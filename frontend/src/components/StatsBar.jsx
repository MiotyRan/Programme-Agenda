const VOLANA = [
  'Janoary','Febroary','Martsa','Aprily','Mey','Jona',
  'Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra',
];

export default function StatsBar({ programmes, total, onShowAVenir }) {
  const moisActifs = new Set(programmes.map(p => p.volana)).size;

  const now = new Date();
  const moisActuel = now.getMonth();
  const jourActuel = now.getDate();
  const heureActuelle = now.getHours();
  const minuteActuelle = now.getMinutes();

  const prochains = programmes.filter(p => {
    const vIdx = VOLANA.indexOf(p.volana);
    const jour = Number(p.daty);
    if (vIdx > moisActuel) return true;
    if (vIdx < moisActuel) return false;
    if (jour > jourActuel) return true;
    if (jour < jourActuel) return false;
    if (!p.ora) return false;
    const [h, m] = p.ora.split(':').map(Number);
    if (h > heureActuelle) return true;
    if (h === heureActuelle && m > minuteActuelle) return true;
    return false;
  });

  return (
    <div className="stats-bar">
      <Stat value={total} label="Programa rehetra" />
      <Stat value={moisActifs} label="Volana" />
      <Stat
        value={prochains.length}
        label="Ho avy"
        accent
        clickable
        onClick={() => onShowAVenir(prochains)}
      />
    </div>
  );
}

function Stat({ value, label, accent, clickable, onClick }) {
  return (
    <div
      className={`stat-card ${accent ? 'stat-accent' : ''} ${clickable ? 'stat-clickable' : ''}`}
      onClick={clickable ? onClick : undefined}
      title={clickable ? 'Cliquez pour voir les programmes à venir' : ''}
    >
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label} {clickable && '→'}</span>
    </div>
  );
}