/**
 * journeyApi.js
 *
 * Thin wrapper around the Journey Planner API endpoints.
 * Safely handles network errors, non-JSON responses, and detailed error messages.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Safely parse JSON or return formatted error details
 */
async function parseJsonResponse(res) {
  const text = await res.text();
  let data = null;
  if (text && text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response (e.g. proxy HTML error page or raw text)
      const snippet = text.slice(0, 150).replace(/<[^>]+>/g, '').trim();
      throw new Error(`Respons server bukan JSON (HTTP ${res.status}): ${snippet || 'Respons kosong'}`);
    }
  } else {
    data = {};
  }

  if (!res.ok) {
    const msg = data?.details
      ? (Array.isArray(data.details) ? data.details.join(', ') : String(data.details))
      : (data?.error || `HTTP ${res.status}: Gagal memproses permintaan`);
    throw new Error(msg);
  }

  return data;
}

/**
 * POST /api/journey/plan
 *
 * @param {object} payload
 * @param {number|string} payload.originStationId
 * @param {number|string} payload.destinationStationId
 * @param {string} payload.targetTime       - "HH:MM"
 * @param {string} payload.mode             - "arrive_by" | "depart_at"
 * @param {string} payload.date             - "YYYY-MM-DD"
 * @param {string} payload.preference
 * @returns {Promise<object>}
 */
export async function planJourney(payload) {
  let res;
  try {
    res = await fetch(`${BASE}/api/journey/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
  } catch (netErr) {
    throw new Error(`Tidak dapat terhubung ke server backend (${netErr.message}). Pastikan server backend aktif di port 5000.`);
  }

  return await parseJsonResponse(res);
}

/**
 * GET /api/journey/:id
 *
 * @param {number|string} id
 * @returns {Promise<object>}
 */
export async function getJourneyPlan(id) {
  let res;
  try {
    res = await fetch(`${BASE}/api/journey/${id}`, {
      credentials: 'include',
    });
  } catch (netErr) {
    throw new Error(`Tidak dapat terhubung ke server backend (${netErr.message}).`);
  }

  return await parseJsonResponse(res);
}

/**
 * GET /api/stations  (used by LocationInput for autocomplete)
 * Returns list of stations matching the query.
 */
export async function searchStations(query) {
  try {
    const res = await fetch(`${BASE}/api/stations?q=${encodeURIComponent(query)}`, {
      credentials: 'include',
    });
    if (!res.ok) return [];
    const text = await res.text();
    if (!text) return [];
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : (data.stations || []);
  } catch (e) {
    return [];
  }
}
