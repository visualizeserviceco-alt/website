import { useState } from 'react';
import { IconPenTool, IconBrowser, IconSticker, IconMapPin } from './Icons';

const pillars = [
  { title: 'Brand Identity', items: ['Logo design', 'Brand identity', 'Brand guidelines'], icon: IconPenTool },
  { title: 'Website Development', items: ['Business websites', 'Landing pages', 'Contact forms'], icon: IconBrowser },
  { title: 'Print & Physical', items: ['Stickers', 'Business cards', 'Print-ready files'], icon: IconSticker },
  { title: 'Digital Setup', items: ['Google Business Profile', 'Basic analytics setup', 'Launch essentials'], icon: IconMapPin },
];

export default function Services() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="services section section-elevated" id="services">
      <div className="wrap">
        <h2 className="section-title">Studio Services</h2>
        <p className="section-subtitle">
          Brand identity, websites, print design, and essential digital setup, delivered directly, start to finish.
        </p>
        <div className="services-grid">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`services-card ${expanded === i ? 'is-expanded' : ''}`}
              onMouseEnter={() => setExpanded(i)}
              onMouseLeave={() => setExpanded(null)}
              onClick={() => setExpanded(expanded === i ? null : i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setExpanded(expanded === i ? null : i)}
            >
              {pillar.icon && (
                <div className="services-card-icon" aria-hidden="true">
                  <pillar.icon size={22} />
                </div>
              )}
              <h3 className="services-card-title">{pillar.title}</h3>
              <ul className="services-card-list">
                {pillar.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-6);
          margin-top: var(--space-12);
        }
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .services-grid { grid-template-columns: 1fr; }
        }
        .services-card {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          cursor: pointer;
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
        }
        .services-card:hover,
        .services-card.is-expanded {
          border-color: var(--brand);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
        }
        .services-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--space-4);
        }
        .services-card-list {
          list-style: none;
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.8;
        }
        .services-card-list li {
          padding-left: var(--space-4);
          position: relative;
        }
        .services-card-list li::before {
          content: '-';
          position: absolute;
          left: 0;
          color: var(--brand);
        }
      `}</style>
    </section>
  );
}
