import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location                = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const links = [
    { to: '/',         label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/showcase', label: 'Work' },
    { to: '/book',     label: 'Contact' },
  ];

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar-pill">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
            <img src="/logo.svg" alt="Visualize Studio" />
          </Link>

          {/* Desktop nav */}
          <nav className="navbar-nav" aria-label="Main navigation">
            <ul>
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`navbar-link ${isActive(to) ? 'navbar-link--active' : ''}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA */}
          <a href="/book" className="btn btn-primary navbar-cta">
            Book a Consultation
          </a>

          {/* Mobile burger */}
          <button
            type="button"
            className={`navbar-burger ${open ? 'is-open' : ''}`}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(o => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={`navbar-overlay ${open ? 'is-visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <nav
        className={`navbar-drawer ${open ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="navbar-drawer-header">
          <img src="/logo.svg" alt="Visualize Studio" className="navbar-drawer-logo" />
          <button
            type="button"
            className="navbar-drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="navbar-drawer-links">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`navbar-drawer-link ${isActive(to) ? 'navbar-drawer-link--active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {label}
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="16" height="16">
                  <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <a href="/book" className="btn btn-primary navbar-drawer-cta" onClick={() => setOpen(false)}>
          Book a Consultation
        </a>

        <p className="navbar-drawer-contact">
          Call or text{' '}
          <a href="tel:+13024687077">(302) 468-7077</a>
        </p>
      </nav>

      <style>{`
        /* ── Pill container ────────────────────────────── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 200;
          padding: 12px var(--space-6);
          transition: padding 0.3s var(--ease);
        }
        .navbar--scrolled { padding: 8px var(--space-6); }

        .navbar-pill {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: var(--space-6);
          padding: 0 var(--space-5);
          height: 52px;
          background: rgba(14, 14, 14, 0.72);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 999px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset;
          transition: background 0.3s var(--ease), box-shadow 0.3s var(--ease);
        }
        .navbar--scrolled .navbar-pill {
          background: rgba(10, 10, 10, 0.88);
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset;
        }

        /* Logo */
        .navbar-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .navbar-logo img {
          height: 26px;
          width: auto;
          display: block;
        }

        /* Desktop nav */
        .navbar-nav { flex: 1; }
        .navbar-nav ul {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          list-style: none;
        }
        .navbar-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          padding: 6px 12px;
          border-radius: 999px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .navbar-link:hover { color: var(--text); background: rgba(255,255,255,0.06); }
        .navbar-link--active { color: var(--text); background: rgba(255,255,255,0.08); }

        /* CTA button */
        .navbar-cta {
          flex-shrink: 0;
          font-size: 0.8125rem;
          padding: 7px 16px;
          white-space: nowrap;
        }

        /* Burger */
        .navbar-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          padding: 6px;
          background: none;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
        }
        .navbar-burger span {
          display: block;
          height: 2px;
          background: var(--text-secondary);
          border-radius: 1px;
          transition: transform 0.25s var(--ease), opacity 0.25s, width 0.25s;
          transform-origin: center;
        }
        .navbar-burger span:nth-child(1) { width: 22px; }
        .navbar-burger span:nth-child(2) { width: 16px; }
        .navbar-burger span:nth-child(3) { width: 22px; }
        .navbar-burger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); width: 22px; }
        .navbar-burger.is-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .navbar-burger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); width: 22px; }

        /* ── Mobile overlay ────────────────────────────── */
        .navbar-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 210;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s var(--ease);
        }
        .navbar-overlay.is-visible { opacity: 1; pointer-events: all; }

        /* ── Mobile drawer ─────────────────────────────── */
        .navbar-drawer {
          position: fixed;
          top: 0; right: 0;
          width: min(320px, 85vw);
          height: 100dvh;
          background: rgba(12, 12, 12, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid rgba(255,255,255,0.07);
          z-index: 220;
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
          box-shadow: -20px 0 60px rgba(0,0,0,0.4);
        }
        .navbar-drawer.is-open { transform: translateX(0); }

        .navbar-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-10);
        }
        .navbar-drawer-logo { height: 28px; width: auto; }
        .navbar-drawer-close {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-secondary);
          transition: background 0.2s, color 0.2s;
        }
        .navbar-drawer-close svg { width: 16px; height: 16px; }
        .navbar-drawer-close:hover { background: rgba(255,255,255,0.1); color: var(--text); }

        .navbar-drawer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          flex: 1;
        }
        .navbar-drawer-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 1.0625rem;
          font-weight: 500;
          color: var(--text-secondary);
          padding: var(--space-4) var(--space-3);
          border-radius: var(--radius);
          transition: color 0.2s, background 0.2s, padding-left 0.2s;
        }
        .navbar-drawer-link:hover {
          color: var(--text);
          background: rgba(255,255,255,0.05);
          padding-left: var(--space-4);
        }
        .navbar-drawer-link--active {
          color: var(--text);
          background: rgba(212,76,67,0.1);
          border-left: 2px solid var(--brand);
        }
        .navbar-drawer-link svg { opacity: 0.4; transition: opacity 0.2s, transform 0.2s; }
        .navbar-drawer-link:hover svg { opacity: 0.7; transform: translateX(3px); }

        .navbar-drawer-cta {
          width: 100%;
          padding: var(--space-4);
          font-size: 0.9375rem;
          margin-top: var(--space-6);
          border-radius: var(--radius-lg);
        }
        .navbar-drawer-contact {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: var(--space-4);
        }
        .navbar-drawer-contact a { color: var(--brand); font-weight: 600; }

        /* ── Mobile breakpoint ─────────────────────────── */
        @media (max-width: 768px) {
          .navbar { padding: 10px var(--space-4); }
          .navbar-nav { display: none; }
          .navbar-cta { display: none; }
          .navbar-burger { display: flex; }
          .navbar-pill { gap: var(--space-3); padding: 0 var(--space-4); }
        }
      `}</style>
    </>
  );
}
