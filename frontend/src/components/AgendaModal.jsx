// src/components/AgendaModal.jsx
import { useState } from 'react';

const VOLANA = [
  'Janoary','Febroary','Martsa','Aprily','Mey','Jona',
  'Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra',
];

const VOLANA_IDX = {
  'Janoary':0,'Febroary':1,'Mars':2,'Martsa':2,'Aprily':3,'Mey':4,'Jona':5,
  'Jolay':6,'Aogositra':7,'Septambra':8,'Oktobra':9,'Novambra':10,'Desambra':11,
};

const JOURS_SEMAINE = ['Alat','Tal','Alar','Alak','Zom','Sab','Alah'];

export default function AgendaModal({ programmes, moisInitial, anneeInitiale, onClose }) {
  const [mois, setMois] = useState(moisInitial || VOLANA[new Date().getMonth()]);
  const [annee, setAnnee] = useState(anneeInitiale || new Date().getFullYear().toString());
  const [jourSelectionne, setJourSelectionne] = useState(null);

  const moisIdx = VOLANA_IDX[mois] ?? 0;

  // Programmes du mois affiché
  const programmsDuMois = programmes.filter(p => p.volana === mois && p.taona === annee);

  // Jours occupés
  const joursOccupes = new Set(programmsDuMois.map(p => Number(p.daty)));

  // Construire le calendrier
  const premierJour = new Date(Number(annee), moisIdx, 1);
  const dernierJour = new Date(Number(annee), moisIdx + 1, 0);
  const nbJours = dernierJour.getDate();

  // Lundi = 0, donc on décale (getDay() : 0=dim, 1=lun...)
  let debutDecalage = premierJour.getDay() - 1;
  if (debutDecalage < 0) debutDecalage = 6; // Dimanche → fin

  const cases = [];
  for (let i = 0; i < debutDecalage; i++) cases.push(null);
  for (let d = 1; d <= nbJours; d++) cases.push(d);

  // Programmes du jour sélectionné
  const programmesDuJour = jourSelectionne
    ? programmsDuMois.filter(p => Number(p.daty) === jourSelectionne)
        .sort((a, b) => (a.ora || '').localeCompare(b.ora || ''))
    : [];

  const naviguerMois = (direction) => {
    const idx = VOLANA_IDX[mois];
    let newIdx = idx + direction;
    let newAnnee = Number(annee);
    if (newIdx < 0)  { newIdx = 11; newAnnee--; }
    if (newIdx > 11) { newIdx = 0;  newAnnee++; }
    setMois(VOLANA[newIdx]);
    setAnnee(newAnnee.toString());
    setJourSelectionne(null);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="agenda-panel" role="dialog" aria-modal="true">

        {/* ── Header ── */}
        <div className="agenda-header">
          <div className="agenda-header-left">
            <span className="agenda-icon">📅</span>
            <div>
              <h2 className="agenda-title">Agenda</h2>
              <p className="agenda-subtitle">
                <span className="agenda-legend-dot" /> Jours avec programme
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="agenda-body">
          {/* ── Calendrier ── */}
          <div className="agenda-calendar">

            {/* Navigation mois */}
            <div className="cal-nav">
              <button className="cal-nav-btn" onClick={() => naviguerMois(-1)}>‹</button>
              <span className="cal-nav-title">{mois} {annee}</span>
              <button className="cal-nav-btn" onClick={() => naviguerMois(1)}>›</button>
            </div>

            {/* Jours de la semaine */}
            <div className="cal-grid">
              {JOURS_SEMAINE.map(j => (
                <div key={j} className="cal-header-cell">{j}</div>
              ))}

              {/* Cases du calendrier */}
              {cases.map((jour, i) => {
                if (!jour) return <div key={`empty-${i}`} className="cal-cell cal-empty" />;
                const occupe = joursOccupes.has(jour);
                const selectionne = jourSelectionne === jour;
                const aujourdhui = (
                  jour === new Date().getDate() &&
                  moisIdx === new Date().getMonth() &&
                  annee === new Date().getFullYear().toString()
                );
                return (
                  <div
                    key={jour}
                    className={`cal-cell
                      ${occupe ? 'cal-occupe' : ''}
                      ${selectionne ? 'cal-selectionne' : ''}
                      ${aujourdhui ? 'cal-aujourdhui' : ''}
                      ${occupe ? 'cal-clickable' : ''}
                    `}
                    onClick={() => occupe && setJourSelectionne(selectionne ? null : jour)}
                    title={occupe ? `${programmsDuMois.filter(p => Number(p.daty) === jour).length} programme(s)` : ''}
                  >
                    <span className="cal-num">{jour}</span>
                    {occupe && (
                      <span className="cal-dot-count">
                        {programmsDuMois.filter(p => Number(p.daty) === jour).length}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="cal-legende">
              <span className="legende-item">
                <span className="legende-dot dot-occupe" /> Jour occupé (cliquez pour voir)
              </span>
              <span className="legende-item">
                <span className="legende-dot dot-aujourdhui" /> Aujourd'hui
              </span>
            </div>
          </div>

          {/* ── Liste programmes du jour ── */}
          <div className="agenda-detail">
            {jourSelectionne ? (
              <>
                <div className="detail-header">
                  <span className="detail-date">{jourSelectionne} {mois} {annee}</span>
                  <span className="detail-count">{programmesDuJour.length} programme(s)</span>
                </div>
                <div className="detail-list">
                  {programmesDuJour.map(p => (
                    <div key={p.id} className="detail-card">
                      <div className="detail-card-top">
                        <span className="detail-heure">{p.ora ? p.ora.slice(0,5) : '—'}</span>
                        <span className="detail-asa">{p.asa}</span>
                      </div>
                      {(p.mpanatanteraka || p.toerana) && (
                        <div className="detail-card-bottom">
                          {p.mpanatanteraka && <span>👤 {p.mpanatanteraka}</span>}
                          {p.toerana && <span>📍 {p.toerana}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="detail-empty">
                <span style={{ fontSize: '32px' }}>📅</span>
                <p>Cliquez sur un jour rouge pour voir les programmes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}