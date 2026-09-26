// src/components/StationSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';
import { stations as stationsApi } from '../utils/api';

export default function StationSearch({ value, onChange, placeholder = 'Cari stasiun…', label, error, id }) {
  const [query, setQuery] = useState(value?.name || '');
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync external value
  useEffect(() => {
    setQuery(value?.name || '');
  }, [value?.name]);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleInput(e) {
    const q = e.target.value;
    setQuery(q);
    if (!q) { onChange(null); setOptions([]); setOpen(false); return; }

    clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await stationsApi.search(q);
        setOptions(Array.isArray(res) ? res : []);
        setOpen(true);
      } catch { setOptions([]); }
      finally { setLoading(false); }
    }, 280);
  }

  function select(station) {
    setQuery(station.name);
    onChange(station);
    setOpen(false);
    setOptions([]);
  }

  function clear() {
    setQuery('');
    onChange(null);
    setOptions([]);
    setOpen(false);
  }

  return (
    <div className="station-search" ref={containerRef}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <div className={`station-input-wrap${error ? ' error' : ''}`}>
        <MapPin size={16} className="station-icon" />
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => options.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="station-input"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {(query) && (
          <button className="station-clear" onClick={clear} aria-label="Hapus">
            <X size={14} />
          </button>
        )}
      </div>
      {error && <span className="form-error">{error}</span>}
      {open && options.length > 0 && (
        <ul className="station-dropdown" role="listbox">
          {options.map((s, i) => (
            <li
              key={s.id || i}
              className="station-option"
              role="option"
              onMouseDown={() => select(s)}
            >
              <MapPin size={14} className="option-icon" />
              <div>
                <div className="option-name">{s.name}</div>
                {s.city?.name && <div className="option-city">{s.city.name}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {open && loading && (
        <div className="station-dropdown"><div className="station-loading">Mencari…</div></div>
      )}
      <style>{`
        .station-search { position: relative; }
        .station-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .station-icon {
          position: absolute;
          left: 14px;
          color: var(--muted);
          pointer-events: none;
          z-index: 1;
        }
        .station-input {
          width: 100%;
          height: 48px;
          padding: 0 40px 0 40px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--r-md);
          font-size: 15px;
          color: var(--text);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
          font-family: inherit;
        }
        .station-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37,99,235,.12);
        }
        .station-input-wrap.error .station-input { border-color: var(--danger); }
        .station-clear {
          position: absolute;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--border);
          color: var(--muted);
          cursor: pointer;
        }
        .station-clear:hover { background: var(--muted); color: #fff; }
        .station-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0; right: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          box-shadow: var(--shadow-2);
          z-index: 300;
          max-height: 240px;
          overflow-y: auto;
        }
        .station-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          cursor: pointer;
          transition: background .1s;
        }
        .station-option:hover { background: var(--bg); }
        .option-icon { color: var(--primary); flex-shrink: 0; }
        .option-name { font-size: 14px; font-weight: 500; color: var(--text); }
        .option-city { font-size: 12px; color: var(--muted); }
        .station-loading { padding: 12px 16px; font-size: 14px; color: var(--muted); }
      `}</style>
    </div>
  );
}
