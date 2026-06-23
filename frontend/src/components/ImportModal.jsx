// src/components/ImportModal.jsx
import { useState } from 'react';
import * as XLSX from 'xlsx';

const COLONNES_ATTENDUES = ['Année','Mois','Jour','Jour semaine','Heure','Activité','Responsable','Lieu'];

const VOLANA_VALIDES = [
  'Janoary','Febroary','Martsa','Aprily','Mey','Jona',
  'Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra',
];

export default function ImportModal({ onImport, onClose }) {
  const [fichier, setFichier] = useState(null);
  const [apercu, setApercu] = useState([]);
  const [erreurs, setErreurs] = useState([]);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleFichier = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFichier(file);
    setDone(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!rows.length) { setErreurs(['Fichier vide']); return; }

        // Vérifier les colonnes
        const headers = rows[0].map(h => (h || '').toString().trim());
        const manquantes = COLONNES_ATTENDUES.filter(c => !headers.includes(c));
        if (manquantes.length) {
          setErreurs([`Colonnes manquantes : ${manquantes.join(', ')}`]);
          setApercu([]);
          return;
        }

        // Parser les lignes
        const errs = [];
        const data = [];
        rows.slice(1).forEach((row, i) => {
          if (row.every(c => !c)) return; // ligne vide
          const obj = {};
          // headers.forEach((h, idx) => { obj[h] = (row[idx] ?? '').toString().trim(); });
          headers.forEach((h, idx) => { 
            obj[h] = h === 'Heure' 
              ? row[idx]  // garder la valeur brute pour l'heure
              : (row[idx] ?? '').toString().trim(); 
          });

          const ligne = i + 2;
          if (!obj['Mois']) { errs.push(`Ligne ${ligne} : Mois manquant`); return; }
          if (!VOLANA_VALIDES.includes(obj['Mois'])) {
            errs.push(`Ligne ${ligne} : Mois invalide "${obj['Mois']}"`); return;
          }
          if (!obj['Jour']) { errs.push(`Ligne ${ligne} : Jour manquant`); return; }
          if (!obj['Activité']) { errs.push(`Ligne ${ligne} : Activité manquante`); return; }

          data.push({
            taona:          obj['Année'] || new Date().getFullYear().toString(),
            volana:         obj['Mois'],
            daty:           obj['Jour'],
            andro:          obj['Jour semaine'] || '',
            // ora:            obj['Heure'] || '',
            ora: excelHeureToString(row[headers.indexOf('Heure')]) || '',
            asa:            obj['Activité'],
            mpanatanteraka: obj['Responsable'] || '',
            toerana:        obj['Lieu'] || '',
          });
        });

        setErreurs(errs);
        setApercu(data);
      } catch (e) {
        setErreurs(['Erreur de lecture du fichier : ' + e.message]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (!apercu.length) return;
    setImporting(true);
    try {
      await onImport(apercu);
      setDone(true);
    } catch(e) {
      setErreurs([e.message]);
    } finally {
      setImporting(false);
    }
  };

  // Convertit un nombre décimal Excel en heure "HH:MM"
  function excelHeureToString(val) {
    if (!val && val !== 0) return '';
    
    // Si c'est déjà une string type "11:15", on la retourne
    if (typeof val === 'string' && val.includes(':')) return val;

    // Si c'est un nombre décimal Excel
    if (typeof val === 'number') {
      const totalMinutes = Math.round(val * 24 * 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
    }

    return val.toString();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h2 className="modal-title">📥 Importer un fichier Excel</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '75vh', overflowY: 'auto' }}> */}
        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Format attendu */}
          <div className="import-info">
            <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>
              Format attendu — colonnes dans cet ordre :
            </p>
            <div className="import-cols">
              {COLONNES_ATTENDUES.map(c => (
                <span key={c} className="import-col-badge">{c}</span>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>
              ⚠ Les mois doivent être en malgache : Janoary, Febroary, Martsa...
            </p>
          </div>

          {/* Sélection fichier */}
          <label className="import-dropzone">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFichier}
              style={{ display: 'none' }}
            />
            <span style={{ fontSize: '28px' }}>📂</span>
            <span style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500 }}>
              {fichier ? fichier.name : 'Cliquez pour choisir un fichier .xlsx'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
              Fichier Excel uniquement (.xlsx)
            </span>
          </label>

          {/* Erreurs */}
          {erreurs.length > 0 && (
            <div className="import-erreurs">
              <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                ⚠ {erreurs.length} erreur(s) détectée(s) :
              </p>
              {erreurs.map((e, i) => (
                <p key={i} style={{ fontSize: '12px' }}>• {e}</p>
              ))}
            </div>
          )}

          {/* Aperçu */}
          {apercu.length > 0 && !done && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '8px' }}>
                ✅ <strong>{apercu.length}</strong> programme(s) prêt(s) à importer
              </p>
              <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card)' }}>
                      {['Mois','Jour','Heure','Activité','Responsable'].map(h => (
                        <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--text-3)', fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {apercu.map((p, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '5px 10px', color: 'var(--text-2)' }}>{p.volana}</td>
                        <td style={{ padding: '5px 10px' }}>{p.daty}</td>
                        <td style={{ padding: '5px 10px', color: 'var(--text-3)' }}>{p.ora || '—'}</td>
                        <td style={{ padding: '5px 10px', fontWeight: 500 }}>{p.asa}</td>
                        <td style={{ padding: '5px 10px', color: 'var(--text-3)' }}>{p.mpanatanteraka || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Succès */}
          {done && (
            <div style={{ background: 'rgba(34,211,160,0.1)', border: '1px solid rgba(34,211,160,0.3)', borderRadius: 'var(--radius-md)', padding: '14px', textAlign: 'center', color: 'var(--success)' }}>
              ✅ {apercu.length} programme(s) importé(s) avec succès !
            </div>
          )}

          {/* Boutons */}
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>Fermer</button>
            {apercu.length > 0 && !done && (
              <button
                className="btn btn-primary"
                onClick={handleImport}
                disabled={importing}
              >
                {importing ? 'Importation...' : `Importer ${apercu.length} programme(s)`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}