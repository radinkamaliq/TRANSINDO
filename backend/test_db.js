const prisma = require('./src/prismaClient');
prisma.station.findMany({ take: 1 })
  .then(r => {
    console.log('DB OK, found:', r.length, 'stations');
    return prisma.$disconnect();
  })
  .catch(e => {
    console.error('DB query error:', e.message);
    return prisma.$disconnect();
  });
