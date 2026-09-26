// src/pages/JourneyPlannerPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  ArrowUpDown,
  Search,
  AlertCircle,
  X,
  ChevronRight,
  Train,
  Bus,
  Footprints,
} from 'lucide-react';
import { planJourney, searchStations } from '../utils/journeyApi';
import '../styles/journeyPlanner.css';

// Preference chip options per style.md
const PREFERENCES = [
  { id: 'fastest', label: 'Tercepat', icon: '⚡' },
  { id: 'cheapest', label: 'Termurah', icon: '💰' },
  { id: 'min_transfer', label: 'Minim Transit', icon: '🔄' },
  { id: 'min_walk', label: 'Minim Jalan Kaki', icon: '🚶' },
  { id: 'most_comfortable', label: 'Paling Nyaman', icon: '✨' },
];

function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) {
    return `${h}j ${m > 0 ? `${m}m` : ''}`.trim();
  }
  return `${m}m`;
}

function formatRupiah(amount) {
  if (amount === undefined || amount === null) return 'Rp0';
  return `Rp${Number(amount).toLocaleString('id-ID')}`;
}

export default function JourneyPlannerPage() {
  // Today's date in YYYY-MM-DD
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Default target time (next full 15 minutes or 1 hour from now)
  const getDefaultTimeString = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 60);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(Math.ceil(d.getMinutes() / 15) * 15 % 60).padStart(2, '0');
    return `${h}:${m}`;
  };

  // Form State
  const [originQuery, setOriginQuery] = useState('Stasiun Bekasi');
  const [selectedOrigin, setSelectedOrigin] = useState({ id: '2', name: 'Stasiun Bekasi', city: { name: 'Kota Bekasi' } });
  const [originOptions, setOriginOptions] = useState([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);

  const [destQuery, setDestQuery] = useState('Stasiun Sudirman');
  const [selectedDest, setSelectedDest] = useState({ id: '3', name: 'Stasiun Sudirman', city: { name: 'Jakarta Pusat' } });
  const [destOptions, setDestOptions] = useState([]);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [mode, setMode] = useState('arrive_by'); // 'arrive_by' | 'depart_at'
  const [targetDate, setTargetDate] = useState(getTodayDateString());
  const [targetTime, setTargetTime] = useState(getDefaultTimeString());
  const [preference, setPreference] = useState('fastest');

  // UI / Results State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [results, setResults] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [selectedRouteForDetail, setSelectedRouteForDetail] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const originRef = useRef(null);
  const destRef = useRef(null);
  const timelineSheetRef = useRef(null);

  // Set document title
  useEffect(() => {
    document.title = 'Journey Planner — TRANSIT Jabodetabek';
    return () => { document.title = 'TRANSIT — Jabodetabek Mobility Planner'; };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (originRef.current && !originRef.current.contains(e.target)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target)) {
        setShowDestDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus-trap inside the timeline dialog
  useEffect(() => {
    if (!selectedRouteForDetail || !timelineSheetRef.current) return;
    const sheet = timelineSheetRef.current;
    const focusable = sheet.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function trapTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    function closeOnEsc(e) {
      if (e.key === 'Escape') setSelectedRouteForDetail(null);
    }
    sheet.addEventListener('keydown', trapTab);
    document.addEventListener('keydown', closeOnEsc);
    // Move focus into the dialog on open
    if (first) first.focus();
    return () => {
      sheet.removeEventListener('keydown', trapTab);
      document.removeEventListener('keydown', closeOnEsc);
    };
  }, [selectedRouteForDetail]);

  // Station search for Origin
  useEffect(() => {
    let active = true;
    if (originQuery && originQuery.trim().length >= 1) {
      const timer = setTimeout(async () => {
        try {
          const stations = await searchStations(originQuery.trim());
          if (active) {
            setOriginOptions(stations);
          }
        } catch (e) {
          if (active) setOriginOptions([]);
        }
      }, 200);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    } else {
      setOriginOptions([]);
    }
  }, [originQuery]);

  // Station search for Destination
  useEffect(() => {
    let active = true;
    if (destQuery && destQuery.trim().length >= 1) {
      const timer = setTimeout(async () => {
        try {
          const stations = await searchStations(destQuery.trim());
          if (active) {
            setDestOptions(stations);
          }
        } catch (e) {
          if (active) setDestOptions([]);
        }
      }, 200);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    } else {
      setDestOptions([]);
    }
  }, [destQuery]);

  // Swap Origin and Destination
  const handleSwap = () => {
    const prevOrigin = selectedOrigin;
    const prevQuery = originQuery;

    setSelectedOrigin(selectedDest);
    setOriginQuery(destQuery);

    setSelectedDest(prevOrigin);
    setDestQuery(prevQuery);

    setFieldErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!selectedOrigin || !originQuery) {
      errors.origin = 'Pilih stasiun keberangkatan (asal)';
    }
    if (!selectedDest || !destQuery) {
      errors.destination = 'Pilih stasiun kedatangan (tujuan)';
    }
    if (selectedOrigin && selectedDest && String(selectedOrigin.id) === String(selectedDest.id)) {
      errors.destination = 'Stasiun asal dan tujuan tidak boleh sama';
    }
    if (!targetDate) {
      errors.date = 'Pilih tanggal perjalanan';
    }
    if (!targetTime) {
      errors.time = 'Tentukan waktu target perjalanan';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Perform search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await planJourney({
        originStationId: selectedOrigin.id,
        destinationStationId: selectedDest.id,
        targetTime,
        mode,
        date: targetDate,
        preference,
      });

      setResults(response.routes || []);
      setRecommendation(response.recommendation || (response.routes && response.routes[0]) || null);
    } catch (err) {
      console.error('Plan journey error:', err);
      setError(err.message || 'Gagal memuat rekomendasi perjalanan. Silakan coba lagi.');
      setResults([]);
      setRecommendation(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial plan load so page has rich results ready
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="jp-page">
      {/* ─── Hero / Header ──────────────────────────────────────────── */}
      <header className="jp-hero" role="banner">
        <div className="jp-hero__inner">
          <h1 className="jp-hero__title" id="jp-title">Sampai tepat waktu, tanpa ribet.</h1>
          <p className="jp-hero__subtitle">
            Cari rute transportasi umum Jabodetabek, tentukan target waktu tiba, dan dapatkan rekomendasi perjalanan yang mudah diikuti.
          </p>

          {/* ─── Search Form Card ─────────────────────────────── */}
          <section className="jp-card" aria-labelledby="jp-form-heading">
            <h2 id="jp-form-heading" className="sr-only">
              Form Pencarian Perjalanan Jabodetabek
            </h2>
            <form onSubmit={handleSearch} noValidate>
              {/* Location Input Row */}
              <div className="jp-location-row">
                <div className="jp-location-inputs">
                  {/* Origin Field */}
                  <div className="jp-location" ref={originRef}>
                    <label htmlFor="jp-origin-input" className="sr-only">
                      Stasiun / Halte Keberangkatan
                    </label>
                    <span className="jp-location__icon" aria-hidden="true">
                      <MapPin size={18} color="#2563EB" />
                    </span>
                    <input
                      id="jp-origin-input"
                      type="text"
                      className="jp-location__input"
                      placeholder="Dari: Stasiun / Halte asal..."
                      value={originQuery}
                      onChange={(e) => {
                        setOriginQuery(e.target.value);
                        setSelectedOrigin(null);
                        setShowOriginDropdown(true);
                      }}
                      onFocus={() => setShowOriginDropdown(true)}
                      aria-autocomplete="list"
                      aria-expanded={showOriginDropdown}
                      aria-controls="origin-dropdown"
                      autoComplete="off"
                    />
                    {fieldErrors.origin && (
                      <div className="jp-field-error" role="alert">{fieldErrors.origin}</div>
                    )}

                    {showOriginDropdown && originOptions.length > 0 && (
                      <div className="jp-location__dropdown" role="listbox" id="origin-dropdown">
                        {originOptions.map((st) => (
                          <div
                            key={st.id}
                            className="jp-location__option"
                            role="option"
                            tabIndex={0}
                            onClick={() => {
                              setSelectedOrigin(st);
                              setOriginQuery(st.name);
                              setShowOriginDropdown(false);
                              if (fieldErrors.origin) {
                                setFieldErrors(prev => ({ ...prev, origin: null }));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setSelectedOrigin(st);
                                setOriginQuery(st.name);
                                setShowOriginDropdown(false);
                              }
                            }}
                          >
                            <span className="jp-location__option-name">{st.name}</span>
                            <span className="jp-location__option-city">
                              {st.city?.name || st.address || 'Jabodetabek'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Destination Field */}
                  <div className="jp-location" ref={destRef}>
                    <label htmlFor="jp-dest-input" className="sr-only">
                      Stasiun / Halte Tujuan
                    </label>
                    <span className="jp-location__icon" aria-hidden="true">
                      <MapPin size={18} color="#16A34A" />
                    </span>
                    <input
                      id="jp-dest-input"
                      type="text"
                      className="jp-location__input"
                      placeholder="Ke: Stasiun / Halte tujuan..."
                      value={destQuery}
                      onChange={(e) => {
                        setDestQuery(e.target.value);
                        setSelectedDest(null);
                        setShowDestDropdown(true);
                      }}
                      onFocus={() => setShowDestDropdown(true)}
                      aria-autocomplete="list"
                      aria-expanded={showDestDropdown}
                      aria-controls="dest-dropdown"
                      autoComplete="off"
                    />
                    {fieldErrors.destination && (
                      <div className="jp-field-error" role="alert">{fieldErrors.destination}</div>
                    )}

                    {showDestDropdown && destOptions.length > 0 && (
                      <div className="jp-location__dropdown" role="listbox" id="dest-dropdown">
                        {destOptions.map((st) => (
                          <div
                            key={st.id}
                            className="jp-location__option"
                            role="option"
                            tabIndex={0}
                            onClick={() => {
                              setSelectedDest(st);
                              setDestQuery(st.name);
                              setShowDestDropdown(false);
                              if (fieldErrors.destination) {
                                setFieldErrors(prev => ({ ...prev, destination: null }));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setSelectedDest(st);
                                setDestQuery(st.name);
                                setShowDestDropdown(false);
                              }
                            }}
                          >
                            <span className="jp-location__option-name">{st.name}</span>
                            <span className="jp-location__option-city">
                              {st.city?.name || st.address || 'Jabodetabek'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap Button */}
                <button
                  type="button"
                  className="jp-swap-btn"
                  onClick={handleSwap}
                  title="Tukar stasiun asal dan tujuan"
                  aria-label="Tukar stasiun asal dan tujuan"
                >
                  <ArrowUpDown size={18} />
                </button>
              </div>

              {/* Preferences Row: Mode, Date, Time */}
              <div className="jp-row">
                {/* Mode Toggle */}
                <div className="jp-field">
                  <label className="jp-field__label">Target Waktu</label>
                  <div className="jp-mode-toggle" role="group" aria-label="Preferensi waktu">
                    <button
                      type="button"
                      id="mode-arrive-by"
                      className={`jp-mode-toggle__btn ${mode === 'arrive_by' ? 'jp-mode-toggle__btn--active' : ''}`}
                      onClick={() => setMode('arrive_by')}
                      aria-pressed={mode === 'arrive_by'}
                    >
                      Tiba Pada
                    </button>
                    <button
                      type="button"
                      id="mode-depart-at"
                      className={`jp-mode-toggle__btn ${mode === 'depart_at' ? 'jp-mode-toggle__btn--active' : ''}`}
                      onClick={() => setMode('depart_at')}
                      aria-pressed={mode === 'depart_at'}
                    >
                      Berangkat
                    </button>
                  </div>
                </div>

                {/* Date Input */}
                <div className="jp-field">
                  <label htmlFor="jp-target-date" className="jp-field__label">Tanggal</label>
                  <input
                    id="jp-target-date"
                    type="date"
                    className="jp-field__input"
                    value={targetDate}
                    min={getTodayDateString()}
                    onChange={(e) => {
                      setTargetDate(e.target.value);
                      if (fieldErrors.date) setFieldErrors(prev => ({ ...prev, date: null }));
                    }}
                    required
                  />
                  {fieldErrors.date && <div className="jp-field-error" role="alert">{fieldErrors.date}</div>}
                </div>

                {/* Time Input */}
                <div className="jp-field">
                  <label htmlFor="jp-target-time" className="jp-field__label">
                    {mode === 'arrive_by' ? 'Harus Tiba Pukul' : 'Waktu Keberangkatan'}
                  </label>
                  <input
                    id="jp-target-time"
                    type="time"
                    className="jp-field__input"
                    value={targetTime}
                    onChange={(e) => {
                      setTargetTime(e.target.value);
                      if (fieldErrors.time) setFieldErrors(prev => ({ ...prev, time: null }));
                    }}
                    required
                  />
                  {fieldErrors.time && <div className="jp-field-error" role="alert">{fieldErrors.time}</div>}
                </div>
              </div>

              {/* Preference Chips */}
              <div className="jp-prefs" role="radiogroup" aria-label="Prioritas perjalanan">
                {PREFERENCES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={preference === p.id}
                    className={`jp-pref-chip ${preference === p.id ? 'jp-pref-chip--active' : ''}`}
                    onClick={() => setPreference(p.id)}
                  >
                    <span>{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                id="search-journey-btn"
                className="jp-search-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="jp-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                    <span>Mencari Rute...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Cari Perjalanan</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </header>

      {/* ─── Results Section ──────────────────────────────────────── */}
      <main className="jp-results" role="region" aria-live="polite">
        {/* Error State */}
        {error && (
          <div className="jp-error" role="alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, marginBottom: 4 }}>
              <AlertCircle size={18} />
              <span>Gagal Memuat Perjalanan</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="jp-loading" role="status">
            <div className="jp-spinner" />
            <p style={{ fontWeight: 500 }}>Menghitung jadwal dan rekomendasi rute terbaik...</p>
          </div>
        )}

        {/* Loaded Results */}
        {!loading && results && results.length > 0 && (
          <>
            {/* Arrive-On-Time Signature Recommendation Banner */}
            {recommendation && (
              <section className="jp-recommendation" aria-labelledby="recom-title">
                <span className="jp-recommendation__badge">
                  ⭐ Rekomendasi Terpilih ({PREFERENCES.find(p => p.id === preference)?.label || 'Terbaik'})
                </span>
                <div id="recom-title" className="jp-recommendation__depart">
                  Sebaiknya berangkat {recommendation.recommendedDeparture}
                </div>
                <div className="jp-recommendation__meta">
                  Tiba {recommendation.expectedArrival} · Durasi {formatDuration(recommendation.totalDurationMin)} ·{' '}
                  {recommendation.transferCount === 0 ? 'Langsung tanpa transit' : `${recommendation.transferCount} transit`} ·{' '}
                  {formatRupiah(recommendation.totalFare)}
                </div>
                <div className="jp-recommendation__buffer">
                  🛡️ {recommendation.bufferMin ?? 5} menit buffer keamanan sebelum jadwal target ({targetTime})
                </div>
              </section>
            )}

            {/* Quick Metrics Strip */}
            {recommendation && (
              <div className="jp-summary-strip" aria-label="Ringkasan perjalanan terpilih">
                <div className="jp-summary-item">
                  <div className="jp-summary-item__value">{formatDuration(recommendation.totalDurationMin)}</div>
                  <div className="jp-summary-item__label">Total Durasi</div>
                </div>
                <div className="jp-summary-item">
                  <div className="jp-summary-item__value">{recommendation.transferCount}</div>
                  <div className="jp-summary-item__label">Transit</div>
                </div>
                <div className="jp-summary-item">
                  <div className="jp-summary-item__value">{formatRupiah(recommendation.totalFare)}</div>
                  <div className="jp-summary-item__label">Estimasi Tarif</div>
                </div>
                <div className="jp-summary-item">
                  <div className="jp-summary-item__value">{formatDuration(recommendation.walkingDurationMin ?? 0)}</div>
                  <div className="jp-summary-item__label">Jalan Kaki</div>
                </div>
              </div>
            )}

            {/* Route Cards Comparison */}
            <h2 className="jp-results__heading">
              Pilihan Rute Perjalanan ({results.length} Opsi Tersedia)
            </h2>

            <div className="jp-route-list">
              {results.map((route, idx) => {
                const isSelected = selectedRouteForDetail && selectedRouteForDetail.id === route.id;
                let badgeLabel = null;
                if (idx === 0) badgeLabel = 'Rekomendasi';
                else if (route.transferCount === 0) badgeLabel = 'Langsung';
                else if (route.totalFare <= 4000) badgeLabel = 'Paling Hemat';

                return (
                  <article
                    key={route.id || idx}
                    className={`jp-route-card ${isSelected ? 'jp-route-card--selected' : ''}`}
                    tabIndex={0}
                    onClick={() => setSelectedRouteForDetail(route)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setSelectedRouteForDetail(route);
                    }}
                    aria-label={`Rute ${idx + 1}: Berangkat ${route.recommendedDeparture}, Tiba ${route.expectedArrival}, Durasi ${formatDuration(route.totalDurationMin)}`}
                  >
                    <div className="jp-route-card__header">
                      <div>
                        <div className="jp-route-card__times">
                          {route.recommendedDeparture} <span style={{ color: '#94A3B8' }}>→</span> {route.expectedArrival}
                        </div>
                        <div className="jp-route-card__duration">
                          {formatDuration(route.totalDurationMin)} perjalanan
                        </div>
                      </div>
                      {badgeLabel && (
                        <span className="jp-route-card__badge">{badgeLabel}</span>
                      )}
                    </div>

                    {/* Legs Chips */}
                    <div className="jp-route-card__legs">
                      {route.legs.map((leg, legIdx) => {
                        const cat = (leg.transportCategory || 'rail').toLowerCase();
                        let chipClass = 'jp-route-card__leg-chip--rail';
                        let Icon = Train;

                        if (cat === 'brt' || cat === 'bus') {
                          chipClass = 'jp-route-card__leg-chip--brt';
                          Icon = Bus;
                        } else if (cat === 'walking') {
                          chipClass = 'jp-route-card__leg-chip--walking';
                          Icon = Footprints;
                        }

                        return (
                          <React.Fragment key={legIdx}>
                            <span className={`jp-route-card__leg-chip ${chipClass}`}>
                              <Icon size={14} />
                              <span>{leg.transportType || leg.routeName}</span>
                            </span>
                            {legIdx < route.legs.length - 1 && (
                              <span style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center' }}>
                                <ChevronRight size={14} />
                              </span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Card Footer */}
                    <div className="jp-route-card__footer">
                      <div>
                        <strong>{formatRupiah(route.totalFare)}</strong>
                        <span style={{ margin: '0 6px', color: '#CBD5E1' }}>•</span>
                        <span>{route.transferCount === 0 ? 'Tanpa transit' : `${route.transferCount} transit`}</span>
                      </div>
                      <button
                        type="button"
                        className="jp-route-card__detail-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRouteForDetail(route);
                        }}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && hasSearched && (!results || results.length === 0) && !error && (
          <div className="jp-empty">
            <div className="jp-empty__icon">🧭</div>
            <div className="jp-empty__title">Tidak Ada Rute yang Tersedia</div>
            <p>
              Tidak ditemukan jadwal perjalanan langsung antara stasiun yang dipilih pada waktu tersebut. Coba pilih stasiun transit atau geser waktu keberangkatan.
            </p>
          </div>
        )}
      </main>

      {/* ─── Route Timeline Sheet / Modal ─────────────────────────── */}
      {selectedRouteForDetail && (
        <div
          className="jp-timeline-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tl-sheet-title"
          onClick={() => setSelectedRouteForDetail(null)}
        >
          <div
            className="jp-timeline-sheet"
            ref={timelineSheetRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="jp-timeline-sheet__header">
              <h3 id="tl-sheet-title" className="jp-timeline-sheet__title">
                Detail Perjalanan ({selectedRouteForDetail.recommendedDeparture} → {selectedRouteForDetail.expectedArrival})
              </h3>
              <button
                type="button"
                className="jp-timeline-close"
                onClick={() => setSelectedRouteForDetail(null)}
                aria-label="Tutup detail perjalanan"
              >
                <X size={18} />
              </button>
            </div>

            {/* Timeline View */}
            <div className="jp-timeline">
              {/* Departure Start */}
              <div className="jp-tl-item">
                <div className="jp-tl-dot jp-tl-dot--origin" aria-hidden="true">
                  📍
                </div>
                <div className="jp-tl-content">
                  <div className="jp-tl-time">{selectedRouteForDetail.recommendedDeparture}</div>
                  <div className="jp-tl-name">
                    {selectedOrigin?.name || selectedRouteForDetail.originStation?.name || 'Stasiun Asal'}
                  </div>
                  <div className="jp-tl-meta">Mulai perjalanan dari stasiun keberangkatan</div>
                </div>
              </div>

              {/* Legs */}
              {selectedRouteForDetail.legs.map((leg, idx) => {
                const cat = (leg.transportCategory || 'rail').toLowerCase();
                let dotClass = 'jp-tl-dot--rail';
                let iconChar = '🚆';
                if (cat === 'brt' || cat === 'bus') {
                  dotClass = 'jp-tl-dot--brt';
                  iconChar = '🚌';
                }

                return (
                  <React.Fragment key={idx}>
                    {/* Leg Departure */}
                    <div className="jp-tl-item">
                      <div className={`jp-tl-dot ${dotClass}`} aria-hidden="true">
                        {iconChar}
                      </div>
                      <div className="jp-tl-content">
                        <div className="jp-tl-time">Naik {leg.transportType}</div>
                        <div className="jp-tl-name">{leg.routeName}</div>
                        <div className="jp-tl-meta">
                          {leg.operator && `Operator: ${leg.operator} • `}
                          {leg.directionLabel && `${leg.directionLabel} • `}
                          Durasi: {formatDuration(leg.durationMin)} • Tarif: {formatRupiah(leg.fare)}
                        </div>

                        {/* Sub-stops in leg */}
                        {leg.stops && leg.stops.length > 0 && (
                          <div style={{ marginTop: 8, paddingLeft: 8, borderLeft: '2px dashed #E2E8F0', fontSize: '0.8rem', color: '#64748B' }}>
                            {leg.stops.map((stop, sIdx) => (
                              <div key={sIdx} style={{ padding: '2px 0' }}>
                                • {stop.stopName || stop.stationName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transfer Point (if not last leg) */}
                    {idx < selectedRouteForDetail.legs.length - 1 && (
                      <div className="jp-tl-item">
                        <div className="jp-tl-dot jp-tl-dot--transfer" aria-hidden="true">
                          🔄
                        </div>
                        <div className="jp-tl-content">
                          <div className="jp-tl-time">Transit & Pindah Peron</div>
                          <div className="jp-tl-name">
                            {leg.toStop?.station?.name || leg.toStop?.name || 'Stasiun Transit'}
                          </div>
                          <div className="jp-tl-meta">
                            Jalan kaki ~5 menit menuju peron moda berikutnya
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Arrival Destination */}
              <div className="jp-tl-item">
                <div className="jp-tl-dot jp-tl-dot--destination" aria-hidden="true">
                  🏁
                </div>
                <div className="jp-tl-content">
                  <div className="jp-tl-time">{selectedRouteForDetail.expectedArrival}</div>
                  <div className="jp-tl-name">
                    {selectedDest?.name || selectedRouteForDetail.destStation?.name || 'Stasiun Tujuan'}
                  </div>
                  <div className="jp-tl-meta">
                    Tiba di tujuan ({selectedRouteForDetail.bufferMin || 5} menit sebelum batas waktu {targetTime})
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="jp-route-card__detail-btn"
                style={{ background: '#2563EB', color: '#fff', borderColor: '#2563EB', padding: '10px 20px', fontWeight: 600 }}
                onClick={() => setSelectedRouteForDetail(null)}
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
