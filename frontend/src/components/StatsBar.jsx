// src/components/StatsBar.jsx
const VOLANA = [
  'Janoary','Febroary','Martsa','Aprily','Mey','Jona',
  'Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra',
];

export default function StatsBar({ programmes, total }) {
  const moisActifs = new Set(programmes.map(p => p.volana)).size;
  const prochains = programmes.filter(p => {
    const now = new Date();
    const vIdx = VOLANA.indexOf(p.volana);
    return vIdx >= now.getMonth();
  }).length;

  return (
    <div className="stats-bar">
      <Stat value={total} label="Programa rehetra" />
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