import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { showcaseCategories, showcaseProjects } from '../data/showcase';

export default function Showcase() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const [filter, setFilter] = useState(
    showcaseCategories.includes(filterParam) ? filterParam : 'all'
  );

  useEffect(() => {
    if (showcaseCategories.includes(filterParam)) setFilter(filterParam);
  }, [filterParam]);

  const filtered = useMemo(() => {
    if (filter === 'all') return showcaseProjects;
    return showcaseProjects.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <>
      <section className="showcase-hero section">
        <div className="showcase-hero-bg" aria-hidden="true" />
        <div className="wrap showcase-hero-wrap">
          <div className="showcase-hero-content">
            <h1 className="section-title">Showcase</h1>
            <p className="section-subtitle">
              Websites, branding, and print work. Drop new images into public/showcase and add entries in src/data/showcase.js.
            </p>
          </div>
          <div className="showcase-hero-visual" aria-hidden="true">
            <div className="showcase-hero-abstract" />
          </div>
        </div>
      </section>
      <section className="showcase-main section">
        <div className="showcase-main-bg" aria-hidden="true" />
        <div className="wrap">
          <div className="showcase-coming">
            <h2 className="showcase-coming-title">Coming Soon</h2>
            <p className="showcase-coming-sub">
              I’m organizing and uploading completed projects. Check back soon for the full showcase.
            </p>
          </div>
        </div>
      </section>
      <style>{`
        .showcase-hero {
          position: relative;
          background: var(--bg);
          padding-bottom: var(--space-12);
        }
        .showcase-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212, 76, 67, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .showcase-hero .wrap { position: relative; z-index: 1; }
        .showcase-hero-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-12);
          align-items: center;
        }
        @media (max-width: 768px) {
          .showcase-hero-wrap { grid-template-columns: 1fr; }
        }
        .showcase-hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .showcase-hero-abstract {
          width: 100%;
          max-width: 520px;
          height: 280px;
          border-radius: var(--radius-lg);
          background:
            radial-gradient(circle at 30% 30%, rgba(212, 76, 67, 0.18) 0%, transparent 55%),
            radial-gradient(circle at 70% 60%, rgba(212, 76, 67, 0.10) 0%, transparent 55%),
            linear-gradient(145deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
          border: 1px solid var(--border);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }
        .showcase-main {
          position: relative;
          background: var(--bg-elevated);
          border-top: 1px solid var(--border);
        }
        .showcase-main-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212, 76, 67, 0.04) 0%, transparent 50%);
          pointer-events: none;
        }
        .showcase-main .wrap { position: relative; z-index: 1; }
        .showcase-coming {
          max-width: 720px;
          margin: 0 auto;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-12);
          text-align: center;
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
        }
        .showcase-coming-title {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          color: var(--text);
          margin-bottom: var(--space-3);
        }
        .showcase-coming-sub {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.7;
          margin: 0;
        }
      `}</style>
    </>
  );
}
