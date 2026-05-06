import { useState } from 'react';
import { packages, features, featureMatrix } from '../data/pricing';
import { IconCheck, IconX, IconChevronDown, IconArrowRight } from '@tabler/icons-react';

export default function PricingTable() {
  const [activeMobile, setActiveMobile] = useState(null);

  return (
    <>
      <div className="pt-wrapper">

        {/* ── Plan cards header ─────────────────────── */}
        <div className="pt-header">
          <div className="pt-contact">
            <div className="pt-contact-icon" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
                <rect width="40" height="40" rx="10" fill="rgba(212,76,67,0.12)" />
                <path d="M12 20h16M20 12l8 8-8 8" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="pt-contact-title">Not sure where to start?</h3>
            <p className="pt-contact-text">
              Share a bit about your business and I&apos;ll recommend the right package for your situation.
            </p>
            <a href="/book" className="btn btn-secondary pt-contact-btn">
              Get a Recommendation
              <IconArrowRight size={14} stroke={2} />
            </a>
          </div>

          <div className="pt-plans">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`pt-plan ${pkg.popular ? 'pt-plan--popular' : ''}`}>
                {pkg.popular && (
                  <div className="pt-plan-badge">
                    <span className="pt-plan-badge-dot" />
                    Most Selected
                  </div>
                )}
                <h3 className="pt-plan-name">{pkg.name}</h3>
                <p className="pt-plan-quote">By Quote</p>
                <p className="pt-plan-desc">{pkg.description}</p>
                <a href="/book" className="btn btn-primary pt-plan-btn">
                  Book a Meeting
                  <IconArrowRight size={13} stroke={2} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop feature table ─────────────────── */}
        <div className="pt-table">
          <div className="pt-table-head">
            <div className="pt-feat-label">What&apos;s included</div>
            {packages.map((pkg) => (
              <div key={pkg.id} className={`pt-col-label ${pkg.popular ? 'pt-col-label--popular' : ''}`}>
                {pkg.name.replace(' Package', '').replace(' Only', '')}
              </div>
            ))}
          </div>
          {features.map((feature, index) => (
            <div key={feature.id} className={`pt-table-row ${index % 2 === 0 ? 'pt-row--alt' : ''}`}>
              <div className="pt-feat-label">{feature.label}</div>
              {packages.map((pkg) => {
                const included = featureMatrix[feature.id]?.[pkg.id] === 'included';
                return (
                  <div key={pkg.id} className={`pt-plan-cell ${included ? 'pt-cell--yes' : 'pt-cell--no'} ${pkg.popular ? 'pt-col--popular' : ''}`}>
                    {included ? <IconCheck size={17} stroke={2.2} /> : <IconX size={15} stroke={2} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Mobile accordion cards ────────────────── */}
        <div className="pt-mobile">
          {packages.map((pkg) => {
            const isOpen = activeMobile === pkg.id;
            const includedFeatures = features.filter(f => featureMatrix[f.id]?.[pkg.id] === 'included');
            return (
              <div key={pkg.id} className={`pt-mob-card ${pkg.popular ? 'pt-mob-card--popular' : ''}`}>
                <button
                  type="button"
                  className="pt-mob-head"
                  onClick={() => setActiveMobile(isOpen ? null : pkg.id)}
                  aria-expanded={isOpen}
                >
                  <div className="pt-mob-info">
                    {pkg.popular && <span className="pt-mob-badge">Most Selected</span>}
                    <span className="pt-mob-name">{pkg.name}</span>
                    <span className="pt-mob-quote">By Quote</span>
                  </div>
                  <IconChevronDown
                    size={18} stroke={1.8}
                    className={`pt-mob-chevron ${isOpen ? 'is-open' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="pt-mob-body">
                    <p className="pt-mob-desc">{pkg.description}</p>
                    <ul className="pt-mob-list">
                      {includedFeatures.map(f => (
                        <li key={f.id}>
                          <IconCheck size={16} stroke={2.2} /> {f.label}
                        </li>
                      ))}
                    </ul>
                    <a href="/book" className="btn btn-primary pt-mob-btn">
                      Book a Meeting
                      <IconArrowRight size={14} stroke={2} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .pt-wrapper {
          margin-top: var(--space-10);
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          padding: var(--space-8);
          box-shadow: 0 18px 50px rgba(0,0,0,0.3);
          overflow: visible;
        }

        /* ── Header ─────────────────────────────────── */
        .pt-header {
          display: grid;
          grid-template-columns: minmax(200px, 220px) 1fr;
          gap: var(--space-6);
          margin-bottom: var(--space-8);
          align-items: start;
        }
        @media (max-width: 900px) {
          .pt-header { grid-template-columns: 1fr; }
        }

        .pt-contact {
          background: var(--glass-bg-strong);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          border: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .pt-contact-icon { flex-shrink: 0; }
        .pt-contact-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1.3;
        }
        .pt-contact-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .pt-contact-btn { font-size: 0.875rem; align-self: flex-start; }

        /* ── Plan cards ─────────────────────────────── */
        .pt-plans {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-3);
          align-items: start;
        }
        @media (max-width: 1100px) {
          .pt-plans { grid-template-columns: repeat(2, 1fr); }
        }

        .pt-plan {
          position: relative;
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          border: 1px solid var(--glass-border);
          background: linear-gradient(180deg, var(--glass-bg-brand) 0%, var(--glass-bg-strong) 100%);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pt-plan:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .pt-plan--popular {
          background: linear-gradient(180deg, rgba(212,76,67,0.22) 0%, var(--glass-bg-strong) 100%);
          border-color: rgba(212,76,67,0.45);
          box-shadow: 0 12px 40px rgba(0,0,0,0.35);
        }

        .pt-plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brand-light);
          background: rgba(212,76,67,0.15);
          border: 1px solid rgba(212,76,67,0.3);
          padding: 3px 8px;
          border-radius: 999px;
          margin-bottom: var(--space-3);
        }
        .pt-plan-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--brand);
          animation: ptDotPulse 1.8s ease-in-out infinite;
        }
        @keyframes ptDotPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,76,67,0.7); }
          50%      { box-shadow: 0 0 0 4px rgba(212,76,67,0); }
        }

        .pt-plan-name {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--space-1);
          line-height: 1.3;
        }
        .pt-plan-quote {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--brand);
          margin-bottom: var(--space-3);
        }
        .pt-plan-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: var(--space-4);
        }
        .pt-plan-btn { width: 100%; font-size: 0.8125rem; padding: 8px; }

        /* ── Desktop feature table ───────────────────── */
        .pt-table {
          display: none;
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          overflow: hidden;
        }
        .pt-table-head {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) repeat(4, minmax(0, 1fr));
          background: rgba(0,0,0,0.55);
          border-bottom: 1px solid var(--glass-border);
        }
        .pt-feat-label {
          padding: var(--space-4) var(--space-5);
          font-size: 0.8125rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          border-right: 1px solid var(--glass-border);
        }
        .pt-col-label {
          padding: var(--space-3) var(--space-4);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-align: center;
          border-right: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pt-col-label--popular { color: var(--brand-light); }

        .pt-table-row {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) repeat(4, minmax(0, 1fr));
          border-top: 1px solid var(--glass-border);
        }
        .pt-row--alt { background: rgba(255,255,255,0.015); }
        .pt-table-row .pt-feat-label { font-size: 0.875rem; padding: var(--space-3) var(--space-5); }
        .pt-plan-cell {
          display: flex; align-items: center; justify-content: center;
          padding: var(--space-3);
          border-right: 1px solid var(--glass-border);
        }
        .pt-cell--yes { color: var(--brand); }
        .pt-cell--no  { color: rgba(255,255,255,0.15); }
        .pt-col--popular { background: rgba(212,76,67,0.04); }

        @media (min-width: 900px) { .pt-table { display: block; } }

        /* ── Mobile accordion ───────────────────────── */
        .pt-mobile { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-6); }
        .pt-mob-card {
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          background: var(--glass-bg-strong);
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .pt-mob-card--popular { border-color: rgba(212,76,67,0.4); }

        .pt-mob-head {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: var(--space-5) var(--space-5);
          background: none; border: none; cursor: pointer; text-align: left;
          gap: var(--space-3);
        }
        .pt-mob-info { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
        .pt-mob-badge {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--brand-light); width: fit-content;
        }
        .pt-mob-name { font-size: 1rem; font-weight: 700; color: var(--text); }
        .pt-mob-quote { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brand); }
        .pt-mob-chevron { color: var(--text-muted); transition: transform 0.25s; flex-shrink: 0; }
        .pt-mob-chevron.is-open { transform: rotate(180deg); }

        .pt-mob-body {
          padding: 0 var(--space-5) var(--space-5);
          border-top: 1px solid var(--glass-border);
          padding-top: var(--space-4);
        }
        .pt-mob-desc { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: var(--space-4); line-height: 1.6; }
        .pt-mob-list { list-style: none; padding: 0; margin: 0 0 var(--space-5); display: flex; flex-direction: column; gap: var(--space-2); }
        .pt-mob-list li { display: flex; align-items: flex-start; gap: var(--space-2); font-size: 0.875rem; color: var(--text-secondary); }
        .pt-mob-list svg { color: var(--brand); flex-shrink: 0; margin-top: 2px; }
        .pt-mob-btn { width: 100%; }

        @media (min-width: 900px) { .pt-mobile { display: none; } }
      `}</style>
    </>
  );
}
