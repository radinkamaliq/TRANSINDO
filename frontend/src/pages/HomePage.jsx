// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Train,
  Clock,
  ArrowRight,
  ArrowUpDown,
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  Compass,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Journey Planner Preview Form State
  const [origin, setOrigin] = useState('Stasiun Bekasi');
  const [destination, setDestination] = useState('Stasiun Sudirman');
  const [mode, setMode] = useState('arrive_by'); // 'arrive_by' | 'depart_at'
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [targetTime, setTargetTime] = useState('08:00');
  const [preference, setPreference] = useState('fastest');

  // Interactive Map Preview State
  const [selectedStation, setSelectedStation] = useState({
    name: 'Stasiun Manggarai',
    lines: 'KRL Lin Bogor, KRL Lin Cikarang, KA Bandara',
    transitHub: true,
    zone: 'Transit Utama (Central Hub)'
  });

  useEffect(() => {
    document.title = 'TRANSIT — Jabodetabek Mobility Planner';
  }, []);

  // Swap Origin and Destination
  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Submit Journey Planner Preview -> navigates to /journey-planner
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    navigate(
      `/journey-planner?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&time=${encodeURIComponent(targetTime)}&mode=${encodeURIComponent(mode)}&date=${encodeURIComponent(targetDate)}&pref=${encodeURIComponent(preference)}`
    );
  };

  // Quick Select Route
  const handleSelectPopularRoute = (orig, dest) => {
    setOrigin(orig);
    setDestination(dest);
    navigate(
      `/journey-planner?origin=${encodeURIComponent(orig)}&destination=${encodeURIComponent(dest)}&time=08:00&mode=arrive_by`
    );
  };

  return (
    <div className="home-page">
      {/* ─── 1. NAVBAR ─────────────────────────────────────────────────── */}
      <header className="home-navbar">
        <div className="container navbar-container">
          <Link to="/" className="brand-group">
            <div className="brand-logo-badge">
              <Train size={20} strokeWidth={2.4} />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">TRANSIT</span>
              <span className="brand-subtitle">Jabodetabek Mobility Planner</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links-desktop">
            <Link to="/" className="nav-link-item active">
              Beranda
            </Link>
            <Link to="/journey-planner" className="nav-link-item">
              Rencanakan Perjalanan
            </Link>
            <a href="#transport-modes" className="nav-link-item">
              Transportasi
            </a>
            <a href="#map-preview" className="nav-link-item">
              Peta
            </a>
            <Link to="/my-trips" className="nav-link-item">
              Perjalanan Saya
            </Link>
            <Link to="/my-schedule" className="nav-link-item">
              Jadwal
            </Link>
          </nav>

          <div className="nav-actions">
            <Link to="/login" className="btn btn-secondary btn-sm">
              Login / Profil
            </Link>
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer container">
            <Link
              to="/"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Train size={18} /> Beranda
            </Link>
            <Link
              to="/journey-planner"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={18} /> Rencanakan Perjalanan
            </Link>
            <a
              href="#transport-modes"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass size={18} /> Transportasi
            </a>
            <a
              href="#map-preview"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Layers size={18} /> Peta Jaringan
            </a>
            <Link
              to="/my-trips"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar size={18} /> Perjalanan Saya
            </Link>
            <Link
              to="/my-schedule"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Clock size={18} /> Jadwal
            </Link>
            <Link
              to="/login"
              className="btn btn-primary btn-full"
              style={{ marginTop: 8 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login / Profil
            </Link>
          </div>
        )}
      </header>

      {/* ─── 2. HERO SECTION ───────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-left">
            <div className="hero-badge-row">
              <Zap size={14} /> Solusi Mobilitas Komuter Jabodetabek
            </div>
            <h1 className="hero-headline">
              Sampai tepat waktu,
              <br />
              tanpa ribet.
            </h1>
            <p className="hero-subtext">
              Rencanakan perjalanan transportasi umum Jabodetabek, temukan rute
              yang sesuai, dan ketahui kapan sebaiknya kamu berangkat.
            </p>
            <div className="hero-cta-buttons">
              <Link to="/journey-planner" className="btn btn-primary btn-lg">
                <Search size={18} /> Rencanakan Perjalanan
              </Link>
              <a href="#transport-modes" className="btn btn-secondary btn-lg">
                Jelajahi Transportasi <ChevronRight size={16} />
              </a>
            </div>
          </div>

          {/* Right side subtle transportation network visual (No generic stock photos) */}
          <div className="hero-visual-card">
            <div className="visual-header">
              <div className="visual-title">
                <Layers size={16} color="var(--primary, #2563EB)" />
                <span>Simulasi Jaringan Lintas Moda</span>
              </div>
              <div className="visual-pulse-indicator">
                <div className="pulse-dot" />
                <span>Jadwal Aktif</span>
              </div>
            </div>

            <div className="network-svg-wrap">
              <svg viewBox="0 0 340 180" className="network-svg">
                <defs>
                  <linearGradient id="gradKrl" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="gradMrt" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>

                {/* Network connecting lines */}
                <line x1="40" y1="90" x2="170" y2="90" stroke="url(#gradKrl)" strokeWidth="4" strokeLinecap="round" />
                <line x1="170" y1="90" x2="300" y2="90" stroke="url(#gradKrl)" strokeWidth="4" strokeLinecap="round" />
                <line x1="170" y1="30" x2="170" y2="90" stroke="url(#gradMrt)" strokeWidth="4" strokeLinecap="round" />
                <line x1="170" y1="90" x2="170" y2="155" stroke="url(#gradMrt)" strokeWidth="4" strokeLinecap="round" />
                <line x1="90" y1="40" x2="170" y2="90" stroke="#EA580C" strokeWidth="2.5" strokeDasharray="5,4" />
                <line x1="170" y1="90" x2="250" y2="140" stroke="#7C3AED" strokeWidth="3" />

                {/* Stations nodes */}
                {/* Bekasi */}
                <circle cx="40" cy="90" r="7" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="3.5" />
                <text x="40" y="115" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0F172A">
                  Bekasi
                </text>

                {/* Manggarai (Hub) */}
                <circle cx="170" cy="90" r="11" fill="#FFFFFF" stroke="#2563EB" strokeWidth="4.5" />
                <circle cx="170" cy="90" r="4" fill="#2563EB" />
                <text x="170" y="72" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                  Manggarai (Hub)
                </text>

                {/* Sudirman */}
                <circle cx="300" cy="90" r="7" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="3.5" />
                <text x="300" y="115" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0F172A">
                  Sudirman
                </text>

                {/* Bundaran HI (North) */}
                <circle cx="170" cy="30" r="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
                <text x="195" y="34" textAnchor="start" fontSize="9" fontWeight="600" fill="#0F172A">
                  Bundaran HI
                </text>

                {/* Blok M (South) */}
                <circle cx="170" cy="155" r="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
                <text x="195" y="158" textAnchor="start" fontSize="9" fontWeight="600" fill="#0F172A">
                  Blok M
                </text>

                {/* LRT Halim node */}
                <circle cx="250" cy="140" r="5" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="3" />
                <text x="250" y="160" textAnchor="middle" fontSize="9" fontWeight="500" fill="#64748B">
                  Halim
                </text>
              </svg>
            </div>

            <div className="network-legend">
              <div className="legend-item">
                <span className="legend-color-dot" style={{ background: '#4F46E5' }} />
                <span>KRL Commuter</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-dot" style={{ background: '#0284C7' }} />
                <span>MRT Jakarta</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-dot" style={{ background: '#7C3AED' }} />
                <span>LRT Jabodebek</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-dot" style={{ background: '#EA580C' }} />
                <span>TransJakarta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. JOURNEY PLANNER PREVIEW CARD ────────────────────────────── */}
      <section className="planner-preview-section container">
        <div className="planner-preview-card">
          <div className="planner-card-header">
            <div className="planner-card-title-group">
              <div className="planner-card-icon">
                <Compass size={20} />
              </div>
              <div>
                <h2 className="planner-card-heading">Rencanakan Perjalanan</h2>
                <span className="planner-card-sub">
                  Hitung waktu berangkat otomatis berdasarkan target tiba
                </span>
              </div>
            </div>

            {/* Mode Toggle: Tiba pada vs Berangkat */}
            <div className="planner-mode-toggle">
              <button
                type="button"
                className={`mode-toggle-btn ${mode === 'arrive_by' ? 'active' : ''}`}
                onClick={() => setMode('arrive_by')}
              >
                Tiba pada
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${mode === 'depart_at' ? 'active' : ''}`}
                onClick={() => setMode('depart_at')}
              >
                Berangkat
              </button>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div className="planner-form-grid">
              {/* Dari */}
              <div className="planner-field">
                <label className="planner-label">
                  <MapPin size={13} color="var(--primary, #2563EB)" /> Dari
                </label>
                <div className="planner-input-wrapper">
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Stasiun atau Halte Asal"
                    required
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="swap-btn-container">
                <button
                  type="button"
                  className="swap-btn"
                  onClick={handleSwap}
                  title="Tukar Asal dan Tujuan"
                  aria-label="Tukar Asal dan Tujuan"
                >
                  <ArrowUpDown size={18} />
                </button>
              </div>

              {/* Ke */}
              <div className="planner-field">
                <label className="planner-label">
                  <MapPin size={13} color="var(--navy, #0F172A)" /> Ke
                </label>
                <div className="planner-input-wrapper">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Stasiun atau Halte Tujuan"
                    required
                  />
                </div>
              </div>

              {/* Tanggal */}
              <div className="planner-field">
                <label className="planner-label">
                  <Calendar size={13} /> Tanggal
                </label>
                <div className="planner-input-wrapper">
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Waktu */}
              <div className="planner-field">
                <label className="planner-label">
                  <Clock size={13} /> Waktu
                </label>
                <div className="planner-input-wrapper">
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action & Preferences Row */}
            <div className="planner-action-row">
              <div className="planner-prefs-group">
                <span className="prefs-label">Preferensi:</span>
                <button
                  type="button"
                  className={`pref-chip ${preference === 'fastest' ? 'active' : ''}`}
                  onClick={() => setPreference('fastest')}
                >
                  ⚡ Tercepat
                </button>
                <button
                  type="button"
                  className={`pref-chip ${preference === 'cheapest' ? 'active' : ''}`}
                  onClick={() => setPreference('cheapest')}
                >
                  💰 Termurah
                </button>
                <button
                  type="button"
                  className={`pref-chip ${preference === 'min_transfer' ? 'active' : ''}`}
                  onClick={() => setPreference('min_transfer')}
                >
                  🔄 Minim Transit
                </button>
                <button
                  type="button"
                  className={`pref-chip ${preference === 'min_walk' ? 'active' : ''}`}
                  onClick={() => setPreference('min_walk')}
                >
                  🚶 Minim Jalan Kaki
                </button>
                <button
                  type="button"
                  className={`pref-chip ${preference === 'most_comfortable' ? 'active' : ''}`}
                  onClick={() => setPreference('most_comfortable')}
                >
                  ✨ Paling Nyaman
                </button>
              </div>

              <button type="submit" className="planner-search-btn">
                <Search size={18} /> Cari Perjalanan
              </button>
            </div>

            <p className="planner-note-text">
              <Info size={14} /> UI Preview — Menghubungkan langsung ke mesin rekomendasi rute Journey Planner.
            </p>
          </form>
        </div>
      </section>

      {/* ─── 4. ARRIVE ON TIME FEATURE SECTION ─────────────────────────── */}
      <section className="aot-section">
        <div className="container">
          <div className="section-tag">
            <Clock size={14} /> Fitur Unggulan
          </div>
          <h2 className="section-title">Arrive On Time — Jangan Sampai Terlambat</h2>
          <p className="section-desc">
            Bukan sekadar rute dari A ke B. TRANSIT menghitung mundur jam berangkat ideal berdasarkan target waktu tiba Anda di kantor, kampus, atau tempat pertemuan.
          </p>

          <div className="aot-container-grid">
            <div className="aot-explanation-list">
              <div className="aot-expl-item">
                <div className="aot-expl-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="aot-expl-title">Hitung Mundur Waktu Berangkat</h3>
                  <p className="aot-expl-desc">
                    Tentukan jam berapa Anda harus tiba. Sistem akan mengalkulasi jam keberangkatan terbaik agar Anda tidak perlu berangkat terlalu pagi atau panik di jalan.
                  </p>
                </div>
              </div>

              <div className="aot-expl-item">
                <div className="aot-expl-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="aot-expl-title">Buffer Keamanan Proporsional</h3>
                  <p className="aot-expl-desc">
                    Menyertakan buffer waktu aman yang disesuaikan secara dinamis dengan jumlah transit dan potensi antrean perpindahan peron.
                  </p>
                </div>
              </div>

              <div className="aot-expl-item">
                <div className="aot-expl-icon" style={{ background: '#FEF9C3', color: '#CA8A04' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="aot-expl-title">Rekomendasi Lintas Moda Presisi</h3>
                  <p className="aot-expl-desc">
                    Mengkombinasikan KRL, MRT, LRT, dan TransJakarta dengan estimasi waktu transfer dan jalan kaki yang realistis.
                  </p>
                </div>
              </div>
            </div>

            {/* AOT Signature Showcase Card (Strictly Matching Example) */}
            <div className="aot-card-showcase">
              <div className="aot-target-banner">
                <span className="aot-target-label">Target Kedatangan Anda:</span>
                <span className="aot-target-time">Harus tiba pukul 08:00</span>
              </div>

              <div className="aot-decision-box">
                <div className="aot-decision-eyebrow">
                  <CheckCircle2 size={15} /> Rekomendasi Waktu Berangkat
                </div>
                <div className="aot-departure-highlight">Sebaiknya berangkat 06:25</div>
                <div className="aot-sub-metrics">
                  <span>Tiba 07:38</span>
                  <span>•</span>
                  <span>Durasi 1j 13m</span>
                  <span>•</span>
                  <span className="text-primary font-bold">Transit 1x</span>
                </div>
              </div>

              <div className="aot-detail-chips-row">
                <div className="aot-stat-badge">
                  <span>💰 Tarif: <strong>Rp8.500</strong></span>
                </div>
                <div className="aot-stat-badge aot-buffer-badge">
                  <span>⏱ <strong>Buffer 22 menit</strong> sebelum jam 08:00</span>
                </div>
              </div>

              {/* Visual timeline */}
              <div className="aot-timeline-compact">
                <div className="compact-leg">
                  <span className="compact-leg-time">06:25</span>
                  <span className="compact-leg-node" />
                  <span className="compact-leg-desc">Berangkat dari Stasiun Bekasi</span>
                  <span className="compact-leg-mode-pill badge-rail">KRL</span>
                </div>
                <div className="compact-leg">
                  <span className="compact-leg-time">07:12</span>
                  <span className="compact-leg-node" style={{ background: '#F59E0B' }} />
                  <span className="compact-leg-desc">Transit di Stasiun Manggarai (Ganti Peron)</span>
                  <span className="compact-leg-mode-pill badge-muted">Transfer</span>
                </div>
                <div className="compact-leg">
                  <span className="compact-leg-time">07:38</span>
                  <span className="compact-leg-node" style={{ background: '#16A34A' }} />
                  <span className="compact-leg-desc">Tiba di Stasiun Sudirman (Aman 22m sebelum 08:00)</span>
                  <span className="compact-leg-mode-pill badge-success">Tujuan</span>
                </div>
              </div>

              <p className="aot-sample-disclaimer">
                ⚠️ Nilai demo di atas adalah data contoh pengembangan (Development Sample Data).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. TRANSPORT MODES ────────────────────────────────────────── */}
      <section className="modes-section" id="transport-modes">
        <div className="container">
          <div className="section-tag">
            <Compass size={14} /> Moda Transportasi
          </div>
          <h2 className="section-title">Terintegrasi Lintas Moda se-Jabodetabek</h2>
          <p className="section-desc">
            Satu platform untuk seluruh ekosistem angkutan massal di Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
          </p>

          <div className="modes-grid">
            {/* KRL */}
            <div className="mode-card" style={{ '--accent-color': '#4F46E5', '--icon-bg': '#EEF2FF' }}>
              <div className="mode-card-top">
                <div className="mode-icon-box">🚆</div>
                <span className="mode-tag">Rel Komuter</span>
              </div>
              <h3 className="mode-title">KRL Commuter Line</h3>
              <p className="mode-desc">
                Jaringan rel utama menghubungkan pusat Jakarta dengan wilayah Bogor, Depok, Bekasi, Cikarang, Rangkasbitung, dan Tangerang.
              </p>
              <div className="mode-meta-list">
                <div className="mode-meta-row">
                  <span>Tarif:</span>
                  <span className="mode-meta-val">Mulai Rp3.000</span>
                </div>
                <div className="mode-meta-row">
                  <span>Jam Operasional:</span>
                  <span className="mode-meta-val">04:00 - 24:00 WIB</span>
                </div>
                <div className="mode-meta-row">
                  <span>Operator:</span>
                  <span className="mode-meta-val">KAI Commuter</span>
                </div>
              </div>
            </div>

            {/* MRT */}
            <div className="mode-card" style={{ '--accent-color': '#0284C7', '--icon-bg': '#E0F2FE' }}>
              <div className="mode-card-top">
                <div className="mode-icon-box">🚇</div>
                <span className="mode-tag">MRT Jakarta</span>
              </div>
              <h3 className="mode-title">MRT Jakarta (Ratangga)</h3>
              <p className="mode-desc">
                Transportasi rel cepat bawah tanah dan layang modern koridor Selatan - Pusat dari Lebak Bulus hingga Bundaran HI.
              </p>
              <div className="mode-meta-list">
                <div className="mode-meta-row">
                  <span>Tarif:</span>
                  <span className="mode-meta-val">Rp3.000 - Rp14.000</span>
                </div>
                <div className="mode-meta-row">
                  <span>Jam Operasional:</span>
                  <span className="mode-meta-val">05:00 - 24:00 WIB</span>
                </div>
                <div className="mode-meta-row">
                  <span>Operator:</span>
                  <span className="mode-meta-val">PT MRT Jakarta</span>
                </div>
              </div>
            </div>

            {/* LRT */}
            <div className="mode-card" style={{ '--accent-color': '#7C3AED', '--icon-bg': '#F3E8FF' }}>
              <div className="mode-card-top">
                <div className="mode-icon-box">🚊</div>
                <span className="mode-tag">LRT Layang</span>
              </div>
              <h3 className="mode-title">LRT Jabodebek & Jakarta</h3>
              <p className="mode-desc">
                Layanan kereta ringan otomatis menghubungkan Dukuh Atas dengan Cibubur, Bekasi Timur, dan Velodrome Kelapa Gading.
              </p>
              <div className="mode-meta-list">
                <div className="mode-meta-row">
                  <span>Tarif:</span>
                  <span className="mode-meta-val">Rp5.000 - Rp20.000</span>
                </div>
                <div className="mode-meta-row">
                  <span>Jam Operasional:</span>
                  <span className="mode-meta-val">05:30 - 23:00 WIB</span>
                </div>
                <div className="mode-meta-row">
                  <span>Operator:</span>
                  <span className="mode-meta-val">KAI & LRT Jakarta</span>
                </div>
              </div>
            </div>

            {/* TransJakarta */}
            <div className="mode-card" style={{ '--accent-color': '#EA580C', '--icon-bg': '#FFEDD5' }}>
              <div className="mode-card-top">
                <div className="mode-icon-box">🚌</div>
                <span className="mode-tag">Bus Rapid Transit</span>
              </div>
              <h3 className="mode-title">TransJakarta BRT</h3>
              <p className="mode-desc">
                Sistem jalur bus khusus terpanjang di dunia dengan 14 koridor utama dan ratusan trayek pengumpan (feeder) non-BRT.
              </p>
              <div className="mode-meta-list">
                <div className="mode-meta-row">
                  <span>Tarif:</span>
                  <span className="mode-meta-val">Rp3.500 Flat (Pagi Rp2.000)</span>
                </div>
                <div className="mode-meta-row">
                  <span>Jam Operasional:</span>
                  <span className="mode-meta-val">24 Jam (Koridor Utama)</span>
                </div>
                <div className="mode-meta-row">
                  <span>Operator:</span>
                  <span className="mode-meta-val">PT Transjakarta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. POPULAR ROUTES ─────────────────────────────────────────── */}
      <section className="routes-section">
        <div className="container">
          <div className="section-tag">
            <Zap size={14} /> Jalur Favorit
          </div>
          <h2 className="section-title">Rute Populer Komuter Jabodetabek</h2>
          <p className="section-desc">
            Rute perjalanan harian yang paling sering dicari pekerja dan mahasiswa dengan rekomendasi jadwal keberangkatan.
          </p>

          <div className="routes-grid">
            {/* Route 1 */}
            <div className="route-card">
              <div className="route-badge-row">
                <span className="route-badge badge-primary">⚡ Tercepat Pekerja</span>
                <span className="badge badge-muted">KRL + Transit</span>
              </div>
              <div className="route-path-flow">
                <div className="station-point">
                  <span className="station-name">Bekasi</span>
                  <span className="station-city">Kota Bekasi</span>
                </div>
                <div className="path-arrow-divider">
                  <ArrowRight size={16} />
                  <div className="path-line" />
                </div>
                <div className="station-point" style={{ textAlign: 'right' }}>
                  <span className="station-name">Sudirman</span>
                  <span className="station-city">Jakarta Pusat</span>
                </div>
              </div>
              <div className="route-stats-row">
                <div className="route-stat-item">
                  <span className="stat-label">Durasi</span>
                  <span className="stat-val">1j 13m</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Transit</span>
                  <span className="stat-val">1x (Manggarai)</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Tarif</span>
                  <span className="stat-val">Rp8.500</span>
                </div>
              </div>
              <button
                className="route-action-btn"
                onClick={() => handleSelectPopularRoute('Stasiun Bekasi', 'Stasiun Sudirman')}
              >
                Coba Rute Ini <ChevronRight size={15} />
              </button>
            </div>

            {/* Route 2 */}
            <div className="route-card">
              <div className="route-badge-row">
                <span className="route-badge badge-success">Direct (0 Transit)</span>
                <span className="badge badge-muted">KRL Bogor Line</span>
              </div>
              <div className="route-path-flow">
                <div className="station-point">
                  <span className="station-name">Bogor</span>
                  <span className="station-city">Kota Bogor</span>
                </div>
                <div className="path-arrow-divider">
                  <ArrowRight size={16} />
                  <div className="path-line" />
                </div>
                <div className="station-point" style={{ textAlign: 'right' }}>
                  <span className="station-name">Manggarai</span>
                  <span className="station-city">Jakarta Selatan</span>
                </div>
              </div>
              <div className="route-stats-row">
                <div className="route-stat-item">
                  <span className="stat-label">Durasi</span>
                  <span className="stat-val">1j 10m</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Transit</span>
                  <span className="stat-val">Langsung</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Tarif</span>
                  <span className="stat-val">Rp5.000</span>
                </div>
              </div>
              <button
                className="route-action-btn"
                onClick={() => handleSelectPopularRoute('Stasiun Bogor', 'Stasiun Manggarai')}
              >
                Coba Rute Ini <ChevronRight size={15} />
              </button>
            </div>

            {/* Route 3 */}
            <div className="route-card">
              <div className="route-badge-row">
                <span className="route-badge badge-warning">Sentra Bisnis</span>
                <span className="badge badge-muted">KRL Duri Line</span>
              </div>
              <div className="route-path-flow">
                <div className="station-point">
                  <span className="station-name">Tangerang</span>
                  <span className="station-city">Kota Tangerang</span>
                </div>
                <div className="path-arrow-divider">
                  <ArrowRight size={16} />
                  <div className="path-line" />
                </div>
                <div className="station-point" style={{ textAlign: 'right' }}>
                  <span className="station-name">Tanah Abang</span>
                  <span className="station-city">Jakarta Pusat</span>
                </div>
              </div>
              <div className="route-stats-row">
                <div className="route-stat-item">
                  <span className="stat-label">Durasi</span>
                  <span className="stat-val">48m</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Transit</span>
                  <span className="stat-val">1x (Duri)</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Tarif</span>
                  <span className="stat-val">Rp4.000</span>
                </div>
              </div>
              <button
                className="route-action-btn"
                onClick={() => handleSelectPopularRoute('Stasiun Tangerang', 'Stasiun Tanah Abang')}
              >
                Coba Rute Ini <ChevronRight size={15} />
              </button>
            </div>

            {/* Route 4 */}
            <div className="route-card">
              <div className="route-badge-row">
                <span className="route-badge badge-primary">Paling Cepat</span>
                <span className="badge badge-muted">MRT Jakarta</span>
              </div>
              <div className="route-path-flow">
                <div className="station-point">
                  <span className="station-name">Lebak Bulus</span>
                  <span className="station-city">Jakarta Selatan</span>
                </div>
                <div className="path-arrow-divider">
                  <ArrowRight size={16} />
                  <div className="path-line" />
                </div>
                <div className="station-point" style={{ textAlign: 'right' }}>
                  <span className="station-name">Bundaran HI</span>
                  <span className="station-city">Jakarta Pusat</span>
                </div>
              </div>
              <div className="route-stats-row">
                <div className="route-stat-item">
                  <span className="stat-label">Durasi</span>
                  <span className="stat-val">29m</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Transit</span>
                  <span className="stat-val">Langsung</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Tarif</span>
                  <span className="stat-val">Rp14.000</span>
                </div>
              </div>
              <button
                className="route-action-btn"
                onClick={() => handleSelectPopularRoute('Stasiun Lebak Bulus Grab', 'Stasiun Bundaran HI')}
              >
                Coba Rute Ini <ChevronRight size={15} />
              </button>
            </div>

            {/* Route 5 */}
            <div className="route-card">
              <div className="route-badge-row">
                <span className="route-badge badge-success">Mahasiswa & Kantor</span>
                <span className="badge badge-muted">KRL Bogor Line</span>
              </div>
              <div className="route-path-flow">
                <div className="station-point">
                  <span className="station-name">Depok Baru</span>
                  <span className="station-city">Kota Depok</span>
                </div>
                <div className="path-arrow-divider">
                  <ArrowRight size={16} />
                  <div className="path-line" />
                </div>
                <div className="station-point" style={{ textAlign: 'right' }}>
                  <span className="station-name">Tebet</span>
                  <span className="station-city">Jakarta Selatan</span>
                </div>
              </div>
              <div className="route-stats-row">
                <div className="route-stat-item">
                  <span className="stat-label">Durasi</span>
                  <span className="stat-val">34m</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Transit</span>
                  <span className="stat-val">Langsung</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Tarif</span>
                  <span className="stat-val">Rp3.500</span>
                </div>
              </div>
              <button
                className="route-action-btn"
                onClick={() => handleSelectPopularRoute('Stasiun Depok Baru', 'Stasiun Tebet')}
              >
                Coba Rute Ini <ChevronRight size={15} />
              </button>
            </div>

            {/* Route 6 */}
            <div className="route-card">
              <div className="route-badge-row">
                <span className="route-badge badge-primary">Koneksi LRT Cepat</span>
                <span className="badge badge-muted">LRT Jabodebek</span>
              </div>
              <div className="route-path-flow">
                <div className="station-point">
                  <span className="station-name">Jatimulya</span>
                  <span className="station-city">Bekasi Timur</span>
                </div>
                <div className="path-arrow-divider">
                  <ArrowRight size={16} />
                  <div className="path-line" />
                </div>
                <div className="station-point" style={{ textAlign: 'right' }}>
                  <span className="station-name">Dukuh Atas</span>
                  <span className="station-city">Jakarta Pusat</span>
                </div>
              </div>
              <div className="route-stats-row">
                <div className="route-stat-item">
                  <span className="stat-label">Durasi</span>
                  <span className="stat-val">45m</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Transit</span>
                  <span className="stat-val">Langsung</span>
                </div>
                <div className="route-stat-item">
                  <span className="stat-label">Tarif</span>
                  <span className="stat-val">Rp12.000</span>
                </div>
              </div>
              <button
                className="route-action-btn"
                onClick={() => handleSelectPopularRoute('Stasiun LRT Jatimulya', 'Stasiun LRT Dukuh Atas')}
              >
                Coba Rute Ini <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. MAP PREVIEW ────────────────────────────────────────────── */}
      <section className="map-preview-section" id="map-preview">
        <div className="container">
          <div className="section-tag">
            <Layers size={14} /> Peta Jaringan
          </div>
          <h2 className="section-title">Peta Skematik Jaringan Transportasi</h2>
          <p className="section-desc">
            Visualisasi jalur rel dan halte terintegrasi Jabodetabek. Klik stasiun transit untuk melihat koneksi lintas moda.
          </p>

          <div className="map-card-wrapper">
            <div className="map-card-top-bar">
              <div className="map-title-row">
                <Layers size={18} color="var(--primary, #2563EB)" />
                <strong>Peta Skematik Jabodetabek</strong>
                <span className="map-badge-static">Visual Static Map Placeholder</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span className="text-muted text-xs">
                  (Bukan pelacak GPS live atau tracking armada bergerak)
                </span>
              </div>
            </div>

            {/* Polished Map Canvas Vector */}
            <div className="map-canvas-container">
              <svg viewBox="0 0 800 400" className="map-svg-full">
                {/* Background Map Grid */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* City boundary hints */}
                <text x="70" y="45" fill="#94A3B8" fontSize="11" fontWeight="700">DKI JAKARTA</text>
                <text x="660" y="190" fill="#94A3B8" fontSize="11" fontWeight="700">KOTA BEKASI</text>
                <text x="360" y="375" fill="#94A3B8" fontSize="11" fontWeight="700">KOTA BOGOR</text>
                <text x="60" y="300" fill="#94A3B8" fontSize="11" fontWeight="700">TANGERANG</text>
                <text x="440" y="270" fill="#94A3B8" fontSize="11" fontWeight="700">DEPOK</text>

                {/* 1. KRL Bogor Line (Red) */}
                <path
                  d="M 400 40 L 400 350"
                  stroke="#DC2626"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* 2. KRL Cikarang / Bekasi Line (Blue) */}
                <path
                  d="M 160 140 L 400 140 L 720 140"
                  stroke="#2563EB"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* 3. MRT Jakarta Line (Cyan) */}
                <path
                  d="M 360 80 L 360 290"
                  stroke="#0284C7"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* 4. KRL Tangerang Line (Brown) */}
                <path
                  d="M 120 220 L 260 140"
                  stroke="#92400E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* 5. LRT Jabodebek Line (Purple) */}
                <path
                  d="M 360 140 L 520 210 L 680 210"
                  stroke="#7C3AED"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Station Nodes */}
                {/* Jakarta Kota */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Jakarta Kota', lines: 'KRL Lin Bogor, Lin Tanjung Priok', transitHub: true, zone: 'Jakarta Utara/Barat' })}>
                  <circle cx="400" cy="50" r="6" fill="#FFFFFF" stroke="#DC2626" strokeWidth="3" />
                  <text x="415" y="54" fontSize="11" fontWeight="600" fill="#0F172A">Jakarta Kota</text>
                </g>

                {/* Manggarai (Hub) */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Manggarai', lines: 'KRL Lin Bogor, Lin Cikarang, KA Bandara', transitHub: true, zone: 'Transit Utama (Central Hub)' })}>
                  <circle cx="400" cy="140" r="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
                  <circle cx="400" cy="140" r="5" fill="#2563EB" />
                  <text x="400" y="122" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0F172A">MANGGARAI (Hub)</text>
                </g>

                {/* Sudirman / Dukuh Atas Hub */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Kawasan Dukuh Atas - Sudirman', lines: 'KRL Sudirman, MRT Dukuh Atas BNI, LRT Dukuh Atas, TJ Tosari', transitHub: true, zone: 'Kawasan Integrasi Dukuh Atas' })}>
                  <circle cx="360" cy="140" r="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3.5" />
                  <circle cx="360" cy="140" r="4" fill="#7C3AED" />
                  <text x="345" y="130" textAnchor="end" fontSize="11" fontWeight="700" fill="#0F172A">Sudirman / Dukuh Atas</text>
                </g>

                {/* Bundaran HI */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Bundaran HI', lines: 'MRT Jakarta, TransJakarta Koridor 1', transitHub: true, zone: 'Jakarta Pusat' })}>
                  <circle cx="360" cy="80" r="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
                  <text x="345" y="84" textAnchor="end" fontSize="11" fontWeight="600" fill="#0F172A">Bundaran HI</text>
                </g>

                {/* Blok M */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Blok M BCA', lines: 'MRT Jakarta, Terminal Bus TransJakarta', transitHub: true, zone: 'Jakarta Selatan' })}>
                  <circle cx="360" cy="220" r="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
                  <text x="345" y="224" textAnchor="end" fontSize="11" fontWeight="600" fill="#0F172A">Blok M</text>
                </g>

                {/* Lebak Bulus */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Lebak Bulus Grab', lines: 'MRT Jakarta Terminus Selatan', transitHub: false, zone: 'Jakarta Selatan' })}>
                  <circle cx="360" cy="290" r="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
                  <text x="345" y="294" textAnchor="end" fontSize="11" fontWeight="600" fill="#0F172A">Lebak Bulus</text>
                </g>

                {/* Depok */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Depok & Depok Baru', lines: 'KRL Lin Bogor', transitHub: false, zone: 'Kota Depok' })}>
                  <circle cx="400" cy="240" r="6" fill="#FFFFFF" stroke="#DC2626" strokeWidth="3" />
                  <text x="415" y="244" fontSize="11" fontWeight="600" fill="#0F172A">Depok</text>
                </g>

                {/* Bogor */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Bogor', lines: 'KRL Lin Bogor Terminus', transitHub: false, zone: 'Kota Bogor' })}>
                  <circle cx="400" cy="340" r="7" fill="#FFFFFF" stroke="#DC2626" strokeWidth="3.5" />
                  <text x="415" y="344" fontSize="11" fontWeight="700" fill="#0F172A">Bogor</text>
                </g>

                {/* Bekasi */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Bekasi', lines: 'KRL Lin Cikarang', transitHub: false, zone: 'Kota Bekasi' })}>
                  <circle cx="580" cy="140" r="6" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
                  <text x="580" y="165" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0F172A">Bekasi</text>
                </g>

                {/* Cikarang */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Cikarang', lines: 'KRL Lin Cikarang & Kereta Lokal', transitHub: false, zone: 'Kab. Bekasi' })}>
                  <circle cx="710" cy="140" r="6" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
                  <text x="710" y="165" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0F172A">Cikarang</text>
                </g>

                {/* Tangerang */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Tangerang', lines: 'KRL Lin Tangerang', transitHub: false, zone: 'Kota Tangerang' })}>
                  <circle cx="130" cy="215" r="6" fill="#FFFFFF" stroke="#92400E" strokeWidth="3" />
                  <text x="130" y="238" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0F172A">Tangerang</text>
                </g>

                {/* Duri */}
                <g style={{ cursor: 'pointer' }} onClick={() => setSelectedStation({ name: 'Stasiun Duri', lines: 'KRL Lin Tangerang, Lin Cikarang, KA Bandara', transitHub: true, zone: 'Jakarta Barat' })}>
                  <circle cx="260" cy="140" r="7" fill="#FFFFFF" stroke="#92400E" strokeWidth="3.5" />
                  <text x="260" y="125" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">Duri (Transit)</text>
                </g>
              </svg>

              {/* Station Info Overlay Card */}
              {selectedStation && (
                <div className="map-interactive-station-box">
                  <div className="map-station-info-name">
                    📍 {selectedStation.name}
                  </div>
                  <div className="map-station-info-details">
                    <div><strong>Jalur:</strong> {selectedStation.lines}</div>
                    <div style={{ marginTop: 3 }}><strong>Zona:</strong> {selectedStation.zone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. FINAL CTA ──────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container cta-box">
          <h2 className="cta-title">Siap berangkat?</h2>
          <p className="cta-subtitle">
            Temukan rute perjalananmu sekarang. Cari opsi transportasi umum Jabodetabek yang paling sesuai dengan waktu dan budget Anda.
          </p>
          <Link to="/journey-planner" className="cta-btn-large">
            <Search size={20} /> Rencanakan Perjalanan
          </Link>
        </div>
      </section>

      {/* ─── 9. FOOTER ─────────────────────────────────────────────────── */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div>
              <div className="footer-brand-title">
                <Train size={22} color="var(--primary, #2563EB)" />
                <span>TRANSIT</span>
              </div>
              <p className="footer-brand-desc">
                Jabodetabek Mobility Planner — Platform perencana perjalanan terintegrasi untuk transportasi umum komuter.
              </p>
              <div className="text-xs text-muted">
                <em>Plan your route. Manage your time. Move smarter.</em>
              </div>
            </div>

            {/* Navigation Column */}
            <div>
              <div className="footer-column-title">Layanan</div>
              <div className="footer-link-list">
                <Link to="/journey-planner">Rencanakan Perjalanan</Link>
                <a href="#transport-modes">Moda Transportasi</a>
                <a href="#map-preview">Peta Jaringan</a>
                <Link to="/journey-planner">Arrive On Time</Link>
              </div>
            </div>

            {/* Features Column */}
            <div>
              <div className="footer-column-title">Fitur Komuter</div>
              <div className="footer-link-list">
                <Link to="/my-trips">Perjalanan Saya</Link>
                <Link to="/my-schedule">Jadwal Rutin</Link>
                <Link to="/login">Login / Profil</Link>
              </div>
            </div>

            {/* Coverage Area */}
            <div>
              <div className="footer-column-title">Cakupan Layanan</div>
              <div className="footer-link-list">
                <span>• DKI Jakarta</span>
                <span>• Kota & Kab. Bogor</span>
                <span>• Kota Depok</span>
                <span>• Kota & Kab. Tangerang</span>
                <span>• Kota & Kab. Bekasi</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <div>
              © 2026 TRANSIT — Jabodetabek Mobility Planner. Hak Cipta Dilindungi.
            </div>
            <div className="footer-disclaimer-tag">
              ⚠️ Data rute dan estimasi waktu disajikan sebagai data acuan simulasi pengembangan (Development Sample Data).
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
