import { useState, useEffect } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  useEffect(() => {
    if (window.location.hash === '#book') {
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: wire to your backend or form service
  };

  return (
    <>
      <section className="page-hero section section-dark" id="book">
        <div className="wrap">
          <h1 className="section-title">Contact</h1>
          <p className="section-subtitle">
            Book a strategy call or send a message. We'll respond within one business day.
          </p>
        </div>
      </section>
      <section className="section section-light">
        <div className="wrap contact-wrap">
          <div className="contact-calendly">
            <div className="calendly-placeholder">
              <p>Calendly embed placeholder</p>
              <p className="calendly-hint">Replace this block with your Calendly embed or link.</p>
              <a href="#" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                Open scheduling link
              </a>
            </div>
          </div>
          <div className="contact-form-wrap">
            <h2 className="contact-form-title">Or send a message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <label>
                <span>Name</span>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                <span>Company (optional)</span>
                <input type="text" name="company" value={form.company} onChange={handleChange} />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} required />
              </label>
              <button type="submit" className="btn btn-primary">Send message</button>
            </form>
          </div>
        </div>
      </section>
      <style>{`
        .page-hero { padding-bottom: var(--space-12); }
        .contact-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
          align-items: start;
        }
        @media (max-width: 900px) {
          .contact-wrap { grid-template-columns: 1fr; }
        }
        .calendly-placeholder {
          background: #f5f5f5;
          border: 1px dashed #d4d4d4;
          border-radius: var(--radius-lg);
          padding: var(--space-12);
          text-align: center;
          color: #737373;
        }
        .calendly-hint {
          font-size: 0.875rem;
          margin-top: var(--space-2);
        }
        .contact-form-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0a0a0a;
          margin-bottom: var(--space-6);
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .contact-form label {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .contact-form span {
          font-size: 0.875rem;
          font-weight: 500;
          color: #262626;
        }
        .contact-form input,
        .contact-form textarea {
          padding: var(--space-3) var(--space-4);
          font-size: 1rem;
          font-family: inherit;
          border: 1px solid #e5e5e5;
          border-radius: var(--radius);
          background: #fff;
        }
        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--brand);
        }
      `}</style>
    </>
  );
}
