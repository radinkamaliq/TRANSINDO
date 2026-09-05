/**
 * journeyService.js
 *
 * Core Journey Planner business logic.
 *
 * Algorithm:
 *  1. Find the origin station and destination station by ID.
 *  2. Find all stops at origin (origin_stops).
 *  3. Find all active routes that pass through any origin_stop (direct routes).
 *  4. For each direct route, check if it also passes through any stop at the
 *     destination — if yes, this is a direct (0-transfer) itinerary.
 *  5. For routes that don't reach destination directly, look for transfer
 *     opportunities: stops served by the origin route that are ALSO served by
 *     another route that reaches destination (1-transfer itinerary, max 2 transfers).
 *  6. For each valid itinerary, compute:
 *       - totalDurationMin  (sum of travel_time_from_previous_minutes along segments)
 *       - totalFare         (sum of fares for each route leg)
 *       - transferCount
 *       - walkingDurationMin (estimated walking between transfer stops — 5 min/transfer)
 *  7. Score itineraries using routeScorer.
 *  8. Compute Arrive-On-Time metadata.
 *  9. Return the scored, ranked list.
 */

const prisma = require('../prismaClient');
const { normaliseAndScore } = require('../utils/routeScorer');
const { calculateArriveOnTime, formatTime } = require('../utils/arriveOnTime');

const WALKING_TIME_PER_TRANSFER_MIN = 5; // assumed walking between platforms
const MAX_RESULTS = 5;

// ─── Prisma helpers ──────────────────────────────────────────────────────────

/**
 * Get all stops belonging to a station.
 */
async function getStopsForStation(stationId) {
  return prisma.stop.findMany({
    where: { stationId: BigInt(stationId) },
    include: {
      station: true,
      transportType: true,
    },
  });
}

/**
 * Get all active routes that include a given stop (by stopId list).
 * Returns routes with their full routeStops (ordered by sequence).
 */
async function getRoutesForStops(stopIds) {
  const bigIds = stopIds.map(id => BigInt(id));
  const routeStops = await prisma.routeStop.findMany({
    where: { stopId: { in: bigIds } },
    include: {
      route: {
        where: { isActive: true },
        include: {
          transportType: true,
          operator: true,
          routeStops: {
            orderBy: { sequenceNumber: 'asc' },
            include: {
              stop: {
                include: {
                  station: true,
                  transportType: true,
                },
              },
            },
          },
          schedules: true,
          fares: true,
        },
      },
    },
  });

  // De-duplicate routes
  const routeMap = new Map();
  for (const rs of routeStops) {
    if (rs.route && rs.route.isActive) {
      routeMap.set(rs.route.id.toString(), rs.route);
    }
  }
  return [...routeMap.values()];
}

/**
 * Get the flat fare for a route, or sum of distance-based fares when available.
 * Falls back to 0 when no fare data exists.
 */
function getFareForRoute(route) {
  if (!route.fares || route.fares.length === 0) return 0;
  // Prefer flat fare
  const flat = route.fares.find(f => f.fareType === 'flat');
  if (flat) return parseFloat(flat.amount.toString());
  // Sum distance-based fares
  return route.fares.reduce((sum, f) => sum + parseFloat(f.amount.toString()), 0);
}

/**
 * Get schedules for a route on a given day type.
 * Returns sorted "HH:MM" time strings.
 */
function getScheduleTimes(route, dayType) {
  if (!route.schedules) return [];
  return route.schedules
    .filter(s => s.dayType === dayType)
    .map(s => {
      const d = new Date(s.departureTime);
      return formatTime(d);
    })
    .sort();
}

/**
 * Determine whether a stop is between two sequence positions in a route.
 */
function stopSequenceInRange(routeStop, fromSeq, toSeq) {
  return routeStop.sequenceNumber > fromSeq && routeStop.sequenceNumber <= toSeq;
}

/**
 * Given a route and an origin stop (by stopId), find the first downstream stop
 * that belongs to the given destination station.
 * Returns { leg, durationMin } or null.
 */
function buildDirectLeg(route, originStopId, destStopIds) {
  const destSet = new Set(destStopIds.map(id => id.toString()));
  const rs = route.routeStops;

  const originIdx = rs.findIndex(r => r.stopId.toString() === originStopId.toString());
  if (originIdx === -1) return null;

  const originSeq = rs[originIdx].sequenceNumber;

  // Find first stop after origin that is a dest stop
  let durationMin = 0;
  for (let i = originIdx + 1; i < rs.length; i++) {
    durationMin += rs[i].travelTimeFromPrevMin || 0;
    if (destSet.has(rs[i].stopId.toString())) {
      return {
        routeId:       route.id.toString(),
        routeName:     route.name,
        routeCode:     route.code,
        directionLabel: route.directionLabel,
        transportType: route.transportType?.name || '',
        transportCategory: route.transportType?.category || '',
        operator:      route.operator?.name || '',
        fromStop:      rs[originIdx].stop,
        toStop:        rs[i].stop,
        fromSeq:       originSeq,
        toSeq:         rs[i].sequenceNumber,
        stops:         rs.slice(originIdx, i + 1).map(r => ({
          stopId:   r.stop.id.toString(),
          stopName: r.stop.name,
          stationName: r.stop.station?.name || '',
          seq:      r.sequenceNumber,
          travelFromPrev: r.travelTimeFromPrevMin || 0,
        })),
        durationMin,
        fare:          getFareForRoute(route),
        schedules:     route.schedules,
        fares:         route.fares,
      };
    }
  }
  return null;
}

/**
 * Main journey planning function.
 *
 * @param {object} input
 * @param {number} input.originStationId
 * @param {number} input.destinationStationId
 * @param {string} input.targetTime     - "HH:MM"
 * @param {string} input.mode           - "arrive_by" | "depart_at"
 * @param {string} input.date           - ISO date string (YYYY-MM-DD)
 * @param {string} input.preference     - PreferredOption value
 * @returns {object} { routes, recommendation }
 */
async function planJourney({ originStationId, destinationStationId, targetTime, mode, date, preference }) {
  // Validate stations exist
  const [originStation, destStation] = await Promise.all([
    prisma.station.findUnique({ where: { id: BigInt(originStationId) } }),
    prisma.station.findUnique({ where: { id: BigInt(destinationStationId) } }),
  ]);

  if (!originStation) throw Object.assign(new Error('Origin station not found'), { status: 400 });
  if (!destStation)   throw Object.assign(new Error('Destination station not found'), { status: 400 });
  if (originStationId === destinationStationId) throw Object.assign(new Error('Origin and destination must differ'), { status: 400 });

  // Get stops at origin and destination
  const originStops = await getStopsForStation(originStationId);
  const destStops   = await getStopsForStation(destinationStationId);

  if (originStops.length === 0) throw Object.assign(new Error('No stops found at origin station'), { status: 404 });
  if (destStops.length === 0)   throw Object.assign(new Error('No stops found at destination station'), { status: 404 });

  const originStopIds = originStops.map(s => s.id);
  const destStopIds   = destStops.map(s => s.id);
  const destStopIdSet = new Set(destStopIds.map(id => id.toString()));

  // Determine day type from date
  const travelDate = new Date(date);
  const dow = travelDate.getDay(); // 0=Sun, 6=Sat
  const dayType = dow === 0 || dow === 6 ? 'weekend' : 'weekday';

  // Get all active routes through origin stops
  const originRoutes = await getRoutesForStops(originStopIds);

  const itineraries = [];

  // ── Pass 1: Direct routes (0 transfers) ──────────────────────────────────
  for (const route of originRoutes) {
    for (const originStop of originStops) {
      const leg = buildDirectLeg(route, originStop.id, destStopIds);
      if (!leg) continue;

      const scheduleTimes = getScheduleTimes(route, dayType);

      itineraries.push({
        type: 'direct',
        legs: [leg],
        totalDurationMin: leg.durationMin,
        totalFare: leg.fare,
        transferCount: 0,
        walkingDurationMin: 0,
        scheduleTimes,
        originStation,
        destStation,
      });
    }
  }

  // ── Pass 2: 1-transfer routes ─────────────────────────────────────────────
  if (itineraries.length < MAX_RESULTS) {
    for (const route of originRoutes) {
      for (const originStop of originStops) {
        // Find all intermediate stops on this route after the origin stop
        const rs = route.routeStops;
        const originIdx = rs.findIndex(r => r.stopId.toString() === originStop.id.toString());
        if (originIdx === -1) continue;

        // Collect intermediate stops (after origin, not destination)
        const intermediateRouteStops = rs.slice(originIdx + 1).filter(
          r => !destStopIdSet.has(r.stopId.toString())
        );

        if (intermediateRouteStops.length === 0) continue;

        const transferStopIds = intermediateRouteStops.map(r => r.stopId);
        const transferRoutes = await getRoutesForStops(transferStopIds);

        for (const transferRoute of transferRoutes) {
          if (transferRoute.id.toString() === route.id.toString()) continue; // same route

          // For each intermediate stop, see if transferRoute goes there and then to dest
          for (const midRs of intermediateRouteStops) {
            const midStopId = midRs.stopId;
            const leg2 = buildDirectLeg(transferRoute, midStopId, destStopIds);
            if (!leg2) continue;

            // Duration of leg 1: origin → mid stop
            let leg1DurationMin = 0;
            for (const r of rs.slice(originIdx + 1)) {
              leg1DurationMin += r.travelTimeFromPrevMin || 0;
              if (r.stopId.toString() === midStopId.toString()) break;
            }

            const leg1 = {
              routeId:           route.id.toString(),
              routeName:         route.name,
              routeCode:         route.code,
              directionLabel:    route.directionLabel,
              transportType:     route.transportType?.name || '',
              transportCategory: route.transportType?.category || '',
              operator:          route.operator?.name || '',
              fromStop:          rs[originIdx].stop,
              toStop:            midRs.stop,
              durationMin:       leg1DurationMin,
              fare:              getFareForRoute(route),
            };

            const walkingMin = WALKING_TIME_PER_TRANSFER_MIN;
            const totalDuration = leg1DurationMin + walkingMin + leg2.durationMin;
            const totalFare     = leg1.fare + leg2.fare;

            const scheduleTimes1 = getScheduleTimes(route, dayType);

            itineraries.push({
              type: '1_transfer',
              legs: [leg1, leg2],
              totalDurationMin:   totalDuration,
              totalFare,
              transferCount:      1,
              walkingDurationMin: walkingMin,
              scheduleTimes: scheduleTimes1,
              originStation,
              destStation,
            });

            if (itineraries.length >= MAX_RESULTS * 3) break;
          }
          if (itineraries.length >= MAX_RESULTS * 3) break;
        }
        if (itineraries.length >= MAX_RESULTS * 3) break;
      }
      if (itineraries.length >= MAX_RESULTS * 3) break;
    }
  }

  // Score and sort
  const scored = normaliseAndScore(itineraries, preference);
  const topResults = scored.slice(0, MAX_RESULTS);

  // Compute Arrive-On-Time for each result
  const results = topResults.map((it, idx) => {
    const arriveInfo = calculateArriveOnTime({
      targetTime,
      mode,
      journeyDate: travelDate,
      totalDurationMin: it.totalDurationMin,
    });
    return {
      id: idx + 1,
      ...it,
      ...arriveInfo,
    };
  });

  const recommendation = results[0] || null;

  return { routes: results, recommendation };
}

module.exports = { planJourney };
