import { Link } from 'react-router-dom';
import { showcaseProjects } from '../data/showcase';

const byCategory = (cat) => showcaseProjects.filter((p) => p.category === cat).slice(0, 3);

export default function ShowcasePreview() {
  const websites = byCategory('websites');
  const branding = byCategory('branding');
  const print = byCategory('print');

  return (
    <section className="showcase-preview section section-dark">
      <div className="showcase-preview-bg" aria-hidden="true" />
      <div className="wrap">
        <h2 className="section-title">My Work</h2>
        <p className="section-subtitle">
          Websites, brand identities, and print, designed with detail, clarity, and consistency.
        </p>
        <div className="showcase-grid">
          {websites.map((p) => (
            <Link key={p.id || p.title} to="/showcase?filter=websites" className="showcase-card">
              <img src={p.image} alt="" />
              <span className="showcase-card-title">{p.title}</span>
            </Link>
          ))}
          {branding.map((p) => (
            <Link key={p.id || p.title} to="/showcase?filter=branding" className="showcase-card">
              <img src={p.image} alt="" />
              <span className="showcase-card-title">{p.title}</span>
            </Link>
          ))}
          {print.map((p) => (
            <Link key={p.id || p.title} to="/showcase?filter=print" className="showcase-card">
              <img src={p.image} alt="" />
              <span className="showcase-card-title">{p.title}</span>
            </Link>
          ))}
        </div>
        <div className="showcase-cta">
          <Link to="/showcase" className="btn btn-secondary">View Full Showcase</Link>
        </div>
      </div>
      <style>{`
        .showcase-preview { position: relative; }
        .showcase-preview-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212, 76, 67, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .showcase-preview .wrap { position: relative; z-index: 1; }
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
          margin-top: var(--space-12);
        }
        @media (max-width: 900px) {
          .showcase-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .showcase-grid { grid-template-columns: 1fr; }
        }
        .showcase-card {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: block;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
        }
        .showcase-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s var(--ease);
        }
        .showcase-card:hover img {
          transform: scale(1.05);
        }
        .showcase-card-title {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-6);
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          font-weight: 600;
          font-size: 1rem;
          color: #fff;
          transition: opacity var(--duration) var(--ease);
        }
        .showcase-card:hover .showcase-card-title {
          opacity: 1;
        }
        .showcase-cta {
          margin-top: var(--space-10);
          text-align: center;
        }
      `}</style>
    </section>
  );
}
