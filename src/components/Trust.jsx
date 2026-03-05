export default function Trust() {
  const placeholders = ['Client', 'Client', 'Client', 'Client', 'Client'];

  return (
    <section className="trust section section-dark">
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
        .trust { padding-top: var(--space-12); padding-bottom: var(--space-12); }
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
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
}
