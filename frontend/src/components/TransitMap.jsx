// src/components/TransitMap.jsx
// Peta Geografis Jabodetabek menggunakan Leaflet + OpenStreetMap.
// Data stasiun & koordinat didapat dari sumber terverifikasi (Wikipedia/Wikidata).

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TransitMap.css';

// â”€â”€â”€ Koordinat stasiun (lat, lon) â€” verifikasi dari sumber eksternal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// KRL: Jakarta Kota, Manggarai, Depok, Bogor, Bekasi, Cikarang, Duri, Tangerang
// MRT: semampai Bundaran HI (Lin Utaraâ€“Selatan)
// LRT: Dukuh Atas â†’ Jatimulya (Lin Bekasi)
const STATIONS = [
  { id: 'kota', name: 'Stasiun Jakarta Kota', lat: -6.13757889, lon: 106.81463389, lines: 'KRL Lin Bogor â€¢ KA Tanjung Priok', type: 'krl', zone: 'Jakarta Barat' },
  { id: 'manggarai', name: 'Stasiun Manggarai', lat: -6.2099, lon: 106.8502, lines: 'KRL Lin Bogor â€¢ KRL Lin Cikarang â€¢ KA Bandara', type: 'krl', zone: 'Transit Utama (Manggarai)' },
  { id: 'depok', name: 'Stasiun Depok', lat: -6.4044222, lon: 106.8170861, lines: 'KRL Lin Bogor', type: 'krl', zone: 'Kota Depok' },
  { id: 'bogor', name: 'Stasiun Bogor', lat: -6.5941, lon: 106.7908, lines: 'KRL Lin Bogor (Akhir)', type: 'krl', zone: 'Kota Bogor' },
  { id: 'bekasi', name: 'Stasiun Bekasi', lat: -6.23528, lon: 107.0025, lines: 'KRL Lin Cikarang', type: 'krl', zone: 'Kota Bekasi' },
  { id: 'cikarang', name: 'Stasiun Cikarang', lat: -6.2536, lon: 107.1422, lines: 'KRL Lin Cikarang & Kereta Lokal', type: 'krl', zone: 'Kab. Bekasi' },
  { id: 'duri', name: 'Stasiun Duri', lat: -6.156302, lon: 106.801063, lines: 'KRL Lin Tangerang â€¢ KRL Lin Cikarang â€¢ KA Bandara', type: 'krl', zone: 'Jakarta Barat (Transit)' },
  { id: 'tangerang', name: 'Stasiun Tangerang', lat: -6.18028, lon: 106.62917, lines: 'KRL Lin Tangerang', type: 'krl', zone: 'Kota Tangerang' },

  { id: 'mrt-lebak-Bulus', name: 'Stasiun MRT Lebak Bulus', lat: -6.2893, lon: 106.7746, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan (Akhir)' },
  { id: 'mrt-fatmawati', name: 'Stasiun MRT Fatmawati Indomaret', lat: -6.2923, lon: 106.7923, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan' },
  { id: 'mrt-cipete', name: 'Stasiun MRT Cipete Raya Tuku', lat: -6.2774, lon: 106.7975, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan' },
  { id: 'mrt-haji-nawi', name: 'Stasiun MRT Haji Nawi', lat: -6.2667982, lon: 106.7973162, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan' },
  { id: 'mrt-blokA', name: 'Stasiun MRT Blok A', lat: -6.2555837, lon: 106.797134, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan' },
  { id: 'mrt-blokM', name: 'Stasiun MRT Blok M', lat: -6.2445265, lon: 106.7982103, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan' },
  { id: 'mrt-asean', name: 'Stasiun MRT ASEAN', lat: -6.239085, lon: 106.7985954, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan' },
  { id: 'mrt-senayan', name: 'Stasiun MRT Senayan', lat: -6.2266907, lon: 106.80247, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan' },
  { id: 'mrt-istora', name: 'Stasiun MRT Istora Mandiri', lat: -6.2229548, lon: 106.8073684, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan' },
  { id: 'mrt-setiabudi', name: 'Stasiun MRT Setiabudi Astra', lat: -6.2099302, lon: 106.8215168, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Selatan' },
  { id: 'mrt-dukuhAtas', name: 'Stasiun MRT Dukuh Atas BNI', lat: -6.20095, lon: 106.822809, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Pusat (Transit Utama)' },
  { id: 'mrt-bundaranHI', name: 'Stasiun MRT Bundaran HI', lat: -6.1934095, lon: 106.8228579, lines: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'mrt', zone: 'Jakarta Pusat (Akhir Utara)' },
  { id: 'lrt-dukuhAtas', name: 'Stasiun LRT Dukuh Atas', lat: -6.2047, lon: 106.8256, lines: 'LRT Jabodebek Lin Bekasi â€¢ Lin Cibubur', type: 'lrt', zone: 'Jakarta Pusat (Transit Utama)' },
  { id: 'lrt-setiabudi', name: 'Stasiun LRT Setiabudi', lat: -6.209277, lon: 106.830211, lines: 'LRT Jabodebek Lin Bekasi â€¢ Lin Cibubur', type: 'lrt', zone: 'Jakarta Selatan' },
  { id: 'lrt-rasunaSaid', name: 'Stasiun LRT Rasuna Said', lat: -6.221753, lon: 106.832261, lines: 'LRT Jabodebek Lin Bekasi â€¢ Lin Cibubur', type: 'lrt', zone: 'Jakarta Selatan' },
  { id: 'lrt-kuningan', name: 'Stasiun LRT Kuningan', lat: -6.228881, lon: 106.833175, lines: 'LRT Jabodebek Lin Bekasi â€¢ Lin Cibubur', type: 'lrt', zone: 'Jakarta Selatan' },
  { id: 'lrt-pancoran', name: 'Stasiun LRT Pancoran', lat: -6.2421272, lon: 106.8384693, lines: 'LRT Jabodebek Lin Bekasi â€¢ Lin Cibubur', type: 'lrt', zone: 'Jakarta Selatan' },
  { id: 'lrt-cikoko', name: 'Stasiun LRT Cikoko', lat: -6.243476, lon: 106.857102, lines: 'LRT Jabodebek Lin Bekasi â€¢ Lin Cibubur', type: 'lrt', zone: 'Jakarta Selatan' },
  { id: 'lrt-ciliwung', name: 'Stasiun LRT Ciliwung', lat: -6.243477, lon: 106.864131, lines: 'LRT Jabodebek Lin Bekasi â€¢ Lin Cibubur', type: 'lrt', zone: 'Jakarta Timur' },
  { id: 'lrt-cawang', name: 'Stasiun LRT Cawang', lat: -6.246225, lon: 106.872386, lines: 'LRT Jabodebek Lin Bekasi â€¢ Lin Cibubur', type: 'lrt', zone: 'Jakarta Timur' },
  { id: 'lrt-halim', name: 'Stasiun LRT Halim', lat: -6.2457663, lon: 106.8852410, lines: 'LRT Jabodebek Lin Bekasi', type: 'lrt', zone: 'Jakarta Timur' },
  { id: 'lrt-jatiBening', name: 'Stasiun LRT Jati Bening Baru', lat: -6.257775, lon: 106.927679, lines: 'LRT Jabodebek Lin Bekasi', type: 'lrt', zone: 'Kota Bekasi' },
  { id: 'lrt-cikunir1', name: 'Stasiun LRT Cikunir 1', lat: -6.25624, lon: 106.950998, lines: 'LRT Jabodebek Lin Bekasi', type: 'lrt', zone: 'Kota Bekasi' },
  { id: 'lrt-cikunir2', name: 'Stasiun LRT Cikunir 2', lat: -6.254512, lon: 106.963378, lines: 'LRT Jabodebek Lin Bekasi', type: 'lrt', zone: 'Kota Bekasi' },
  { id: 'lrt-bekasiBarat', name: 'Stasiun LRT Bekasi Barat', lat: -6.252926, lon: 106.990076, lines: 'LRT Jabodebek Lin Bekasi', type: 'lrt', zone: 'Kota Bekasi' },
  { id: 'lrt-jatimulya', name: 'Stasiun LRT Jatimulya', lat: -6.263952, lon: 107.021432, lines: 'LRT Jabodebek Lin Bekasi (Akhir)', type: 'lrt', zone: 'Kab. Bekasi' },

];

// â”€â”€â”€ Rute jalur (urutan stasiun dari sumber jalur nyata) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ROUTES = [
  { id: 'krl-bogor', name: 'KRL Lin Bogor', type: 'KRL', color: '#DC2626', stations: ['kota', 'manggarai', 'depok', 'bogor'] },
  { id: 'krl-cikarang', name: 'KRL Lin Cikarang', type: 'KRL', color: '#2563EB', stations: ['manggarai', 'bekasi', 'cikarang'] },
  { id: 'krl-tangerang', name: 'KRL Lin Tangerang', type: 'KRL', color: '#92400E', stations: ['duri', 'tangerang'] },
  { id: 'mrt-nus', name: 'MRT Jakarta Lin Utaraâ€“Selatan', type: 'MRT', color: '#0284C7', stations: ['mrt-lebak-Bulus', 'mrt-fatmawati', 'mrt-cipete', 'mrt-haji-nawi', 'mrt-blokA', 'mrt-blokM', 'mrt-asean', 'mrt-senayan', 'mrt-istora', 'mrt-setiabudi', 'mrt-dukuhAtas', 'mrt-bundaranHI'] },
  { id: 'lrt-bekasi', name: 'LRT Jabodebek Lin Bekasi', type: 'LRT', color: '#7C3AED', stations: ['lrt-dukuhAtas', 'lrt-setiabudi', 'lrt-rasunaSaid', 'lrt-kuningan', 'lrt-pancoran', 'lrt-cikoko', 'lrt-ciliwung', 'lrt-cawang', 'lrt-halim', 'lrt-jatiBening', 'lrt-cikunir1', 'lrt-cikunir2', 'lrt-bekasiBarat', 'lrt-jatimulya'] },
];

export default function TransitMap({ selectedRoute, onStationSelect }) {
  const mapContainerRef = useRef(null);

  const [selectedStation, setSelectedStation] = useState(null);

  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    const map = L.map(container, {
      center: [-6.35, 106.85],
      zoom: 10,
      zoomControl: true,
      attributionControl: true,
      fadeAnimation: true,
      zoomAnimation: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    mapRef.current = map;
    setReady(true);
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Render semua rute base
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline && layer._routeId) map.removeLayer(layer);
    });
    ROUTES.forEach((route) => {
      const coords = route.stations
        .map((sid) => STATIONS.find((s) => s.id === sid))
        .filter(Boolean)
        .map((s) => [s.lat, s.lon]);
      if (coords.length < 2) return;
      const polyline = L.polyline(coords, {
        color: route.color, weight: 6, opacity: 0.85, smoothFactor: 1.2,
      }).addTo(map);
      polyline._routeId = route.id;
      polyline.bindPopup(`<div style="font-weight:700;color:#0F172A">${route.name}</div><div style="font-size:0.75rem;color:#64748B">${route.type}</div>`);
    });

  // Render marker stasiun
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    STATIONS.forEach((station) => {
      const marker = L.circleMarker([station.lat, station.lon], {
        radius: 8,
        color: '#1F2937',
        weight: 2,
        fillColor: station.type === 'mrt' ? '#0284C7' : station.type === 'lrt' ? '#7C3AED' : '#DC2626',
        fillOpacity: 0.85,
      });

      const popupContent = `
        <div style="font-weight:700;color:#0F172A;font-size:0.9rem">${station.name}</div>
        <div style="font-size:0.75rem;color:#64748B;margin-top:4px">${station.lines}</div>
        <div style="font-size:0.7rem;color:#94A3B8;margin-top:4px">${station.zone}</div>
      `;
      marker.bindPopup(popupContent);

      if (onStationSelect) {
        marker.on('click', () => onStationSelect(station));
      }
      marker.addTo(map);
    });
  }, [ready, onStationSelect]);

  // Garis rute terpilih (dari Journey Planner) + marker asal/ujung/transit
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    // Hapus highlight sebelumnya
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline && layer._highlightId) map.removeLayer(layer);
      if (layer instanceof L.circleMarker && layer._highlightId) map.removeLayer(layer);
      if (layer instanceof L.marker && layer._highlightId) map.removeLayer(layer);
    });

    if (!selectedRoute || !selectedRoute.legs || selectedRoute.legs.length === 0) return;

    const pathCoords = [];
    let origin = null;
    let destination = null;
    const transitNames = new Set();

    selectedRoute.legs.forEach((leg) => {
      const legStationNames = (leg.stops || []).map((s) => s.stationName).filter(Boolean);
      legStationNames.forEach((name) => {
        const st = STATIONS.find((s) => s.name === name);
        if (!st) return;
        const coord = [st.lat, st.lon];
        if (!pathCoords.length) origin = coord;
        pathCoords.push(coord);
        if (legStationNames.indexOf(name) === legStationNames.length - 1) destination = coord;
        if (legStationNames.indexOf(name) > 0 && legStationNames.indexOf(name) < legStationNames.length - 1) {
          transitNames.add(name);
        }
      });
    });

    if (!origin || !destination) return;

    // Poligon rute terpilih
    if (pathCoords.length >= 2) {
      const polyline = L.polyline(pathCoords, {
        color: '#F59E0B', weight: 7, opacity: 0.95, dashArray: '6 8',
      }).addTo(map);
      polyline._highlightId = true;
      polyline.bindPopup('<div style="font-weight:700;color:#0F172A">Rute terpilih â€” klik untuk informasi</div>');
    }

    // Marker asal (hijau)
    L.circleMarker(origin, { radius: 10, color: '#16A34A', fillColor: '#10B981', fillOpacity: 0.9, _highlightId: true }).addTo(map);
    // Marker tujuan (merah)
    L.circleMarker(destination, { radius: 10, color: '#DC2626', fillColor: '#EF4444', fillOpacity: 0.9, _highlightId: true }).addTo(map);

    // Marker transit (oranye)
    transitNames.forEach((name) => {
      const st = STATIONS.find((s) => s.name === name);
      if (st) {
        L.circleMarker([st.lat, st.lon], { radius: 7, color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.9, _highlightId: true }).addTo(map);
      }
    });

    const all = pathCoords;
    if (all.length > 0) {
      const bounds = L.latLngBounds(all);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [selectedRoute, ready]);

  }, [ready]);

  return (
    <div className="transit-map-wrapper">
      <div className="transit-map-header">
        <div>
          <div className="transit-map-header-title">Peta Geografis Jabodetabek</div>
          <div className="transit-map-header-subtitle">
            <span className="transit-map-header-type">KRL</span><span className="transit-map-header-type">MRT</span><span className="transit-map-header-type">LRT</span>
          </div>
        </div>
        <div className="transit-map-footer-note">
          Peta visualisasi geografis rute &amp; stasiun â€” bukan pelacak GPS live dan bukan pelacakan armada.
        </div>
      </div>

      {/* Info stasiun terjual â€” muncul saat marker diklik */}
      {selectedStation && (
        <div className="transit-map-station-box">
          <div className="transit-map-station-name">ðŸ“ {selectedStation.name}</div>
          <div className="transit-map-station-detail">{selectedStation.lines}</div>
          <div className="transit-map-station-detail">ðŸ—ºï¸ {selectedStation.zone}</div>
        </div>
      )}

      <div ref={mapContainerRef} className="transit-map-container" style={{ minHeight: '420px' }} />

      <div className="transit-map-legend">
        {ROUTES.map((r) => (
          <span key={r.id} className="transit-map-legend-item">
            <span className="transit-map-legend-swatch" style={{ backgroundColor: r.color }} />
            {r.name} ({r.type})
          </span>
        ))}
      </div>
    </div>
  );
}
