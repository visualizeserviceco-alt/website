import PricingTable from '../components/PricingTable';

export default function Pricing() {
  return (
    <>
      <section className="pricing-hero section">
        <div className="pricing-hero-bg" aria-hidden="true" />
        <div className="wrap">
          <h1 className="section-title">Simple, transparent packages</h1>
          <p className="section-subtitle">
            Clear, upfront pricing for branding and website projects. No retainers, no surprise fees.
          </p>
        </div>
      </section>
      <section className="pricing-main section">
        <div className="pricing-main-bg" aria-hidden="true" />
        <div className="wrap">
          <PricingTable />
        </div>
      </section>
      <style>{`
        .pricing-hero {
          position: relative;
          background: var(--bg);
          padding-bottom: var(--space-12);
        }
        .pricing-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212, 76, 67, 0.1) 0%, transparent 55%);
          pointer-events: none;
        }
        .pricing-hero .wrap {
          position: relative;
          z-index: 1;
        }
        .pricing-main {
          position: relative;
          background: var(--bg-elevated);
          border-top: 1px solid var(--glass-border);
        }
        .pricing-main-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212, 76, 67, 0.04) 0%, transparent 55%);
          pointer-events: none;
        }
        .pricing-main .wrap {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}

