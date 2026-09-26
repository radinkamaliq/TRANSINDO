// backend/test/journey.test.js

const { test, describe } = require('node:test');
const assert = require('node:assert');

const { normaliseAndScore, WEIGHTS } = require('../src/utils/routeScorer');
const { calculateArriveOnTime, findNextDeparture, formatTime } = require('../src/utils/arriveOnTime');
const { planJourney } = require('../src/services/journeyService');
const { searchStations, DEFAULT_STATIONS } = require('../src/controllers/stationController');
const authorizeRoles = require('../src/middleware/role');

describe('Route Scorer Tests', () => {
  const sampleItineraries = [
    { id: 1, totalDurationMin: 45, totalFare: 8000, transferCount: 1, walkingDurationMin: 5 },
    { id: 2, totalDurationMin: 60, totalFare: 3500, transferCount: 0, walkingDurationMin: 10 },
    { id: 3, totalDurationMin: 35, totalFare: 12000, transferCount: 2, walkingDurationMin: 3 },
  ];

  test('fastest preference ranks shortest duration first', () => {
    const scored = normaliseAndScore(sampleItineraries, 'fastest');
    assert.strictEqual(scored[0].id, 3, 'Shortest duration (35m) should rank top for fastest');
    assert.ok(scored[0].score <= scored[1].score, 'Scores must be sorted ascending');
  });

  test('cheapest preference ranks lowest fare first', () => {
    const scored = normaliseAndScore(sampleItineraries, 'cheapest');
    assert.strictEqual(scored[0].id, 2, 'Lowest fare (Rp3.500) should rank top for cheapest');
  });

  test('min_transfer preference ranks 0 transfers first', () => {
    const scored = normaliseAndScore(sampleItineraries, 'min_transfer');
    assert.strictEqual(scored[0].id, 2, '0 transfers should rank top for min_transfer');
  });

  test('handles single itinerary without division by zero', () => {
    const single = [{ id: 1, totalDurationMin: 30, totalFare: 5000, transferCount: 0, walkingDurationMin: 2 }];
    const scored = normaliseAndScore(single, 'fastest');
    assert.strictEqual(scored.length, 1);
    assert.strictEqual(scored[0].score, 0);
  });

  test('handles empty itineraries gracefully', () => {
    const scored = normaliseAndScore([], 'fastest');
    assert.deepStrictEqual(scored, []);
  });
});

describe('Arrive On Time Calculation Tests', () => {
  const testDate = new Date('2026-09-05T00:00:00');

  test('arrive_by mode subtracts duration and 5 min buffer from target time', () => {
    const result = calculateArriveOnTime({
      targetTime: '08:00',
      mode: 'arrive_by',
      journeyDate: testDate,
      totalDurationMin: 45,
      bufferMin: 5,
    });

    // 08:00 - 50m = 07:10 departure
    assert.strictEqual(result.recommendedDeparture, '07:10');
    // 07:10 + 45m = 07:55 arrival (5m before 08:00)
    assert.strictEqual(result.expectedArrival, '07:55');
    assert.strictEqual(result.bufferMin, 5);
    assert.strictEqual(result.totalDurationMin, 45);
  });

  test('depart_at mode sets departure to target time and adds duration', () => {
    const result = calculateArriveOnTime({
      targetTime: '07:15',
      mode: 'depart_at',
      journeyDate: testDate,
      totalDurationMin: 50,
    });

    assert.strictEqual(result.recommendedDeparture, '07:15');
    // 07:15 + 50m = 08:05
    assert.strictEqual(result.expectedArrival, '08:05');
  });

  test('findNextDeparture returns first schedule >= refTime', () => {
    const schedules = ['06:00', '06:15', '06:30', '06:45', '07:00'];
    assert.strictEqual(findNextDeparture(schedules, '06:20'), '06:30');
    assert.strictEqual(findNextDeparture(schedules, '06:45'), '06:45');
    assert.strictEqual(findNextDeparture(schedules, '07:10'), null);
  });
});

describe('Station Search Controller Tests', () => {
  test('returns full default stations when query is empty', async () => {
    let responseData = null;
    const req = { query: {} };
    const res = {
      status(code) {
        assert.strictEqual(code, 200);
        return {
          json(data) {
            responseData = data;
          },
        };
      },
    };

    await searchStations(req, res);
    assert.ok(Array.isArray(responseData));
    assert.strictEqual(responseData.length, DEFAULT_STATIONS.length);
  });

  test('filters stations case-insensitively', async () => {
    let responseData = null;
    const req = { query: { q: 'bekasi' } };
    const res = {
      status(code) {
        assert.strictEqual(code, 200);
        return {
          json(data) {
            responseData = data;
          },
        };
      },
    };

    await searchStations(req, res);
    assert.ok(Array.isArray(responseData));
    assert.ok(responseData.some(s => s.name.includes('Bekasi')));
  });
});

describe('Journey Planner End-to-End Service Tests', () => {
  test('plans journey with realistic Jabodetabek transit routes and recommendation', async () => {
    const plan = await planJourney({
      originStationId: '2', // Bekasi
      destinationStationId: '3', // Sudirman
      targetTime: '08:00',
      mode: 'arrive_by',
      date: '2026-09-06',
      preference: 'fastest',
    });

    assert.ok(plan.routes && plan.routes.length > 0, 'Should return candidate routes');
    assert.ok(plan.recommendation, 'Should provide top recommendation');
    assert.strictEqual(typeof plan.recommendation.recommendedDeparture, 'string');
    assert.strictEqual(typeof plan.recommendation.expectedArrival, 'string');
    assert.ok(plan.recommendation.totalDurationMin > 0);
    assert.ok(plan.recommendation.totalFare > 0);
    assert.ok(plan.recommendation.legs.length >= 1);
  });

  test('rejects identical origin and destination', async () => {
    await assert.rejects(
      async () => {
        await planJourney({
          originStationId: '2',
          destinationStationId: '2',
          targetTime: '08:00',
          mode: 'arrive_by',
          date: '2026-09-06',
          preference: 'fastest',
        });
      },
      (err) => {
        assert.strictEqual(err.message, 'Origin and destination must differ');
        return true;
      }
    );
  });
});

describe('Authorization Role Middleware Tests', () => {
  test('allows case-insensitive user role match', (t) => {
    const middleware = authorizeRoles('user', 'admin');
    const req = { user: { role: { name: 'USER' } } };
    let nextCalled = false;
    const res = {
      status() { return this; },
      json() {},
    };

    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, true, 'Next should be called for valid USER role');
  });

  test('blocks unauthorized roles with 403', (t) => {
    const middleware = authorizeRoles('admin');
    const req = { user: { role: { name: 'GUEST' } } };
    let statusCode = null;
    let errorMsg = null;
    const res = {
      status(code) {
        statusCode = code;
        return {
          json(data) {
            errorMsg = data.error;
          },
        };
      },
    };

    middleware(req, res, () => {});
    assert.strictEqual(statusCode, 403);
    assert.strictEqual(errorMsg, 'Forbidden: insufficient privileges');
  });
});
