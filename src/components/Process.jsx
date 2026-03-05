const steps = [
  { num: '01', title: 'Strategy', desc: 'We align on goals, audience, and positioning before any build.' },
  { num: '02', title: 'Build', desc: 'Brand, website, and marketing assets designed to convert.' },
  { num: '03', title: 'Launch', desc: 'Go live with tracking, optimization, and clear next steps.' },
  { num: '04', title: 'Scale', desc: 'Ongoing management and strategy to grow your results.' },
];

export default function Process() {
  return (
    <section className="process section section-light">
      <div className="wrap">
        <h2 className="section-title">How We Work</h2>
        <p className="section-subtitle">
          A clear process from strategy to launch and scale.
        </p>
        <div className="process-timeline">
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
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: var(--radius-lg);
          margin: 0 var(--space-2);
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
        }
        .process-step:hover {
          border-color: #d4d4d4;
          box-shadow: 0 8px 32px rgba(0,0,0,0.06);
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
          color: #0a0a0a;
          margin-bottom: var(--space-2);
        }
        .process-desc {
          font-size: 0.9375rem;
          color: #525252;
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
}
