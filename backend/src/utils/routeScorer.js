/**
 * routeScorer.js
 *
 * Deterministic route scoring with preference-based weighting.
 *
 * Weights per preference (must sum to 1.0):
 *
 * | Preference        | time | fare | transfers | walking |
 * |-------------------|------|------|-----------|---------|
 * | fastest           | 0.60 | 0.10 |      0.20 |    0.10 |
 * | cheapest          | 0.10 | 0.60 |      0.20 |    0.10 |
 * | min_transfer      | 0.20 | 0.10 |      0.60 |    0.10 |
 * | min_walk          | 0.10 | 0.10 |      0.20 |    0.60 |
 * | most_comfortable  | 0.25 | 0.25 |      0.25 |    0.25 |
 *
 * A lower score is better (scores are normalised costs).
 * Call normaliseAndScore(itineraries, preference) to get each itinerary
 * annotated with a `score` property, sorted ascending (best first).
 */

const WEIGHTS = {
  fastest:          { time: 0.60, fare: 0.10, transfers: 0.20, walking: 0.10 },
  cheapest:         { time: 0.10, fare: 0.60, transfers: 0.20, walking: 0.10 },
  min_transfer:     { time: 0.20, fare: 0.10, transfers: 0.60, walking: 0.10 },
  min_walk:         { time: 0.10, fare: 0.10, transfers: 0.20, walking: 0.60 },
  most_comfortable: { time: 0.25, fare: 0.25, transfers: 0.25, walking: 0.25 },
};

/**
 * Normalise a value within [min, max] to [0, 1].
 * Returns 0 when all values are equal (to avoid division by zero).
 */
function normalise(value, min, max) {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

/**
 * Score a single itinerary given already-computed normalisedValues.
 * @param {object} norm   - { time, fare, transfers, walking } each in [0,1]
 * @param {string} preference
 * @returns {number} score in [0,1], lower is better
 */
function scoreOne(norm, preference) {
  const w = WEIGHTS[preference] || WEIGHTS.fastest;
  return (
    w.time      * norm.time +
    w.fare      * norm.fare +
    w.transfers * norm.transfers +
    w.walking   * norm.walking
  );
}

/**
 * Given a list of itineraries, normalise their metrics and attach a score.
 *
 * Each itinerary must have:
 *   {
 *     totalDurationMin: number,   // total travel time in minutes
 *     totalFare:        number,   // total fare in Rupiah
 *     transferCount:    number,   // number of transfers
 *     walkingDurationMin: number, // total walking time in minutes
 *   }
 *
 * @param {object[]} itineraries
 * @param {string}   preference  - one of the WEIGHTS keys
 * @returns {object[]} itineraries with `score` added, sorted ascending
 */
function normaliseAndScore(itineraries, preference) {
  if (!itineraries || itineraries.length === 0) return [];

  const pref = WEIGHTS[preference] ? preference : 'fastest';

  const times     = itineraries.map(it => it.totalDurationMin);
  const fares     = itineraries.map(it => it.totalFare);
  const transfers = itineraries.map(it => it.transferCount);
  const walking   = itineraries.map(it => it.walkingDurationMin);

  const minT = Math.min(...times),     maxT = Math.max(...times);
  const minF = Math.min(...fares),     maxF = Math.max(...fares);
  const minX = Math.min(...transfers), maxX = Math.max(...transfers);
  const minW = Math.min(...walking),   maxW = Math.max(...walking);

  const scored = itineraries.map(it => {
    const norm = {
      time:      normalise(it.totalDurationMin,   minT, maxT),
      fare:      normalise(it.totalFare,           minF, maxF),
      transfers: normalise(it.transferCount,       minX, maxX),
      walking:   normalise(it.walkingDurationMin,  minW, maxW),
    };
    return { ...it, score: parseFloat(scoreOne(norm, pref).toFixed(4)) };
  });

  return scored.sort((a, b) => a.score - b.score);
}

module.exports = { normaliseAndScore, WEIGHTS };
