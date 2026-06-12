// src/App.jsx
import { useState, useEffect } from 'react';
import { programmeApi } from './services/api';
import ProgrammeModal from './components/ProgrammeModal';
import ProgrammeTable from './components/ProgrammeTable';
import FilterBar from './components/FilterBar';
import StatsBar from './components/StatsBar';
import AgendaModal from './components/AgendaModal';
import './index.css';

const VOLANA = [
  'Janoary','Febroary','Martsa','Aprily','Mey','Jona',
  'Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra',
];

export default function App() {
  const [programmes, setProgrammes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(null); // null | 'insert' | 'edit'

  const [filters, setFilters] = useState({
    taona: new Date().getFullYear().toString(),
    volana_debut: '',
    volana_fin: '',
    mpanatanteraka: '',
    search: '',
  });

  const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await programmeApi.getAll(filters);
    setProgrammes(res.data);
    setTotal(res.total);
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [filters]);

useEffect(() => {
  const interval = setInterval(() => {
    fetchData(); // rafraîchit toutes les minutes
  }, 60000); // 60 secondes
  return () => clearInterval(interval);
}, []);

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm('Supprimer ce programme ?')) return;
    try {
      await programmeApi.delete(selectedId);
      setSelectedId(null);
      fetchData();
    } catch (e) { alert(e.message); }
  };

  const handleDuplicate = async () => {
    if (!selectedId) return;
    try {
      await programmeApi.duplicate(selectedId);
      fetchData();
    } catch (e) { alert(e.message); }
  };

 const handleSave = async (formData) => {
  try {
    if (modal === 'insert') {
      await programmeApi.create(formData);
    } else {
      await programmeApi.update(selectedId, formData);
    }
    setModal(null);
    fetchData();
  } catch (e) {
    setError(e.message);
  }
};

  const selectedProgramme = programmes.find(p => p.id === selectedId);

  const [showAgenda, setShowAgenda] = useState(false);

  return (
    <div className="app-shell">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-mark">✝</div>
          <div>
            <h1 className="app-title">TVF-Lamin'asa</h1>
            <p className="app-subtitle">Fandaharam-pivoriana sy hetsika</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => setShowAgenda(true)}>
            📅 Voir Agenda
          </button>
          <button className="btn btn-ghost" onClick={() => programmeApi.exportCsv(filters)}>
            <span className="btn-icon">↓</span> Exporter CSV
          </button>
          {/* <button
            className="btn btn-secondary"
            onClick={handleDuplicate}
            disabled={!selectedId}
          >
            Même date
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={!selectedId}
          >
            Supprimer
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => { if (!selectedId) return; setModal('edit'); }}
            disabled={!selectedId}
          >
            Modifier
          </button> */}
          <button className="btn btn-primary" onClick={() => setModal('insert')}>
            + Insérer
          </button>
        </div>
      </header>

      {/* ── Filters ────────────────────────────────────── */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* ── Stats ──────────────────────────────────────── */}
      <StatsBar programmes={programmes} total={total} />

      {/* ── Table ──────────────────────────────────────── */}
      <main className="table-container">
        {error && (
          <div className="error-banner">
            ⚠ Impossible de charger les données: {error}
            <button onClick={fetchData}>Réessayer</button>
          </div>
        )}
        <ProgrammeTable
          programmes={programmes}
          loading={loading}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onEdit={() => { if (selectedId) setModal('edit'); }}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      </main>

      {/* ── Modal ──────────────────────────────────────── */}
      {modal && (
        <ProgrammeModal
          mode={modal}
          initial={modal === 'edit' ? selectedProgramme : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {showAgenda && (
        <AgendaModal
          programmes={programmes}
          moisInitial={VOLANA[new Date().getMonth()]}
          anneeInitiale={new Date().getFullYear().toString()}
          onClose={() => setShowAgenda(false)}
        />
      )}
    </div>
  );
}