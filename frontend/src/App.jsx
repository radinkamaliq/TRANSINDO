// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Placeholder component for future pages
const Placeholder = ({ title }) => (
  <div style={{ padding: '2rem' }}>
    <h1>{title}</h1>
    <p>⚠️ This page is a placeholder and will be implemented later.</p>
    <nav>
      <Link to="/">Home</Link>
    </nav>
  </div>
);

const HomePage = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({ status: 'unavailable' }));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>TRANSIT – Home</h1>
      <p>Welcome to the TRANSIT demo. Use the navigation to explore sections.</p>
      <p>Backend health: {health ? `${health.status}` : 'Loading...'}</p>
      <ul>
        <li><Link to="/journey-planner">Journey Planner (placeholder)</Link></li>
        <li><Link to="/map">Map (placeholder)</Link></li>
        <li><Link to="/explore">Transport Explorer (placeholder)</Link></li>
        <li><Link to="/my-trips">My Trips (placeholder)</Link></li>
        <li><Link to="/my-schedule">My Schedule (placeholder)</Link></li>
        <li><Link to="/admin">Admin Dashboard (placeholder)</Link></li>
      </ul>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/journey-planner" element={<Placeholder title="Journey Planner" />} />
      <Route path="/map" element={<Placeholder title="Interactive Map" />} />
      <Route path="/explore" element={<Placeholder title="Transport Explorer" />} />
      <Route path="/my-trips" element={<Placeholder title="My Trips" />} />
      <Route path="/my-schedule" element={<Placeholder title="My Schedule" />} />
      <Route path="/admin" element={<Placeholder title="Admin Dashboard" />} />
    </Routes>
  );
}

export default App;
