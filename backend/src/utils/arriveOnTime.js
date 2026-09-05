/**
 * arriveOnTime.js
 *
 * Arrive‑On‑Time calculation utilities.
 *
 * Default buffer = 5 minutes (configurable via ARRIVE_BUFFER_MIN env var).
 *
 * Logic:
 *   Given a target arrival time and a total journey duration (in minutes),
 *   calculate the latest safe departure time so the traveller arrives
 *   BEFORE the target with the buffer applied.
 *
 *   recommendedDeparture = targetArrival − totalDurationMin − bufferMin
 *
 * For schedule-based calculation:
 *   Given the first available departure from origin that is >= recommendedDeparture,
 *   compute the expected arrival.
 */

const DEFAULT_BUFFER_MIN = parseInt(process.env.ARRIVE_BUFFER_MIN || '5', 10);

/**
 * Parse a "HH:MM" string into a Date object on the given date.
 * @param {string} timeStr  - e.g. "07:30"
 * @param {Date}   baseDate - the calendar date to attach the time to
 * @returns {Date}
 */
function parseTimeOnDate(timeStr, baseDate) {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Format a Date as "HH:MM" (24h, zero-padded).
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Calculate Arrive‑On‑Time metadata for a journey.
 *
 * @param {object} params
 * @param {string} params.targetTime        - "HH:MM" — desired arrival or departure time
 * @param {string} params.mode              - "arrive_by" | "depart_at"
 * @param {Date}   params.journeyDate       - the travel date
 * @param {number} params.totalDurationMin  - total journey duration in minutes
 * @param {number} [params.bufferMin]       - override default buffer
 *
 * @returns {{
 *   recommendedDeparture: string,
 *   expectedArrival: string,
 *   bufferMin: number,
 *   totalDurationMin: number
 * }}
 */
function calculateArriveOnTime({
  targetTime,
  mode,
  journeyDate,
  totalDurationMin,
  bufferMin,
}) {
  const buffer = bufferMin !== undefined ? bufferMin : DEFAULT_BUFFER_MIN;
  const targetDate = parseTimeOnDate(targetTime, journeyDate);

  let recommendedDeparture, expectedArrival;

  if (mode === 'arrive_by') {
    // Must arrive BY targetTime → depart early enough, with buffer subtracted
    const depMs = targetDate.getTime() - (totalDurationMin + buffer) * 60_000;
    recommendedDeparture = formatTime(new Date(depMs));
    expectedArrival = formatTime(new Date(depMs + totalDurationMin * 60_000));
  } else {
    // depart_at — targetTime IS the departure
    recommendedDeparture = targetTime;
    const arrMs = targetDate.getTime() + totalDurationMin * 60_000;
    expectedArrival = formatTime(new Date(arrMs));
  }

  return {
    recommendedDeparture,
    expectedArrival,
    bufferMin: buffer,
    totalDurationMin,
  };
}

/**
 * Given a list of schedule departure times (strings "HH:MM") on a given day,
 * find the first one >= a reference time string.
 *
 * @param {string[]} scheduleTimes  - sorted array of "HH:MM" strings
 * @param {string}   refTime        - "HH:MM"
 * @returns {string|null}
 */
function findNextDeparture(scheduleTimes, refTime) {
  const [rh, rm] = refTime.split(':').map(Number);
  const refMinutes = rh * 60 + rm;
  for (const t of scheduleTimes) {
    const [h, m] = t.split(':').map(Number);
    if (h * 60 + m >= refMinutes) return t;
  }
  return null; // no departure available
}

module.exports = { calculateArriveOnTime, findNextDeparture, formatTime, parseTimeOnDate, DEFAULT_BUFFER_MIN };
