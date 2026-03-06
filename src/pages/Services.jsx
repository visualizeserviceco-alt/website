import { useState } from 'react';
import {
  IconPenTool,
  IconLogoMark,
  IconLayers,
  IconBrowser,
  IconLayoutSingle,
  IconSticker,
  IconCard,
  IconMapPin,
  IconRocket,
  IconGrid,
  IconBrandMark,
  IconChat,
  IconPencilRuler,
  IconRefresh,
  IconCheckCircle,
} from '../components/Icons';

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.667 5L7.5 14.167 3.333 10" />
  </svg>
);

const serviceIcons = {
  'Logo Design': IconLogoMark,
  'Full Brand Identity': IconLayers,
  'Business Website (5 Pages)': IconBrowser,
  'Landing Page': IconLayoutSingle,
  'Sticker Production': IconSticker,
  'Business Cards': IconCard,
  'Google Business Profile': IconMapPin,
};

const packageIcons = {
  'Launch Package': IconRocket,
  'Build Package': IconGrid,
  'Website Only': IconBrowser,
  'Brand Only': IconBrandMark,
};

const processIcons = [IconChat, IconPencilRuler, IconRefresh, IconCheckCircle];

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
  { title: 'Consultation', desc: 'I align on your goals, audience, and deliverables.' },
  { title: 'Design & Development', desc: 'Your brand and site are built to your scope.' },
  { title: 'Review & Revisions', desc: 'You review and request changes before final delivery.' },
  { title: 'Final Delivery', desc: 'All files and access are handed over. You launch.' },
];

const pillarBlocks = [
  { id: 'brand', title: 'Brand Identity', summary: 'Logo, full identity, and brand systems.' },
  { id: 'website', title: 'Business Websites', summary: '5-page sites, landing pages, and digital presence.' },
  { id: 'print', title: 'Print & Physical Assets', summary: 'Stickers, business cards, and physical brand.' },
  { id: 'digital', title: 'Digital Setup', summary: 'Google Business and launch essentials.' },
];

const websiteAddOns = [
  {
    id: 'contact-form',
    title: 'Custom Contact Form Upgrade',
    price: '$75',
    description: 'Advanced contact form with conditional logic, file uploads, and structured inquiry routing.',
    includes: ['Multi-step form', 'Conditional fields', 'File upload capability', 'Email routing customization'],
    payment: 'Added to project invoice (50% upfront with project deposit)',
  },
  {
    id: 'database',
    title: 'Database Integration',
    price: '$200',
    description: 'Custom database functionality for storing and managing client data securely.',
    includes: ['Backend database setup', 'Secure form-to-database connection', 'Basic admin viewing access'],
    useCases: ['Client submissions', 'Applications', 'Directory systems'],
  },
  {
    id: 'client-portal',
    title: 'Client Portal / Login System',
    price: '$350',
    description: 'Private login area for clients or members.',
    includes: ['User authentication', 'Protected pages', 'Basic account dashboard'],
  },
  {
    id: 'booking',
    title: 'Booking System Integration',
    price: '$125',
    description: 'Integrated appointment booking system connected to your calendar.',
    includes: ['Calendar sync', 'Booking confirmations', 'Time slot customization'],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Functionality',
    price: '$300',
    description: 'Online store functionality for selling products directly from your website.',
    includes: ['Product pages', 'Cart system', 'Secure checkout integration', 'Basic payment setup'],
  },
  {
    id: 'cms',
    title: 'CMS / Editable Content Setup',
    price: '$150',
    description: 'Backend content management system allowing you to edit text and images without coding.',
    includes: ['Editable sections', 'Simple admin interface', 'Basic training guidance'],
  },
  {
    id: 'seo',
    title: 'Advanced SEO Structure',
    price: '$150',
    description: 'Enhanced on-site SEO structuring beyond basic setup.',
    includes: ['Schema markup', 'Structured metadata', 'Sitemap optimization', 'Technical improvements'],
  },
  {
    id: 'performance',
    title: 'Performance Optimization',
    price: '$100',
    description: 'Advanced speed and performance optimization.',
    includes: ['Image compression', 'Code optimization', 'Performance testing', 'Load speed improvements'],
  },
  {
    id: 'email-capture',
    title: 'Email Capture Integration',
    price: '$100',
    description: 'Newsletter signup or lead capture integration.',
    includes: ['Email platform integration', 'Custom signup forms', 'Auto-response setup'],
  },
  {
    id: 'maintenance',
    title: 'Ongoing Website Maintenance',
    price: '$75/month',
    description: 'Optional monthly maintenance for updates and minor edits.',
    includes: ['Small content updates', 'Plugin/tool updates', 'Basic troubleshooting'],
  },
];

function ServiceCardCollapsible({ service, categoryTitle, categoryId, isExpanded, onToggle }) {
  const hasDeliverables = service.deliverables?.length;
  const hasIncludes = service.includes?.length;
  const hasPricingTable = service.pricingTable?.length;
  const list = service.deliverables || service.includes || [];
  const IconComponent = serviceIcons[service.name];

  return (
    <article
      className={`svc-card ${isExpanded ? 'is-expanded' : ''}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
    >
      <span className="svc-card-pill">{categoryTitle}</span>
      {IconComponent && (
        <div className="svc-card-icon" aria-hidden="true">
          <IconComponent size={22} />
        </div>
      )}
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
      <div className="svc-card-expand">
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
      </div>
      <span className="svc-card-toggle" aria-hidden="true">
        {isExpanded ? 'Show less' : 'View deliverables'}
      </span>
    </article>
  );
}

function AddOnCard({ addon, isExpanded, onToggle }) {
  const hasUseCases = addon.useCases?.length;
  return (
    <article
      className={`addon-card ${isExpanded ? 'is-expanded' : ''}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
    >
      <div className="addon-card-header">
        <h3 className="addon-card-title">{addon.title}</h3>
        <span className="addon-card-price">{addon.price}</span>
      </div>
      <p className="addon-card-desc">{addon.description}</p>
      <div className="addon-card-expand">
        {addon.includes?.length > 0 && (
          <ul className="addon-card-includes">
            {addon.includes.map((item) => (
              <li key={item}><Check /> {item}</li>
            ))}
          </ul>
        )}
        {hasUseCases && (
          <div className="addon-card-usecases">
            <span className="addon-card-usecases-label">Use cases:</span>
            <span className="addon-card-usecases-list">{addon.useCases.join(' • ')}</span>
          </div>
        )}
        {addon.payment && (
          <p className="addon-card-payment">{addon.payment}</p>
        )}
      </div>
      <span className="addon-card-toggle" aria-hidden="true">
        {isExpanded ? 'Show less' : 'View details'}
      </span>
    </article>
  );
}

export default function ServicesPage() {
  const [expandedServiceKey, setExpandedServiceKey] = useState(null);
  const [expandedAddOn, setExpandedAddOn] = useState(null);
  const [pillarHover, setPillarHover] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Split Hero */}
      <section className="sv-hero">
        <div className="sv-hero-bg" aria-hidden="true" />
        <div className="wrap sv-hero-wrap">
          <div className="sv-hero-left">
            <h1 className="sv-hero-title">Branding & Websites Built for Real Businesses</h1>
            <p className="sv-hero-sub">
              I design the visuals and build the digital foundation your business needs to launch properly.
            </p>
            <div className="sv-hero-cta">
              <a href="/contact#book" className="btn btn-primary">Start Your Project</a>
              <a href="#packages" className="btn btn-secondary">View Packages</a>
            </div>
          </div>
          <div className="sv-hero-right">
            <div className="sv-hero-visual" />
          </div>
        </div>
      </section>

      {/* What I Build – Pillar blocks */}
      <section className="sv-pillars">
        <div className="wrap">
          <h2 className="sv-pillars-heading">What I Build</h2>
          <div className="sv-pillars-grid">
            {pillarBlocks.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                className={`sv-pillar-block ${pillarHover === pillar.id ? 'is-hover' : ''}`}
                onClick={() => scrollToSection(pillar.id)}
                onMouseEnter={() => setPillarHover(pillar.id)}
                onMouseLeave={() => setPillarHover(null)}
              >
                <span className="sv-pillar-title">{pillar.title}</span>
                <span className="sv-pillar-summary">{pillar.summary}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Breakdown – Modular collapsible by category */}
      <section className="sv-breakdown" id="catalog">
        <div className="wrap">
          <h2 className="sv-heading">Service Breakdown</h2>
          <p className="sv-heading-sub">Clear pricing by category. Expand any card for deliverables and payment details.</p>
          {catalogCategories.map((cat) => (
            <div key={cat.id} className="svc-category" id={cat.id}>
              <h3 className="svc-category-title">{cat.title}</h3>
              <div className="svc-grid">
                {cat.services.map((service) => (
                  <ServiceCardCollapsible
                    key={service.name}
                    service={service}
                    categoryTitle={cat.title}
                    categoryId={cat.id}
                    isExpanded={expandedServiceKey === `${cat.id}-${service.name}`}
                    onToggle={() => setExpandedServiceKey(expandedServiceKey === `${cat.id}-${service.name}` ? null : `${cat.id}-${service.name}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Website Add-Ons – Visually distinct */}
      <section className="sv-addons" id="addons">
        <div className="sv-addons-bg" aria-hidden="true" />
        <div className="wrap">
          <h2 className="sv-addons-heading">Advanced Website Add-Ons</h2>
          <p className="sv-addons-sub">
            Optional upgrades for Business Website, Landing Page, or Website Packages. Pricing added to project invoice.
          </p>
          <div className="addon-grid">
            {websiteAddOns.map((addon) => (
              <AddOnCard
                key={addon.id}
                addon={addon}
                isExpanded={expandedAddOn === addon.id}
                onToggle={() => setExpandedAddOn(expandedAddOn === addon.id ? null : addon.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Package comparison – Premium panels */}
      <section className="sv-packages" id="packages">
        <div className="wrap">
          <h2 className="sv-heading">Packages</h2>
          <p className="sv-heading-sub">Bundled services for a full launch or upgrade.</p>
          <div className="sv-pkg-scroll">
            <div className="sv-pkg-grid">
              {packageCards.map((pkg) => {
                const PkgIcon = packageIcons[pkg.name];
                return (
                <div key={pkg.name} className="sv-pkg-card">
                  <div className="sv-pkg-card-accent" />
                  {PkgIcon && (
                    <div className="sv-pkg-card-icon" aria-hidden="true">
                      <PkgIcon size={20} />
                    </div>
                  )}
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
              );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Process – Horizontal timeline */}
      <section className="sv-process">
        <div className="wrap">
          <h2 className="sv-heading">Process</h2>
          <div className="sv-process-timeline">
            {processSteps.map((step, i) => {
              const StepIcon = processIcons[i];
              return (
              <div key={step.title} className="sv-process-step">
                <div className="sv-process-circle">
                  {StepIcon ? <StepIcon size={20} /> : <span>{String(i + 1).padStart(2, '0')}</span>}
                </div>
                {i < processSteps.length - 1 && <div className="sv-process-line" />}
                <div className="sv-process-content">
                  <h3 className="sv-process-title">{step.title}</h3>
                  <p className="sv-process-desc">{step.desc}</p>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA – Full width deep brand */}
      <section className="sv-cta">
        <div className="sv-cta-bg" aria-hidden="true" />
        <div className="wrap sv-cta-wrap">
          <h2 className="sv-cta-title">Ready to Build Your Business Foundation?</h2>
          <div className="sv-cta-btns">
            <a href="/contact#book" className="btn btn-primary">Start Your Project</a>
            <a href="/contact#book" className="btn btn-secondary">Book Consultation</a>
          </div>
        </div>
      </section>

      <style>{`
        /* ----- Split Hero ----- */
        .sv-hero {
          position: relative;
          padding: var(--space-24) 0;
          min-height: 70vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .sv-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--bg) 0%, var(--bg-elevated) 50%, #0d0d0e 100%);
          z-index: 0;
        }
        .sv-hero-bg::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 80%;
          height: 140%;
          background: radial-gradient(ellipse at center, rgba(212, 76, 67, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .sv-hero-wrap {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
          align-items: center;
        }
        @media (max-width: 900px) {
          .sv-hero-wrap { grid-template-columns: 1fr; text-align: center; }
          .sv-hero-left .sv-hero-cta { justify-content: center; }
          .sv-hero-right { min-height: 200px; order: -1; }
        }
        .sv-hero-title {
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: var(--space-4);
          color: var(--text);
        }
        .sv-hero-sub {
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 480px;
          margin-bottom: var(--space-10);
          line-height: 1.6;
        }
        .sv-hero-cta { display: flex; flex-wrap: wrap; gap: var(--space-4); }
        .sv-hero-visual {
          position: relative;
          width: 100%;
          min-height: 320px;
          border-radius: var(--radius-lg);
          background: linear-gradient(145deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
          border: 1px solid var(--border);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }
        .sv-hero-visual::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 70% 30%, rgba(212, 76, 67, 0.12) 0%, transparent 50%);
          animation: sv-pulse 8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes sv-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        /* ----- What I Build – Pillars ----- */
        .sv-pillars {
          padding: var(--space-20) 0;
          background: var(--bg-elevated);
          border-top: 1px solid var(--border);
        }
        .sv-pillars-heading {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          color: var(--text);
          margin-bottom: var(--space-12);
          text-align: center;
        }
        .sv-pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-6);
        }
        @media (max-width: 900px) { .sv-pillars-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .sv-pillars-grid { grid-template-columns: 1fr; } }
        .sv-pillar-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          padding: var(--space-10);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease);
        }
        .sv-pillar-block:hover,
        .sv-pillar-block.is-hover {
          border-color: var(--brand);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(212, 76, 67, 0.2);
          transform: translateY(-2px);
        }
        .sv-pillar-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: var(--space-2);
        }
        .sv-pillar-summary {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* ----- Service Breakdown ----- */
        .sv-breakdown {
          padding: var(--space-24) 0;
          background: var(--bg);
          position: relative;
        }
        .sv-breakdown::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(212, 76, 67, 0.02) 100%);
          pointer-events: none;
        }
        .sv-heading {
          font-size: clamp(1.75rem, 3.5vw, 2.25rem);
          font-weight: 800;
          margin-bottom: var(--space-3);
          color: var(--text);
        }
        .sv-heading-sub {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-12);
          max-width: 560px;
        }
        .svc-category {
          margin-bottom: var(--space-16);
        }
        .svc-category:last-child { margin-bottom: 0; }
        .svc-category-title {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brand);
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--border);
        }
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-6);
        }
        .svc-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
        }
        .svc-card:hover {
          border-color: var(--border-light);
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        }
        .svc-card.is-expanded {
          border-color: var(--brand);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
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
        .svc-card-icon {
          color: var(--brand);
          margin-bottom: var(--space-3);
        }
        .svc-card-icon svg { display: block; }
        .svc-card-head { margin-bottom: var(--space-3); }
        .svc-card-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text);
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
        .svc-card-expand {
          max-height: 0;
          overflow: hidden;
          transition: max-height var(--duration) var(--ease);
        }
        .svc-card.is-expanded .svc-card-expand { max-height: 500px; }
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
          color: var(--text-secondary);
        }
        .svc-card-table-row:last-child { border-bottom: none; }
        .svc-card-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .svc-card-list li {
          display: flex; align-items: center; gap: var(--space-2);
          font-size: 0.9375rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }
        .svc-card-list svg { color: var(--brand); flex-shrink: 0; }
        .svc-card-toggle {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--brand);
          margin-top: auto;
          display: inline-block;
        }
        .svc-card.is-expanded .svc-card-toggle { margin-top: var(--space-4); }

        /* ----- Add-Ons – Distinct section ----- */
        .sv-addons {
          position: relative;
          padding: var(--space-24) 0;
          background: linear-gradient(180deg, #0f0f10 0%, var(--bg-elevated) 100%);
          border-top: 1px solid var(--border);
        }
        .sv-addons-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212, 76, 67, 0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .sv-addons .wrap { position: relative; z-index: 1; }
        .sv-addons-heading {
          font-size: clamp(1.75rem, 3.5vw, 2.25rem);
          font-weight: 800;
          color: var(--text);
          margin-bottom: var(--space-3);
        }
        .sv-addons-sub {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-12);
          max-width: 560px;
        }
        .addon-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        @media (max-width: 1000px) { .addon-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .addon-grid { grid-template-columns: 1fr; } }
        .addon-card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-left: 3px solid var(--brand);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          cursor: pointer;
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease);
          display: flex;
          flex-direction: column;
        }
        .addon-card:hover {
          border-color: var(--border-light);
          border-left-color: var(--brand-light);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
          transform: translateY(-3px);
        }
        .addon-card.is-expanded {
          border-color: var(--brand);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        .addon-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }
        .addon-card-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1.3;
          margin: 0;
          flex: 1;
        }
        .addon-card-price {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--brand);
          flex-shrink: 0;
        }
        .addon-card-desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 var(--space-4);
        }
        .addon-card-expand {
          max-height: 0;
          overflow: hidden;
          transition: max-height var(--duration) var(--ease);
        }
        .addon-card.is-expanded .addon-card-expand { max-height: 400px; }
        .addon-card-includes {
          list-style: none;
          padding: 0;
          margin: 0 0 var(--space-4);
        }
        .addon-card-includes li {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }
        .addon-card-includes svg { color: var(--brand); flex-shrink: 0; }
        .addon-card-usecases {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-bottom: var(--space-3);
        }
        .addon-card-usecases-label { font-weight: 600; color: var(--text-secondary); margin-right: var(--space-1); }
        .addon-card-payment {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin: 0 0 var(--space-4);
          line-height: 1.5;
        }
        .addon-card-toggle {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--brand);
          margin-top: auto;
          display: inline-block;
        }
        .addon-card.is-expanded .addon-card-toggle { margin-top: var(--space-2); }

        /* ----- Packages – Premium panels ----- */
        .sv-packages {
          padding: var(--space-24) 0;
          background: var(--bg-elevated);
          border-top: 1px solid var(--border);
        }
        .sv-packages .sv-heading,
        .sv-packages .sv-heading-sub { color: var(--text); }
        .sv-packages .sv-heading-sub { color: var(--text-secondary); }
        .sv-pkg-scroll {
          overflow-x: auto;
          margin: 0 calc(-1 * var(--space-6));
          padding: var(--space-4) var(--space-6);
          -webkit-overflow-scrolling: touch;
        }
        .sv-pkg-scroll::-webkit-scrollbar { height: 6px; }
        .sv-pkg-scroll::-webkit-scrollbar-track { background: var(--border); border-radius: 3px; }
        .sv-pkg-scroll::-webkit-scrollbar-thumb { background: var(--brand); border-radius: 3px; }
        .sv-pkg-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(280px, 1fr));
          gap: var(--space-8);
          min-width: min-content;
        }
        @media (max-width: 1100px) { .sv-pkg-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .sv-pkg-grid { grid-template-columns: 1fr; } }
        .sv-pkg-card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-10);
          display: flex;
          flex-direction: column;
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
        }
        .sv-pkg-card:hover {
          border-color: var(--brand);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        .sv-pkg-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--brand);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }
        .sv-pkg-card-icon {
          color: var(--brand);
          margin-bottom: var(--space-3);
        }
        .sv-pkg-card-icon svg { display: block; }
        .sv-pkg-name {
          font-size: 1.375rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: var(--space-2);
        }
        .sv-pkg-price {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--brand);
          margin-bottom: var(--space-3);
        }
        .sv-pkg-for {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
          line-height: 1.5;
        }
        .sv-pkg-includes {
          list-style: none;
          padding: 0;
          margin: 0 0 var(--space-6);
          flex: 1;
        }
        .sv-pkg-includes li {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.9375rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }
        .sv-pkg-includes svg { color: var(--brand); flex-shrink: 0; }
        .sv-pkg-timeline {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--space-2);
        }
        .sv-pkg-goal {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: var(--space-6);
          line-height: 1.5;
        }
        .sv-pkg-cta { width: 100%; }

        /* ----- Process – Horizontal timeline ----- */
        .sv-process {
          padding: var(--space-24) 0;
          background: var(--bg);
          border-top: 1px solid var(--border);
        }
        .sv-process .sv-heading { margin-bottom: var(--space-12); }
        .sv-process-timeline {
          display: flex;
          align-items: flex-start;
          gap: 0;
          position: relative;
        }
        @media (max-width: 900px) {
          .sv-process-timeline { flex-direction: column; gap: var(--space-6); }
          .sv-process-line { display: none; }
        }
        .sv-process-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          min-width: 0;
        }
        .sv-process-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(212, 76, 67, 0.12);
          border: 1px solid rgba(212, 76, 67, 0.35);
          color: var(--brand);
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: var(--space-4);
          box-shadow: 0 0 0 4px var(--bg);
        }
        .sv-process-circle svg { display: block; }
        .sv-process-line {
          flex: 1;
          min-width: 24px;
          height: 2px;
          margin: 25px 0 0;
          background: linear-gradient(90deg, var(--brand) 0%, var(--border) 100%);
          opacity: 0.5;
        }
        @media (max-width: 900px) {
          .sv-process-step { flex-direction: row; align-items: flex-start; gap: var(--space-4); width: 100%; }
          .sv-process-circle { margin-bottom: 0; }
        }
        .sv-process-content {
          text-align: center;
          max-width: 220px;
        }
        @media (max-width: 900px) { .sv-process-content { text-align: left; max-width: none; } }
        .sv-process-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--space-2);
        }
        .sv-process-desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        /* ----- Final CTA ----- */
        .sv-cta {
          position: relative;
          padding: var(--space-24) 0;
          background: linear-gradient(180deg, var(--bg-elevated) 0%, #080808 100%);
          border-top: 1px solid var(--border);
        }
        .sv-cta-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 100% 80% at 50% 100%, rgba(212, 76, 67, 0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .sv-cta .wrap { position: relative; z-index: 1; }
        .sv-cta-wrap { text-align: center; }
        .sv-cta-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-10);
          color: var(--text);
        }
        .sv-cta-btns {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--space-4);
        }
      `}</style>
    </>
  );
}
