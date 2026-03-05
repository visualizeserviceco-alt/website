export default function CTA() {
  return (
    <section className="cta section section-dark">
      <div className="wrap cta-inner">
        <h2 className="cta-title">Ready to Build a System That Generates Customers?</h2>
        <a href="/contact#book" className="btn btn-primary cta-btn">Book Your Strategy Call</a>
      </div>
      <style>{`
        .cta {
          background: var(--bg);
          border-top: 1px solid var(--border);
        }
        .cta-inner {
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
        }
        .cta-btn {
          padding: var(--space-4) var(--space-8);
          font-size: 1rem;
        }
      `}</style>
    </section>
  );
}
