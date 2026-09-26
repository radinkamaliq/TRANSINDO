/**
 * journeyController.js
 *
 * Handles:
 *   POST /api/journey/plan  — validate input, call journeyService, return results
 *   GET  /api/journey/:id   — in-memory plan retrieval (session-scoped, no DB persistence per ERD)
 */

const { planJourney } = require('../services/journeyService');

// In-memory store keyed by requestId. Clears on server restart.
// ERD explicitly states: "Trip/Search Result tidak dijadikan tabel tersendiri."
const planStore = new Map();
let planCounter = 0;

/**
 * Validate the journey plan request body.
 * Returns an array of error strings (empty if valid).
 */
function validatePlanRequest(body) {
  const errors = [];
  const { originStationId, destinationStationId, targetTime, mode, date, preference } = body;

  if (!originStationId)      errors.push('originStationId is required');
  if (!destinationStationId) errors.push('destinationStationId is required');
  if (originStationId && destinationStationId &&
      String(originStationId) === String(destinationStationId)) {
    errors.push('originStationId and destinationStationId must differ');
  }
  if (!targetTime)           errors.push('targetTime is required (HH:MM)');
  if (targetTime && !/^\d{2}:\d{2}$/.test(targetTime)) {
    errors.push('targetTime must be in HH:MM format');
  }
  if (!mode || !['arrive_by', 'depart_at'].includes(mode)) {
    errors.push('mode must be "arrive_by" or "depart_at"');
  }
  if (!date)                 errors.push('date is required (YYYY-MM-DD)');
  if (date && isNaN(Date.parse(date))) {
    errors.push('date is not a valid date');
  }
  if (date) {
    const parts = date.split('-').map(Number);
    const d = parts.length === 3 && !parts.some(isNaN)
      ? new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0)
      : new Date(date);
    d.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) errors.push('date must be today or in the future');
  }

  const validPreferences = ['fastest', 'cheapest', 'min_transfer', 'min_walk', 'most_comfortable'];
  if (!preference || !validPreferences.includes(preference)) {
    errors.push(`preference must be one of: ${validPreferences.join(', ')}`);
  }

  return errors;
}

/**
 * POST /api/journey/plan
 */
async function plan(req, res) {
  const errors = validatePlanRequest(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const { originStationId, destinationStationId, targetTime, mode, date, preference } = req.body;

  try {
    const result = await planJourney({
      originStationId,
      destinationStationId,
      targetTime,
      mode,
      date,
      preference,
    });

    // Store plan in memory so GET /:id can retrieve it
    const planId = ++planCounter;
    planStore.set(planId, { planId, ...result, createdAt: new Date().toISOString() });

    return res.status(200).json({
      planId,
      routes:         result.routes,
      recommendation: result.recommendation,
      meta: {
        preference,
        mode,
        date,
        targetTime,
        originStationId,
        destinationStationId,
        totalFound: result.routes.length,
      },
    });
  } catch (err) {
    console.error('[journeyController] plan error:', err);
    const statusCode = err.status || err.statusCode || 500;
    return res.status(statusCode).json({
      error: err.message || 'Internal server error',
      ...(err.details && { details: err.details }),
    });
  }
}

/**
 * GET /api/journey/:id
 */
async function getPlan(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid plan ID' });
  }

  const stored = planStore.get(id);
  if (!stored) {
    return res.status(404).json({ error: 'Plan not found. Plans are session-scoped and cleared on server restart.' });
  }

  return res.status(200).json(stored);
}

module.exports = { plan, getPlan };
