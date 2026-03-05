const quotes = [
  { text: 'They helped us launch our brand and site on time. Professional and strategic.', author: 'Client', company: 'Local Business' },
  { text: 'Our website now generates consistent leads. The process was clear from day one.', author: 'Client', company: 'Local Business' },
  { text: 'Full-stack support: brand, site, and ongoing marketing. One team, real results.', author: 'Client', company: 'Local Business' },
];

export default function Testimonials() {
  return (
    <section className="testimonials section section-light">
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
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          margin: 0;
        }
        .testimonial-text {
          font-size: 1rem;
          color: #262626;
          line-height: 1.7;
          margin-bottom: var(--space-6);
        }
        .testimonial-author {
          font-weight: 600;
          color: #0a0a0a;
          font-style: normal;
        }
        .testimonial-company {
          display: block;
          font-size: 0.875rem;
          color: #737373;
          margin-top: var(--space-1);
        }
      `}</style>
    </section>
  );
}
