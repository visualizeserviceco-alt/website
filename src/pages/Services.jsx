import { useState } from 'react';

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.667 5L7.5 14.167 3.333 10" />
  </svg>
);

const catalogCategories = [
  {
    id: 'brand',
    title: 'Brand Development',
    services: [
      {
        name: 'Logo Design',
        price: '$75',
        payment: '50% upfront, 50% on completion',
        description: 'Custom primary logo built for professional credibility and brand recognition.',
        deliverables: ['Primary logo', 'Secondary variation', 'Favicon', 'Black/white versions', 'PNG + SVG files'],
      },
      {
        name: 'Full Brand Identity',
        price: '$150',
        payment: '50% upfront, 50% on completion',
        description: 'Complete brand system including all designs for print: business cards, stickers, and other physical assets, plus digital consistency.',
        deliverables: ['Logo suite', 'Color palette', 'Typography system', 'Brand style guide PDF', 'All print designs (business cards, stickers, etc.)', 'Social profile graphics'],
      },
    ],
  },
  {
    id: 'website',
    title: 'Website Development',
    services: [
      {
        name: 'Business Website (5 Pages)',
        price: '$650',
        payment: '50% upfront, 50% on completion',
        note: 'Hosting & maintenance: $50–$100+/month depending on tools.',
        description: 'Professional business website designed to clearly present your services and make it easy for customers to contact you.',
        deliverables: ['5 custom pages', 'Mobile responsive design', 'Contact form', 'Basic SEO setup', 'Analytics integration'],
      },
      {
        name: 'Landing Page',
        price: '$300',
        payment: '50% upfront, 50% on completion',
        description: 'Single-page website focused on presenting one service or offer clearly and professionally.',
        deliverables: ['Custom landing page design', 'Lead/contact form', 'Mobile responsive layout', 'Basic SEO setup'],
      },
    ],
  },
  {
    id: 'print',
    title: 'Print & Physical',
    services: [
      {
        name: 'Sticker Production',
        price: null,
        payment: 'Paid upfront before production begins.',
        description: 'Custom branded stickers printed in-house for physical brand presence.',
        pricingTable: [
          { qty: '50 Stickers', price: '$45' },
          { qty: '100 Stickers', price: '$75' },
          { qty: '250 Stickers', price: '$99' },
        ],
      },
      {
        name: 'Business Cards',
        price: 'Design + Print (varies)',
        payment: '50% upfront for design, balance before print submission.',
        description: 'Custom business card design and coordination with a professional print service.',
        includes: ['Custom design', 'Print-ready files', 'Print service coordination', 'Paper/finish options'],
      },
    ],
  },
  {
    id: 'digital',
    title: 'Digital Setup',
    services: [
      {
        name: 'Google Business Profile',
        price: '$100 standalone',
        priceNote: 'Included in packages',
        payment: null,
        description: 'Setup or optimization of your Google Business listing for accurate presence online.',
        includes: ['Profile setup or updates', 'Service descriptions', 'Business info formatting', 'Photo upload guidance'],
      },
    ],
  },
];

const packageCards = [
  {
    name: 'Launch Package',
    price: '$750',
    for: 'New businesses starting from scratch.',
    includes: ['Logo Design', 'Full Brand Identity', '5-Page Website', 'Google Business Optimization', '100 Stickers', 'Business Card Design'],
    timeline: '3–4 Weeks',
    goal: 'Professional launch presence and credibility foundation.',
  },
  {
    name: 'Build Package',
    price: '$1,200',
    for: 'Businesses upgrading their image and digital presence.',
    includes: ['Full Brand Identity', '5-Page Website', 'Landing Page', 'Google Business Optimization', '100 Stickers', 'Business Card Design + Print Coordination'],
    timeline: '4–5 Weeks',
    goal: 'Complete, polished business presence online and offline.',
  },
  {
    name: 'Website Only',
    price: '$650',
    for: 'You have branding. You need a website.',
    includes: ['5-Page Website', 'Contact form', 'Basic SEO', 'Mobile responsive layout'],
    timeline: '2–3 Weeks',
    goal: null,
  },
  {
    name: 'Brand Only',
    price: '$150',
    for: 'Branding without a website.',
    includes: ['Logo suite', 'Color palette', 'Typography system', 'Brand guide'],
    timeline: null,
    goal: null,
  },
];

const processSteps = [
  { title: 'Consultation', desc: 'We align on your goals, audience, and deliverables.' },
  { title: 'Design & Development', desc: 'Your brand and site are built to your scope.' },
  { title: 'Review & Revisions', desc: 'You review and request changes before final delivery.' },
  { title: 'Final Delivery', desc: 'All files and access are handed over. You launch.' },
];

function ServiceShowcaseCard({ service, categoryTitle }) {
  const hasDeliverables = service.deliverables?.length;
  const hasIncludes = service.includes?.length;
  const hasPricingTable = service.pricingTable?.length;
  const list = service.deliverables || service.includes || [];

  return (
    <article className="svc-card">
      <span className="svc-card-pill">{categoryTitle}</span>
      <div className="svc-card-head">
        <h3 className="svc-card-name">{service.name}</h3>
        {service.price && (
          <div className="svc-card-price-block">
            <span className="svc-card-price">{service.price}</span>
            {service.priceNote && <span className="svc-card-price-note">{service.priceNote}</span>}
          </div>
        )}
      </div>
      <p className="svc-card-desc">{service.description}</p>
      {service.payment && <p className="svc-card-payment">{service.payment}</p>}
      {service.note && <p className="svc-card-note">{service.note}</p>}
      {hasPricingTable && (
        <div className="svc-card-table">
          {service.pricingTable.map((row) => (
            <div key={row.qty} className="svc-card-table-row">
              <span>{row.qty}</span>
              <span>{row.price}</span>
            </div>
          ))}
        </div>
      )}
      {list.length > 0 && (
        <ul className="svc-card-list">
          {list.map((item) => (
            <li key={item}><Check /> {item}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categoriesForFilter = [{ id: 'all', title: 'All Services' }, ...catalogCategories];
  const filteredServices = activeCategory === 'all'
    ? catalogCategories.flatMap((cat) => cat.services.map((s) => ({ ...s, categoryTitle: cat.title })))
    : catalogCategories
        .filter((c) => c.id === activeCategory)[0]
        ?.services.map((s) => ({ ...s, categoryTitle: catalogCategories.find((c) => c.id === activeCategory).title })) || [];

  return (
    <>
      {/* Hero */}
      <section className="sv-hero">
        <div className="wrap">
          <h1 className="sv-hero-title">Professional Branding & Websites for Local Businesses</h1>
          <p className="sv-hero-sub">
            We build the visuals and digital foundation your business needs to launch with confidence.
          </p>
          <div className="sv-hero-cta">
            <a href="/contact#book" className="btn btn-primary">Start Your Project</a>
            <a href="#packages" className="btn btn-secondary">View Packages</a>
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="sv-positioning">
        <div className="wrap sv-positioning-wrap">
          <p className="sv-positioning-lead">
            Visualize helps local businesses build professional brands and create strong digital foundations.
          </p>
          <div className="sv-positioning-grid">
            <div className="sv-positioning-block">
              <h3 className="sv-positioning-head">What we do</h3>
              <p>We design the visuals. We build the website. We prepare your business to launch properly.</p>
            </div>
            <div className="sv-positioning-block sv-positioning-block--clarify">
              <h3 className="sv-positioning-head">What we don’t do</h3>
              <p>We do not run ads. We do not manage marketing campaigns. We focus on branding, website development, and launch assets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service catalog – full showcase */}
      <section className="sv-catalog" id="catalog">
        <div className="wrap">
          <h2 className="sv-heading">Services</h2>
          <p className="sv-heading-sub">Individual services and clear pricing. Mix and match or choose a package below.</p>
          <div className="sv-filter">
            {categoriesForFilter.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`sv-filter-btn ${activeCategory === cat.id ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.title}
              </button>
            ))}
          </div>
          <div className="svc-grid">
            {filteredServices.map((service) => (
              <ServiceShowcaseCard
                key={`${service.categoryTitle}-${service.name}`}
                service={service}
                categoryTitle={service.categoryTitle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="sv-packages section-light" id="packages">
        <div className="wrap">
          <h2 className="sv-heading sv-heading--dark">Packages</h2>
          <p className="sv-heading-sub sv-heading-sub--dark">Bundled services for a full launch or upgrade.</p>
          <div className="sv-pkg-grid">
            {packageCards.map((pkg) => (
              <div key={pkg.name} className="sv-pkg-card">
                <h3 className="sv-pkg-name">{pkg.name}</h3>
                <p className="sv-pkg-price">{pkg.price}</p>
                <p className="sv-pkg-for">{pkg.for}</p>
                <ul className="sv-pkg-includes">
                  {pkg.includes.map((item) => (
                    <li key={item}><Check /> {item}</li>
                  ))}
                </ul>
                {pkg.timeline && <p className="sv-pkg-timeline">Delivery: {pkg.timeline}</p>}
                {pkg.goal && <p className="sv-pkg-goal">{pkg.goal}</p>}
                <a href="/contact#book" className="btn btn-primary sv-pkg-cta">Start Your Project</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="sv-process">
        <div className="wrap">
          <h2 className="sv-heading">Process</h2>
          <div className="sv-process-grid">
            {processSteps.map((step, i) => (
              <div key={step.title} className="sv-process-step">
                <span className="sv-process-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sv-process-title">{step.title}</h3>
                <p className="sv-process-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="sv-cta">
        <div className="wrap sv-cta-wrap">
          <h2 className="sv-cta-title">Ready to build your business foundation?</h2>
          <div className="sv-cta-btns">
            <a href="/contact#book" className="btn btn-primary">Start Your Project</a>
            <a href="/contact#book" className="btn btn-secondary">Book a Consultation</a>
          </div>
        </div>
      </section>

      <style>{`
        .sv-hero {
          padding: var(--space-24) 0;
          background: var(--bg);
        }
        .sv-hero-title {
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: var(--space-4);
          max-width: 12ch;
        }
        .sv-hero-sub {
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 480px;
          margin-bottom: var(--space-10);
          line-height: 1.6;
        }
        .sv-hero-cta { display: flex; flex-wrap: wrap; gap: var(--space-4); }

        .sv-positioning {
          padding: var(--space-20) 0;
          background: #fff;
          color: #0a0a0a;
        }
        .sv-positioning-wrap { max-width: 800px; margin: 0 auto; }
        .sv-positioning-lead {
          font-size: 1.25rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: var(--space-10);
          line-height: 1.6;
        }
        .sv-positioning-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-10);
        }
        @media (max-width: 700px) { .sv-positioning-grid { grid-template-columns: 1fr; } }
        .sv-positioning-block {
          padding: var(--space-8);
          background: #fafafa;
          border-radius: var(--radius-lg);
          border: 1px solid #e5e5e5;
        }
        .sv-positioning-block--clarify { background: #f5f5f5; }
        .sv-positioning-head {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--brand);
          margin-bottom: var(--space-3);
        }
        .sv-positioning-block p {
          font-size: 0.9375rem;
          color: #404040;
          line-height: 1.6;
          margin: 0;
        }

        .sv-catalog {
          padding: var(--space-24) 0;
          background: var(--bg-elevated);
        }
        .sv-heading {
          font-size: clamp(1.75rem, 3.5vw, 2.25rem);
          font-weight: 800;
          margin-bottom: var(--space-3);
          color: #fff;
        }
        .sv-heading-sub {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-10);
          max-width: 560px;
        }
        .sv-filter {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-bottom: var(--space-10);
        }
        .sv-filter-btn {
          padding: var(--space-2) var(--space-4);
          font-size: 0.875rem;
          font-weight: 600;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-secondary);
          transition: all var(--duration) var(--ease);
        }
        .sv-filter-btn:hover { border-color: var(--border-light); color: var(--text); }
        .sv-filter-btn.is-active { background: var(--brand); border-color: var(--brand); color: #fff; }

        .svc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-6);
        }
        .svc-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
        }
        .svc-card:hover {
          border-color: var(--border-light);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .svc-card-pill {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brand);
          margin-bottom: var(--space-4);
        }
        .svc-card-head { margin-bottom: var(--space-3); }
        .svc-card-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: var(--space-2);
          line-height: 1.25;
        }
        .svc-card-price-block { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-2); }
        .svc-card-price { font-size: 1.25rem; font-weight: 800; color: var(--brand); }
        .svc-card-price-note { font-size: 0.8125rem; color: var(--text-muted); }
        .svc-card-desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--space-4);
        }
        .svc-card-payment { font-size: 0.8125rem; color: var(--text-muted); margin-bottom: var(--space-3); }
        .svc-card-note { font-size: 0.8125rem; color: var(--text-muted); margin-bottom: var(--space-3); }
        .svc-card-table {
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          margin-bottom: var(--space-4);
        }
        .svc-card-table-row {
          display: flex; justify-content: space-between;
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--border);
          font-size: 0.9375rem;
        }
        .svc-card-table-row:last-child { border-bottom: none; }
        .svc-card-list {
          list-style: none;
          padding: 0;
          margin: 0;
          margin-top: auto;
        }
        .svc-card-list li {
          display: flex; align-items: center; gap: var(--space-2);
          font-size: 0.9375rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }
        .svc-card-list .plan-check { color: var(--brand); flex-shrink: 0; }

        .sv-packages {
          padding: var(--space-24) 0;
          background: #fff;
          color: #0a0a0a;
        }
        .sv-heading--dark { color: #0a0a0a; }
        .sv-heading-sub--dark { color: #525252; }
        .sv-pkg-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-8);
        }
        @media (max-width: 900px) { .sv-pkg-grid { grid-template-columns: 1fr; } }
        .sv-pkg-card {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: var(--radius-lg);
          padding: var(--space-10);
          display: flex;
          flex-direction: column;
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
        }
        .sv-pkg-card:hover {
          border-color: #d4d4d4;
          box-shadow: 0 12px 40px rgba(0,0,0,0.06);
        }
        .sv-pkg-name { font-size: 1.375rem; font-weight: 800; color: #0a0a0a; margin-bottom: var(--space-2); }
        .sv-pkg-price { font-size: 1.75rem; font-weight: 800; color: var(--brand); margin-bottom: var(--space-3); }
        .sv-pkg-for { font-size: 0.9375rem; color: #525252; margin-bottom: var(--space-6); line-height: 1.5; }
        .sv-pkg-includes { list-style: none; padding: 0; margin: 0 0 var(--space-6); flex: 1; }
        .sv-pkg-includes li { display: flex; align-items: center; gap: var(--space-2); font-size: 0.9375rem; color: #262626; margin-bottom: var(--space-2); }
        .sv-pkg-includes .plan-check { color: var(--brand); flex-shrink: 0; }
        .sv-pkg-timeline { font-size: 0.875rem; font-weight: 600; color: #0a0a0a; margin-bottom: var(--space-2); }
        .sv-pkg-goal { font-size: 0.875rem; color: #737373; margin-bottom: var(--space-6); line-height: 1.5; }
        .sv-pkg-cta { width: 100%; }

        .sv-process {
          padding: var(--space-24) 0;
          background: var(--bg);
        }
        .sv-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-8);
        }
        @media (max-width: 900px) { .sv-process-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .sv-process-grid { grid-template-columns: 1fr; } }
        .sv-process-step {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
        }
        .sv-process-num {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--brand);
          letter-spacing: 0.05em;
          margin-bottom: var(--space-3);
        }
        .sv-process-title { font-size: 1.125rem; font-weight: 700; margin-bottom: var(--space-2); }
        .sv-process-desc { font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

        .sv-cta {
          padding: var(--space-20) 0;
          background: var(--bg-elevated);
          border-top: 1px solid var(--border);
        }
        .sv-cta-wrap { text-align: center; }
        .sv-cta-title {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          margin-bottom: var(--space-8);
        }
        .sv-cta-btns { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-4); }
      `}</style>
    </>
  );
}
