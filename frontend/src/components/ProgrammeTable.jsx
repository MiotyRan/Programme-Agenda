// src/components/ProgrammeTable.jsx
import { useState } from 'react';

const COLS = [
  { key: 'volana',         label: 'Volana',         w: '100px' },
  { key: 'daty',           label: 'Daty',           w: '60px'  },
  { key: 'andro',          label: 'Andro',          w: '90px'  },
  { key: 'ora',            label: 'Ora',            w: '70px'  },
  { key: 'asa',            label: 'Asa',            w: 'auto'  },
  { key: 'mpanatanteraka', label: 'Mpanatanteraka', w: '130px' },
  { key: 'toerana',        label: 'Toerana',        w: '120px' },
];

const VOLANA_IDX = {
  Janoary:0,Febroary:1,Martsa:2,Aprily:3,Mey:4,Jona:5,
  Jolay:6,Aogositra:7,Septambra:8,Oktobra:9,Novambra:10,Desambra:11,
};

const VOLANA_COLORS = [
  '#EF4444','#F97316','#EAB308','#22C55E','#10B981','#06B6D4',
  '#3B82F6','#6366F1','#8B5CF6','#EC4899','#F43F5E','#14B8A6',
];

export default function ProgrammeTable({ programmes, loading, selectedId, onSelect }) {
  const [sortKey, setSortKey] = useState('volana');
  const [sortDir, setSortDir] = useState(1);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(1); }
  };

  const sorted = [...programmes].sort((a, b) => {
    let av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
    if (sortKey === 'volana') { av = VOLANA_IDX[av] ?? 99; bv = VOLANA_IDX[bv] ?? 99; }
    else if (sortKey === 'daty') { av = Number(av); bv = Number(bv); }
    if (av < bv) return -sortDir;
    if (av > bv) return sortDir;
    return 0;
  });

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner" />
        <span>Maka angona...</span>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {COLS.map(col => (
              <th
                key={col.key}
                style={{ width: col.w }}
                onClick={() => handleSort(col.key)}
                className={sortKey === col.key ? 'th-active' : ''}
              >
                {col.label}
                <span className="sort-icon">
                  {sortKey === col.key ? (sortDir === 1 ? ' ↑' : ' ↓') : ' ⇅'}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={7} className="table-empty">
                <div className="empty-state">
                  <span className="empty-cross">✝</span>
                  <p>Tsy misy programa voasoratra</p>
                  <small>Tsindrio "+ Insérer" mba hanampy</small>
                </div>
              </td>
            </tr>
          ) : (
            sorted.map((p, i) => {
              const vColor = VOLANA_COLORS[VOLANA_IDX[p.volana] ?? 0];
              return (
                <tr
                  key={p.id}
                  className={`table-row ${selectedId === p.id ? 'row-selected' : ''}`}
                  onClick={() => onSelect(selectedId === p.id ? null : p.id)}
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <td>
                    <span className="volana-pill" style={{ '--pill-color': vColor }}>
                      {p.volana}
                    </span>
                  </td>
                  <td className="td-center td-bold">{p.daty}</td>
                  <td className="td-muted">{p.andro || '—'}</td>
                  <td className="td-mono">{p.ora ? p.ora.slice(0, 5) : '—'}</td>
                  <td className="td-asa">{p.asa}</td>
                  <td className="td-mpana">{p.mpanatanteraka || '—'}</td>
                  <td className="td-muted td-small">{p.toerana || '—'}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}