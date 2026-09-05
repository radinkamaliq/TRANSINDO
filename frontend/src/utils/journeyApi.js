/**
 * journeyApi.js
 *
 * Thin wrapper around the Journey Planner API endpoints.
 * Credentials are included so the HTTP-only auth cookie is sent automatically.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * POST /api/journey/plan
 *
 * @param {object} payload
 * @param {number} payload.originStationId
 * @param {number} payload.destinationStationId
 * @param {string} payload.targetTime       - "HH:MM"
 * @param {string} payload.mode             - "arrive_by" | "depart_at"
 * @param {string} payload.date             - "YYYY-MM-DD"
 * @param {string} payload.preference
 * @returns {Promise<object>}
 */
export async function planJourney(payload) {
  const res = await fetch(`${BASE}/api/journey/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data.details ? data.details.join(', ') : (data.error || 'Unknown error');
    throw new Error(msg);
  }
  return data;
}

/**
 * GET /api/journey/:id
 *
 * @param {number|string} id
 * @returns {Promise<object>}
 */
export async function getJourneyPlan(id) {
  const res = await fetch(`${BASE}/api/journey/${id}`, {
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to retrieve plan');
  }
  return data;
}

/**
 * GET /api/stations  (used by LocationInput for autocomplete)
 * Returns list of stations matching the query.
 */
export async function searchStations(query) {
  const res = await fetch(`${BASE}/api/stations?q=${encodeURIComponent(query)}`, {
    credentials: 'include',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.stations || []);
}
