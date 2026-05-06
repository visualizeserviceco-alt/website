import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IconInfoCircle, IconX, IconCalendar, IconLogout, IconArrowLeft, IconLogin, IconUserPlus, IconPackage, IconArrowRight } from '@tabler/icons-react';

const CLIENTS_KEY = 'vz_clients';
const ORDERS_KEY  = 'vz_print_orders';
const SESSION_KEY = 'vz_portal_session';

const CALENDLY_URL = 'https://calendly.com/contactvisualize/studio-meeting?hide_gdpr_banner=1';

const STATUS_META = {
  pending:   { label: 'Pending Review', color: '#f59e0b', desc: 'Your order has been received and is waiting to be reviewed.' },
  reviewed:  { label: 'Reviewed',       color: '#60a5fa', desc: 'Your order has been reviewed. A quote is being prepared.' },
  approved:  { label: 'Approved',       color: '#a78bfa', desc: 'Your order is approved and moving forward.' },
  sent:      { label: 'Quote Sent',     color: '#34d399', desc: 'A quote has been sent to your email. Check your inbox.' },
  completed: { label: 'Completed',      color: '#22c55e', desc: 'Your order is complete. Thank you!' },
};

function getClients() {
  try { return JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]'); } catch { return []; }
}
function saveClients(c) { localStorage.setItem(CLIENTS_KEY, JSON.stringify(c)); }

function getOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; }
}

function hashPassword(pw) {
  // Simple deterministic transform — not cryptographic, but keeps plain text out of storage
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
  return btoa(`vz:${h}:${pw.length}`);
}

function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return ''; }
}
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── Calendly modal ───────────────────────────────────────────── */
function CalendlyModal({ onClose }) {
  useEffect(() => {
    if (!document.querySelector('script[src*="calendly.com"]')) {
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      document.body.appendChild(s);
    }
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="cp-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cp-modal">
        <div className="cp-modal-header">
          <h3 className="cp-modal-title">Book a Meeting</h3>
          <button className="cp-modal-close" onClick={onClose} aria-label="Close">
            <IconX size={18} stroke={2} />
          </button>
        </div>
        <div
          className="calendly-inline-widget"
          data-url={CALENDLY_URL}
          style={{ minWidth: '320px', height: '620px' }}
        />
      </div>
    </div>
  );
}

/* ── Status timeline ──────────────────────────────────────────── */
function StatusTimeline({ status }) {
  const steps = ['pending', 'reviewed', 'approved', 'sent', 'completed'];
  const current = steps.indexOf(status || 'pending');
  return (
    <div className="cp-timeline">
      {steps.map((s, i) => {
        const meta  = STATUS_META[s];
        const done  = i < current;
        const active = i === current;
        return (
          <div key={s} className={`cp-tl-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className="cp-tl-left">
              <div className="cp-tl-dot" style={active || done ? { '--sc': meta.color } : {}}>
                {done ? (
                  <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                    <path d="M2 6l2.5 2.5L10 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </div>
              {i < steps.length - 1 && <div className="cp-tl-line" />}
            </div>
            <div className="cp-tl-body">
              <span className="cp-tl-label" style={active ? { color: meta.color } : {}}>{meta.label}</span>
              {active && <p className="cp-tl-desc">{meta.desc}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Order card ───────────────────────────────────────────────── */
function OrderCard({ order, onSelect, selected }) {
  const meta = STATUS_META[order.status || 'pending'];
  return (
    <button
      type="button"
      className={`cp-order-card ${selected ? 'cp-order-card--active' : ''}`}
      onClick={onSelect}
    >
      <div className="cp-order-top">
        <span className="cp-order-type">{order.type || 'Custom Print'}</span>
        <span className="cp-order-time">{timeAgo(order.date)}</span>
      </div>
      <div className="cp-order-tags">
        {order.shape    && <span className="cp-tag">{order.shape}</span>}
        {order.size     && <span className="cp-tag">{order.size}</span>}
        {order.quantity && <span className="cp-tag">{order.quantity} units</span>}
        {order.finish   && <span className="cp-tag">{order.finish}</span>}
      </div>
      <span className="cp-order-status" style={{ '--sc': meta.color }}>
        <span className="cp-order-status-dot" />
        {meta.label}
      </span>
    </button>
  );
}

/* ── Auth screen ──────────────────────────────────────────────── */
function AuthScreen({ onAuth }) {
  const [mode, setMode]     = useState('login'); // 'login' | 'signup'
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [pw, setPw]         = useState('');
  const [error, setError]   = useState('');
  const [shaking, setShake] = useState(false);

  const shake = (msg) => {
    setError(msg); setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const clients = getClients();

    if (mode === 'signup') {
      if (!name.trim())         return shake('Please enter your name.');
      if (!email.trim())        return shake('Please enter your email.');
      if (!/\S+@\S+\.\S+/.test(email)) return shake('Enter a valid email address.');
      if (pw.length < 6)        return shake('Password must be at least 6 characters.');
      if (clients.find(c => c.email.toLowerCase() === email.toLowerCase()))
        return shake('An account with this email already exists. Try logging in.');

      const client = { id: Date.now(), name: name.trim(), email: email.toLowerCase().trim(), passwordHash: hashPassword(pw), password: pw, createdAt: new Date().toISOString() };
      saveClients([...clients, client]);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: client.id, name: client.name, email: client.email }));
      onAuth({ name: client.name, email: client.email });
    } else {
      const client = clients.find(c => c.email.toLowerCase() === email.toLowerCase().trim());
      if (!client || client.passwordHash !== hashPassword(pw))
        return shake('Incorrect email or password.');
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: client.id, name: client.name, email: client.email }));
      onAuth({ name: client.name, email: client.email });
    }
  };

  return (
    <div className="cp-auth-wrap">
      <div className="cp-auth-card">
        <div className="cp-auth-logo">
          <img src="/logo.svg" alt="Visualize Studio" style={{ height: 30 }} />
        </div>
        <h1 className="cp-auth-title">
          {mode === 'login' ? 'Track Your Orders' : 'Create an Account'}
        </h1>
        <p className="cp-auth-sub">
          {mode === 'login'
            ? 'Log in to see the status of your print orders.'
            : 'Create an account to track your print orders and book meetings.'}
        </p>

        {mode === 'signup' && (
          <div className="cp-auth-notice">
            <IconInfoCircle size={15} stroke={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Use a <strong>new password</strong> created just for this portal — not one you use anywhere else.</span>
          </div>
        )}

        <form className={`cp-auth-form ${shaking ? 'cp-shake' : ''}`} onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <div className="cp-field">
              <label className="cp-label">Your Name</label>
              <input className="cp-input" value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="Full name" autoComplete="name" />
            </div>
          )}
          <div className="cp-field">
            <label className="cp-label">Email</label>
            <input className="cp-input" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="cp-field">
            <label className="cp-label">Password</label>
            <input className="cp-input" type="password" value={pw} onChange={e => { setPw(e.target.value); setError(''); }} placeholder={mode === 'signup' ? 'Create a new password (6+ chars)' : 'Your password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
          </div>
          {error && <p className="cp-auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary cp-auth-btn">
            {mode === 'login' ? <IconLogin size={16} stroke={1.8} /> : <IconUserPlus size={16} stroke={1.8} />}
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p className="cp-auth-switch">
          {mode === 'login' ? (
            <>Don&apos;t have an account?{' '}
              <button type="button" className="cp-switch-btn" onClick={() => { setMode('signup'); setError(''); }}>Sign up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button type="button" className="cp-switch-btn" onClick={() => { setMode('login'); setError(''); }}>Log in</button>
            </>
          )}
        </p>

        <Link to="/" className="cp-back-link">
          <IconArrowLeft size={13} stroke={2} />
          Back to site
        </Link>
      </div>
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────────────────── */
function Dashboard({ user, onLogout }) {
  const [orders, setOrders]         = useState([]);
  const [selected, setSelected]     = useState(null);
  const [showCalendly, setCalendly] = useState(false);

  const loadOrders = useCallback(() => {
    const all = getOrders();
    const mine = all.filter(o => o.email?.toLowerCase() === user.email.toLowerCase());
    setOrders(mine);
    if (mine.length > 0 && !selected) setSelected(mine[0]);
  }, [user.email, selected]);

  useEffect(() => { loadOrders(); }, []);

  const selectedOrder = orders.find(o => o.id === selected?.id) || selected;

  return (
    <div className="cp-dash">
      {/* Top bar */}
      <header className="cp-dash-header">
        <div className="cp-dash-header-left">
          <img src="/logo.svg" alt="Visualize Studio" style={{ height: 26 }} />
          <span className="cp-dash-header-title">Client Portal</span>
        </div>
        <div className="cp-dash-header-right">
          <span className="cp-dash-welcome">Hi, {user.name.split(' ')[0]}</span>
          <button
            type="button"
            className="btn btn-primary cp-book-btn"
            onClick={() => setCalendly(true)}
          >
            <IconCalendar size={15} stroke={1.8} />
            Book a Meeting
          </button>
          <button className="cp-logout" onClick={onLogout}>
            <IconLogout size={14} stroke={1.8} />
            Log out
          </button>
        </div>
      </header>

      <div className="cp-dash-body">
        {orders.length === 0 ? (
          /* Empty state */
          <div className="cp-empty">
            <div className="cp-empty-icon">
              <svg viewBox="0 0 64 64" fill="none" width="56" height="56">
                <rect x="10" y="12" width="44" height="38" rx="6" stroke="var(--text-muted)" strokeWidth="2" />
                <path d="M20 24h24M20 32h16M20 40h10" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="cp-empty-title">No orders yet</h2>
            <p className="cp-empty-sub">
              Once you submit a quote request through the prints page, your orders will appear here with live status updates.
            </p>
            <div className="cp-empty-actions">
              <Link to="/prints" className="btn btn-primary">
                <IconPackage size={16} stroke={1.8} />
                Configure a Print Order
              </Link>
              <button type="button" className="btn btn-secondary" onClick={() => setCalendly(true)}>
                <IconCalendar size={16} stroke={1.8} />
                Book a Meeting
              </button>
            </div>
          </div>
        ) : (
          /* Order list + detail */
          <div className="cp-dash-layout">
            {/* Left: order list */}
            <div className="cp-order-list">
              <div className="cp-order-list-head">
                <h2 className="cp-list-title">Your Orders</h2>
                <span className="cp-list-count">{orders.length}</span>
              </div>
              {orders.map(o => (
                <OrderCard
                  key={o.id}
                  order={o}
                  selected={selectedOrder?.id === o.id}
                  onSelect={() => setSelected(o)}
                />
              ))}
              <Link to="/prints" className="btn btn-secondary cp-new-order-btn">
                <IconArrowRight size={14} stroke={2} />
                New Order
              </Link>
            </div>

            {/* Right: order detail */}
            {selectedOrder && (
              <div className="cp-order-detail">
                <div className="cp-detail-head">
                  <div>
                    <h3 className="cp-detail-title">
                      {selectedOrder.type ? (selectedOrder.type.charAt(0).toUpperCase() + selectedOrder.type.slice(1)) : 'Custom Print'} Order
                    </h3>
                    <p className="cp-detail-date">Submitted {formatDate(selectedOrder.date)}</p>
                  </div>
                </div>

                {/* Status timeline */}
                <div className="cp-detail-section">
                  <h4 className="cp-detail-section-title">Order Progress</h4>
                  <StatusTimeline status={selectedOrder.status || 'pending'} />
                </div>

                {/* Order specs */}
                <div className="cp-detail-section">
                  <h4 className="cp-detail-section-title">Order Details</h4>
                  <div className="cp-spec-grid">
                    {[
                      ['Type',     selectedOrder.type],
                      ['Shape',    selectedOrder.shape],
                      ['Size',     selectedOrder.size],
                      ['Quantity', selectedOrder.quantity ? `${selectedOrder.quantity} units` : null],
                      ['Finish',   selectedOrder.finish],
                      ['Design',   selectedOrder.design],
                    ].filter(([,v]) => v).map(([k, v]) => (
                      <div key={k} className="cp-spec-pair">
                        <span className="cp-spec-key">{k}</span>
                        <span className="cp-spec-val">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="cp-detail-section">
                    <h4 className="cp-detail-section-title">Your Notes</h4>
                    <p className="cp-notes-text">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Need help CTA */}
                <div className="cp-help-box">
                  <div className="cp-help-text">
                    <span className="cp-help-title">Have a question about your order?</span>
                    <span className="cp-help-sub">Book a meeting or reach out directly.</span>
                  </div>
                  <div className="cp-help-actions">
                    <button type="button" className="btn btn-primary cp-help-btn" onClick={() => setCalendly(true)}>
                      <IconCalendar size={15} stroke={1.8} />
                      Book a Meeting
                    </button>
                    <a href="tel:+13024687077" className="btn btn-secondary cp-help-btn">(302) 468-7077</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showCalendly && <CalendlyModal onClose={() => setCalendly(false)} />}
    </div>
  );
}

/* ── Root export ──────────────────────────────────────────────── */
export default function ClientPortal() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  });

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  if (!user) return (
    <>
      <AuthScreen onAuth={setUser} />
      <style>{cpStyles}</style>
    </>
  );

  return (
    <>
      <Dashboard user={user} onLogout={logout} />
      <style>{cpStyles}</style>
    </>
  );
}

const cpStyles = `
  /* ── Auth ─────────────────────────────────── */
  .cp-auth-wrap {
    min-height: 100vh;
    background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    padding: var(--space-6);
    background-image: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,76,67,0.07) 0%, transparent 55%);
  }
  .cp-auth-card {
    width: 100%; max-width: 420px;
    background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--space-10) var(--space-8);
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  }
  .cp-auth-logo { display: flex; justify-content: center; margin-bottom: var(--space-6); }
  .cp-auth-title { font-size: 1.5rem; font-weight: 800; color: var(--text); text-align: center; margin-bottom: var(--space-2); }
  .cp-auth-sub { font-size: 0.875rem; color: var(--text-secondary); text-align: center; line-height: 1.6; margin-bottom: var(--space-6); }

  .cp-auth-notice {
    display: flex; align-items: flex-start; gap: 8px;
    background: rgba(212,76,67,0.08); border: 1px solid rgba(212,76,67,0.2);
    border-radius: var(--radius); padding: var(--space-3) var(--space-4);
    font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5;
    margin-bottom: var(--space-4); color: rgba(240,180,100,0.9);
  }
  .cp-auth-notice strong { color: rgba(240,200,100,1); }

  .cp-auth-form { display: flex; flex-direction: column; gap: var(--space-4); }
  .cp-field { display: flex; flex-direction: column; gap: var(--space-2); }
  .cp-label { font-size: 0.875rem; font-weight: 600; color: var(--text); }
  .cp-input {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius); border: 1px solid var(--border-light);
    background: var(--glass-bg); color: var(--text);
    font-size: 0.9375rem; font-family: inherit; outline: none;
    width: 100%; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .cp-input:focus { border-color: var(--brand); box-shadow: 0 0 0 1px rgba(212,76,67,0.25); }
  .cp-auth-error { font-size: 0.8125rem; color: rgba(248,113,113,0.9); text-align: center; }
  .cp-auth-btn { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; padding: var(--space-3); font-size: 1rem; margin-top: var(--space-2); }

  .cp-auth-switch { text-align: center; font-size: 0.875rem; color: var(--text-muted); margin-top: var(--space-4); }
  .cp-switch-btn { background: none; border: none; color: var(--brand); font-weight: 600; cursor: pointer; font-size: inherit; padding: 0; }
  .cp-switch-btn:hover { text-decoration: underline; }
  .cp-back-link { display: flex; align-items: center; justify-content: center; gap: 4px; text-align: center; font-size: 0.8125rem; color: var(--text-muted); margin-top: var(--space-4); }
  .cp-back-link:hover { color: var(--text); }
  @keyframes cpShake { 0%,100%{transform:translateX(0)} 15%,55%{transform:translateX(-6px)} 35%,75%{transform:translateX(6px)} }
  .cp-shake { animation: cpShake 0.5s ease; }

  /* ── Dashboard ───────────────────────────── */
  .cp-dash { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }

  .cp-dash-header {
    position: sticky; top: 0; z-index: 50;
    background: rgba(10,10,10,0.88);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 var(--space-6); height: 60px; gap: var(--space-4);
  }
  .cp-dash-header-left { display: flex; align-items: center; gap: 10px; }
  .cp-dash-header-title { font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); padding-left: 10px; border-left: 1px solid var(--glass-border); }
  .cp-dash-header-right { display: flex; align-items: center; gap: var(--space-3); }
  .cp-dash-welcome { font-size: 0.875rem; color: var(--text-secondary); }
  .cp-book-btn { font-size: 0.8125rem; padding: 7px 14px; display: flex; align-items: center; gap: 6px; }
  .cp-logout {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: 1px solid var(--glass-border);
    color: var(--text-muted); font-size: 0.8125rem;
    padding: 6px 12px; border-radius: var(--radius); cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .cp-logout:hover { color: var(--text); border-color: var(--text-secondary); }

  @media (max-width: 600px) {
    .cp-dash-header { padding: 0 var(--space-4); }
    .cp-dash-welcome { display: none; }
    .cp-book-btn span { display: none; }
  }

  .cp-dash-body { flex: 1; padding: var(--space-8) var(--space-6); max-width: 1100px; margin: 0 auto; width: 100%; }
  @media (max-width: 600px) { .cp-dash-body { padding: var(--space-6) var(--space-4); } }

  /* ── Empty state ─────────────────────────── */
  .cp-empty {
    text-align: center; padding: var(--space-16) var(--space-6);
    display: flex; flex-direction: column; align-items: center; gap: var(--space-4);
  }
  .cp-empty-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    display: flex; align-items: center; justify-content: center;
  }
  .cp-empty-title { font-size: 1.5rem; font-weight: 800; color: var(--text); }
  .cp-empty-sub { font-size: 1rem; color: var(--text-secondary); max-width: 440px; line-height: 1.65; }
  .cp-empty-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: center; margin-top: var(--space-2); }

  /* ── Order list ──────────────────────────── */
  .cp-dash-layout { display: grid; grid-template-columns: 320px 1fr; gap: var(--space-6); align-items: start; }
  @media (max-width: 800px) { .cp-dash-layout { grid-template-columns: 1fr; } }

  .cp-order-list { display: flex; flex-direction: column; gap: var(--space-3); }
  .cp-order-list-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2); }
  .cp-list-title { font-size: 1rem; font-weight: 700; color: var(--text); }
  .cp-list-count {
    font-size: 0.75rem; font-weight: 700;
    background: rgba(212,76,67,0.12); color: var(--brand);
    padding: 2px 8px; border-radius: 999px;
  }
  .cp-order-card {
    display: flex; flex-direction: column; gap: var(--space-2);
    padding: var(--space-4); text-align: left; width: 100%;
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .cp-order-card:hover { border-color: rgba(212,76,67,0.35); }
  .cp-order-card--active { border-color: var(--brand); background: rgba(212,76,67,0.07); }
  .cp-order-top { display: flex; justify-content: space-between; align-items: baseline; }
  .cp-order-type { font-size: 0.9375rem; font-weight: 700; color: var(--text); text-transform: capitalize; }
  .cp-order-time { font-size: 0.72rem; color: var(--text-muted); }
  .cp-order-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .cp-tag { font-size: 0.7rem; padding: 2px 7px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: var(--text-secondary); text-transform: capitalize; }
  .cp-order-status { display: inline-flex; align-items: center; gap: 5px; font-size: 0.72rem; font-weight: 700; color: var(--sc); text-transform: uppercase; letter-spacing: 0.06em; }
  .cp-order-status-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--sc); }
  .cp-new-order-btn { text-align: center; margin-top: var(--space-2); }

  /* ── Order detail ────────────────────────── */
  .cp-order-detail {
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-6);
    position: sticky; top: 76px;
    display: flex; flex-direction: column; gap: var(--space-6);
  }
  .cp-detail-head { display: flex; align-items: flex-start; justify-content: space-between; }
  .cp-detail-title { font-size: 1.25rem; font-weight: 800; color: var(--text); margin-bottom: 4px; }
  .cp-detail-date { font-size: 0.8125rem; color: var(--text-muted); }
  .cp-detail-section { display: flex; flex-direction: column; gap: var(--space-3); }
  .cp-detail-section-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }

  /* ── Status timeline ─────────────────────── */
  .cp-timeline { display: flex; flex-direction: column; }
  .cp-tl-step { display: flex; gap: var(--space-3); }
  .cp-tl-left { display: flex; flex-direction: column; align-items: center; }
  .cp-tl-dot {
    width: 22px; height: 22px; border-radius: 50%;
    border: 2px solid var(--border-light);
    background: var(--bg-card);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.25s;
  }
  .cp-tl-step.done .cp-tl-dot { background: var(--sc, var(--brand)); border-color: var(--sc, var(--brand)); }
  .cp-tl-step.active .cp-tl-dot { border-color: var(--sc, var(--brand)); background: color-mix(in srgb, var(--sc,var(--brand)) 15%, transparent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--sc,var(--brand)) 15%, transparent); }
  .cp-tl-line { width: 2px; flex: 1; min-height: 16px; background: var(--border); margin: 3px 0; }
  .cp-tl-step.done .cp-tl-line { background: var(--sc, var(--brand)); }
  .cp-tl-body { padding: 2px 0 14px; }
  .cp-tl-label { font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); }
  .cp-tl-step.active .cp-tl-label { font-weight: 700; }
  .cp-tl-step.done .cp-tl-label { color: var(--text-muted); }
  .cp-tl-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin-top: 3px; max-width: 280px; }

  /* ── Specs ───────────────────────────────── */
  .cp-spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
  @media (max-width: 500px) { .cp-spec-grid { grid-template-columns: 1fr; } }
  .cp-spec-pair { background: var(--glass-bg); border-radius: var(--radius); padding: var(--space-3) var(--space-4); }
  .cp-spec-key { display: block; font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
  .cp-spec-val { font-size: 0.9rem; font-weight: 600; color: var(--text); text-transform: capitalize; }

  .cp-notes-text { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; white-space: pre-wrap; }

  /* ── Help box ────────────────────────────── */
  .cp-help-box {
    background: rgba(212,76,67,0.06); border: 1px solid rgba(212,76,67,0.2);
    border-radius: var(--radius-lg); padding: var(--space-5);
    display: flex; align-items: center; justify-content: space-between;
    gap: var(--space-4); flex-wrap: wrap;
  }
  .cp-help-text { display: flex; flex-direction: column; gap: 3px; }
  .cp-help-title { font-size: 0.9375rem; font-weight: 700; color: var(--text); }
  .cp-help-sub { font-size: 0.8125rem; color: var(--text-muted); }
  .cp-help-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }
  .cp-help-btn { font-size: 0.8125rem; padding: 8px 14px; }

  /* ── Calendly modal ──────────────────────── */
  .cp-modal-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: var(--space-4);
    animation: cpFadeIn 0.2s ease;
  }
  @keyframes cpFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .cp-modal {
    background: #111;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    width: 100%; max-width: 780px;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.7);
    animation: cpSlideUp 0.25s var(--ease);
  }
  @keyframes cpSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .cp-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-4) var(--space-6);
    border-bottom: 1px solid var(--glass-border);
  }
  .cp-modal-title { font-size: 1rem; font-weight: 700; color: var(--text); }
  .cp-modal-close {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
    color: var(--text-secondary); cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .cp-modal-close:hover { background: rgba(255,255,255,0.1); color: var(--text); }
`;
