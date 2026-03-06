export default function CTA() {
  return (
    <section className="cta section">
      <div className="cta-bg" aria-hidden="true" />
      <div className="wrap cta-inner">
        <h2 className="cta-title">Ready to Build a Brand and Website You’re Proud Of?</h2>
        <a href="/contact#book" className="btn btn-primary cta-btn">Book a Consultation</a>
      </div>
      <style>{`
        .cta {
          position: relative;
          background: linear-gradient(180deg, var(--bg-elevated) 0%, #080808 100%);
          border-top: 1px solid var(--border);
        }
        .cta-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 100% 80% at 50% 100%, rgba(212, 76, 67, 0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .cta-inner {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        .cta-title {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: var(--space-8);
          max-width: 16ch;
          margin-left: auto;
          margin-right: auto;
          color: var(--text);
        }
        .cta-btn {
          padding: var(--space-4) var(--space-8);
          font-size: 1rem;
        }
      `}</style>
    </section>
  );
}
