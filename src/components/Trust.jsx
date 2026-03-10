export default function Trust() {
  const placeholders = ['Client', 'Client', 'Client', 'Client', 'Client'];

  return (
    <section className="trust section section-elevated">
      <div className="trust-bg" aria-hidden="true" />
      <div className="wrap">
        <p className="trust-label">Trusted by local businesses</p>
        <div className="trust-logos">
          {placeholders.map((name, i) => (
            <div key={i} className="trust-logo" title={name}>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .trust {
          position: relative;
          padding-top: var(--space-12);
          padding-bottom: var(--space-12);
        }
        .trust-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212, 76, 67, 0.04) 0%, transparent 50%);
          pointer-events: none;
        }
        .trust .wrap { position: relative; z-index: 1; }
        .trust-label {
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          text-align: center;
          margin-bottom: var(--space-6);
        }
        .trust-logos {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: var(--space-10);
        }
        .trust-logo {
          width: 120px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: var(--radius);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
}
