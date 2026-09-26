// backend/src/controllers/adminController.js
const prisma = require('../prismaClient');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function paginate(query) {
  const page  = Math.max(1, parseInt(query.page  || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  return { skip: (page - 1) * limit, take: limit, page, limit };
}

function bigStr(v) { return v ? v.toString() : null; }

// ─── OPERATORS ────────────────────────────────────────────────────────────────
async function listOperators(req, res) {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const q = req.query.q || '';
    const where = q ? { name: { contains: q, mode: 'insensitive' } } : {};
    const [items, total] = await Promise.all([
      prisma.operator.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      prisma.operator.count({ where }),
    ]);
    return res.json({ items: items.map(o => ({ ...o, id: bigStr(o.id) })), total, page, limit });
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat operator' }); }
}

async function createOperator(req, res) {
  try {
    const { name, websiteUrl, supportContact, supportsRealtime } = req.body;
    if (!name) return res.status(400).json({ error: 'name wajib diisi' });
    const item = await prisma.operator.create({
      data: { name, websiteUrl: websiteUrl || null, supportContact: supportContact || null,
              supportsRealtime: !!supportsRealtime },
    });
    return res.status(201).json({ ...item, id: bigStr(item.id) });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Nama operator sudah ada' });
    return res.status(500).json({ error: 'Gagal membuat operator' });
  }
}

async function updateOperator(req, res) {
  try {
    const id = BigInt(req.params.id);
    const { name, websiteUrl, supportContact, supportsRealtime } = req.body;
    const item = await prisma.operator.update({
      where: { id },
      data: { ...(name && { name }), websiteUrl, supportContact, ...(supportsRealtime !== undefined && { supportsRealtime: !!supportsRealtime }) },
    });
    return res.json({ ...item, id: bigStr(item.id) });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Operator tidak ditemukan' });
    return res.status(500).json({ error: 'Gagal memperbarui operator' });
  }
}

async function deleteOperator(req, res) {
  try {
    const id = BigInt(req.params.id);
    await prisma.operator.delete({ where: { id } });
    return res.json({ message: 'Operator dihapus' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Operator tidak ditemukan' });
    if (err.code === 'P2003') return res.status(409).json({ error: 'Operator masih digunakan oleh rute aktif' });
    return res.status(500).json({ error: 'Gagal menghapus operator' });
  }
}

// ─── TRANSPORT TYPES ──────────────────────────────────────────────────────────
async function listTransportTypes(req, res) {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const [items, total] = await Promise.all([
      prisma.transportType.findMany({ skip, take, orderBy: { name: 'asc' } }),
      prisma.transportType.count(),
    ]);
    return res.json({ items: items.map(t => ({ ...t, id: bigStr(t.id) })), total, page, limit });
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat jenis transportasi' }); }
}

async function createTransportType(req, res) {
  try {
    const { name, category } = req.body;
    if (!name || !category) return res.status(400).json({ error: 'name dan category wajib diisi' });
    const item = await prisma.transportType.create({ data: { name, category } });
    return res.status(201).json({ ...item, id: bigStr(item.id) });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Nama jenis transportasi sudah ada' });
    return res.status(500).json({ error: 'Gagal membuat jenis transportasi' });
  }
}

async function updateTransportType(req, res) {
  try {
    const id = BigInt(req.params.id);
    const { name, category } = req.body;
    const item = await prisma.transportType.update({ where: { id }, data: { ...(name && { name }), ...(category && { category }) } });
    return res.json({ ...item, id: bigStr(item.id) });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Jenis transportasi tidak ditemukan' });
    return res.status(500).json({ error: 'Gagal memperbarui jenis transportasi' });
  }
}

async function deleteTransportType(req, res) {
  try {
    const id = BigInt(req.params.id);
    await prisma.transportType.delete({ where: { id } });
    return res.json({ message: 'Jenis transportasi dihapus' });
  } catch (err) {
    if (err.code === 'P2003') return res.status(409).json({ error: 'Jenis transportasi masih digunakan' });
    return res.status(500).json({ error: 'Gagal menghapus jenis transportasi' });
  }
}

// ─── CITIES ───────────────────────────────────────────────────────────────────
async function listCities(req, res) {
  try {
    const items = await prisma.city.findMany({ orderBy: { name: 'asc' } });
    return res.json(items.map(c => ({ ...c, id: bigStr(c.id) })));
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat kota' }); }
}

async function createCity(req, res) {
  try {
    const { name, province } = req.body;
    if (!name || !province) return res.status(400).json({ error: 'name dan province wajib diisi' });
    const item = await prisma.city.create({ data: { name, province } });
    return res.status(201).json({ ...item, id: bigStr(item.id) });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Nama kota sudah ada' });
    return res.status(500).json({ error: 'Gagal membuat kota' });
  }
}

async function deleteCity(req, res) {
  try {
    const id = BigInt(req.params.id);
    await prisma.city.delete({ where: { id } });
    return res.json({ message: 'Kota dihapus' });
  } catch (err) {
    if (err.code === 'P2003') return res.status(409).json({ error: 'Kota masih digunakan oleh stasiun' });
    return res.status(500).json({ error: 'Gagal menghapus kota' });
  }
}

// ─── STATIONS ─────────────────────────────────────────────────────────────────
async function listStationsAdmin(req, res) {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const q = req.query.q || '';
    const where = q ? { name: { contains: q, mode: 'insensitive' } } : {};
    const [items, total] = await Promise.all([
      prisma.station.findMany({ where, skip, take, orderBy: { name: 'asc' }, include: { city: true, stops: true } }),
      prisma.station.count({ where }),
    ]);
    return res.json({
      items: items.map(s => ({
        ...s,
        id: bigStr(s.id),
        cityId: bigStr(s.cityId),
        city: s.city ? { ...s.city, id: bigStr(s.city.id) } : null,
        stops: s.stops.map(st => ({ ...st, id: bigStr(st.id), stationId: bigStr(st.stationId), transportTypeId: bigStr(st.transportTypeId) })),
      })),
      total, page, limit,
    });
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat stasiun' }); }
}

async function createStation(req, res) {
  try {
    const { cityId, name, latitude, longitude, address } = req.body;
    if (!cityId || !name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'cityId, name, latitude, longitude wajib diisi' });
    }
    const item = await prisma.station.create({
      data: { cityId: BigInt(cityId), name, latitude: parseFloat(latitude), longitude: parseFloat(longitude), address: address || null },
      include: { city: true },
    });
    return res.status(201).json({ ...item, id: bigStr(item.id), cityId: bigStr(item.cityId), city: item.city ? { ...item.city, id: bigStr(item.city.id) } : null });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Stasiun dengan nama ini sudah ada di kota tersebut' });
    return res.status(500).json({ error: 'Gagal membuat stasiun' });
  }
}

async function updateStation(req, res) {
  try {
    const id = BigInt(req.params.id);
    const { name, latitude, longitude, address, cityId } = req.body;
    const item = await prisma.station.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
        ...(longitude !== undefined && { longitude: parseFloat(longitude) }),
        ...(address !== undefined && { address }),
        ...(cityId && { cityId: BigInt(cityId) }),
      },
      include: { city: true },
    });
    return res.json({ ...item, id: bigStr(item.id), cityId: bigStr(item.cityId) });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Stasiun tidak ditemukan' });
    return res.status(500).json({ error: 'Gagal memperbarui stasiun' });
  }
}

async function deleteStation(req, res) {
  try {
    const id = BigInt(req.params.id);
    await prisma.station.delete({ where: { id } });
    return res.json({ message: 'Stasiun dihapus' });
  } catch (err) {
    if (err.code === 'P2003') return res.status(409).json({ error: 'Stasiun masih digunakan oleh data lain' });
    return res.status(500).json({ error: 'Gagal menghapus stasiun' });
  }
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────
function serializeRoute(r) {
  return {
    ...r,
    id: bigStr(r.id),
    transportTypeId: bigStr(r.transportTypeId),
    operatorId: bigStr(r.operatorId),
    transportType: r.transportType ? { ...r.transportType, id: bigStr(r.transportType.id) } : null,
    operator: r.operator ? { ...r.operator, id: bigStr(r.operator.id) } : null,
    routeStops: r.routeStops ? r.routeStops.map(rs => ({
      ...rs,
      id: bigStr(rs.id),
      routeId: bigStr(rs.routeId),
      stopId: bigStr(rs.stopId),
      stop: rs.stop ? {
        ...rs.stop,
        id: bigStr(rs.stop.id),
        stationId: bigStr(rs.stop.stationId),
        transportTypeId: bigStr(rs.stop.transportTypeId),
        station: rs.stop.station ? { ...rs.stop.station, id: bigStr(rs.stop.station.id) } : null,
      } : null,
    })) : undefined,
    schedules: r.schedules ? r.schedules.map(s => ({ ...s, id: bigStr(s.id), routeId: bigStr(s.routeId) })) : undefined,
    fares: r.fares ? r.fares.map(f => ({ ...f, id: bigStr(f.id), routeId: bigStr(f.routeId), fromStopId: bigStr(f.fromStopId), toStopId: bigStr(f.toStopId), amount: parseFloat(f.amount) })) : undefined,
  };
}

async function listRoutes(req, res) {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const { q, transportTypeId, operatorId, cityId } = req.query;
    const where = {
      ...(q && { name: { contains: q, mode: 'insensitive' } }),
      ...(transportTypeId && { transportTypeId: BigInt(transportTypeId) }),
      ...(operatorId && { operatorId: BigInt(operatorId) }),
    };
    const [items, total] = await Promise.all([
      prisma.route.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: { transportType: true, operator: true, _count: { select: { routeStops: true } } },
      }),
      prisma.route.count({ where }),
    ]);
    return res.json({ items: items.map(serializeRoute), total, page, limit });
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat rute' }); }
}

async function getRoute(req, res) {
  try {
    const id = BigInt(req.params.id);
    const r = await prisma.route.findUnique({
      where: { id },
      include: {
        transportType: true,
        operator: true,
        routeStops: {
          orderBy: { sequenceNumber: 'asc' },
          include: { stop: { include: { station: { include: { city: true } }, transportType: true } } },
        },
        schedules: { orderBy: { departureTime: 'asc' } },
        fares: true,
      },
    });
    if (!r) return res.status(404).json({ error: 'Rute tidak ditemukan' });
    return res.json(serializeRoute(r));
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat rute' }); }
}

async function createRoute(req, res) {
  try {
    const { transportTypeId, operatorId, name, code, directionLabel, isActive } = req.body;
    if (!transportTypeId || !operatorId || !name) {
      return res.status(400).json({ error: 'transportTypeId, operatorId, dan name wajib diisi' });
    }
    const item = await prisma.route.create({
      data: {
        transportTypeId: BigInt(transportTypeId),
        operatorId: BigInt(operatorId),
        name,
        code: code || null,
        directionLabel: directionLabel || null,
        isActive: isActive !== undefined ? !!isActive : true,
      },
      include: { transportType: true, operator: true },
    });
    return res.status(201).json(serializeRoute(item));
  } catch (err) { return res.status(500).json({ error: 'Gagal membuat rute' }); }
}

async function updateRoute(req, res) {
  try {
    const id = BigInt(req.params.id);
    const { name, code, directionLabel, isActive, transportTypeId, operatorId } = req.body;
    const item = await prisma.route.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code !== undefined && { code }),
        ...(directionLabel !== undefined && { directionLabel }),
        ...(isActive !== undefined && { isActive: !!isActive }),
        ...(transportTypeId && { transportTypeId: BigInt(transportTypeId) }),
        ...(operatorId && { operatorId: BigInt(operatorId) }),
      },
      include: { transportType: true, operator: true },
    });
    return res.json(serializeRoute(item));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Rute tidak ditemukan' });
    return res.status(500).json({ error: 'Gagal memperbarui rute' });
  }
}

async function deleteRoute(req, res) {
  try {
    const id = BigInt(req.params.id);
    await prisma.route.delete({ where: { id } });
    return res.json({ message: 'Rute dihapus' });
  } catch (err) {
    if (err.code === 'P2003') return res.status(409).json({ error: 'Rute masih memiliki data terkait' });
    return res.status(500).json({ error: 'Gagal menghapus rute' });
  }
}

// ─── SCHEDULES ────────────────────────────────────────────────────────────────
async function listSchedulesAdmin(req, res) {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const { routeId } = req.query;
    const where = routeId ? { routeId: BigInt(routeId) } : {};
    const [items, total] = await Promise.all([
      prisma.schedule.findMany({ where, skip, take, include: { route: true }, orderBy: { departureTime: 'asc' } }),
      prisma.schedule.count({ where }),
    ]);
    const s = items.map(s => ({
      ...s,
      id: bigStr(s.id),
      routeId: bigStr(s.routeId),
      route: s.route ? { ...s.route, id: bigStr(s.route.id) } : null,
      departureTime: s.departureTime instanceof Date
        ? `${String(s.departureTime.getHours()).padStart(2,'0')}:${String(s.departureTime.getMinutes()).padStart(2,'0')}`
        : s.departureTime,
    }));
    return res.json({ items: s, total, page, limit });
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat jadwal' }); }
}

async function createScheduleAdmin(req, res) {
  try {
    const { routeId, dayType, departureTime, headwayMinutes, isRealtimeAvailable } = req.body;
    if (!routeId || !dayType || !departureTime) {
      return res.status(400).json({ error: 'routeId, dayType, departureTime wajib diisi' });
    }
    const [h, m] = departureTime.split(':').map(Number);
    const dt = new Date(2000, 0, 1, h, m, 0);
    const item = await prisma.schedule.create({
      data: {
        routeId: BigInt(routeId),
        dayType,
        departureTime: dt,
        headwayMinutes: headwayMinutes ? parseInt(headwayMinutes) : null,
        isRealtimeAvailable: !!isRealtimeAvailable,
      },
    });
    return res.status(201).json({ ...item, id: bigStr(item.id), routeId: bigStr(item.routeId) });
  } catch (err) { return res.status(500).json({ error: 'Gagal membuat jadwal' }); }
}

async function deleteScheduleAdmin(req, res) {
  try {
    const id = BigInt(req.params.id);
    await prisma.schedule.delete({ where: { id } });
    return res.json({ message: 'Jadwal dihapus' });
  } catch (err) { return res.status(500).json({ error: 'Gagal menghapus jadwal' }); }
}

// ─── FARES ────────────────────────────────────────────────────────────────────
async function listFares(req, res) {
  try {
    const { routeId } = req.query;
    const where = routeId ? { routeId: BigInt(routeId) } : {};
    const items = await prisma.fare.findMany({ where, include: { route: true }, orderBy: { createdAt: 'asc' } });
    return res.json(items.map(f => ({ ...f, id: bigStr(f.id), routeId: bigStr(f.routeId), fromStopId: bigStr(f.fromStopId), toStopId: bigStr(f.toStopId), amount: parseFloat(f.amount) })));
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat tarif' }); }
}

async function createFare(req, res) {
  try {
    const { routeId, fareType, amount, fromStopId, toStopId } = req.body;
    if (!routeId || !fareType || amount === undefined) {
      return res.status(400).json({ error: 'routeId, fareType, amount wajib diisi' });
    }
    const item = await prisma.fare.create({
      data: {
        routeId: BigInt(routeId),
        fareType,
        amount: parseFloat(amount),
        fromStopId: fromStopId ? BigInt(fromStopId) : null,
        toStopId: toStopId ? BigInt(toStopId) : null,
      },
    });
    return res.status(201).json({ ...item, id: bigStr(item.id), routeId: bigStr(item.routeId), amount: parseFloat(item.amount) });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Tarif untuk kombinasi ini sudah ada' });
    return res.status(500).json({ error: 'Gagal membuat tarif' });
  }
}

async function deleteFare(req, res) {
  try {
    const id = BigInt(req.params.id);
    await prisma.fare.delete({ where: { id } });
    return res.json({ message: 'Tarif dihapus' });
  } catch (err) { return res.status(500).json({ error: 'Gagal menghapus tarif' }); }
}

// ─── USERS (admin) ────────────────────────────────────────────────────────────
async function listUsers(req, res) {
  try {
    const { skip, take, page, limit } = paginate(req.query);
    const q = req.query.q || '';
    const where = q ? { OR: [{ email: { contains: q, mode: 'insensitive' } }, { fullName: { contains: q, mode: 'insensitive' } }] } : {};
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: { id: true, fullName: true, email: true, phoneNumber: true, isActive: true, createdAt: true, updatedAt: true, role: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    return res.json({ items: items.map(u => ({ ...u, id: bigStr(u.id) })), total, page, limit });
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat pengguna' }); }
}

async function updateUser(req, res) {
  try {
    const id = BigInt(req.params.id);
    // Prevent admin from deactivating themselves
    if (id === BigInt(req.user.id) && req.body.isActive === false) {
      return res.status(400).json({ error: 'Admin tidak dapat menonaktifkan akun sendiri' });
    }
    const { isActive } = req.body;
    const item = await prisma.user.update({
      where: { id },
      data: { ...(isActive !== undefined && { isActive: !!isActive }) },
      select: { id: true, fullName: true, email: true, isActive: true, role: { select: { name: true } } },
    });
    return res.json({ ...item, id: bigStr(item.id) });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    return res.status(500).json({ error: 'Gagal memperbarui pengguna' });
  }
}

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
async function getDashboardStats(req, res) {
  try {
    const [routes, stations, pendingReports, users] = await Promise.all([
      prisma.route.count({ where: { isActive: true } }),
      prisma.station.count(),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.user.count(),
    ]);
    return res.json({ routes, stations, pendingReports, users });
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat statistik' }); }
}

// ─── EXPLORER (public) ────────────────────────────────────────────────────────
async function exploreRoutes(req, res) {
  try {
    const { cityId, transportTypeId, operatorId, q } = req.query;
    const { skip, take, page, limit } = paginate(req.query);

    // Build filter through station → stop → route_stop → route when filtering by city
    let routeIdFilter;
    if (cityId) {
      const stops = await prisma.stop.findMany({
        where: { station: { cityId: BigInt(cityId) } },
        select: { id: true },
      });
      const stopIds = stops.map(s => s.id);
      const routeStops = await prisma.routeStop.findMany({
        where: { stopId: { in: stopIds } },
        select: { routeId: true },
        distinct: ['routeId'],
      });
      routeIdFilter = routeStops.map(rs => rs.routeId);
    }

    const where = {
      isActive: true,
      ...(routeIdFilter && { id: { in: routeIdFilter } }),
      ...(transportTypeId && { transportTypeId: BigInt(transportTypeId) }),
      ...(operatorId && { operatorId: BigInt(operatorId) }),
      ...(q && { name: { contains: q, mode: 'insensitive' } }),
    };

    const [items, total] = await Promise.all([
      prisma.route.findMany({
        where,
        skip,
        take,
        include: { transportType: true, operator: true, _count: { select: { routeStops: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.route.count({ where }),
    ]);

    return res.json({ items: items.map(serializeRoute), total, page, limit });
  } catch (err) { return res.status(500).json({ error: 'Gagal memuat data transportasi' }); }
}

module.exports = {
  listOperators, createOperator, updateOperator, deleteOperator,
  listTransportTypes, createTransportType, updateTransportType, deleteTransportType,
  listCities, createCity, deleteCity,
  listStationsAdmin, createStation, updateStation, deleteStation,
  listRoutes, getRoute, createRoute, updateRoute, deleteRoute,
  listSchedulesAdmin, createScheduleAdmin, deleteScheduleAdmin,
  listFares, createFare, deleteFare,
  listUsers, updateUser,
  getDashboardStats,
  exploreRoutes,
};
