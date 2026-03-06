import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/showcase', label: 'Work' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="navbar">
      <div className="wrap navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <img src="/logo.svg" alt="Visualize" />
          <span>Visualize</span>
        </Link>
        <button
          type="button"
          className="navbar-toggle"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`navbar-nav ${open ? 'is-open' : ''}`}>
          <ul>
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} onClick={() => setOpen(false)}>{label}</Link>
              </li>
            ))}
            <li>
              <a href="/contact#book" className="btn btn-primary" onClick={() => setOpen(false)}>
                Book a Consultation
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 10, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text);
          font-weight: 700;
          font-size: 1.125rem;
        }
        .navbar-logo img {
          height: 28px;
          width: auto;
        }
        .navbar-toggle {
          display: none;
          flex-direction: column;
          gap: 6px;
          padding: var(--space-2);
          background: none;
          border: none;
          color: var(--text);
        }
        .navbar-toggle span {
          width: 24px;
          height: 2px;
          background: currentColor;
          border-radius: 1px;
          transition: transform var(--duration) var(--ease), opacity var(--duration) var(--ease);
        }
        .navbar-nav ul {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          list-style: none;
        }
        .navbar-nav a {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color var(--duration) var(--ease);
        }
        .navbar-nav a:hover {
          color: var(--text);
        }
        .navbar-nav .btn-primary {
          padding: var(--space-2) var(--space-4);
          font-size: 0.875rem;
        }
        @media (max-width: 768px) {
          .navbar-toggle { display: flex; }
          .navbar-nav {
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            max-width: 320px;
            height: 100vh;
            background: var(--bg-elevated);
            border-left: 1px solid var(--border);
            padding: var(--space-24) var(--space-6);
            transform: translateX(100%);
            transition: transform var(--duration) var(--ease);
          }
          .navbar-nav.is-open { transform: translateX(0); }
          .navbar-nav ul {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-6);
          }
        }
      `}</style>
    </header>
  );
}
