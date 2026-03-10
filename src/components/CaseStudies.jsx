const placeholders = [
  { title: 'Case Study One', metric: 'Result metric', desc: 'Short outcome description.' },
  { title: 'Case Study Two', metric: 'Result metric', desc: 'Short outcome description.' },
  { title: 'Case Study Three', metric: 'Result metric', desc: 'Short outcome description.' },
];

export default function CaseStudies() {
  return (
    <section className="case-studies section section-dark">
      <div className="wrap">
        <h2 className="section-title">Results</h2>
        <p className="section-subtitle">
          Data and outcomes from recent engagements. More case studies coming soon.
        </p>
        <div className="case-grid">
          {placeholders.map((c) => (
            <div key={c.title} className="case-card">
              <div className="case-card-placeholder" />
              <h3 className="case-card-title">{c.title}</h3>
              <p className="case-card-metric">{c.metric}</p>
              <p className="case-card-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .case-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-8);
          margin-top: var(--space-12);
        }
        @media (max-width: 900px) {
          .case-grid { grid-template-columns: 1fr; }
        }
        .case-card {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color var(--duration) var(--ease);
        }
        .case-card:hover {
          border-color: var(--border-light);
        }
        .case-card-placeholder {
          height: 200px;
          background: var(--surface);
        }
        .case-card-title {
          font-size: 1.125rem;
          font-weight: 700;
          padding: var(--space-4) var(--space-6) 0;
          margin-bottom: var(--space-2);
        }
        .case-card-metric {
          font-size: 0.875rem;
          color: var(--brand);
          font-weight: 600;
          padding: 0 var(--space-6);
        }
        .case-card-desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          padding: var(--space-2) var(--space-6) var(--space-6);
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
