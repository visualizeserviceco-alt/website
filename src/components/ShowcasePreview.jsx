import { Link } from 'react-router-dom';
import { IconArrowRight, IconExternalLink } from '@tabler/icons-react';
import { showcaseProjects } from '../data/showcase';

const byCategory = (cat) => showcaseProjects.filter((p) => p.category === cat).slice(0, 3);

export default function ShowcasePreview() {
  const websites = byCategory('websites');
  const branding = byCategory('branding');
  const print    = byCategory('print');
  const all      = [...websites, ...branding, ...print].slice(0, 6);

  return (
    <section className="showcase-preview section section-dark">
      <div className="showcase-preview-bg" aria-hidden="true" />
      <div className="wrap">
        <div className="showcase-preview-head reveal">
          <div>
            <h2 className="section-title">My Work</h2>
            <p className="section-subtitle">
              Websites, brand identities, and print — designed with detail, clarity, and consistency.
            </p>
          </div>
          <Link to="/showcase" className="btn btn-secondary showcase-view-all">
            View All Work
            <IconArrowRight size={15} stroke={1.8} className="showcase-arrow" />
          </Link>
        </div>
        <div className="showcase-grid stagger">
          {all.map((p) => (
            <Link key={p.id || p.title} to="/showcase" className="showcase-card">
              <img src={p.image} alt={p.title} loading="lazy" />
              <div className="showcase-card-overlay">
                <span className="showcase-card-title">{p.title}</span>
                <span className="showcase-card-action">
                  <IconExternalLink size={14} stroke={2} />
                  View
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .showcase-preview { position: relative; }
        .showcase-preview-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,76,67,0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .showcase-preview .wrap { position: relative; z-index: 1; }
        .showcase-preview-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: var(--space-6); flex-wrap: wrap; margin-bottom: var(--space-12);
        }
        .showcase-view-all {
          display: inline-flex; align-items: center; gap: 7px;
          flex-shrink: 0; font-size: 0.875rem;
        }
        .showcase-arrow { transition: transform 0.2s; }
        .showcase-view-all:hover .showcase-arrow { transform: translateX(3px); }

        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
        }
        @media (max-width: 900px) { .showcase-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .showcase-grid { grid-template-columns: 1fr; } }

        .showcase-card {
          position: relative; aspect-ratio: 4/3;
          border-radius: var(--radius-lg); overflow: hidden; display: block;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          transition: transform 0.3s var(--ease), box-shadow 0.3s;
        }
        .showcase-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.4);
        }
        .showcase-card img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s var(--ease);
        }
        .showcase-card:hover img { transform: scale(1.06); }
        .showcase-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%);
          display: flex; align-items: flex-end; justify-content: space-between;
          padding: var(--space-5); opacity: 0;
          transition: opacity 0.3s;
        }
        .showcase-card:hover .showcase-card-overlay { opacity: 1; }
        .showcase-card-title {
          font-size: 0.9375rem; font-weight: 700; color: #fff;
        }
        .showcase-card-action {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.75rem; font-weight: 700; color: var(--brand-light);
          background: rgba(0,0,0,0.5); padding: 4px 9px; border-radius: 999px;
          border: 1px solid rgba(212,76,67,0.3);
        }
      `}</style>
    </section>
  );
}
