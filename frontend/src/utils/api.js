/**
 * api.js — Central API client for TRANSIT frontend
 * All fetch calls go through here so we have consistent error handling,
 * base URL resolution, and cookie credentials.
 *
 * ⚠️ SAMPLE DATA NOTE: When the backend DB is offline/empty, the backend's
 * journeyService falls back to deterministic sample Jabodetabek routes.
 * This is labelled in the UI wherever it applies.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.details ? data.details.join(', ') : (data.error || `HTTP ${res.status}`);
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const auth = {
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/api/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  logout:   ()     => request('/api/auth/logout',   { method: 'POST' }),
  me:       ()     => request('/api/auth/me'),
  demo:     ()     => request('/api/auth/demo',     { method: 'POST' }),
};

// ─── Stations ─────────────────────────────────────────────────────────────────
export const stations = {
  search: (q = '') => request(`/api/stations?q=${encodeURIComponent(q)}`),
};

// ─── Journey ─────────────────────────────────────────────────────────────────
export const journey = {
  plan: (body) => request('/api/journey/plan', { method: 'POST', body: JSON.stringify(body) }),
  get:  (id)   => request(`/api/journey/${id}`),
};

// ─── Favorites (My Trips) ─────────────────────────────────────────────────────
export const favorites = {
  list:     ()           => request('/api/favorites'),
  create:   (body)       => request('/api/favorites',     { method: 'POST',   body: JSON.stringify(body) }),
  update:   (id, body)   => request(`/api/favorites/${id}`, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete:   (id)         => request(`/api/favorites/${id}`, { method: 'DELETE' }),
  planFrom: (id, body)   => request(`/api/favorites/${id}/plan`, { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Schedules (My Schedule) ──────────────────────────────────────────────────
export const schedules = {
  list:   ()         => request('/api/schedules'),
  create: (body)     => request('/api/schedules',     { method: 'POST',   body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/schedules/${id}`, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (id)       => request(`/api/schedules/${id}`, { method: 'DELETE' }),
};

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reports = {
  listMine: ()     => request('/api/reports'),
  create:   (body) => request('/api/reports', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Transport Explorer (public) ─────────────────────────────────────────────
export const explore = {
  routes:          (params = {}) => request(`/api/explore?${new URLSearchParams(params)}`),
  cities:          ()            => request('/api/explore/cities'),
  transportTypes:  ()            => request('/api/explore/transport-types'),
  operators:       ()            => request('/api/explore/operators'),
  routeDetail:     (id)          => request(`/api/explore/routes/${id}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const admin = {
  dashboard:   () => request('/api/admin/dashboard'),

  operators:   {
    list:   (p) => request(`/api/admin/operators?${new URLSearchParams(p || {})}`),
    create: (b) => request('/api/admin/operators',     { method: 'POST',   body: JSON.stringify(b) }),
    update: (id, b) => request(`/api/admin/operators/${id}`, { method: 'PATCH', body: JSON.stringify(b) }),
    delete: (id) => request(`/api/admin/operators/${id}`, { method: 'DELETE' }),
  },
  transportTypes: {
    list:   (p) => request(`/api/admin/transport-types?${new URLSearchParams(p || {})}`),
    create: (b) => request('/api/admin/transport-types', { method: 'POST',   body: JSON.stringify(b) }),
    update: (id, b) => request(`/api/admin/transport-types/${id}`, { method: 'PATCH', body: JSON.stringify(b) }),
    delete: (id) => request(`/api/admin/transport-types/${id}`, { method: 'DELETE' }),
  },
  cities: {
    list:   () => request('/api/admin/cities'),
    create: (b) => request('/api/admin/cities', { method: 'POST', body: JSON.stringify(b) }),
    delete: (id) => request(`/api/admin/cities/${id}`, { method: 'DELETE' }),
  },
  stations: {
    list:   (p) => request(`/api/admin/stations?${new URLSearchParams(p || {})}`),
    create: (b) => request('/api/admin/stations', { method: 'POST', body: JSON.stringify(b) }),
    update: (id, b) => request(`/api/admin/stations/${id}`, { method: 'PATCH', body: JSON.stringify(b) }),
    delete: (id) => request(`/api/admin/stations/${id}`, { method: 'DELETE' }),
  },
  routes: {
    list:   (p) => request(`/api/admin/routes?${new URLSearchParams(p || {})}`),
    get:    (id) => request(`/api/admin/routes/${id}`),
    create: (b) => request('/api/admin/routes', { method: 'POST', body: JSON.stringify(b) }),
    update: (id, b) => request(`/api/admin/routes/${id}`, { method: 'PATCH', body: JSON.stringify(b) }),
    delete: (id) => request(`/api/admin/routes/${id}`, { method: 'DELETE' }),
  },
  schedules: {
    list:   (p) => request(`/api/admin/schedules?${new URLSearchParams(p || {})}`),
    create: (b) => request('/api/admin/schedules', { method: 'POST', body: JSON.stringify(b) }),
    delete: (id) => request(`/api/admin/schedules/${id}`, { method: 'DELETE' }),
  },
  fares: {
    list:   (p) => request(`/api/admin/fares?${new URLSearchParams(p || {})}`),
    create: (b) => request('/api/admin/fares', { method: 'POST', body: JSON.stringify(b) }),
    delete: (id) => request(`/api/admin/fares/${id}`, { method: 'DELETE' }),
  },
  users: {
    list:   (p) => request(`/api/admin/users?${new URLSearchParams(p || {})}`),
    update: (id, b) => request(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(b) }),
  },
  reports: {
    list:   (p) => request(`/api/admin/reports/list?${new URLSearchParams(p || {})}`),
    update: (id, b) => request(`/api/admin/reports/${id}`, { method: 'PATCH', body: JSON.stringify(b) }),
  },
};
