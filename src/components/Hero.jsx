import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="wrap hero-inner">
        <h1 className="hero-title">Performance Marketing for Local Businesses</h1>
        <p className="hero-sub">
          We build brands, websites, and marketing systems that generate real customers.
        </p>
        <div className="hero-cta">
          <a href="/contact#book" className="btn btn-primary">Book a Strategy Call</a>
          <Link to="/showcase" className="btn btn-secondary">View Our Work</Link>
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
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212, 76, 67, 0.08) 0%, transparent 50%),
                      linear-gradient(180deg, var(--bg) 0%, var(--bg-elevated) 100%);
          pointer-events: none;
        }
        .hero-inner {
          position: relative;
          z-index: 1;
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: var(--space-6);
          max-width: 14ch;
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
      `}</style>
    </section>
  );
}
