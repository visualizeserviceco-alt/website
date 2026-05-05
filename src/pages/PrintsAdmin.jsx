import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch { return iso; }
}

function Badge({ text }) {
  return <span className="adm-badge">{text || '—'}</span>;
}

export default function PrintsAdmin() {
  const [pw, setPw]           = useState('');
  const [auth, setAuth]       = useState(false);
  const [pwError, setPwError] = useState(false);
  const [orders, setOrders]   = useState([]);
  const [detail, setDetail]   = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuth(true);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 600);
    }
  };

  useEffect(() => {
    if (!auth) return;
    try {
      const raw = JSON.parse(localStorage.getItem('vz_print_orders') || '[]');
      setOrders(raw);
    } catch { setOrders([]); }
  }, [auth]);

  const deleteOrder = (id) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    localStorage.setItem('vz_print_orders', JSON.stringify(updated));
    if (detail?.id === id) setDetail(null);
  };

  if (!auth) {
    return (
      <div className="adm-page">
        <div className="adm-login">
          <div className="adm-login-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--brand)" />
              <path d="M8 10h16M8 16h10M8 22h13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span>Visualize Admin</span>
          </div>
          <h1 className="adm-login-title">Print Orders</h1>
          <form onSubmit={handleLogin} className={`adm-login-form ${pwError ? 'adm-shake' : ''}`}>
            <input
              type="password"
              className="adm-input"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError(false); }}
              placeholder="Enter admin password"
              autoFocus
            />
            {pwError && <p className="adm-pw-error">Incorrect password</p>}
            <button type="submit" className="btn btn-primary adm-login-btn">Access Dashboard</button>
          </form>
        </div>
        <style>{admStyles}</style>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adm-wrap">
        <div className="adm-topbar">
          <div>
            <h1 className="adm-title">Print Order Requests</h1>
            <p className="adm-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} on file</p>
          </div>
          <button className="adm-logout" onClick={() => { setAuth(false); setPw(''); }}>Log out</button>
        </div>

        {orders.length === 0 ? (
          <div className="adm-empty">
            <p>No orders yet. They&apos;ll appear here once customers submit a quote request.</p>
          </div>
        ) : (
          <div className="adm-layout">
            <div className="adm-list">
              {orders.map(o => (
                <button
                  key={o.id}
                  type="button"
                  className={`adm-row ${detail?.id === o.id ? 'adm-row--active' : ''}`}
                  onClick={() => setDetail(o)}
                >
                  <div className="adm-row-top">
                    <strong className="adm-row-name">{o.name || 'Unknown'}</strong>
                    <span className="adm-row-date">{formatDate(o.date)}</span>
                  </div>
                  <div className="adm-row-tags">
                    {o.type && <Badge text={o.type} />}
                    {o.quantity && <Badge text={`${o.quantity} units`} />}
                    {o.finish && <Badge text={o.finish} />}
                  </div>
                </button>
              ))}
            </div>

            <div className="adm-detail">
              {detail ? (
                <>
                  <div className="adm-detail-header">
                    <h2 className="adm-detail-name">{detail.name}</h2>
                    <button className="adm-delete" onClick={() => deleteOrder(detail.id)}>Delete</button>
                  </div>
                  <p className="adm-detail-date">{formatDate(detail.date)}</p>

                  <div className="adm-detail-grid">
                    {[
                      ['Product Type', detail.type],
                      ['Shape',        detail.shape],
                      ['Size',         detail.size],
                      ['Quantity',     detail.quantity ? `${detail.quantity} units` : null],
                      ['Finish',       detail.finish],
                      ['Design',       detail.design],
                    ].map(([k, v]) => v ? (
                      <div key={k} className="adm-detail-pair">
                        <span className="adm-detail-key">{k}</span>
                        <span className="adm-detail-val">{v}</span>
                      </div>
                    ) : null)}
                  </div>

                  <div className="adm-detail-contact">
                    <h3 className="adm-detail-section">Contact</h3>
                    <p><strong>Email:</strong> <a href={`mailto:${detail.email}`}>{detail.email}</a></p>
                    {detail.phone && <p><strong>Phone:</strong> <a href={`tel:${detail.phone}`}>{detail.phone}</a></p>}
                  </div>

                  {detail.notes && (
                    <div className="adm-detail-notes">
                      <h3 className="adm-detail-section">Notes</h3>
                      <p>{detail.notes}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="adm-detail-placeholder">Select an order to view details</p>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{admStyles}</style>
    </div>
  );
}

const admStyles = `
  .adm-page {
    min-height: 100vh;
    background: var(--bg);
    padding: var(--space-12) 0 var(--space-24);
  }

  /* Login */
  .adm-login {
    max-width: 380px;
    margin: var(--space-24) auto;
    padding: var(--space-10) var(--space-8);
    background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    text-align: center;
  }
  .adm-login-logo {
    display: flex; align-items: center; justify-content: center;
    gap: var(--space-2); font-size: 1rem; font-weight: 700;
    color: var(--text); margin-bottom: var(--space-6);
  }
  .adm-login-title {
    font-size: 1.5rem; font-weight: 800; color: var(--text);
    margin-bottom: var(--space-6);
  }
  .adm-login-form { display: flex; flex-direction: column; gap: var(--space-3); }
  .adm-input {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius); border: 1px solid var(--border-light);
    background: var(--glass-bg); color: var(--text);
    font-size: 0.9375rem; font-family: inherit; outline: none;
    transition: border-color 0.2s; text-align: center; width: 100%;
  }
  .adm-input:focus { border-color: var(--brand); }
  .adm-pw-error { font-size: 0.8rem; color: rgba(220,80,80,0.9); }
  .adm-login-btn { width: 100%; padding: var(--space-3); }
  @keyframes admShake {
    0%,100% { transform: translateX(0); }
    15%,55%  { transform: translateX(-7px); }
    35%,75%  { transform: translateX(7px); }
  }
  .adm-shake { animation: admShake 0.5s ease; }

  /* Dashboard */
  .adm-wrap { max-width: 960px; margin: 0 auto; padding: 0 var(--space-6); }
  .adm-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: var(--space-8);
  }
  .adm-title { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }
  .adm-subtitle { font-size: 0.875rem; color: var(--text-muted); margin-top: 4px; }
  .adm-logout {
    background: none; border: 1px solid var(--border-light);
    color: var(--text-secondary); font-size: 0.875rem;
    padding: var(--space-2) var(--space-4); border-radius: var(--radius);
    cursor: pointer; transition: color 0.2s, border-color 0.2s;
  }
  .adm-logout:hover { color: var(--text); border-color: var(--text-secondary); }
  .adm-empty {
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-12);
    text-align: center; color: var(--text-secondary);
  }
  .adm-layout {
    display: grid; grid-template-columns: 320px 1fr;
    gap: var(--space-6); align-items: start;
  }
  @media (max-width: 700px) { .adm-layout { grid-template-columns: 1fr; } }

  /* Order list */
  .adm-list { display: flex; flex-direction: column; gap: var(--space-2); }
  .adm-row {
    display: flex; flex-direction: column; gap: var(--space-2);
    padding: var(--space-4) var(--space-5);
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); cursor: pointer;
    text-align: left; width: 100%;
    transition: border-color 0.2s, background 0.2s;
  }
  .adm-row:hover { border-color: rgba(212,76,67,0.4); }
  .adm-row--active { border-color: var(--brand); background: rgba(212,76,67,0.08); }
  .adm-row-top { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-2); }
  .adm-row-name { font-size: 0.9375rem; font-weight: 700; color: var(--text); }
  .adm-row-date { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; }
  .adm-row-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .adm-badge {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em;
    text-transform: capitalize;
    padding: 2px 8px; border-radius: 999px;
    background: rgba(212,76,67,0.12); color: var(--brand-light);
    border: 1px solid rgba(212,76,67,0.2);
  }

  /* Detail panel */
  .adm-detail {
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-6);
    min-height: 300px;
  }
  .adm-detail-placeholder { color: var(--text-muted); font-size: 0.875rem; }
  .adm-detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .adm-detail-name { font-size: 1.25rem; font-weight: 800; color: var(--text); }
  .adm-delete {
    background: none; border: 1px solid rgba(180,50,50,0.35);
    color: rgba(220,80,80,0.8); font-size: 0.8rem; padding: 4px 10px;
    border-radius: var(--radius); cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .adm-delete:hover { color: rgba(240,80,80,1); border-color: rgba(220,80,80,0.6); }
  .adm-detail-date { font-size: 0.8125rem; color: var(--text-muted); margin-bottom: var(--space-5); }
  .adm-detail-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);
    margin-bottom: var(--space-5);
  }
  .adm-detail-pair {
    background: var(--glass-bg); border-radius: var(--radius);
    padding: var(--space-3) var(--space-4);
  }
  .adm-detail-key { display: block; font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
  .adm-detail-val { font-size: 0.9375rem; font-weight: 600; color: var(--text); text-transform: capitalize; }
  .adm-detail-contact, .adm-detail-notes {
    margin-top: var(--space-4); border-top: 1px solid var(--glass-border);
    padding-top: var(--space-4);
  }
  .adm-detail-section { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: var(--space-2); }
  .adm-detail-contact p, .adm-detail-notes p {
    font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.6;
  }
  .adm-detail-contact a { color: var(--brand); }
  .adm-detail-contact a:hover { text-decoration: underline; }
`;
