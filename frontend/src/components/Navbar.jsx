// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Train, Map, Search, Heart, Calendar, User, LayoutDashboard,
  Menu, X, LogOut, ChevronDown,
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner container">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <div className="brand-icon"><Train size={18} /></div>
            <span className="brand-name">TRANSIT</span>
          </Link>

          {/* Desktop nav */}
          <nav className="navbar-links">
            <NavLink to="/plan" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Search size={16} /> Rencanakan
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Train size={16} /> Jelajahi
            </NavLink>
            <NavLink to="/map" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Map size={16} /> Peta
            </NavLink>
            {user && (
              <>
                <NavLink to="/trips" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <Heart size={16} /> Perjalanan
                </NavLink>
                <NavLink to="/schedule" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <Calendar size={16} /> Jadwal
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link-admin${isActive ? ' active' : ''}`}>
                <LayoutDashboard size={16} /> Admin
              </NavLink>
            )}
          </nav>

          {/* Desktop auth */}
          <div className="navbar-auth">
            {user ? (
              <div className="user-menu-wrap">
                <button className="user-menu-btn" onClick={() => setUserMenuOpen(v => !v)}>
                  <div className="user-avatar">{user.fullName?.[0]?.toUpperCase() || 'U'}</div>
                  <span className="user-name">{user.fullName?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={15} /> Profil
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={15} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <NavLink to="/plan" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <Search size={18} /> Rencanakan Perjalanan
            </NavLink>
            <NavLink to="/explore" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <Train size={18} /> Jelajahi Transportasi
            </NavLink>
            <NavLink to="/map" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <Map size={18} /> Peta Interaktif
            </NavLink>
            {user && (
              <>
                <NavLink to="/trips" className="mobile-link" onClick={() => setMenuOpen(false)}>
                  <Heart size={18} /> Perjalanan Tersimpan
                </NavLink>
                <NavLink to="/schedule" className="mobile-link" onClick={() => setMenuOpen(false)}>
                  <Calendar size={18} /> Jadwal Saya
                </NavLink>
                <NavLink to="/report" className="mobile-link" onClick={() => setMenuOpen(false)}>
                  Riwayat Laporan
                </NavLink>
                <NavLink to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>
                  <User size={18} /> Profil
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" className="mobile-link admin" onClick={() => setMenuOpen(false)}>
                <LayoutDashboard size={18} /> Admin Dashboard
              </NavLink>
            )}
            {!user ? (
              <div className="mobile-auth">
                <Link to="/login" className="btn btn-secondary btn-full" onClick={() => setMenuOpen(false)}>Masuk</Link>
                <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>Daftar</Link>
              </div>
            ) : (
              <button className="mobile-link danger" onClick={handleLogout}>
                <LogOut size={18} /> Keluar
              </button>
            )}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <Train size={20} /><span>Beranda</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <Search size={20} /><span>Jelajahi</span>
        </NavLink>
        <NavLink to="/plan" className={({ isActive }) => `bottom-nav-item bottom-nav-plan${isActive ? ' active' : ''}`}>
          <div className="bottom-nav-plan-icon"><Map size={22} /></div>
          <span>Plan</span>
        </NavLink>
        <NavLink to="/trips" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <Heart size={20} /><span>Perjalanan</span>
        </NavLink>
        <NavLink to={user ? '/profile' : '/login'} className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <User size={20} /><span>Profil</span>
        </NavLink>
      </nav>
    </>
  );
}
