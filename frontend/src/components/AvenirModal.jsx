// src/components/AVenirModal.jsx
export default function AVenirModal({ programmes, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" role="dialog">
        <div className="modal-header">
          <h2 className="modal-title">📅 Programmes à venir — {programmes.length}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
          {programmes.length === 0 ? (
            <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: '2rem' }}>
              Tsy misy programa ho avy
            </p>
          ) : (
            programmes.map(p => (
              <div key={p.id} className="detail-card">
                <div className="detail-card-top">
                  <span className="detail-heure">{p.ora ? p.ora.slice(0,5) : '—'}</span>
                  <span className="detail-asa">{p.asa}</span>
                </div>
                <div className="detail-card-bottom">
                  <span>📆 {p.daty} {p.volana} {p.taona}</span>
                  {p.mpanatanteraka && <span>👤 {p.mpanatanteraka}</span>}
                  {p.toerana && <span>📍 {p.toerana}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}