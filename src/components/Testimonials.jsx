const quotes = [
  { text: 'Clear communication, strong design, and a smooth handoff. Everything felt organized from day one.', author: 'Client', company: 'Local Business' },
  { text: 'The brand and website came together quickly, and the details were handled with care.', author: 'Client', company: 'Local Business' },
  { text: 'The final site looks professional, loads fast, and matches the brand perfectly.', author: 'Client', company: 'Local Business' },
];

export default function Testimonials() {
  return (
    <section className="testimonials section section-elevated">
      <div className="wrap">
        <h2 className="section-title">What Clients Say</h2>
        <div className="testimonials-grid">
          {quotes.map((q, i) => (
            <blockquote key={i} className="testimonial-card">
              <p className="testimonial-text">"{q.text}"</p>
              <footer>
                <cite className="testimonial-author">{q.author}</cite>
                <span className="testimonial-company">{q.company}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-8);
          margin-top: var(--space-12);
        }
        @media (max-width: 900px) {
          .testimonials-grid { grid-template-columns: 1fr; }
        }
        .testimonial-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          margin: 0;
          transition: border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
        }
        .testimonial-card:hover {
          border-color: var(--border-light);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .testimonial-text {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-6);
        }
        .testimonial-author {
          font-weight: 600;
          color: var(--text);
          font-style: normal;
        }
        .testimonial-company {
          display: block;
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: var(--space-1);
        }
      `}</style>
    </section>
  );
}
