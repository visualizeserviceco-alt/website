import { useState, useEffect, useCallback } from 'react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const ORDER_STATUSES = [
  { id: 'pending',   label: 'Pending',   color: '#f59e0b' },
  { id: 'reviewed',  label: 'Reviewed',  color: '#60a5fa' },
  { id: 'approved',  label: 'Approved',  color: '#a78bfa' },
  { id: 'sent',      label: 'Quote Sent', color: '#34d399' },
  { id: 'completed', label: 'Completed', color: '#22c55e' },
];

function formatDate(iso) {
  try { return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }); }
  catch { return iso; }
}
function formatDateShort(iso) {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  catch { return ''; }
}
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'just now';
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function StatusBadge({ status }) {
  const s = ORDER_STATUSES.find(x => x.id === status) || ORDER_STATUSES[0];
  return (
    <span className="adm-status-badge" style={{ '--sc': s.color }}>
      <span className="adm-status-dot" />
      {s.label}
    </span>
  );
}

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="adm-stat" style={accent ? { '--accent': accent } : {}}>
      <div className="adm-stat-top">
        <span className="adm-stat-icon" aria-hidden="true">{icon}</span>
        <span className="adm-stat-val">{value}</span>
      </div>
      <span className="adm-stat-label">{label}</span>
      {sub && <span className="adm-stat-sub">{sub}</span>}
    </div>
  );
}

function MiniBar({ data, max }) {
  return (
    <div className="adm-mini-bar">
      {data.map((d, i) => (
        <div key={i} className="adm-mini-bar-col" title={d.label}>
          <div className="adm-mini-bar-fill" style={{ height: max > 0 ? `${(d.value / max) * 100}%` : '0%' }} />
          <span className="adm-mini-bar-x">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Login screen ─────────────────────────────────────────────── */
function LoginScreen({ onAuth }) {
  const [pw, setPw]         = useState('');
  const [error, setError]   = useState(false);
  const [shaking, setShake] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onAuth(); return; }
    setError(true);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="adm-page">
      <div className="adm-login">
        <div className="adm-login-logo">
          <img src="/logo.svg" alt="Visualize" style={{ height: 32 }} />
        </div>
        <h1 className="adm-login-title">Admin Dashboard</h1>
        <p className="adm-login-sub">Visualize Studio — Internal</p>
        <form onSubmit={submit} className={`adm-login-form ${shaking ? 'adm-shake' : ''}`}>
          <input
            type="password"
            className={`adm-input ${error ? 'adm-input--error' : ''}`}
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false); }}
            placeholder="Enter password"
            autoFocus
          />
          {error && <p className="adm-pw-err">Incorrect password</p>}
          <button type="submit" className="btn btn-primary adm-login-btn">Access Dashboard</button>
        </form>
      </div>
      <style>{admStyles}</style>
    </div>
  );
}

/* ── Main dashboard ───────────────────────────────────────────── */
export default function PrintsAdmin() {
  const [auth, setAuth]         = useState(false);
  const [orders, setOrders]     = useState([]);
  const [detail, setDetail]     = useState(null);
  const [filter, setFilter]     = useState('all');
  const [tab, setTab]           = useState('orders'); // 'overview' | 'orders'
  const [search, setSearch]     = useState('');
  const [analytics, setAnalytics] = useState({ pageViews: 0, uniqueVisits: 0, topPages: [], dailyViews: [] });

  const loadOrders = useCallback(() => {
    try { setOrders(JSON.parse(localStorage.getItem('vz_print_orders') || '[]')); }
    catch { setOrders([]); }
  }, []);

  const loadAnalytics = useCallback(() => {
    try {
      const raw  = JSON.parse(localStorage.getItem('vz_analytics') || '{"views":[],"sessions":[]}');
      const views = raw.views || [];
      const sessions = raw.sessions || [];

      // Group by page
      const pageMap = {};
      views.forEach(v => { pageMap[v.page] = (pageMap[v.page] || 0) + 1; });
      const topPages = Object.entries(pageMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([page, count]) => ({ page, count }));

      // Group by day (last 7 days)
      const now = Date.now();
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now - (6 - i) * 86400000);
        return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), value: 0, ts: d.setHours(0,0,0,0) };
      });
      views.forEach(v => {
        const vDay = new Date(v.ts).setHours(0,0,0,0);
        const slot = days.find(d => d.ts === vDay);
        if (slot) slot.value++;
      });

      setAnalytics({
        pageViews:    views.length,
        uniqueVisits: sessions.length,
        topPages,
        dailyViews:   days,
      });
    } catch { /* no analytics yet */ }
  }, []);

  useEffect(() => {
    if (!auth) return;
    loadOrders();
    loadAnalytics();
  }, [auth, loadOrders, loadAnalytics]);

  // Track this visit
  useEffect(() => {
    try {
      const key = 'vz_analytics';
      const raw = JSON.parse(localStorage.getItem(key) || '{"views":[],"sessions":[]}');
      raw.views = [...(raw.views || []), { page: window.location.pathname, ts: Date.now() }].slice(-500);
      const sid = sessionStorage.getItem('vz_sid');
      if (!sid) {
        sessionStorage.setItem('vz_sid', '1');
        raw.sessions = [...(raw.sessions || []), { ts: Date.now() }].slice(-200);
      }
      localStorage.setItem(key, JSON.stringify(raw));
    } catch { /* silent */ }
  }, []);

  const updateStatus = (id, status) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('vz_print_orders', JSON.stringify(updated));
    if (detail?.id === id) setDetail(prev => ({ ...prev, status }));
  };

  const deleteOrder = (id) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    localStorage.setItem('vz_print_orders', JSON.stringify(updated));
    if (detail?.id === id) setDetail(null);
  };

  if (!auth) return <LoginScreen onAuth={() => setAuth(true)} />;

  // Derived stats
  const statusCounts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s.id] = orders.filter(o => (o.status || 'pending') === s.id).length;
    return acc;
  }, {});
  const newToday = orders.filter(o => {
    const d = new Date(o.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || (o.status || 'pending') === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || (o.name || '').toLowerCase().includes(q) || (o.email || '').toLowerCase().includes(q) || (o.type || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const maxDay = Math.max(...analytics.dailyViews.map(d => d.value), 1);

  return (
    <div className="adm-page">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <img src="/logo.svg" alt="Visualize" style={{ height: 28 }} />
        </div>
        <nav className="adm-sidebar-nav">
          {[
            { id: 'overview', label: 'Overview', icon: (
              <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            )},
            { id: 'orders', label: 'Orders', icon: (
              <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                <path d="M4 6h12M4 10h8M4 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ), badge: statusCounts.pending || null },
          ].map(item => (
            <button
              key={item.id}
              type="button"
              className={`adm-nav-item ${tab === item.id ? 'adm-nav-item--active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              {item.icon}
              {item.label}
              {item.badge ? <span className="adm-nav-badge">{item.badge}</span> : null}
            </button>
          ))}
        </nav>
        <button className="adm-logout" onClick={() => setAuth(false)}>
          <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
            <path d="M13 3h4v14h-4M9 14l4-4-4-4M13 10H5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Log out
        </button>
      </aside>

      {/* ── Main content ───────────────────────── */}
      <main className="adm-main">

        {/* ── Overview tab ─────────────────────── */}
        {tab === 'overview' && (
          <div className="adm-content">
            <div className="adm-topbar">
              <div>
                <h1 className="adm-title">Overview</h1>
                <p className="adm-subtitle">Visualize Studio Dashboard</p>
              </div>
              <button className="adm-refresh" onClick={() => { loadOrders(); loadAnalytics(); }} title="Refresh">
                <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                  <path d="M17 10A7 7 0 116.07 4.5M17 10V5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Refresh
              </button>
            </div>

            {/* Stat cards */}
            <div className="adm-stats-grid">
              <StatCard
                label="Total Orders"
                value={orders.length}
                sub={newToday > 0 ? `+${newToday} today` : 'No new today'}
                accent="var(--brand)"
                icon={<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M4 6h12M4 10h8M4 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
              />
              <StatCard
                label="Pending Review"
                value={statusCounts.pending || 0}
                accent="#f59e0b"
                icon={<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" /><path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
              />
              <StatCard
                label="Completed"
                value={statusCounts.completed || 0}
                accent="#22c55e"
                icon={<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              />
              <StatCard
                label="Page Views"
                value={analytics.pageViews}
                sub={`${analytics.uniqueVisits} sessions`}
                accent="#60a5fa"
                icon={<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.6" /><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /></svg>}
              />
            </div>

            {/* Charts row */}
            <div className="adm-charts-row">
              {/* Daily views chart */}
              <div className="adm-panel">
                <h3 className="adm-panel-title">Page Views — Last 7 Days</h3>
                <MiniBar data={analytics.dailyViews} max={maxDay} />
                {analytics.pageViews === 0 && (
                  <p className="adm-panel-empty">Analytics are recorded as visitors browse the site.</p>
                )}
              </div>

              {/* Order status breakdown */}
              <div className="adm-panel">
                <h3 className="adm-panel-title">Order Status Breakdown</h3>
                <div className="adm-status-list">
                  {ORDER_STATUSES.map(s => (
                    <div key={s.id} className="adm-status-row">
                      <div className="adm-status-row-left">
                        <span className="adm-status-bar-dot" style={{ background: s.color }} />
                        <span className="adm-status-row-label">{s.label}</span>
                      </div>
                      <div className="adm-status-row-right">
                        <div className="adm-status-track">
                          <div
                            className="adm-status-fill"
                            style={{
                              width: orders.length ? `${((statusCounts[s.id] || 0) / orders.length) * 100}%` : '0%',
                              background: s.color,
                            }}
                          />
                        </div>
                        <span className="adm-status-count">{statusCounts[s.id] || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {orders.length === 0 && <p className="adm-panel-empty">No orders yet.</p>}
              </div>
            </div>

            {/* Top pages */}
            {analytics.topPages.length > 0 && (
              <div className="adm-panel adm-panel--full">
                <h3 className="adm-panel-title">Top Pages</h3>
                <div className="adm-top-pages">
                  {analytics.topPages.map((p, i) => (
                    <div key={p.page} className="adm-top-page-row">
                      <span className="adm-top-page-rank">#{i + 1}</span>
                      <span className="adm-top-page-path">{p.page || '/'}</span>
                      <span className="adm-top-page-count">{p.count} views</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent orders */}
            {orders.length > 0 && (
              <div className="adm-panel adm-panel--full">
                <div className="adm-panel-head">
                  <h3 className="adm-panel-title">Recent Orders</h3>
                  <button className="adm-see-all" onClick={() => setTab('orders')}>See all →</button>
                </div>
                <div className="adm-recent-list">
                  {orders.slice(0, 5).map(o => (
                    <div
                      key={o.id}
                      className="adm-recent-row"
                      onClick={() => { setDetail(o); setTab('orders'); }}
                    >
                      <div className="adm-recent-left">
                        <span className="adm-recent-name">{o.name || 'Unknown'}</span>
                        <span className="adm-recent-info">{o.type} · {o.quantity && `${o.quantity} units`} · {o.finish}</span>
                      </div>
                      <div className="adm-recent-right">
                        <StatusBadge status={o.status || 'pending'} />
                        <span className="adm-recent-time">{timeAgo(o.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Orders tab ───────────────────────── */}
        {tab === 'orders' && (
          <div className="adm-content">
            <div className="adm-topbar">
              <div>
                <h1 className="adm-title">Orders</h1>
                <p className="adm-subtitle">{orders.length} total · {statusCounts.pending || 0} pending</p>
              </div>
            </div>

            {/* Filter + search bar */}
            <div className="adm-filters">
              <div className="adm-filter-tabs">
                {[{ id: 'all', label: 'All' }, ...ORDER_STATUSES].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`adm-filter-tab ${filter === s.id ? 'active' : ''}`}
                    onClick={() => setFilter(s.id)}
                  >
                    {s.label}
                    <span className="adm-filter-count">
                      {s.id === 'all' ? orders.length : statusCounts[s.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
              <input
                className="adm-search"
                placeholder="Search by name, email, type…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {orders.length === 0 ? (
              <div className="adm-empty">
                <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
                  <rect x="8" y="10" width="32" height="28" rx="4" stroke="var(--text-muted)" strokeWidth="2" />
                  <path d="M16 18h16M16 24h10M16 30h8" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p>No orders yet. They&apos;ll appear here once customers submit a quote request.</p>
              </div>
            ) : (
              <div className="adm-layout">
                {/* Order list */}
                <div className="adm-list">
                  {filtered.length === 0 ? (
                    <p className="adm-no-results">No orders match your filters.</p>
                  ) : filtered.map(o => (
                    <button
                      key={o.id}
                      type="button"
                      className={`adm-row ${detail?.id === o.id ? 'adm-row--active' : ''}`}
                      onClick={() => setDetail(o)}
                    >
                      <div className="adm-row-top">
                        <strong className="adm-row-name">{o.name || 'Unknown'}</strong>
                        <span className="adm-row-date">{formatDateShort(o.date)}</span>
                      </div>
                      <div className="adm-row-mid">
                        {o.type && <span className="adm-chip">{o.type}</span>}
                        {o.quantity && <span className="adm-chip">{o.quantity} units</span>}
                        {o.finish && <span className="adm-chip">{o.finish}</span>}
                      </div>
                      <StatusBadge status={o.status || 'pending'} />
                    </button>
                  ))}
                </div>

                {/* Detail panel */}
                <div className="adm-detail">
                  {detail ? (
                    <>
                      <div className="adm-detail-header">
                        <div>
                          <h2 className="adm-detail-name">{detail.name}</h2>
                          <p className="adm-detail-date">{formatDate(detail.date)}</p>
                        </div>
                        <button className="adm-delete" onClick={() => deleteOrder(detail.id)}>
                          <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                            <path d="M2 4h12M5 4V3h6v1M6 7v5M10 7v5M3 4l1 9h8l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                          Delete
                        </button>
                      </div>

                      {/* Status picker */}
                      <div className="adm-status-picker">
                        <p className="adm-detail-section">Order Status</p>
                        <div className="adm-status-options">
                          {ORDER_STATUSES.map(s => (
                            <button
                              key={s.id}
                              type="button"
                              className={`adm-status-opt ${(detail.status || 'pending') === s.id ? 'active' : ''}`}
                              style={{ '--sc': s.color }}
                              onClick={() => updateStatus(detail.id, s.id)}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Order specs */}
                      <div className="adm-detail-grid">
                        {[
                          ['Product Type', detail.type],
                          ['Shape',        detail.shape],
                          ['Size',         detail.size],
                          ['Quantity',     detail.quantity ? `${detail.quantity} units` : null],
                          ['Finish',       detail.finish],
                          ['Design',       detail.design],
                        ].filter(([,v]) => v).map(([k, v]) => (
                          <div key={k} className="adm-detail-pair">
                            <span className="adm-detail-key">{k}</span>
                            <span className="adm-detail-val">{v}</span>
                          </div>
                        ))}
                      </div>

                      {/* Contact */}
                      <div className="adm-detail-contact">
                        <p className="adm-detail-section">Contact Info</p>
                        <div className="adm-contact-rows">
                          <div className="adm-contact-row">
                            <span className="adm-contact-key">Email</span>
                            <a href={`mailto:${detail.email}`} className="adm-contact-val">{detail.email}</a>
                          </div>
                          {detail.phone && (
                            <div className="adm-contact-row">
                              <span className="adm-contact-key">Phone</span>
                              <a href={`tel:${detail.phone}`} className="adm-contact-val">{detail.phone}</a>
                            </div>
                          )}
                        </div>
                      </div>

                      {detail.notes && (
                        <div className="adm-detail-notes">
                          <p className="adm-detail-section">Notes</p>
                          <p className="adm-notes-text">{detail.notes}</p>
                        </div>
                      )}

                      {/* Quick actions */}
                      <div className="adm-quick-actions">
                        <a
                          href={`mailto:${detail.email}?subject=Your Custom Print Quote — Visualize Studio&body=Hi ${detail.name},%0A%0AThanks for your order request. Here's your quote for ${detail.type} (${detail.size || ''}, ${detail.quantity || ''} units, ${detail.finish || ''} finish):%0A%0A[Insert quote details here]%0A%0ABest,%0AVisualize Studio`}
                          className="btn btn-primary adm-action-btn"
                        >
                          <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                            <path d="M2 4h16v12H2V4zm0 0l8 7 8-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Send Quote Email
                        </a>
                        {detail.phone && (
                          <a href={`sms:${detail.phone}`} className="btn btn-secondary adm-action-btn">
                            <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                              <path d="M2 3h16v11H2V3zm4 14l4-3 4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Text Client
                          </a>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="adm-detail-empty">
                      <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
                        <rect x="8" y="8" width="32" height="32" rx="6" stroke="var(--text-muted)" strokeWidth="1.8" />
                        <path d="M16 18h16M16 24h10" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      <p>Select an order to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{admStyles}</style>
    </div>
  );
}

const admStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-page {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    font-family: 'Inter', -apple-system, sans-serif;
  }

  /* ── Login ───────────────────────────────── */
  .adm-login {
    max-width: 360px;
    margin: auto;
    padding: var(--space-10) var(--space-8);
    background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    text-align: center;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  }
  .adm-login-logo { display: flex; justify-content: center; margin-bottom: var(--space-6); }
  .adm-login-title { font-size: 1.4rem; font-weight: 800; color: var(--text); margin-bottom: var(--space-1); }
  .adm-login-sub { font-size: 0.8125rem; color: var(--text-muted); margin-bottom: var(--space-6); }
  .adm-login-form { display: flex; flex-direction: column; gap: var(--space-3); }
  .adm-input {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius); border: 1px solid var(--border-light);
    background: var(--glass-bg); color: var(--text);
    font-size: 0.9375rem; font-family: inherit; outline: none;
    text-align: center; width: 100%; transition: border-color 0.2s;
  }
  .adm-input:focus { border-color: var(--brand); }
  .adm-input--error { border-color: rgba(220,80,80,0.7); }
  .adm-pw-err { font-size: 0.8rem; color: rgba(220,80,80,0.9); }
  .adm-login-btn { width: 100%; padding: var(--space-3); }
  @keyframes admShake {
    0%,100% { transform: translateX(0); }
    15%,55%  { transform: translateX(-7px); }
    35%,75%  { transform: translateX(7px); }
  }
  .adm-shake { animation: admShake 0.5s ease; }

  /* ── Sidebar ─────────────────────────────── */
  .adm-sidebar {
    width: 220px;
    flex-shrink: 0;
    background: rgba(12,12,12,0.95);
    border-right: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    padding: var(--space-6) var(--space-4);
    position: sticky;
    top: 0;
    height: 100vh;
  }
  .adm-sidebar-logo {
    padding: var(--space-2) var(--space-2) var(--space-8);
  }
  .adm-sidebar-nav {
    display: flex; flex-direction: column; gap: var(--space-1); flex: 1;
  }
  .adm-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius);
    background: none; border: none; cursor: pointer;
    font-size: 0.875rem; font-weight: 500; color: var(--text-muted);
    text-align: left; width: 100%;
    transition: background 0.2s, color 0.2s;
  }
  .adm-nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text-secondary); }
  .adm-nav-item--active { background: rgba(212,76,67,0.1); color: var(--text); border-left: 2px solid var(--brand); }
  .adm-nav-badge {
    margin-left: auto;
    font-size: 0.65rem; font-weight: 700;
    background: var(--brand); color: #fff;
    padding: 1px 6px; border-radius: 999px; min-width: 18px; text-align: center;
  }
  .adm-logout {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 12px; border-radius: var(--radius);
    background: none; border: 1px solid var(--glass-border);
    color: var(--text-muted); font-size: 0.8125rem;
    cursor: pointer; margin-top: var(--space-4);
    transition: color 0.2s, border-color 0.2s;
  }
  .adm-logout:hover { color: var(--text); border-color: var(--text-muted); }

  /* ── Main ────────────────────────────────── */
  .adm-main { flex: 1; overflow-y: auto; }
  .adm-content { max-width: 1040px; padding: var(--space-8); }
  .adm-topbar {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: var(--space-8); gap: var(--space-4);
  }
  .adm-title { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }
  .adm-subtitle { font-size: 0.875rem; color: var(--text-muted); margin-top: 3px; }
  .adm-refresh {
    display: flex; align-items: center; gap: 6px;
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    color: var(--text-secondary); font-size: 0.8125rem;
    padding: 7px 12px; border-radius: var(--radius);
    cursor: pointer; transition: color 0.2s; white-space: nowrap;
  }
  .adm-refresh:hover { color: var(--text); }

  /* ── Stat cards ──────────────────────────── */
  .adm-stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: var(--space-4); margin-bottom: var(--space-6);
  }
  @media (max-width: 900px) { .adm-stats-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px) { .adm-stats-grid { grid-template-columns: 1fr 1fr; } }

  .adm-stat {
    background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .adm-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .adm-stat-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: var(--space-3);
  }
  .adm-stat-icon { color: var(--accent, var(--text-muted)); opacity: 0.8; }
  .adm-stat-val { font-size: 2rem; font-weight: 900; color: var(--accent, var(--text)); letter-spacing: -0.03em; }
  .adm-stat-label { font-size: 0.8125rem; color: var(--text-secondary); display: block; }
  .adm-stat-sub { font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 3px; }

  /* ── Charts ──────────────────────────────── */
  .adm-charts-row {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: var(--space-4); margin-bottom: var(--space-4);
  }
  @media (max-width: 780px) { .adm-charts-row { grid-template-columns: 1fr; } }

  .adm-panel {
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-5);
  }
  .adm-panel--full { margin-bottom: var(--space-4); }
  .adm-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); }
  .adm-panel-title { font-size: 0.875rem; font-weight: 700; color: var(--text); margin-bottom: var(--space-4); }
  .adm-panel-empty { font-size: 0.8125rem; color: var(--text-muted); margin-top: var(--space-3); }
  .adm-see-all { background: none; border: none; color: var(--brand); font-size: 0.8125rem; cursor: pointer; font-weight: 600; }

  /* Bar chart */
  .adm-mini-bar {
    display: flex; align-items: flex-end; gap: 6px;
    height: 100px;
  }
  .adm-mini-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
  .adm-mini-bar-fill {
    width: 100%; min-height: 2px;
    background: linear-gradient(180deg, var(--brand-light), var(--brand));
    border-radius: 3px 3px 0 0;
    transition: height 0.4s var(--ease);
  }
  .adm-mini-bar-x { font-size: 0.6rem; color: var(--text-muted); }

  /* Status breakdown */
  .adm-status-list { display: flex; flex-direction: column; gap: var(--space-3); }
  .adm-status-row { display: flex; align-items: center; gap: var(--space-3); }
  .adm-status-row-left { display: flex; align-items: center; gap: 8px; min-width: 100px; }
  .adm-status-bar-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .adm-status-row-label { font-size: 0.8125rem; color: var(--text-secondary); }
  .adm-status-row-right { flex: 1; display: flex; align-items: center; gap: var(--space-2); }
  .adm-status-track { flex: 1; height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
  .adm-status-fill { height: 100%; border-radius: 2px; min-width: 2px; transition: width 0.4s var(--ease); }
  .adm-status-count { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); min-width: 20px; text-align: right; }

  /* Top pages */
  .adm-top-pages { display: flex; flex-direction: column; gap: var(--space-2); }
  .adm-top-page-row { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--glass-border); }
  .adm-top-page-row:last-child { border-bottom: none; }
  .adm-top-page-rank { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); min-width: 28px; }
  .adm-top-page-path { flex: 1; font-size: 0.875rem; color: var(--text); font-family: monospace; }
  .adm-top-page-count { font-size: 0.8125rem; color: var(--text-muted); }

  /* Recent orders */
  .adm-recent-list { display: flex; flex-direction: column; }
  .adm-recent-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--space-3) var(--space-2); gap: var(--space-3);
    border-bottom: 1px solid var(--glass-border); cursor: pointer;
    border-radius: var(--radius); transition: background 0.15s;
  }
  .adm-recent-row:last-child { border-bottom: none; }
  .adm-recent-row:hover { background: rgba(255,255,255,0.03); }
  .adm-recent-left { flex: 1; min-width: 0; }
  .adm-recent-name { display: block; font-size: 0.9rem; font-weight: 600; color: var(--text); }
  .adm-recent-info { display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .adm-recent-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .adm-recent-time { font-size: 0.72rem; color: var(--text-muted); }

  /* ── Status badge ────────────────────────── */
  .adm-status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
    padding: 3px 8px; border-radius: 999px;
    background: color-mix(in srgb, var(--sc) 12%, transparent);
    color: var(--sc);
    border: 1px solid color-mix(in srgb, var(--sc) 30%, transparent);
    white-space: nowrap;
  }
  .adm-status-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--sc);
    flex-shrink: 0;
  }

  /* ── Orders list ─────────────────────────── */
  .adm-filters {
    display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
    margin-bottom: var(--space-5); flex-wrap: wrap;
  }
  .adm-filter-tabs { display: flex; gap: var(--space-1); flex-wrap: wrap; }
  .adm-filter-tab {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 999px;
    background: none; border: 1px solid var(--glass-border);
    color: var(--text-muted); font-size: 0.8rem; cursor: pointer;
    transition: all 0.2s; white-space: nowrap;
  }
  .adm-filter-tab:hover { color: var(--text); border-color: var(--text-muted); }
  .adm-filter-tab.active { background: rgba(212,76,67,0.1); border-color: rgba(212,76,67,0.4); color: var(--text); }
  .adm-filter-count { font-size: 0.65rem; color: var(--text-muted); }
  .adm-search {
    padding: 8px 14px; border-radius: var(--radius);
    border: 1px solid var(--border-light);
    background: var(--glass-bg); color: var(--text);
    font-size: 0.875rem; font-family: inherit; outline: none;
    min-width: 200px; transition: border-color 0.2s;
  }
  .adm-search:focus { border-color: var(--brand); }
  @media (max-width: 600px) { .adm-search { width: 100%; } }

  .adm-layout { display: grid; grid-template-columns: 300px 1fr; gap: var(--space-5); align-items: start; }
  @media (max-width: 800px) { .adm-layout { grid-template-columns: 1fr; } }

  .adm-list { display: flex; flex-direction: column; gap: var(--space-2); }
  .adm-no-results { font-size: 0.875rem; color: var(--text-muted); padding: var(--space-4); }

  .adm-row {
    display: flex; flex-direction: column; gap: var(--space-2);
    padding: var(--space-4);
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); cursor: pointer;
    text-align: left; width: 100%;
    transition: border-color 0.2s, background 0.2s;
  }
  .adm-row:hover { border-color: rgba(212,76,67,0.4); }
  .adm-row--active { border-color: var(--brand); background: rgba(212,76,67,0.07); }
  .adm-row-top { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-2); }
  .adm-row-name { font-size: 0.9rem; font-weight: 700; color: var(--text); }
  .adm-row-date { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }
  .adm-row-mid { display: flex; flex-wrap: wrap; gap: 4px; }
  .adm-chip {
    font-size: 0.7rem; font-weight: 600;
    padding: 2px 7px; border-radius: 999px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    color: var(--text-secondary); text-transform: capitalize;
  }

  /* ── Detail panel ────────────────────────── */
  .adm-detail {
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-6); min-height: 320px;
    position: sticky; top: var(--space-8);
  }
  .adm-detail-empty {
    height: 200px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: var(--space-3);
    color: var(--text-muted); font-size: 0.875rem; text-align: center;
  }
  .adm-detail-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: var(--space-4); gap: var(--space-3);
  }
  .adm-detail-name { font-size: 1.2rem; font-weight: 800; color: var(--text); }
  .adm-detail-date { font-size: 0.8rem; color: var(--text-muted); margin-top: 3px; }
  .adm-delete {
    display: flex; align-items: center; gap: 5px; flex-shrink: 0;
    background: none; border: 1px solid rgba(180,50,50,0.3);
    color: rgba(220,80,80,0.8); font-size: 0.8rem;
    padding: 5px 10px; border-radius: var(--radius); cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .adm-delete:hover { color: #f87171; border-color: rgba(220,80,80,0.6); }
  .adm-detail-section { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: var(--space-2); }

  /* Status picker */
  .adm-status-picker { margin-bottom: var(--space-5); }
  .adm-status-options { display: flex; flex-wrap: wrap; gap: var(--space-2); }
  .adm-status-opt {
    font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 999px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    color: var(--text-muted); cursor: pointer; transition: all 0.2s;
  }
  .adm-status-opt:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
  .adm-status-opt.active {
    background: color-mix(in srgb, var(--sc) 15%, transparent);
    border-color: color-mix(in srgb, var(--sc) 40%, transparent);
    color: var(--sc);
  }

  /* Specs grid */
  .adm-detail-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: var(--space-3); margin-bottom: var(--space-5);
  }
  .adm-detail-pair {
    background: var(--glass-bg); border-radius: var(--radius);
    padding: var(--space-3) var(--space-4);
  }
  .adm-detail-key { display: block; font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
  .adm-detail-val { font-size: 0.9rem; font-weight: 600; color: var(--text); text-transform: capitalize; }

  /* Contact */
  .adm-detail-contact { margin-bottom: var(--space-5); }
  .adm-contact-rows { display: flex; flex-direction: column; gap: var(--space-2); }
  .adm-contact-row { display: flex; gap: var(--space-3); align-items: center; }
  .adm-contact-key { font-size: 0.8rem; color: var(--text-muted); min-width: 44px; }
  .adm-contact-val { font-size: 0.9rem; color: var(--brand); font-weight: 600; }
  .adm-contact-val:hover { text-decoration: underline; }

  /* Notes */
  .adm-detail-notes { margin-bottom: var(--space-5); }
  .adm-notes-text { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; white-space: pre-wrap; }

  /* Quick actions */
  .adm-quick-actions {
    display: flex; gap: var(--space-3); flex-wrap: wrap;
    padding-top: var(--space-5); border-top: 1px solid var(--glass-border);
  }
  .adm-action-btn { font-size: 0.8125rem; padding: 8px 14px; display: flex; align-items: center; gap: 6px; }

  /* Empty state */
  .adm-empty {
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-16);
    text-align: center; color: var(--text-secondary);
    display: flex; flex-direction: column; align-items: center; gap: var(--space-4);
  }

  /* Mobile sidebar collapse */
  @media (max-width: 700px) {
    .adm-sidebar { width: 60px; padding: var(--space-4) var(--space-2); }
    .adm-sidebar-logo img { height: 22px; }
    .adm-nav-item span:last-child { display: none; }
    .adm-nav-badge { display: none; }
    .adm-logout span { display: none; }
    .adm-content { padding: var(--space-5) var(--space-4); }
  }
`;
