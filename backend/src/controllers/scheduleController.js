// backend/src/controllers/scheduleController.js
const prisma = require('../prismaClient');
const { calculateArriveOnTime } = require('../utils/arriveOnTime');

function userId(req) {
  return BigInt(req.user.id);
}

function serializeSchedule(s) {
  return {
    id: s.id.toString(),
    name: s.name,
    originStationId: s.originStationId.toString(),
    destinationStationId: s.destinationStationId.toString(),
    requiredArrivalTime: s.requiredArrivalTime,
    daysOfWeek: s.daysOfWeek,
    preferredOption: s.preferredOption,
    isActive: s.isActive,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    originStation: s.originStation
      ? { id: s.originStation.id.toString(), name: s.originStation.name, city: s.originStation.city?.name }
      : null,
    destinationStation: s.destinationStation
      ? { id: s.destinationStation.id.toString(), name: s.destinationStation.name, city: s.destinationStation.city?.name }
      : null,
  };
}

// GET /api/schedules
async function listSchedules(req, res) {
  try {
    const schedules = await prisma.userSchedule.findMany({
      where: { userId: userId(req) },
      include: {
        originStation: { include: { city: true } },
        destinationStation: { include: { city: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Attach recommended departure for each active schedule
    const today = new Date();
    const h = String(today.getHours()).padStart(2, '0');
    const m = String(today.getMinutes()).padStart(2, '0');
    const nowTime = `${h}:${m}`;

    const result = schedules.map(s => {
      const serialized = serializeSchedule(s);
      if (s.isActive) {
        // Use a rough average duration of 60 min as default when no journey computed
        const aot = calculateArriveOnTime({
          targetTime: s.requiredArrivalTime,
          mode: 'arrive_by',
          journeyDate: today,
          totalDurationMin: 60,
        });
        serialized.recommendedDeparture = aot.recommendedDeparture;
        serialized.expectedArrival = aot.expectedArrival;
        serialized.bufferMin = aot.bufferMin;
        serialized.departureAlreadyPassed = aot.recommendedDeparture < nowTime;
      }
      return serialized;
    });

    return res.json(result);
  } catch (err) {
    console.error('[scheduleController] listSchedules:', err);
    return res.status(500).json({ error: 'Gagal memuat jadwal' });
  }
}

// POST /api/schedules
async function createSchedule(req, res) {
  try {
    const { name, originStationId, destinationStationId, requiredArrivalTime, daysOfWeek, preferredOption } = req.body;
    if (!name || !originStationId || !destinationStationId || !requiredArrivalTime || !daysOfWeek) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }
    if (String(originStationId) === String(destinationStationId)) {
      return res.status(400).json({ error: 'Stasiun asal dan tujuan tidak boleh sama' });
    }
    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
      return res.status(400).json({ error: 'Pilih minimal satu hari' });
    }

    const schedule = await prisma.userSchedule.create({
      data: {
        userId: userId(req),
        name,
        originStationId: BigInt(originStationId),
        destinationStationId: BigInt(destinationStationId),
        requiredArrivalTime,
        daysOfWeek: daysOfWeek.map(Number),
        preferredOption: preferredOption || 'fastest',
        isActive: true,
      },
      include: {
        originStation: { include: { city: true } },
        destinationStation: { include: { city: true } },
      },
    });

    // Compute initial recommendation
    const today = new Date();
    const aot = calculateArriveOnTime({
      targetTime: schedule.requiredArrivalTime,
      mode: 'arrive_by',
      journeyDate: today,
      totalDurationMin: 60,
    });

    const serialized = serializeSchedule(schedule);
    serialized.recommendedDeparture = aot.recommendedDeparture;
    serialized.expectedArrival = aot.expectedArrival;
    serialized.bufferMin = aot.bufferMin;

    return res.status(201).json(serialized);
  } catch (err) {
    console.error('[scheduleController] createSchedule:', err);
    return res.status(500).json({ error: 'Gagal membuat jadwal' });
  }
}

// PATCH /api/schedules/:id
async function updateSchedule(req, res) {
  try {
    const id = BigInt(req.params.id);
    const existing = await prisma.userSchedule.findFirst({ where: { id, userId: userId(req) } });
    if (!existing) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });

    const { name, requiredArrivalTime, daysOfWeek, preferredOption, isActive,
            originStationId, destinationStationId } = req.body;

    const updated = await prisma.userSchedule.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(requiredArrivalTime !== undefined && { requiredArrivalTime }),
        ...(daysOfWeek !== undefined && { daysOfWeek: daysOfWeek.map(Number) }),
        ...(preferredOption !== undefined && { preferredOption }),
        ...(isActive !== undefined && { isActive }),
        ...(originStationId !== undefined && { originStationId: BigInt(originStationId) }),
        ...(destinationStationId !== undefined && { destinationStationId: BigInt(destinationStationId) }),
      },
      include: {
        originStation: { include: { city: true } },
        destinationStation: { include: { city: true } },
      },
    });
    return res.json(serializeSchedule(updated));
  } catch (err) {
    console.error('[scheduleController] updateSchedule:', err);
    return res.status(500).json({ error: 'Gagal memperbarui jadwal' });
  }
}

// DELETE /api/schedules/:id
async function deleteSchedule(req, res) {
  try {
    const id = BigInt(req.params.id);
    const existing = await prisma.userSchedule.findFirst({ where: { id, userId: userId(req) } });
    if (!existing) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    await prisma.userSchedule.delete({ where: { id } });
    return res.json({ message: 'Jadwal dihapus' });
  } catch (err) {
    console.error('[scheduleController] deleteSchedule:', err);
    return res.status(500).json({ error: 'Gagal menghapus jadwal' });
  }
}

module.exports = { listSchedules, createSchedule, updateSchedule, deleteSchedule };
