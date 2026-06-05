// src/services/api.js
// Couche d'accès à l'API Laravel

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  // Pour les exports CSV, retourner le blob directement
  if (res.headers.get('Content-Type')?.includes('text/csv')) {
    return res.blob();
  }

  return res.json();
}

// ─── Programmes ────────────────────────────────────────────────────────────

export const programmeApi = {
  /**
   * Récupère tous les programmes avec filtres optionnels
   * @param {Object} filters - { taona, volana_debut, volana_fin, mpanatanteraka, search }
   */
  getAll(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    const qs = params.toString();
    return request(`/programmes${qs ? '?' + qs : ''}`);
  },

  getOne(id) {
    return request(`/programmes/${id}`);
  },

  create(data) {
    return request('/programmes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return request(`/programmes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id) {
    return request(`/programmes/${id}`, { method: 'DELETE' });
  },

  duplicate(id) {
    return request(`/programmes/${id}/duplicate`, { method: 'POST' });
  },

  async exportCsv(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    const qs = params.toString();
    const blob = await request(`/programmes/export/csv${qs ? '?' + qs : ''}`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TVF-LaminAsa.csv';
    a.click();
    URL.revokeObjectURL(url);
  },
};