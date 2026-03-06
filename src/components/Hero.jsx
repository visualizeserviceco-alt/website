import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="wrap hero-wrap">
        <div className="hero-left">
          <h1 className="hero-title">Branding & Websites for Real Businesses</h1>
          <p className="hero-sub">
            I design the visuals and build the digital foundation your business needs to show up professionally.
          </p>
          <div className="hero-cta">
            <a href="/contact#book" className="btn btn-primary">Book a Consultation</a>
            <Link to="/showcase" className="btn btn-secondary">View My Work</Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-visual" />
        </div>
      </div>
      <style>{`
        .hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          padding: var(--space-24) 0;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--bg) 0%, var(--bg-elevated) 50%, #0d0d0e 100%);
          pointer-events: none;
        }
        .hero-bg::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 80%;
          height: 140%;
          background: radial-gradient(ellipse at center, rgba(212, 76, 67, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-wrap {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
          align-items: center;
        }
        @media (max-width: 900px) {
          .hero-wrap { grid-template-columns: 1fr; text-align: center; }
          .hero-left .hero-cta { justify-content: center; }
          .hero-right { min-height: 200px; order: -1; }
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: var(--space-6);
          color: var(--text);
        }
        .hero-sub {
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 480px;
          margin-bottom: var(--space-10);
          line-height: 1.6;
        }
        .hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
        }
        .hero-visual {
          position: relative;
          width: 100%;
          min-height: 320px;
          border-radius: var(--radius-lg);
          background: linear-gradient(145deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
          border: 1px solid var(--border);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }
        .hero-visual::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 70% 30%, rgba(212, 76, 67, 0.12) 0%, transparent 50%);
          animation: hero-pulse 8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes hero-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
}
