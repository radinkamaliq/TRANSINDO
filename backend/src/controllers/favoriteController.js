// backend/src/controllers/favoriteController.js
const prisma = require('../prismaClient');
const { planJourney } = require('../services/journeyService');

function userId(req) {
  return BigInt(req.user.id);
}

// GET /api/favorites
async function listFavorites(req, res) {
  try {
    const trips = await prisma.favoriteTrip.findMany({
      where: { userId: userId(req) },
      include: {
        originStation: { include: { city: true } },
        destinationStation: { include: { city: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(trips.map(serialize));
  } catch (err) {
    console.error('[favoriteController] listFavorites:', err);
    return res.status(500).json({ error: 'Gagal memuat daftar favorit' });
  }
}

// POST /api/favorites
async function createFavorite(req, res) {
  try {
    const { label, originStationId, destinationStationId, preferredOption } = req.body;
    if (!label || !originStationId || !destinationStationId) {
      return res.status(400).json({ error: 'label, originStationId, dan destinationStationId wajib diisi' });
    }
    if (String(originStationId) === String(destinationStationId)) {
      return res.status(400).json({ error: 'Stasiun asal dan tujuan tidak boleh sama' });
    }
    const trip = await prisma.favoriteTrip.create({
      data: {
        userId: userId(req),
        label,
        originStationId: BigInt(originStationId),
        destinationStationId: BigInt(destinationStationId),
        preferredOption: preferredOption || 'fastest',
      },
      include: {
        originStation: { include: { city: true } },
        destinationStation: { include: { city: true } },
      },
    });
    return res.status(201).json(serialize(trip));
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Perjalanan dengan nama ini sudah ada' });
    }
    console.error('[favoriteController] createFavorite:', err);
    return res.status(500).json({ error: 'Gagal menyimpan perjalanan favorit' });
  }
}

// PATCH /api/favorites/:id  – rename label
async function updateFavorite(req, res) {
  try {
    const id = BigInt(req.params.id);
    const { label, preferredOption } = req.body;
    const existing = await prisma.favoriteTrip.findFirst({ where: { id, userId: userId(req) } });
    if (!existing) return res.status(404).json({ error: 'Perjalanan tidak ditemukan' });

    const updated = await prisma.favoriteTrip.update({
      where: { id },
      data: {
        ...(label && { label }),
        ...(preferredOption && { preferredOption }),
      },
      include: {
        originStation: { include: { city: true } },
        destinationStation: { include: { city: true } },
      },
    });
    return res.json(serialize(updated));
  } catch (err) {
    console.error('[favoriteController] updateFavorite:', err);
    return res.status(500).json({ error: 'Gagal memperbarui perjalanan favorit' });
  }
}

// DELETE /api/favorites/:id
async function deleteFavorite(req, res) {
  try {
    const id = BigInt(req.params.id);
    const existing = await prisma.favoriteTrip.findFirst({ where: { id, userId: userId(req) } });
    if (!existing) return res.status(404).json({ error: 'Perjalanan tidak ditemukan' });
    await prisma.favoriteTrip.delete({ where: { id } });
    return res.json({ message: 'Perjalanan favorit dihapus' });
  } catch (err) {
    console.error('[favoriteController] deleteFavorite:', err);
    return res.status(500).json({ error: 'Gagal menghapus perjalanan favorit' });
  }
}

// POST /api/favorites/:id/plan  – re-run journey from saved trip
async function planFromFavorite(req, res) {
  try {
    const id = BigInt(req.params.id);
    const trip = await prisma.favoriteTrip.findFirst({
      where: { id, userId: userId(req) },
    });
    if (!trip) return res.status(404).json({ error: 'Perjalanan tidak ditemukan' });

    const { targetTime, date, mode } = req.body;
    if (!targetTime || !date || !mode) {
      return res.status(400).json({ error: 'targetTime, date, dan mode wajib diisi' });
    }

    const result = await planJourney({
      originStationId: trip.originStationId.toString(),
      destinationStationId: trip.destinationStationId.toString(),
      targetTime,
      mode,
      date,
      preference: trip.preferredOption,
    });

    return res.json({ planId: null, ...result, meta: { preference: trip.preferredOption, mode, date, targetTime } });
  } catch (err) {
    console.error('[favoriteController] planFromFavorite:', err);
    return res.status(500).json({ error: 'Gagal merencanakan perjalanan' });
  }
}

function serialize(trip) {
  return {
    id: trip.id.toString(),
    label: trip.label,
    originStationId: trip.originStationId.toString(),
    destinationStationId: trip.destinationStationId.toString(),
    preferredOption: trip.preferredOption,
    originStation: trip.originStation
      ? { id: trip.originStation.id.toString(), name: trip.originStation.name, city: trip.originStation.city?.name }
      : null,
    destinationStation: trip.destinationStation
      ? { id: trip.destinationStation.id.toString(), name: trip.destinationStation.name, city: trip.destinationStation.city?.name }
      : null,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}

module.exports = { listFavorites, createFavorite, updateFavorite, deleteFavorite, planFromFavorite };
