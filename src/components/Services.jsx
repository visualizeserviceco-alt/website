import { useState } from 'react';

const pillars = [
  {
    title: 'Brand Development',
    items: ['Logo', 'Brand system', 'Print assets'],
  },
  {
    title: 'Website & Funnels',
    items: ['High-converting websites', 'Landing pages', 'Booking systems'],
  },
  {
    title: 'Lead Generation',
    items: ['Paid ads setup', 'Google optimization', 'Retargeting systems'],
  },
  {
    title: 'Growth & Retainers',
    items: ['Ongoing ad management', 'Campaign optimization', 'Strategy consulting'],
  },
];

export default function Services() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="services section section-light" id="services">
      <div className="wrap">
        <h2 className="section-title">Full-Stack Marketing</h2>
        <p className="section-subtitle">
          From brand and website to lead generation and ongoing growth. One partner, end-to-end.
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
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          cursor: pointer;
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
        }
        .services-card:hover,
        .services-card.is-expanded {
          border-color: #d4d4d4;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }
        .services-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0a0a0a;
          margin-bottom: var(--space-4);
        }
        .services-card-list {
          list-style: none;
          font-size: 0.9375rem;
          color: #525252;
          line-height: 1.8;
        }
        .services-card-list li {
          padding-left: var(--space-4);
          position: relative;
        }
        .services-card-list li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: var(--brand);
        }
      `}</style>
    </section>
  );
}
