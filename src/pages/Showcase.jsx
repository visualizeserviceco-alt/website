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
      <section className="page-hero section section-dark">
        <div className="wrap">
          <h1 className="section-title">Showcase</h1>
          <p className="section-subtitle">
            Websites, branding, and print work. Drop new images into public/showcase and add entries in src/data/showcase.js.
          </p>
        </div>
      </section>
      <section className="section section-dark">
        <div className="wrap">
          <div className="showcase-filters">
            <button
              type="button"
              className={`filter-btn ${filter === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {showcaseCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${filter === cat ? 'is-active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="showcase-page-grid">
            {filtered.map((p) => (
              <div key={`${p.category}-${p.title}`} className="showcase-page-card">
                <img src={p.image} alt="" />
                <span className="showcase-page-card-title">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        .page-hero { padding-bottom: var(--space-12); }
        .showcase-filters {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-bottom: var(--space-12);
        }
        .filter-btn {
          padding: var(--space-2) var(--space-4);
          font-size: 0.9375rem;
          font-weight: 500;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-secondary);
          transition: border-color var(--duration) var(--ease), color var(--duration) var(--ease);
        }
        .filter-btn:hover {
          border-color: var(--border-light);
          color: var(--text);
        }
        .filter-btn.is-active {
          border-color: var(--brand);
          color: var(--brand);
        }
        .showcase-page-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        @media (max-width: 900px) {
          .showcase-page-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .showcase-page-grid { grid-template-columns: 1fr; }
        }
        .showcase-page-card {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-card);
        }
        .showcase-page-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .showcase-page-card-title {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-4);
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          font-weight: 600;
          font-size: 0.9375rem;
          color: #fff;
        }
      `}</style>
    </>
  );
}
