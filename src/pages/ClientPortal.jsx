import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  IconInfoCircle, IconX, IconCalendar, IconLogout, IconArrowLeft,
  IconLogin, IconUserPlus, IconPackage, IconArrowRight,
  IconLayoutDashboard, IconReceipt, IconPlus, IconCheck,
  IconClock, IconAlertCircle, IconChevronRight,
} from '@tabler/icons-react';

const CLIENTS_KEY  = 'vz_clients';
const ORDERS_KEY   = 'vz_print_orders';
const INVOICES_KEY = 'vz_invoices';
const SESSION_KEY  = 'vz_portal_session';
const CALENDLY_URL = 'https://calendly.com/contactvisualize/studio-meeting?hide_gdpr_banner=1';

const STATUS_META = {
  pending:   { label: 'Pending Review', color: '#f59e0b', desc: 'Your order has been received and is waiting to be reviewed.' },
  reviewed:  { label: 'Reviewed',       color: '#60a5fa', desc: 'Your order has been reviewed. A quote is being prepared.' },
  approved:  { label: 'Approved',       color: '#a78bfa', desc: 'Your order is approved and moving forward.' },
  sent:      { label: 'Quote Sent',     color: '#34d399', desc: 'A quote has been sent to your email. Check your inbox.' },
  completed: { label: 'Completed',      color: '#22c55e', desc: 'Your order is complete. Thank you!' },
};

const INVOICE_STATUS = {
  unpaid:  { label: 'Unpaid',  color: '#f59e0b', icon: IconClock },
  paid:    { label: 'Paid',    color: '#22c55e', icon: IconCheck },
  overdue: { label: 'Overdue', color: '#ef4444', icon: IconAlertCircle },
};

function getClients() {
  try { return JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]'); } catch { return []; }
}
function saveClients(c) { localStorage.setItem(CLIENTS_KEY, JSON.stringify(c)); }
function getOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; }
}
function getInvoices() {
  try { return JSON.parse(localStorage.getItem(INVOICES_KEY) || '[]'); } catch { return []; }
}
function hashPassword(pw) {
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

/* ── Calendly modal ─────────────────────────────────────────────── */
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
        <div className="calendly-inline-widget" data-url={CALENDLY_URL} style={{ minWidth: '320px', height: '620px' }} />
      </div>
    </div>
  );
}

/* ── Auth screen ─────────────────────────────────────────────────── */
function AuthScreen({ onAuth }) {
  const [mode, setMode]   = useState('login');
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');
  const [shaking, setShake] = useState(false);

  const shake = (msg) => { setError(msg); setShake(true); setTimeout(() => setShake(false), 500); };

  const submit = (e) => {
    e.preventDefault(); setError('');
    const clients = getClients();
    if (mode === 'signup') {
      if (!name.trim())  return shake('Please enter your name.');
      if (!email.trim()) return shake('Please enter your email.');
      if (!/\S+@\S+\.\S+/.test(email)) return shake('Enter a valid email address.');
      if (pw.length < 6) return shake('Password must be at least 6 characters.');
      if (clients.find(c => c.email.toLowerCase() === email.toLowerCase()))
        return shake('An account with this email already exists. Try logging in.');
      const client = { id: Date.now(), name: name.trim(), email: email.toLowerCase().trim(), passwordHash: hashPassword(pw), password: pw, createdAt: new Date().toISOString() };
      saveClients([...clients, client]);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: client.id, name: client.name, email: client.email }));
      onAuth({ name: client.name, email: client.email });
    } else {
      const client = clients.find(c => c.email.toLowerCase() === email.toLowerCase().trim());
      if (!client || client.passwordHash !== hashPassword(pw)) return shake('Incorrect email or password.');
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: client.id, name: client.name, email: client.email }));
      onAuth({ name: client.name, email: client.email });
    }
  };

  return (
    <div className="cp-auth-wrap">
      <div className="cp-auth-card">
        <div className="cp-auth-logo"><img src="/logo.svg" alt="Visualize Studio" style={{ height: 32 }} /></div>
        <h1 className="cp-auth-title">{mode === 'login' ? 'Client Portal' : 'Create an Account'}</h1>
        <p className="cp-auth-sub">
          {mode === 'login' ? 'Sign in to track your orders and view invoices.' : 'Create an account to track orders, view invoices, and book meetings.'}
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
              <input className="cp-input" value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="First name" autoComplete="name" />
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
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="cp-auth-switch">
          {mode === 'login'
            ? <> Don&apos;t have an account?{' '}<button type="button" className="cp-switch-btn" onClick={() => { setMode('signup'); setError(''); }}>Sign up</button></>
            : <> Already have an account?{' '}<button type="button" className="cp-switch-btn" onClick={() => { setMode('login'); setError(''); }}>Sign in</button></>}
        </p>
        <Link to="/" className="cp-back-link"><IconArrowLeft size={13} stroke={2} />Back to site</Link>
      </div>
    </div>
  );
}

/* ── Status timeline ────────────────────────────────────────────── */
function StatusTimeline({ status }) {
  const steps = ['pending', 'reviewed', 'approved', 'sent', 'completed'];
  const current = steps.indexOf(status || 'pending');
  return (
    <div className="cp-timeline">
      {steps.map((s, i) => {
        const meta   = STATUS_META[s];
        const done   = i < current;
        const active = i === current;
        return (
          <div key={s} className={`cp-tl-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className="cp-tl-left">
              <div className="cp-tl-dot" style={active || done ? { '--sc': meta.color } : {}}>
                {done && <svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M2 6l2.5 2.5L10 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
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

/* ── Sidebar ────────────────────────────────────────────────────── */
function Sidebar({ tab, setTab, user, onLogout, onCalendly }) {
  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
    { id: 'orders',    label: 'My Orders',  icon: IconPackage },
    { id: 'invoices',  label: 'Invoices',   icon: IconReceipt },
  ];
  return (
    <aside className="cp-sidebar">
      <div className="cp-sidebar-brand">
        <img src="/logo.svg" alt="Visualize Studio" style={{ height: 28 }} />
        <span className="cp-sidebar-brand-label">Client Portal</span>
      </div>
      <nav className="cp-sidebar-nav">
        {nav.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button"
              className={`cp-nav-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <Icon size={17} stroke={1.7} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="cp-sidebar-footer">
        <button type="button" className="cp-book-sidebar" onClick={onCalendly}>
          <IconCalendar size={16} stroke={1.8} />
          Book a Meeting
        </button>
        <div className="cp-sidebar-user">
          <div className="cp-sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="cp-sidebar-user-info">
            <span className="cp-sidebar-name">{user.name}</span>
            <span className="cp-sidebar-email">{user.email}</span>
          </div>
          <button className="cp-sidebar-logout" onClick={onLogout} title="Sign out">
            <IconLogout size={15} stroke={1.6} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ── Dashboard view ─────────────────────────────────────────────── */
function DashboardView({ user, orders, invoices, onCalendly, setTab }) {
  const pending   = orders.filter(o => (o.status || 'pending') !== 'completed').length;
  const unpaidInv = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue');
  const recent    = orders[0];

  return (
    <div className="cp-view">
      <div className="cp-view-header">
        <h1 className="cp-view-title">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="cp-view-sub">Here&apos;s a summary of your account.</p>
      </div>

      {/* Stat cards */}
      <div className="cp-stats-row">
        <div className="cp-stat-card" onClick={() => setTab('orders')} style={{ cursor: 'pointer' }}>
          <span className="cp-stat-icon" style={{ '--c': 'var(--brand)' }}><IconPackage size={18} stroke={1.7} /></span>
          <span className="cp-stat-val">{orders.length}</span>
          <span className="cp-stat-label">Total Orders</span>
        </div>
        <div className="cp-stat-card" onClick={() => setTab('orders')} style={{ cursor: 'pointer' }}>
          <span className="cp-stat-icon" style={{ '--c': '#f59e0b' }}><IconClock size={18} stroke={1.7} /></span>
          <span className="cp-stat-val">{pending}</span>
          <span className="cp-stat-label">In Progress</span>
        </div>
        <div className="cp-stat-card" onClick={() => setTab('invoices')} style={{ cursor: 'pointer' }}>
          <span className="cp-stat-icon" style={{ '--c': unpaidInv.length > 0 ? '#ef4444' : '#22c55e' }}>
            <IconReceipt size={18} stroke={1.7} />
          </span>
          <span className="cp-stat-val">{unpaidInv.length}</span>
          <span className="cp-stat-label">{unpaidInv.length === 1 ? 'Invoice Due' : 'Invoices Due'}</span>
        </div>
      </div>

      <div className="cp-dash-grid">
        {/* Recent order */}
        <div className="cp-panel">
          <div className="cp-panel-head">
            <h2 className="cp-panel-title">Recent Order</h2>
            <button type="button" className="cp-panel-link" onClick={() => setTab('orders')}>
              View all <IconChevronRight size={13} stroke={2} />
            </button>
          </div>
          {recent ? (
            <div className="cp-recent-order">
              <div className="cp-recent-order-top">
                <div>
                  <p className="cp-recent-type">{recent.type ? recent.type.charAt(0).toUpperCase() + recent.type.slice(1) : 'Custom Print'}</p>
                  <p className="cp-recent-date">{formatDate(recent.date)}</p>
                </div>
                <span className="cp-status-pill" style={{ '--sc': STATUS_META[recent.status || 'pending'].color }}>
                  <span className="cp-status-pill-dot" />
                  {STATUS_META[recent.status || 'pending'].label}
                </span>
              </div>
              <div className="cp-recent-tags">
                {recent.shape    && <span className="cp-tag">{recent.shape}</span>}
                {recent.size     && <span className="cp-tag">{recent.size}</span>}
                {recent.quantity && <span className="cp-tag">{recent.quantity} units</span>}
                {recent.finish   && <span className="cp-tag">{recent.finish}</span>}
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <StatusTimeline status={recent.status || 'pending'} />
              </div>
            </div>
          ) : (
            <div className="cp-panel-empty">
              <IconPackage size={32} stroke={1.2} />
              <p>No orders yet. Place your first order to get started.</p>
              <Link to="/prints" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>
                <IconPlus size={15} stroke={2} />Place an Order
              </Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="cp-panel">
          <h2 className="cp-panel-title">Quick Actions</h2>
          <div className="cp-quick-actions">
            <Link to="/prints" className="cp-quick-btn">
              <span className="cp-quick-icon" style={{ '--c': 'var(--brand)' }}><IconPlus size={18} stroke={2} /></span>
              <div>
                <p className="cp-quick-label">New Print Order</p>
                <p className="cp-quick-sub">Stickers, vinyl & more</p>
              </div>
              <IconChevronRight size={14} stroke={2} className="cp-quick-arrow" />
            </Link>
            <button type="button" className="cp-quick-btn" onClick={() => setTab('invoices')}>
              <span className="cp-quick-icon" style={{ '--c': '#60a5fa' }}><IconReceipt size={18} stroke={1.8} /></span>
              <div>
                <p className="cp-quick-label">View Invoices</p>
                <p className="cp-quick-sub">{invoices.length} total · {unpaidInv.length} due</p>
              </div>
              <IconChevronRight size={14} stroke={2} className="cp-quick-arrow" />
            </button>
            <button type="button" className="cp-quick-btn" onClick={onCalendly}>
              <span className="cp-quick-icon" style={{ '--c': '#34d399' }}><IconCalendar size={18} stroke={1.8} /></span>
              <div>
                <p className="cp-quick-label">Book a Meeting</p>
                <p className="cp-quick-sub">Schedule time to talk</p>
              </div>
              <IconChevronRight size={14} stroke={2} className="cp-quick-arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Orders view ────────────────────────────────────────────────── */
function OrdersView({ orders, onCalendly }) {
  const [selected, setSelected]         = useState(orders[0] || null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const selectedOrder = orders.find(o => o.id === selected?.id) || selected;

  const handleSelect = (o) => { setSelected(o); setMobileDetail(true); };

  return (
    <div className="cp-view">
      <div className="cp-view-header cp-view-header--row">
        <div>
          <h1 className="cp-view-title">My Orders</h1>
          <p className="cp-view-sub">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link to="/prints" className="btn btn-primary" style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <IconPlus size={15} stroke={2} />New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="cp-panel cp-panel-empty-lg">
          <IconPackage size={40} stroke={1.2} />
          <h3>No orders yet</h3>
          <p>Once you submit a quote request, your orders will appear here with live status updates.</p>
          <Link to="/prints" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
            <IconPlus size={15} stroke={2} />Place Your First Order
          </Link>
        </div>
      ) : (
        <div className={`cp-orders-layout ${mobileDetail ? 'cp-detail-open' : ''}`}>
          {/* Left list */}
          <div className="cp-order-list">
            {orders.map(o => {
              const meta = STATUS_META[o.status || 'pending'];
              return (
                <button key={o.id} type="button"
                  className={`cp-order-card ${selectedOrder?.id === o.id ? 'active' : ''}`}
                  onClick={() => handleSelect(o)}
                >
                  <div className="cp-order-card-top">
                    <span className="cp-order-card-type">{o.type ? o.type.charAt(0).toUpperCase() + o.type.slice(1) : 'Custom Print'}</span>
                    <span className="cp-order-card-time">{timeAgo(o.date)}</span>
                  </div>
                  <div className="cp-order-card-tags">
                    {o.shape    && <span className="cp-tag">{o.shape}</span>}
                    {o.size     && <span className="cp-tag">{o.size}</span>}
                    {o.quantity && <span className="cp-tag">{o.quantity} units</span>}
                    {o.finish   && <span className="cp-tag">{o.finish}</span>}
                  </div>
                  <span className="cp-status-pill" style={{ '--sc': meta.color }}>
                    <span className="cp-status-pill-dot" />
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right detail */}
          {selectedOrder && (
            <div className="cp-order-detail">
              <button className="cp-mobile-back-btn" onClick={() => setMobileDetail(false)}>
                <IconArrowLeft size={15} stroke={2} />All Orders
              </button>
              <div className="cp-detail-top">
                <div>
                  <h3 className="cp-detail-title">
                    {selectedOrder.type ? selectedOrder.type.charAt(0).toUpperCase() + selectedOrder.type.slice(1) : 'Custom Print'} Order
                  </h3>
                  <p className="cp-detail-date">Submitted {formatDate(selectedOrder.date)}</p>
                </div>
                <span className="cp-status-pill" style={{ '--sc': STATUS_META[selectedOrder.status || 'pending'].color }}>
                  <span className="cp-status-pill-dot" />
                  {STATUS_META[selectedOrder.status || 'pending'].label}
                </span>
              </div>

              <div className="cp-detail-section">
                <p className="cp-detail-section-label">Order Progress</p>
                <StatusTimeline status={selectedOrder.status || 'pending'} />
              </div>

              <div className="cp-detail-section">
                <p className="cp-detail-section-label">Order Details</p>
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
                  <p className="cp-detail-section-label">Notes</p>
                  <p className="cp-notes-text">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="cp-help-box">
                <div>
                  <p className="cp-help-title">Have a question?</p>
                  <p className="cp-help-sub">Book a meeting or call us directly.</p>
                </div>
                <div className="cp-help-actions">
                  <button type="button" className="btn btn-primary cp-help-btn" onClick={onCalendly}>
                    <IconCalendar size={14} stroke={1.8} />Book Meeting
                  </button>
                  <a href="tel:+13024687077" className="btn btn-secondary cp-help-btn">(302) 468-7077</a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Invoices view ──────────────────────────────────────────────── */
function InvoicesView({ invoices, onCalendly }) {
  const [selected, setSelected]         = useState(invoices[0] || null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const selectedInv = invoices.find(i => i.id === selected?.id) || selected;

  const handleSelect = (inv) => { setSelected(inv); setMobileDetail(true); };
  const totalOwed = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);

  return (
    <div className="cp-view">
      <div className="cp-view-header">
        <h1 className="cp-view-title">Invoices</h1>
        <p className="cp-view-sub">
          {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
          {totalOwed > 0 && <> · <span style={{ color: '#ef4444' }}>${totalOwed.toFixed(2)} outstanding</span></>}
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="cp-panel cp-panel-empty-lg">
          <IconReceipt size={40} stroke={1.2} />
          <h3>No invoices yet</h3>
          <p>Invoices created by Visualize Studio will appear here once your order is approved.</p>
          <button type="button" className="btn btn-secondary" onClick={onCalendly} style={{ fontSize: '0.875rem' }}>
            <IconCalendar size={15} stroke={1.8} />Book a Meeting
          </button>
        </div>
      ) : (
        <div className={`cp-orders-layout ${mobileDetail ? 'cp-detail-open' : ''}`}>
          {/* Invoice list */}
          <div className="cp-order-list">
            {invoices.map(inv => {
              const s = INVOICE_STATUS[inv.status] || INVOICE_STATUS.unpaid;
              return (
                <button key={inv.id} type="button"
                  className={`cp-order-card ${selectedInv?.id === inv.id ? 'active' : ''}`}
                  onClick={() => handleSelect(inv)}
                >
                  <div className="cp-order-card-top">
                    <span className="cp-order-card-type">{inv.invoiceNumber || `INV-${inv.id}`}</span>
                    <span className="cp-order-card-time">{timeAgo(inv.createdAt)}</span>
                  </div>
                  <p className="cp-inv-desc">{inv.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="cp-inv-amount">${parseFloat(inv.amount || 0).toFixed(2)}</span>
                    <span className="cp-status-pill" style={{ '--sc': s.color }}>
                      <span className="cp-status-pill-dot" />{s.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Invoice detail */}
          {selectedInv && (() => {
            const s = INVOICE_STATUS[selectedInv.status] || INVOICE_STATUS.unpaid;
            const SIcon = s.icon;
            return (
              <div className="cp-order-detail">
                <button className="cp-mobile-back-btn" onClick={() => setMobileDetail(false)}>
                  <IconArrowLeft size={15} stroke={2} />All Invoices
                </button>
                <div className="cp-detail-top">
                  <div>
                    <h3 className="cp-detail-title">{selectedInv.invoiceNumber || `INV-${selectedInv.id}`}</h3>
                    <p className="cp-detail-date">Issued {formatDate(selectedInv.createdAt)}</p>
                  </div>
                  <span className="cp-status-pill" style={{ '--sc': s.color }}>
                    <span className="cp-status-pill-dot" />{s.label}
                  </span>
                </div>

                {/* Amount hero */}
                <div className="cp-inv-hero" style={{ '--sc': s.color }}>
                  <div className="cp-inv-hero-icon"><SIcon size={22} stroke={1.8} /></div>
                  <div>
                    <p className="cp-inv-hero-label">Amount Due</p>
                    <p className="cp-inv-hero-amount">${parseFloat(selectedInv.amount || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="cp-detail-section">
                  <p className="cp-detail-section-label">Description</p>
                  <p className="cp-notes-text">{selectedInv.description}</p>
                </div>

                {selectedInv.dueDate && (
                  <div className="cp-detail-section">
                    <p className="cp-detail-section-label">Due Date</p>
                    <p style={{ fontSize: '0.9375rem', color: selectedInv.status === 'overdue' ? '#ef4444' : 'var(--text)', fontWeight: 600 }}>
                      {formatDate(selectedInv.dueDate)}
                    </p>
                  </div>
                )}

                {selectedInv.notes && (
                  <div className="cp-detail-section">
                    <p className="cp-detail-section-label">Notes from Visualize</p>
                    <p className="cp-notes-text">{selectedInv.notes}</p>
                  </div>
                )}

                {selectedInv.status !== 'paid' && (
                  <div className="cp-help-box">
                    <div>
                      <p className="cp-help-title">Ready to pay?</p>
                      <p className="cp-help-sub">Book a meeting or reach out to arrange payment.</p>
                    </div>
                    <button type="button" className="btn btn-primary cp-help-btn" onClick={onCalendly}>
                      <IconCalendar size={14} stroke={1.8} />Book Meeting
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

/* ── Main portal ────────────────────────────────────────────────── */
function Portal({ user, onLogout }) {
  const [tab, setTab]               = useState('dashboard');
  const [showCalendly, setCalendly] = useState(false);
  const [orders, setOrders]         = useState([]);
  const [invoices, setInvoices]     = useState([]);

  const load = useCallback(() => {
    const allOrders   = getOrders();
    const allInvoices = getInvoices();
    setOrders(allOrders.filter(o => o.email?.toLowerCase() === user.email.toLowerCase()));
    setInvoices(allInvoices.filter(i => i.clientEmail?.toLowerCase() === user.email.toLowerCase()));
  }, [user.email]);

  useEffect(() => { load(); }, [load]);

  const unpaidCount  = invoices.filter(i => i.status !== 'paid').length;
  const pendingCount = orders.filter(o => (o.status || 'pending') !== 'completed').length;

  const bottomNavItems = [
    { id: 'dashboard', label: 'Home',     icon: IconLayoutDashboard },
    { id: 'orders',    label: 'Orders',   icon: IconPackage,  badge: pendingCount },
    { id: 'invoices',  label: 'Invoices', icon: IconReceipt,  badge: unpaidCount  },
  ];

  return (
    <div className="cp-portal">
      {/* Mobile-only top bar */}
      <div className="cp-mobile-topbar">
        <img src="/logo.svg" alt="Visualize" style={{ height: 22 }} />
        <div className="cp-mobile-topbar-right">
          <div className="cp-sidebar-avatar" style={{ width: 30, height: 30, fontSize: '0.75rem' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button className="cp-sidebar-logout" onClick={onLogout} title="Sign out">
            <IconLogout size={15} stroke={1.6} />
          </button>
        </div>
      </div>

      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={onLogout} onCalendly={() => setCalendly(true)} />

      <main className="cp-main">
        {tab === 'dashboard' && <DashboardView user={user} orders={orders} invoices={invoices} onCalendly={() => setCalendly(true)} setTab={setTab} />}
        {tab === 'orders'    && <OrdersView    orders={orders}   onCalendly={() => setCalendly(true)} />}
        {tab === 'invoices'  && <InvoicesView  invoices={invoices} onCalendly={() => setCalendly(true)} />}
      </main>

      {/* Mobile-only bottom tab bar */}
      <nav className="cp-bottom-nav" aria-label="Main navigation">
        {bottomNavItems.map(item => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button key={item.id} type="button"
              className={`cp-bottom-nav-item ${active ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <span className="cp-bottom-nav-icon">
                <Icon size={22} stroke={active ? 2 : 1.6} />
                {item.badge > 0 && <span className="cp-bottom-nav-badge">{item.badge}</span>}
              </span>
              <span className="cp-bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {showCalendly && <CalendlyModal onClose={() => setCalendly(false)} />}
    </div>
  );
}

/* ── Root export ────────────────────────────────────────────────── */
export default function ClientPortal() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  });
  const logout = () => { sessionStorage.removeItem(SESSION_KEY); setUser(null); };

  return (
    <>
      {user ? <Portal user={user} onLogout={logout} /> : <AuthScreen onAuth={setUser} />}
      <style>{cpStyles}</style>
    </>
  );
}

const cpStyles = `
  /* ── Layout ──────────────────────────────── */
  .cp-portal { display: flex; min-height: 100vh; background: var(--bg); }
  .cp-main { flex: 1; overflow-y: auto; min-width: 0; }

  /* ── Sidebar ─────────────────────────────── */
  .cp-sidebar {
    width: 240px; flex-shrink: 0;
    background: rgba(12,12,12,0.97);
    border-right: 1px solid var(--glass-border);
    display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh;
    overflow: hidden;
  }
  .cp-sidebar-brand {
    display: flex; align-items: center; gap: 10px;
    padding: var(--space-6) var(--space-5) var(--space-5);
    border-bottom: 1px solid var(--glass-border);
  }
  .cp-sidebar-brand-label {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--text-muted);
  }
  .cp-sidebar-nav {
    flex: 1; display: flex; flex-direction: column; gap: 2px;
    padding: var(--space-4) var(--space-3);
  }
  .cp-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius);
    background: none; border: none; cursor: pointer;
    font-size: 0.875rem; font-weight: 500; color: var(--text-muted);
    text-align: left; width: 100%;
    transition: background 0.15s, color 0.15s;
  }
  .cp-nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text-secondary); }
  .cp-nav-item.active { background: rgba(212,76,67,0.12); color: var(--text); border-left: 2px solid var(--brand); padding-left: 10px; }
  .cp-sidebar-footer {
    padding: var(--space-4) var(--space-3);
    border-top: 1px solid var(--glass-border);
    display: flex; flex-direction: column; gap: var(--space-3);
  }
  .cp-book-sidebar {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    width: 100%; padding: 9px; border-radius: var(--radius);
    background: rgba(212,76,67,0.12); border: 1px solid rgba(212,76,67,0.25);
    color: var(--brand); font-size: 0.8125rem; font-weight: 600; cursor: pointer;
    transition: background 0.2s;
  }
  .cp-book-sidebar:hover { background: rgba(212,76,67,0.2); }
  .cp-sidebar-user {
    display: flex; align-items: center; gap: var(--space-2);
    padding: var(--space-2) 0;
  }
  .cp-sidebar-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: rgba(212,76,67,0.15); border: 1px solid rgba(212,76,67,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; color: var(--brand);
  }
  .cp-sidebar-user-info { flex: 1; min-width: 0; }
  .cp-sidebar-name { display: block; font-size: 0.8125rem; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cp-sidebar-email { display: block; font-size: 0.68rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cp-sidebar-logout {
    width: 28px; height: 28px; flex-shrink: 0; border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center;
    background: none; border: 1px solid var(--glass-border);
    color: var(--text-muted); cursor: pointer; transition: color 0.2s, border-color 0.2s;
  }
  .cp-sidebar-logout:hover { color: #f87171; border-color: rgba(220,80,80,0.4); }

  /* ── View container ──────────────────────── */
  .cp-view { padding: var(--space-8); max-width: 1000px; }
  .cp-view-header { margin-bottom: var(--space-7); }
  .cp-view-header--row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4); }
  .cp-view-title { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text); margin-bottom: 4px; }
  .cp-view-sub { font-size: 0.9rem; color: var(--text-muted); }

  /* ── Stat cards ──────────────────────────── */
  .cp-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-bottom: var(--space-6); }
  @media (max-width: 600px) { .cp-stats-row { grid-template-columns: 1fr; } }
  .cp-stat-card {
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-5);
    display: flex; flex-direction: column; gap: var(--space-2);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .cp-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .cp-stat-icon {
    width: 36px; height: 36px; border-radius: var(--radius);
    background: color-mix(in srgb, var(--c) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--c) 25%, transparent);
    display: flex; align-items: center; justify-content: center;
    color: var(--c);
  }
  .cp-stat-val { font-size: 1.75rem; font-weight: 900; color: var(--text); letter-spacing: -0.03em; }
  .cp-stat-label { font-size: 0.8125rem; color: var(--text-secondary); }

  /* ── Dashboard grid ──────────────────────── */
  .cp-dash-grid { display: grid; grid-template-columns: 1fr 320px; gap: var(--space-5); }
  @media (max-width: 900px) { .cp-dash-grid { grid-template-columns: 1fr; } }

  /* ── Panels ──────────────────────────────── */
  .cp-panel {
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-6);
  }
  .cp-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-5); }
  .cp-panel-title { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: var(--space-5); }
  .cp-panel-head .cp-panel-title { margin-bottom: 0; }
  .cp-panel-link {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 0.8125rem; color: var(--brand); font-weight: 600;
    background: none; border: none; cursor: pointer;
    transition: gap 0.2s;
  }
  .cp-panel-link:hover { gap: 5px; }
  .cp-panel-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: var(--space-3); padding: var(--space-8) 0;
    text-align: center; color: var(--text-muted);
  }
  .cp-panel-empty p { font-size: 0.875rem; color: var(--text-secondary); max-width: 300px; line-height: 1.6; }

  /* Empty panel (large) */
  .cp-panel-empty-lg {
    display: flex; flex-direction: column; align-items: center;
    gap: var(--space-4); padding: var(--space-16) var(--space-8);
    text-align: center; color: var(--text-muted);
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
  }
  .cp-panel-empty-lg h3 { font-size: 1.2rem; font-weight: 700; color: var(--text); }
  .cp-panel-empty-lg p { font-size: 0.9rem; color: var(--text-secondary); max-width: 380px; line-height: 1.65; }

  /* ── Recent order ────────────────────────── */
  .cp-recent-order { display: flex; flex-direction: column; gap: var(--space-3); }
  .cp-recent-order-top { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3); }
  .cp-recent-type { font-size: 1rem; font-weight: 700; color: var(--text); text-transform: capitalize; margin-bottom: 3px; }
  .cp-recent-date { font-size: 0.78rem; color: var(--text-muted); }
  .cp-recent-tags { display: flex; flex-wrap: wrap; gap: 4px; }

  /* ── Quick actions ───────────────────────── */
  .cp-quick-actions { display: flex; flex-direction: column; gap: var(--space-2); }
  .cp-quick-btn {
    display: flex; align-items: center; gap: var(--space-3);
    padding: var(--space-4); border-radius: var(--radius-lg);
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    cursor: pointer; text-align: left; width: 100%;
    transition: border-color 0.2s, background 0.2s;
    text-decoration: none; color: inherit;
  }
  .cp-quick-btn:hover { border-color: rgba(212,76,67,0.3); background: rgba(212,76,67,0.04); }
  .cp-quick-icon {
    width: 36px; height: 36px; flex-shrink: 0; border-radius: var(--radius);
    background: color-mix(in srgb, var(--c) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--c) 25%, transparent);
    display: flex; align-items: center; justify-content: center; color: var(--c);
  }
  .cp-quick-label { font-size: 0.875rem; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .cp-quick-sub { font-size: 0.75rem; color: var(--text-muted); }
  .cp-quick-arrow { color: var(--text-muted); margin-left: auto; flex-shrink: 0; }

  /* ── Status pill ─────────────────────────── */
  .cp-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 999px; white-space: nowrap;
    background: color-mix(in srgb, var(--sc) 12%, transparent);
    color: var(--sc); border: 1px solid color-mix(in srgb, var(--sc) 30%, transparent);
  }
  .cp-status-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--sc); flex-shrink: 0; }

  /* ── Tags ────────────────────────────────── */
  .cp-tag { font-size: 0.7rem; padding: 2px 7px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: var(--text-secondary); text-transform: capitalize; }

  /* ── Orders layout ───────────────────────── */
  .cp-orders-layout { display: grid; grid-template-columns: 300px 1fr; gap: var(--space-5); align-items: start; }
  @media (max-width: 800px) { .cp-orders-layout { grid-template-columns: 1fr; } }

  .cp-order-list { display: flex; flex-direction: column; gap: var(--space-2); }
  .cp-order-card {
    display: flex; flex-direction: column; gap: var(--space-2);
    padding: var(--space-4); text-align: left; width: 100%;
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .cp-order-card:hover { border-color: rgba(212,76,67,0.35); }
  .cp-order-card.active { border-color: var(--brand); background: rgba(212,76,67,0.07); }
  .cp-order-card-top { display: flex; justify-content: space-between; align-items: baseline; }
  .cp-order-card-type { font-size: 0.9375rem; font-weight: 700; color: var(--text); text-transform: capitalize; }
  .cp-order-card-time { font-size: 0.72rem; color: var(--text-muted); }
  .cp-order-card-tags { display: flex; flex-wrap: wrap; gap: 4px; }

  /* ── Order / Invoice detail ──────────────── */
  .cp-order-detail {
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-6);
    position: sticky; top: var(--space-6);
    display: flex; flex-direction: column; gap: var(--space-5);
  }
  .cp-detail-top { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap; }
  .cp-detail-title { font-size: 1.25rem; font-weight: 800; color: var(--text); margin-bottom: 4px; }
  .cp-detail-date { font-size: 0.8125rem; color: var(--text-muted); }
  .cp-detail-section { display: flex; flex-direction: column; gap: var(--space-3); }
  .cp-detail-section-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }

  /* ── Timeline ────────────────────────────── */
  .cp-timeline { display: flex; flex-direction: column; }
  .cp-tl-step { display: flex; gap: var(--space-3); }
  .cp-tl-left { display: flex; flex-direction: column; align-items: center; }
  .cp-tl-dot {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid var(--border-light); background: var(--bg-card);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.25s;
  }
  .cp-tl-step.done .cp-tl-dot { background: var(--sc,var(--brand)); border-color: var(--sc,var(--brand)); }
  .cp-tl-step.active .cp-tl-dot { border-color: var(--sc,var(--brand)); background: color-mix(in srgb,var(--sc,var(--brand)) 15%,transparent); box-shadow: 0 0 0 3px color-mix(in srgb,var(--sc,var(--brand)) 15%,transparent); }
  .cp-tl-line { width: 2px; flex: 1; min-height: 14px; background: var(--border); margin: 3px 0; }
  .cp-tl-step.done .cp-tl-line { background: var(--sc,var(--brand)); }
  .cp-tl-body { padding: 1px 0 12px; }
  .cp-tl-label { font-size: 0.8125rem; font-weight: 600; color: var(--text-secondary); }
  .cp-tl-step.active .cp-tl-label { font-weight: 700; }
  .cp-tl-step.done .cp-tl-label { color: var(--text-muted); }
  .cp-tl-desc { font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; margin-top: 3px; }

  /* ── Spec grid ───────────────────────────── */
  .cp-spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
  @media (max-width: 500px) { .cp-spec-grid { grid-template-columns: 1fr; } }
  .cp-spec-pair { background: var(--glass-bg); border-radius: var(--radius); padding: var(--space-3) var(--space-4); }
  .cp-spec-key { display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
  .cp-spec-val { font-size: 0.875rem; font-weight: 600; color: var(--text); text-transform: capitalize; }
  .cp-notes-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; white-space: pre-wrap; }

  /* ── Invoice specifics ───────────────────── */
  .cp-inv-desc { font-size: 0.8125rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cp-inv-amount { font-size: 1.125rem; font-weight: 800; color: var(--text); }
  .cp-inv-hero {
    display: flex; align-items: center; gap: var(--space-4);
    background: color-mix(in srgb, var(--sc) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--sc) 20%, transparent);
    border-radius: var(--radius-lg); padding: var(--space-5);
  }
  .cp-inv-hero-icon {
    width: 44px; height: 44px; border-radius: var(--radius);
    background: color-mix(in srgb, var(--sc) 15%, transparent);
    display: flex; align-items: center; justify-content: center;
    color: var(--sc); flex-shrink: 0;
  }
  .cp-inv-hero-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
  .cp-inv-hero-amount { font-size: 1.75rem; font-weight: 900; color: var(--text); letter-spacing: -0.02em; }

  /* ── Help box ────────────────────────────── */
  .cp-help-box {
    background: rgba(212,76,67,0.06); border: 1px solid rgba(212,76,67,0.18);
    border-radius: var(--radius-lg); padding: var(--space-5);
    display: flex; align-items: center; justify-content: space-between;
    gap: var(--space-4); flex-wrap: wrap;
  }
  .cp-help-title { font-size: 0.9375rem; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .cp-help-sub { font-size: 0.8125rem; color: var(--text-muted); }
  .cp-help-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }
  .cp-help-btn { font-size: 0.8125rem; padding: 8px 14px; display: inline-flex; align-items: center; gap: 5px; }

  /* ── Auth ────────────────────────────────── */
  .cp-auth-wrap {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    padding: var(--space-6);
    background-image: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,76,67,0.07) 0%, transparent 55%);
  }
  .cp-auth-card {
    width: 100%; max-width: 420px;
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-10) var(--space-8);
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  }
  .cp-auth-logo { display: flex; justify-content: center; margin-bottom: var(--space-6); }
  .cp-auth-title { font-size: 1.5rem; font-weight: 800; color: var(--text); text-align: center; margin-bottom: var(--space-2); }
  .cp-auth-sub { font-size: 0.875rem; color: var(--text-secondary); text-align: center; line-height: 1.6; margin-bottom: var(--space-6); }
  .cp-auth-notice {
    display: flex; align-items: flex-start; gap: 8px;
    background: rgba(212,76,67,0.08); border: 1px solid rgba(212,76,67,0.2);
    border-radius: var(--radius); padding: var(--space-3) var(--space-4);
    font-size: 0.8125rem; line-height: 1.5; margin-bottom: var(--space-4);
    color: rgba(240,180,100,0.9);
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

  /* ── Calendly modal ──────────────────────── */
  .cp-modal-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: var(--space-4); animation: cpFadeIn 0.2s ease;
  }
  @keyframes cpFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .cp-modal {
    background: #111; border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); width: 100%; max-width: 780px;
    overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.7);
    animation: cpSlideUp 0.25s var(--ease);
  }
  @keyframes cpSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .cp-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--glass-border);
  }
  .cp-modal-title { font-size: 1rem; font-weight: 700; color: var(--text); }
  .cp-modal-close {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
    color: var(--text-secondary); cursor: pointer; transition: background 0.2s, color 0.2s;
  }
  .cp-modal-close:hover { background: rgba(255,255,255,0.1); color: var(--text); }

  /* ── Mobile back button (desktop: hidden) ── */
  .cp-mobile-back-btn { display: none; }

  /* ── Mobile top bar (desktop: hidden) ────── */
  .cp-mobile-topbar { display: none; }

  /* ── Bottom nav (desktop: hidden) ────────── */
  .cp-bottom-nav { display: none; }

  /* ── Mobile layout ────────────────────────── */
  @media (max-width: 700px) {
    /* Portal becomes a column so topbar sits above */
    .cp-portal { flex-direction: column; }

    /* Hide sidebar — replaced by bottom nav + top bar */
    .cp-sidebar { display: none; }

    /* Mobile top bar */
    .cp-mobile-topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px var(--space-4);
      padding-top: calc(10px + env(safe-area-inset-top));
      background: rgba(10,10,10,0.97);
      border-bottom: 1px solid var(--glass-border);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      position: sticky; top: 0; z-index: 50;
      flex-shrink: 0;
    }
    .cp-mobile-topbar-right {
      display: flex; align-items: center; gap: var(--space-2);
    }

    /* Main view */
    .cp-main {
      flex: 1; overflow-y: auto;
      padding-bottom: calc(72px + env(safe-area-inset-bottom));
    }

    /* Bottom tab nav */
    .cp-bottom-nav {
      display: flex; align-items: stretch;
      position: fixed; bottom: 0; left: 0; right: 0;
      height: calc(60px + env(safe-area-inset-bottom));
      padding-bottom: env(safe-area-inset-bottom);
      background: rgba(10,10,10,0.97);
      border-top: 1px solid var(--glass-border);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      z-index: 100;
    }
    .cp-bottom-nav-item {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 3px;
      background: none; border: none; cursor: pointer;
      color: var(--text-muted);
      transition: color 0.15s;
      padding: 6px 0;
      -webkit-tap-highlight-color: transparent;
    }
    .cp-bottom-nav-item.active { color: var(--brand); }
    .cp-bottom-nav-icon {
      position: relative; display: flex; align-items: center; justify-content: center;
    }
    .cp-bottom-nav-badge {
      position: absolute; top: -4px; right: -6px;
      background: var(--brand); color: #fff;
      font-size: 0.55rem; font-weight: 800;
      width: 14px; height: 14px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .cp-bottom-nav-label {
      font-size: 0.65rem; font-weight: 600; letter-spacing: 0.03em;
    }

    /* View padding */
    .cp-view { padding: var(--space-4) var(--space-4); }
    .cp-view-title { font-size: 1.3rem; }

    /* Stats row: horizontal scroll instead of stacking */
    .cp-stats-row {
      display: flex; overflow-x: auto; gap: var(--space-3);
      padding-bottom: 4px; scrollbar-width: none;
    }
    .cp-stats-row::-webkit-scrollbar { display: none; }
    .cp-stat-card { min-width: 130px; flex: 1; }

    /* Dashboard grid: single column */
    .cp-dash-grid { grid-template-columns: 1fr; }

    /* Orders/invoices: drill-down */
    .cp-orders-layout { grid-template-columns: 1fr; }
    .cp-orders-layout:not(.cp-detail-open) .cp-order-detail { display: none; }
    .cp-orders-layout.cp-detail-open .cp-order-list { display: none; }
    .cp-orders-layout.cp-detail-open .cp-order-detail { display: flex !important; }

    /* Mobile back button inside detail */
    .cp-mobile-back-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: none; cursor: pointer;
      color: var(--brand); font-size: 0.9rem; font-weight: 600;
      padding: 0 0 var(--space-4) 0;
      -webkit-tap-highlight-color: transparent;
    }

    /* Order cards: bigger tap targets */
    .cp-order-card { padding: var(--space-5); }
    .cp-quick-btn { padding: var(--space-4) var(--space-4); }

    /* Detail: no sticky on mobile */
    .cp-order-detail { position: static; }

    /* Help box: stack vertically */
    .cp-help-box { flex-direction: column; align-items: flex-start; }
    .cp-help-actions { width: 100%; }
    .cp-help-btn { flex: 1; justify-content: center; }

    /* Auth card: full width */
    .cp-auth-card { padding: var(--space-8) var(--space-5); }

    /* Calendly modal: full screen on mobile */
    .cp-modal { border-radius: var(--radius-lg) var(--radius-lg) 0 0; position: fixed; bottom: 0; left: 0; right: 0; max-width: 100%; }
    .cp-modal-overlay { align-items: flex-end; padding: 0; }
    .calendly-inline-widget { height: 70dvh !important; }
  }
`;
