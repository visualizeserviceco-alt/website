import { useState } from 'react';
import {
  IconPencil,
  IconDeviceDesktop,
  IconPrinter,
  IconMapPin,
  IconChevronDown,
  IconCheck,
} from '@tabler/icons-react';

const pillars = [
  {
    title: 'Brand Identity',
    items: ['Logo design', 'Brand identity', 'Brand guidelines'],
    icon: IconPencil,
    color: '#d44c43',
  },
  {
    title: 'Website Development',
    items: ['Business websites', 'Landing pages', 'Contact forms'],
    icon: IconDeviceDesktop,
    color: '#60a5fa',
  },
  {
    title: 'Print & Physical',
    items: ['Stickers', 'Business cards', 'Print-ready files'],
    icon: IconPrinter,
    color: '#a78bfa',
  },
  {
    title: 'Digital Setup',
    items: ['Google Business Profile', 'Basic analytics setup', 'Launch essentials'],
    icon: IconMapPin,
    color: '#34d399',
  },
];

export default function Services() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="services section section-elevated" id="services">
      <div className="wrap">
        <h2 className="section-title reveal">Studio Services</h2>
        <p className="section-subtitle reveal">
          Brand identity, websites, print design, and essential digital setup, delivered directly, start to finish.
        </p>
        <div className="services-grid stagger">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            const isOpen = expanded === i;
            return (
              <button
                key={pillar.title}
                type="button"
                className={`services-card ${isOpen ? 'is-expanded' : ''}`}
                style={{ '--sc': pillar.color }}
                onMouseEnter={() => setExpanded(i)}
                onMouseLeave={() => setExpanded(null)}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div className="services-card-top">
                  <div className="services-card-icon">
                    <Icon size={20} stroke={1.8} />
                  </div>
                  <IconChevronDown
                    size={16}
                    stroke={1.8}
                    className={`services-card-chevron ${isOpen ? 'is-open' : ''}`}
                  />
                </div>
                <h3 className="services-card-title">{pillar.title}</h3>
                <ul className="services-card-list">
                  {pillar.items.map((item) => (
                    <li key={item}>
                      <IconCheck size={13} stroke={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-5);
          margin-top: var(--space-12);
        }
        @media (max-width: 1024px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .services-grid { grid-template-columns: 1fr; } }

        .services-card {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          cursor: pointer; text-align: left; width: 100%;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s, background 0.25s;
          position: relative; overflow: hidden;
        }
        .services-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--sc, var(--brand));
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s var(--ease);
        }
        .services-card:hover::before,
        .services-card.is-expanded::before { transform: scaleX(1); }
        .services-card:hover,
        .services-card.is-expanded {
          border-color: color-mix(in srgb, var(--sc) 45%, transparent);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25), 0 0 0 1px color-mix(in srgb, var(--sc) 15%, transparent);
          background: color-mix(in srgb, var(--sc) 5%, var(--glass-bg));
          transform: translateY(-2px);
        }
        .services-card-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: var(--space-4);
        }
        .services-card-icon {
          width: 40px; height: 40px; border-radius: var(--radius);
          background: color-mix(in srgb, var(--sc) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--sc) 25%, transparent);
          display: flex; align-items: center; justify-content: center;
          color: var(--sc, var(--brand));
          transition: background 0.25s;
        }
        .services-card:hover .services-card-icon,
        .services-card.is-expanded .services-card-icon {
          background: color-mix(in srgb, var(--sc) 20%, transparent);
        }
        .services-card-chevron {
          color: var(--text-muted); transition: transform 0.25s, color 0.25s;
        }
        .services-card-chevron.is-open { transform: rotate(180deg); color: var(--sc, var(--brand)); }
        .services-card-title {
          font-size: 1.0625rem; font-weight: 700; color: var(--text);
          margin-bottom: var(--space-4); line-height: 1.3;
        }
        .services-card-list {
          list-style: none; padding: 0;
          display: flex; flex-direction: column; gap: var(--space-2);
        }
        .services-card-list li {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.875rem; color: var(--text-secondary); line-height: 1.4;
        }
        .services-card-list svg { color: var(--sc, var(--brand)); flex-shrink: 0; }
      `}</style>
    </section>
  );
}
