// backend/src/controllers/reportController.js
const prisma = require('../prismaClient');

function userId(req) {
  return BigInt(req.user.id);
}

function serializeReport(r) {
  return {
    id: r.id.toString(),
    userId: r.userId ? r.userId.toString() : null,
    reportType: r.reportType,
    relatedRouteId: r.relatedRouteId ? r.relatedRouteId.toString() : null,
    relatedStationId: r.relatedStationId ? r.relatedStationId.toString() : null,
    description: r.description,
    status: r.status,
    adminResponse: r.adminResponse,
    createdAt: r.createdAt,
    resolvedAt: r.resolvedAt,
    user: r.user ? { fullName: r.user.fullName, email: r.user.email } : null,
    relatedRoute: r.relatedRoute ? { id: r.relatedRoute.id.toString(), name: r.relatedRoute.name } : null,
    relatedStation: r.relatedStation ? { id: r.relatedStation.id.toString(), name: r.relatedStation.name } : null,
  };
}

// GET /api/reports  (user's own reports)
async function listMyReports(req, res) {
  try {
    const reports = await prisma.report.findMany({
      where: { userId: userId(req) },
      include: { relatedRoute: true, relatedStation: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(reports.map(serializeReport));
  } catch (err) {
    console.error('[reportController] listMyReports:', err);
    return res.status(500).json({ error: 'Gagal memuat laporan' });
  }
}

// POST /api/reports
async function createReport(req, res) {
  try {
    const { reportType, description, relatedRouteId, relatedStationId } = req.body;
    if (!reportType || !description) {
      return res.status(400).json({ error: 'reportType dan description wajib diisi' });
    }

    const validTypes = ['data_salah', 'jadwal_tidak_akurat', 'layanan_terganggu', 'bug_aplikasi', 'lainnya'];
    if (!validTypes.includes(reportType)) {
      return res.status(400).json({ error: `reportType harus salah satu dari: ${validTypes.join(', ')}` });
    }

    const report = await prisma.report.create({
      data: {
        userId: userId(req),
        reportType,
        description,
        relatedRouteId: relatedRouteId ? BigInt(relatedRouteId) : null,
        relatedStationId: relatedStationId ? BigInt(relatedStationId) : null,
        status: 'pending',
      },
      include: { relatedRoute: true, relatedStation: true },
    });

    return res.status(201).json(serializeReport(report));
  } catch (err) {
    console.error('[reportController] createReport:', err);
    return res.status(500).json({ error: 'Gagal mengirim laporan' });
  }
}

// --- Admin endpoints ---

// GET /api/admin/reports
async function adminListReports(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? { status } : {};

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: { user: true, relatedRoute: true, relatedStation: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.report.count({ where }),
    ]);

    return res.json({ reports: reports.map(serializeReport), total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('[reportController] adminListReports:', err);
    return res.status(500).json({ error: 'Gagal memuat laporan' });
  }
}

// PATCH /api/admin/reports/:id
async function adminUpdateReport(req, res) {
  try {
    const id = BigInt(req.params.id);
    const { status, adminResponse } = req.body;
    const validStatuses = ['pending', 'reviewed', 'resolved', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `status harus salah satu dari: ${validStatuses.join(', ')}` });
    }

    const updated = await prisma.report.update({
      where: { id },
      data: {
        status,
        ...(adminResponse !== undefined && { adminResponse }),
        ...(['resolved', 'rejected'].includes(status) && { resolvedAt: new Date() }),
      },
      include: { user: true, relatedRoute: true, relatedStation: true },
    });
    return res.json(serializeReport(updated));
  } catch (err) {
    console.error('[reportController] adminUpdateReport:', err);
    return res.status(500).json({ error: 'Gagal memperbarui laporan' });
  }
}

module.exports = { listMyReports, createReport, adminListReports, adminUpdateReport };
