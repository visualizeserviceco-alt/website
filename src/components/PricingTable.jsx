import { packages, features, featureMatrix } from '../data/pricing';
import { IconCheckCircle, IconX } from './Icons';

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.667 5L7.5 14.167 3.333 10" />
  </svg>
);

export default function PricingTable() {
  return (
    <>
      <div className="pt-wrapper">
        <div className="pt-header">
          <div className="pt-contact">
            <h3 className="pt-contact-title">Not sure where to start?</h3>
            <p className="pt-contact-text">
              Share a bit about your business and I&apos;ll recommend the right package for your situation.
            </p>
            <a href="/contact#book" className="btn btn-secondary pt-contact-btn">
              Contact
            </a>
          </div>
          <div className="pt-plans">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`pt-plan ${pkg.popular ? 'pt-plan--popular' : ''}`}
              >
                {pkg.popular && <div className="pt-plan-badge">Most Selected</div>}
                <h3 className="pt-plan-name">{pkg.name}</h3>
                <p className="pt-plan-price">{pkg.price}</p>
                <p className="pt-plan-desc">{pkg.description}</p>
                <a href="/contact#book" className="btn btn-primary pt-plan-btn">
                  Choose Plan
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-table">
          <div className="pt-table-row pt-table-row--head">
            <div className="pt-feature-col">What&apos;s included</div>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`pt-plan-col ${pkg.popular ? 'pt-plan-col--popular' : ''}`}
                aria-label={pkg.name}
              />
            ))}
          </div>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`pt-table-row ${index % 2 === 0 ? 'pt-table-row--alt' : ''}`}
            >
              <div className="pt-feature-col">
                <span>{feature.label}</span>
              </div>
              {packages.map((pkg) => {
                const state = featureMatrix[feature.id]?.[pkg.id] || 'excluded';
                const included = state === 'included';
                return (
                  <div
                    key={pkg.id}
                    className={`pt-plan-col ${included ? 'pt-plan-col--included' : 'pt-plan-col--excluded'}`}
                  >
                    {included ? (
                      <IconCheckCircle size={18} />
                    ) : (
                      <IconX size={16} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="pt-mobile">
          {packages.map((pkg) => (
            <div key={pkg.id} className="pt-mobile-card">
              <div className="pt-mobile-head">
                <h3 className="pt-plan-name">{pkg.name}</h3>
                <p className="pt-plan-price">{pkg.price}</p>
                <p className="pt-plan-desc">{pkg.description}</p>
              </div>
              <ul className="pt-mobile-list">
                {features.map((feature) => {
                  const included = featureMatrix[feature.id]?.[pkg.id] === 'included';
                  if (!included) return null;
                  return (
                    <li key={feature.id}>
                      <Check /> {feature.label}
                    </li>
                  );
                })}
              </ul>
              <a href="/contact#book" className="btn btn-primary pt-plan-btn">
                Choose Plan
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .pt-wrapper {
          margin-top: var(--space-10);
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          padding: var(--space-8);
          box-shadow: 0 18px 50px rgba(0,0,0,0.35);
        }
        .pt-header {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.6fr);
          gap: var(--space-8);
          margin-bottom: var(--space-8);
        }
        @media (max-width: 900px) {
          .pt-header {
            grid-template-columns: 1fr;
          }
        }
        .pt-contact {
          background: rgba(0,0,0,0.5);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          border: 1px solid var(--border);
        }
        .pt-contact-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: var(--space-3);
        }
        .pt-contact-text {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
        }
        .pt-contact-btn {
          font-size: 0.9rem;
        }
        .pt-plans {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--space-4);
        }
        @media (max-width: 1100px) {
          .pt-plans {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 700px) {
          .pt-plans {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .pt-plan {
          position: relative;
          border-radius: var(--radius-lg);
          padding: var(--space-6) var(--space-5) var(--space-5);
          border: 1px solid var(--border);
          background: radial-gradient(circle at top, rgba(212,76,67,0.12), rgba(0,0,0,0.6));
        }
        .pt-plan--popular {
          background: radial-gradient(circle at top, rgba(212,76,67,0.22), rgba(0,0,0,0.8));
          border-color: var(--brand);
          box-shadow: 0 18px 60px rgba(0,0,0,0.65);
        }
        .pt-plan-badge {
          position: absolute;
          top: var(--space-3);
          right: var(--space-4);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(0,0,0,0.6);
          color: var(--brand-light);
        }
        .pt-plan-name {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .pt-plan-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--brand);
          margin-bottom: var(--space-2);
        }
        .pt-plan-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
        }
        .pt-plan-btn {
          width: 100%;
          font-size: 0.875rem;
        }

        .pt-table {
          display: none;
          margin-top: var(--space-6);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .pt-table-row {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) repeat(4, minmax(0, 1fr));
          align-items: stretch;
        }
        .pt-table-row--head {
          background: rgba(0,0,0,0.6);
        }
        .pt-table-row--alt {
          background: rgba(255,255,255,0.01);
        }
        .pt-feature-col {
          padding: var(--space-4);
          border-right: 1px solid var(--border);
          border-top: 1px solid var(--border);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .pt-plan-col {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          border-right: 1px solid var(--border);
          border-top: 1px solid var(--border);
        }
        .pt-table-row--head .pt-feature-col,
        .pt-table-row--head .pt-plan-col {
          border-top: none;
        }
        .pt-plan-col--included {
          color: var(--brand);
        }
        .pt-plan-col--excluded {
          color: var(--text-muted);
        }
        .pt-plan-col--popular {
          background: rgba(212,76,67,0.05);
        }

        .pt-mobile {
          display: block;
          margin-top: var(--space-6);
        }
        .pt-mobile-card {
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          background: rgba(0,0,0,0.5);
          padding: var(--space-6);
          margin-bottom: var(--space-4);
        }
        .pt-mobile-head {
          margin-bottom: var(--space-4);
        }
        .pt-mobile-list {
          list-style: none;
          padding: 0;
          margin: 0 0 var(--space-4);
        }
        .pt-mobile-list li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }
        .pt-mobile-list svg {
          color: var(--brand);
          flex-shrink: 0;
          margin-top: 2px;
        }

        @media (min-width: 900px) {
          .pt-table { display: block; }
          .pt-mobile { display: none; }
        }
      `}</style>
    </>
  );
}

