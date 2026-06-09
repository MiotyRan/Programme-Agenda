// src/components/FilterBar.jsx
const VOLANA = [
  'Janoary','Febroary','Martsa','Aprily','Mey','Jona',
  'Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra',
];
const TAONA = ['2023','2024','2025','2026','2027'];

export default function FilterBar({ filters, onChange }) {
  const set = (key, val) => onChange(f => ({ ...f, [key]: val }));

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">Taona</label>
        <select className="filter-select" value={filters.taona} onChange={e => set('taona', e.target.value)}>
          {TAONA.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="filter-divider" />

      <div className="filter-group">
        <label className="filter-label">Volana voalohany</label>
        <select className="filter-select" translate="no" value={filters.volana_debut} onChange={e => set('volana_debut', e.target.value)}>
          <option value="">— Rehetra —</option>
          {VOLANA.map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Volana farany</label>
        <select className="filter-select" translate="no" value={filters.volana_fin} onChange={e => set('volana_fin', e.target.value)}>
          <option value="">— Rehetra —</option>
          {VOLANA.map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div className="filter-divider" />

      <div className="filter-group filter-search">
        <label className="filter-label">Karohy</label>
        <input
          className="filter-input"
          type="text"
          placeholder="Asa, mpanatanteraka, toerana..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
        />
      </div>
    </div>
  );
}