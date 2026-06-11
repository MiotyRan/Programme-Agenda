// src/components/ProgrammeModal.jsx
import { useState } from 'react';

const VOLANA = [
  'Janoary','Febroary','Martsa','Aprily','Mey','Jona',
  'Jolay','Aogositra','Septambra','Oktobra','Novambra','Desambra',
];
const ANDRO = ['Alahady','Alatsinainy','Talata','Alarobia','Alakamisy','Zoma','Sabotsy'];

const empty = {
  volana: '', daty: '', andro: '', ora: '',
  asa: '', mpanatanteraka: '', toerana: '',
  taona: new Date().getFullYear().toString(),
};

export default function ProgrammeModal({ mode, initial, onSave, onClose }) {
  // const [form, setForm] = useState(initial ? { ...initial } : { ...empty });
  const [form, setForm] = useState(initial ? { 
  ...initial, 
  asa: (initial.asa || '').replace(' (kopia)', '').trim()
  } : { ...empty });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.volana) e.volana = 'Tsy maintsy misy';
    if (!form.daty)   e.daty   = 'Tsy maintsy misy';
    if (!form.asa)    e.asa    = 'Tsy maintsy misy';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setErrors({ _global: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'insert' ? '+ Programa vaovao' : '✎ Hanova programa'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {errors._global && (
            <div className="form-error-banner">{errors._global}</div>
          )}

          <div className="form-row">
            <Field label="Volana *" error={errors.volana}>
              <select value={form.volana} onChange={e => set('volana', e.target.value)} translate='no'>
                <option value="v">— Misafidy —</option>
                {VOLANA.map(v => <option key={v} translate='no' >{v}</option>)}
              </select>
            </Field>

            <Field label="Daty *" error={errors.daty}>
              <input
                type="number" min="1" max="31"
                placeholder="1 – 31"
                value={form.daty}
                onChange={e => set('daty', e.target.value)}
              />
            </Field>

            <Field label="Andro">
              <select value={form.andro} onChange={e => set('andro', e.target.value)}>
                <option value="">—</option>
                {ANDRO.map(a => <option key={a}>{a}</option>)}
              </select>
            </Field>

            <Field label="Ora">
              <input
                type="time"
                value={form.ora}
                onChange={e => set('ora', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Asa *" error={errors.asa} fullWidth>
            <input
              type="text"
              placeholder="Fanompoam-pivavahana, hetsika, fivoriana..."
              value={form.asa}
              onChange={e => set('asa', e.target.value)}
            />
          </Field>

          <div className="form-row">
            <Field label="Mpanatanteraka">
              <input
                type="text"
                placeholder="Pastora, Diakona, FAFI..."
                value={form.mpanatanteraka}
                onChange={e => set('mpanatanteraka', e.target.value)}
              />
            </Field>

            <Field label="Toerana">
              <input
                type="text"
                placeholder="Sala lehibe, Ikeliny..."
                value={form.toerana}
                onChange={e => set('toerana', e.target.value)}
              />
            </Field>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Hanafoana
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Mitahiry...' : mode === 'insert' ? 'Ampidirina' : 'Ovaina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, fullWidth, children }) {
  return (
    <div className={`field ${fullWidth ? 'field-full' : ''} ${error ? 'field-error' : ''}`}>
      <label className="field-label">{label}</label>
      {children}
      {error && <span className="field-hint">{error}</span>}
    </div>
  );
}