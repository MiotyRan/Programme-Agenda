// src/components/StatsBar.jsx
const VOLANA = [
  'Janoary','Febroary','Martsa','Aprily','Mey','Jona',
  'Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra',
];

export default function StatsBar({ programmes, total }) {
  const moisActifs = new Set(programmes.map(p => p.volana)).size;

  const now = new Date();
  const moisActuel = now.getMonth();    // 0-11
  const jourActuel = now.getDate();     // 1-31
  const heureActuelle = now.getHours();
  const minuteActuelle = now.getMinutes();

  const prochains = programmes.filter(p => {
    const vIdx = VOLANA.indexOf(p.volana);
    const jour = Number(p.daty);

    // Mois futur → à venir
    if (vIdx > moisActuel) return true;

    // Mois passé → passé
    if (vIdx < moisActuel) return false;

    // Même mois — vérifier le jour
    if (jour > jourActuel) return true;
    if (jour < jourActuel) return false;

    // Même jour — vérifier l'heure
    if (!p.ora) return false; // pas d'heure = considéré passé

    const [h, m] = p.ora.split(':').map(Number);
    if (h > heureActuelle) return true;
    if (h === heureActuelle && m > minuteActuelle) return true;

    return false; // heure passée
  }).length;

  return (
    <div className="stats-bar">
      <Stat value={total} label="Programa" />
      <Stat value={moisActifs} label="Volana" />
      <Stat value={prochains} label="Ho avy" accent />
    </div>
  );
}

function Stat({ value, label, accent }) {
  return (
    <div className={`stat-card ${accent ? 'stat-accent' : ''}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}