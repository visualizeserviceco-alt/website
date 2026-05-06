import { IconSearch, IconPencil, IconRefresh, IconRocket } from '@tabler/icons-react';

const steps = [
  { num: '01', title: 'Discovery',         desc: 'I learn your goals, audience, and what your brand or website needs to communicate.', icon: IconSearch },
  { num: '02', title: 'Design & Build',    desc: 'I design the visuals and build a clean, structured site that matches your brand.',   icon: IconPencil },
  { num: '03', title: 'Review & Revisions',desc: 'You review the work and I refine the details until it feels right.',                 icon: IconRefresh },
  { num: '04', title: 'Launch & Handoff',  desc: 'I publish the site and hand over files, access, and next-step guidance.',           icon: IconRocket },
];

export default function Process() {
  return (
    <section className="process section section-elevated">
      <div className="wrap">
        <h2 className="section-title reveal">My Process</h2>
        <p className="section-subtitle reveal">A clear process from kickoff to launch.</p>
        <div className="process-timeline stagger">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="process-step">
                <div className="process-step-top">
                  <div className="process-icon">
                    <Icon size={20} stroke={1.8} />
                  </div>
                  <span className="process-num">{step.num}</span>
                </div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-desc">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="process-connector" aria-hidden="true">
                    <div className="process-connector-line" />
                    <svg viewBox="0 0 8 8" fill="none" width="8" height="8">
                      <circle cx="4" cy="4" r="3" fill="var(--brand)" opacity="0.4" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
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
        @media (max-width: 900px) { .process-timeline { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .process-timeline { grid-template-columns: 1fr; } }

        .process-step {
          position: relative; padding: var(--space-8);
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border); border-radius: var(--radius-lg);
          margin: 0 var(--space-2);
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .process-step:hover {
          border-color: rgba(212,76,67,0.4);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
          transform: translateY(-3px);
        }
        .process-step-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: var(--space-4);
        }
        .process-icon {
          width: 40px; height: 40px; border-radius: var(--radius);
          background: rgba(212,76,67,0.1); border: 1px solid rgba(212,76,67,0.2);
          display: flex; align-items: center; justify-content: center;
          color: var(--brand);
        }
        .process-num {
          font-size: 1.75rem; font-weight: 900; letter-spacing: -0.04em;
          color: rgba(255,255,255,0.06);
        }
        .process-title {
          font-size: 1.0625rem; font-weight: 700; color: var(--text); margin-bottom: var(--space-3);
        }
        .process-desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; }

        .process-connector {
          display: none;
          position: absolute; top: 50%; right: calc(-1 * var(--space-2) - 8px);
          transform: translateY(-50%);
          align-items: center; gap: 0; z-index: 1;
        }
        .process-connector-line {
          width: calc(var(--space-2) * 2); height: 1px;
          background: linear-gradient(90deg, rgba(212,76,67,0.3), rgba(212,76,67,0.1));
        }
        @media (min-width: 901px) { .process-connector { display: flex; } }
      `}</style>
    </section>
  );
}
