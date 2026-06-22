// src/App.jsx
import { useState, useEffect } from 'react';
import { programmeApi } from './services/api';
import ProgrammeModal from './components/ProgrammeModal';
import ProgrammeTable from './components/ProgrammeTable';
import FilterBar from './components/FilterBar';
import StatsBar from './components/StatsBar';
import AgendaModal from './components/AgendaModal';
import AVenirModal from './components/AVenirModal';
import ImportModal from './components/ImportModal';
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
  const [modal, setModal] = useState(null);
  const [datyFilter, setDatyFilter] = useState(null); // ← NOUVEAU

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
    const interval = setInterval(() => { fetchData(); }, 60000);
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

 
  const handleMemeDate = () => {
    if (!selectedId) return;
    const selected = programmes.find(p => p.id === selectedId);
    if (!selected) return;
    setFilters(f => ({
      ...f,
      volana_debut: selected.volana,
      volana_fin: selected.volana,
    }));
    setDatyFilter(selected.daty);
  };

 
  const resetDatyFilter = () => {
    setDatyFilter(null);
    setFilters(f => ({ ...f, volana_debut: '', volana_fin: '' }));
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

  const handleImport = async (programmes) => {
    for (const p of programmes) {
      await programmeApi.create(p);
    }
    fetchData();
  };

  const selectedProgramme = programmes.find(p => p.id === selectedId);
  const [showAgenda, setShowAgenda] = useState(false);

  const [aVenirProgrammes, setAVenirProgrammes] = useState(null);

  const [showImport, setShowImport] = useState(false);

  const programmesFiltres = datyFilter
    ? programmes.filter(p => Number(p.daty) === Number(datyFilter))
    : programmes;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-mark">✝</div>
          <div>
            <h1 className="app-title">TVF-Lamin'asa</h1>
            <p className="app-subtitle">Fandaharam-pivoriana sy hetsika</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-green" onClick={() => setShowAgenda(true)}>
            📅 Voir Agenda
          </button>
          <button className="btn btn-ghost" onClick={() => programmeApi.exportCsv(filters)}>
            <span className="btn-icon">↓</span> Exporter
          </button>
          <button className="btn btn-ghost" onClick={() => setShowImport(true)}>
            📥 Importer
          </button>

          {datyFilter ? (
            <button className="btn btn-secondary" onClick={resetDatyFilter}>
              ✕ Effacer filtre date
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={handleMemeDate}
              disabled={!selectedId}
            >
              📋 Même date
            </button>
          )}

          <button className="btn btn-primary" onClick={() => setModal('insert')}>
            + Insérer
          </button>
        </div>
      </header>

      <FilterBar filters={filters} onChange={setFilters} />

      <StatsBar
        programmes={programmesFiltres}
        total={programmesFiltres.length}
        onShowAVenir={(prochains) => setAVenirProgrammes(prochains)}
      />

      {aVenirProgrammes && (
        <AVenirModal
          programmes={aVenirProgrammes}
          onClose={() => setAVenirProgrammes(null)}
        />
      )}

      <main className="table-container">
        {error && (
          <div className="error-banner">
            ⚠ Impossible de charger les données: {error}
            <button onClick={fetchData}>Réessayer</button>
          </div>
        )}

        <ProgrammeTable
          programmes={programmesFiltres}
          loading={loading}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onEdit={() => { if (selectedId) setModal('edit'); }}
          onDelete={handleDelete}
          onDuplicate={() => {}}
        />
      </main>

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

      {showImport && (
        <ImportModal
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}