// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JourneyPlannerPage from './pages/JourneyPlannerPage';

// Simple fallback view for secondary paths with clean styling
const SimplePage = ({ title, description }) => (
  <div style={{ minHeight: '80vh', padding: '64px 24px', maxWidth: 900, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
    <Link
      to="/"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: '#2563EB',
        fontWeight: 600,
        textDecoration: 'none',
        marginBottom: 24,
      }}
    >
      ← Kembali ke Beranda
    </Link>
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '36px', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
        {title}
      </h1>
      <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: 28 }}>
        {description || 'Fitur ini terintegrasi dalam platform TRANSIT Jabodetabek.'}
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link
          to="/journey-planner"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#2563EB',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 10,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          🚆 Buka Journey Planner
        </Link>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#0F172A',
            padding: '12px 20px',
            borderRadius: 10,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Beranda TRANSIT
        </Link>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/journey-planner" element={<JourneyPlannerPage />} />
      <Route path="/plan" element={<JourneyPlannerPage />} />
      <Route
        path="/map"
        element={
          <SimplePage
            title="Peta Interaktif Jabodetabek"
            description="Visualisasi jaringan KRL, MRT, LRT, dan TransJakarta untuk mendukung perjalanan komuter."
          />
        }
      />
      <Route
        path="/explore"
        element={
          <SimplePage
            title="Eksplorasi Moda Transportasi"
            description="Daftar lengkap operator, moda, rute, dan tarif angkutan massal di Jabodetabek."
          />
        }
      />
      <Route
        path="/my-trips"
        element={
          <SimplePage
            title="Perjalanan Saya"
            description="Kelola dan gunakan kembali perjalanan favorit harian Anda dengan cepat."
          />
        }
      />
      <Route
        path="/schedule"
        element={
          <SimplePage
            title="Jadwal Rutin"
            description="Atur rutinitas komuter Anda untuk mendapatkan rekomendasi waktu keberangkatan setiap hari."
          />
        }
      />
      <Route
        path="/my-schedule"
        element={
          <SimplePage
            title="Jadwal Rutin"
            description="Atur rutinitas komuter Anda untuk mendapatkan rekomendasi waktu keberangkatan setiap hari."
          />
        }
      />
      <Route
        path="/login"
        element={
          <SimplePage
            title="Masuk / Akun Profil"
            description="Masuk untuk menyimpan perjalanan favorit dan sinkronisasi jadwal komuter Anda."
          />
        }
      />
      <Route
        path="/register"
        element={
          <SimplePage
            title="Daftar Akun TRANSIT"
            description="Daftar akun gratis untuk menikmati fitur personalisasi perjalanan komuter Jabodetabek."
          />
        }
      />
      <Route
        path="/admin"
        element={
          <SimplePage
            title="Admin Dashboard"
            description="Panel pengelolaan data acuan operator, rute, stasiun, jadwal, dan tarif."
          />
        }
      />
    </Routes>
  );
}

export default App;
