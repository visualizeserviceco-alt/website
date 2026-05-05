const steps = [
  { num: '01', title: 'Discovery', desc: 'I learn your goals, audience, and what your brand or website needs to communicate.' },
  { num: '02', title: 'Design & Build', desc: 'I design the visuals and build a clean, structured site that matches your brand.' },
  { num: '03', title: 'Review & Revisions', desc: 'You review the work and I refine the details until it feels right.' },
  { num: '04', title: 'Launch & Handoff', desc: 'I publish the site and hand over files, access, and next-step guidance.' },
];

export default function Process() {
  return (
    <section className="process section section-elevated">
      <div className="wrap">
        <h2 className="section-title">My Process</h2>
        <p className="section-subtitle">
          A clear process from kickoff to launch.
        </p>
        <div className="process-timeline stagger">
          {steps.map((step, i) => (
            <div key={step.num} className="process-step">
              <span className="process-num">{step.num}</span>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.desc}</p>
              {i < steps.length - 1 && <span className="process-line" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .process-timeline {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-top: var(--space-12);
          position: relative;
        }
        @media (max-width: 900px) {
          .process-timeline { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .process-timeline { grid-template-columns: 1fr; }
        }
        .process-step {
          position: relative;
          padding: var(--space-8);
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          margin: 0 var(--space-2);
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
        }
        .process-step:hover {
          border-color: var(--brand);
          box-shadow: 0 12px 40px rgba(0,0,0,0.2);
        }
        .process-num {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--brand);
          letter-spacing: 0.05em;
          margin-bottom: var(--space-2);
        }
        .process-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--space-2);
        }
        .process-desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
}
