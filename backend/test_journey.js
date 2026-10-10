// Simulate the exact planJourney call that the controller makes
const { planJourney } = require('./src/services/journeyService');

const today = new Date();
const dateStr = today.toISOString().split('T')[0];

planJourney({
  originStationId: '2',
  destinationStationId: '1',
  targetTime: '08:00',
  mode: 'arrive_by',
  date: dateStr,
  preference: 'fastest',
})
  .then(result => {
    console.log('SUCCESS');
    console.log('Routes found:', result.routes.length);
    console.log(JSON.stringify(result, null, 2).slice(0, 2000));
  })
  .catch(err => {
    console.error('FAILED:', err.message);
    console.error('Stack:', err.stack);
  })
  .finally(() => {
    const prisma = require('./src/prismaClient');
    prisma.$disconnect();
  });
