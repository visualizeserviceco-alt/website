import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/logo.svg" alt="Visualize" />
            <span>Visualize</span>
          </Link>
          <p className="footer-tagline">Performance Marketing & Brand Development</p>
        </div>
        <div className="footer-links">
          <nav>
            <Link to="/services">Services</Link>
            <Link to="/showcase">Work</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <a href="https://www.instagram.com/visualizetm/" target="_blank" rel="noopener noreferrer" className="footer-social">
            Instagram
          </a>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Visualize. All rights reserved.</p>
      </div>
      <style>{`
        .footer {
          background: var(--bg-elevated);
          border-top: 1px solid var(--border);
          padding: var(--space-16) 0 var(--space-8);
        }
        .footer-inner {
          display: grid;
          gap: var(--space-8);
        }
        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text);
          font-weight: 700;
          font-size: 1.125rem;
        }
        .footer-logo img { height: 24px; width: auto; }
        .footer-tagline {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: var(--space-2);
        }
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-6);
          align-items: center;
        }
        .footer-links nav {
          display: flex;
          gap: var(--space-6);
        }
        .footer-links a {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          transition: color var(--duration) var(--ease);
        }
        .footer-links a:hover { color: var(--text); }
        .footer-copy {
          font-size: 0.8125rem;
          color: var(--text-muted);
          padding-top: var(--space-6);
          border-top: 1px solid var(--border);
        }
      `}</style>
    </footer>
  );
}
