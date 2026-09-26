// backend/src/controllers/stationController.js

const prisma = require('../prismaClient');

// Standard Jabodetabek transit stations used for search / autocomplete
const DEFAULT_STATIONS = [
  { id: '1', name: 'Stasiun Manggarai', city: { name: 'Jakarta Selatan' }, address: 'Manggarai, Tebet' },
  { id: '2', name: 'Stasiun Bekasi', city: { name: 'Kota Bekasi' }, address: 'Jl. Ir. H. Juanda, Bekasi' },
  { id: '3', name: 'Stasiun Sudirman', city: { name: 'Jakarta Pusat' }, address: 'Dukuh Atas, Menteng' },
  { id: '4', name: 'Stasiun Tanah Abang', city: { name: 'Jakarta Pusat' }, address: 'Jl. Jatibaru, Tanah Abang' },
  { id: '5', name: 'Stasiun Jakarta Kota', city: { name: 'Jakarta Barat' }, address: 'Pinangsia, Taman Sari' },
  { id: '6', name: 'Stasiun Bogor', city: { name: 'Kota Bogor' }, address: 'Cibogor, Bogor Tengah' },
  { id: '7', name: 'Stasiun Depok', city: { name: 'Kota Depok' }, address: 'Pancoran Mas, Depok' },
  { id: '8', name: 'Stasiun Bundaran HI', city: { name: 'Jakarta Pusat' }, address: 'Jl. M.H. Thamrin, Menteng' },
  { id: '9', name: 'Stasiun Lebak Bulus', city: { name: 'Jakarta Selatan' }, address: 'Cilandak Barat' },
  { id: '10', name: 'Stasiun Blok M', city: { name: 'Jakarta Selatan' }, address: 'Kebayoran Baru' },
  { id: '11', name: 'Stasiun Dukuh Atas', city: { name: 'Jakarta Pusat' }, address: 'Setiabudi' },
  { id: '12', name: 'Stasiun Juanda', city: { name: 'Jakarta Pusat' }, address: 'Pasar Baru, Sawah Besar' },
  { id: '13', name: 'Stasiun Pasar Senen', city: { name: 'Jakarta Pusat' }, address: 'Senen' },
  { id: '14', name: 'Stasiun Cawang', city: { name: 'Jakarta Timur' }, address: 'Tebet Timur' },
  { id: '15', name: 'Stasiun Tangerang', city: { name: 'Kota Tangerang' }, address: 'Sukarasa, Tangerang' },
  { id: '16', name: 'Stasiun Serpong', city: { name: 'Tangerang Selatan' }, address: 'Serpong' },
];

/**
 * GET /api/stations
 * Query param: q (string)
 */
async function searchStations(req, res) {
  const query = (req.query.q || '').trim().toLowerCase();

  try {
    // Attempt database query if available
    const dbStations = await prisma.station.findMany({
      where: query
        ? {
            name: { contains: query, mode: 'insensitive' },
          }
        : undefined,
      include: { city: true },
      take: 20,
    });

    if (dbStations && dbStations.length > 0) {
      return res.status(200).json(dbStations);
    }
  } catch (err) {
    // Graceful fallback to default stations list if DB is offline or empty
  }

  // Filter default stations
  const filtered = query
    ? DEFAULT_STATIONS.filter(
        s =>
          s.name.toLowerCase().includes(query) ||
          (s.city && s.city.name.toLowerCase().includes(query))
      )
    : DEFAULT_STATIONS;

  return res.status(200).json(filtered);
}

module.exports = { searchStations, DEFAULT_STATIONS };
