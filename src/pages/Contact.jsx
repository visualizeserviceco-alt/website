import { useState, useEffect } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  useEffect(() => {
    if (window.location.hash === '#book') {
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (document.querySelector('script[src*="calendly.com"]')) return;
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
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
      <section className="contact-hero section" id="book">
        <div className="contact-hero-bg" aria-hidden="true" />
        <div className="wrap">
          <h1 className="section-title">Contact</h1>
          <p className="section-subtitle">
            Book a consultation or send a message. I&apos;ll respond within one business day.
          </p>
        </div>
      </section>
      <section className="contact-main section">
        <div className="contact-main-bg" aria-hidden="true" />
        <div className="wrap contact-wrap">
          <div className="contact-calendly">
            <div className="calendly-panel">
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/contactvisualize/15min-onboarding-meeting?hide_event_type_details=1&hide_gdpr_banner=1"
                style={{ minWidth: '320px', height: '700px' }}
              />
            </div>
          </div>
          <div className="contact-form-wrap">
            <div className="contact-form-panel">
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
        </div>
      </section>
      <style>{`
        .contact-hero {
          position: relative;
          background: var(--bg);
          padding-bottom: var(--space-12);
        }
        .contact-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212, 76, 67, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .contact-hero .wrap { position: relative; z-index: 1; }
        .contact-main {
          position: relative;
          background: var(--bg-elevated);
          border-top: 1px solid var(--border);
        }
        .contact-main-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212, 76, 67, 0.04) 0%, transparent 50%);
          pointer-events: none;
        }
        .contact-main .wrap { position: relative; z-index: 1; }
        .contact-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
          align-items: start;
        }
        @media (max-width: 900px) {
          .contact-wrap { grid-template-columns: 1fr; }
        }
        .calendly-panel {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .calendly-panel .calendly-inline-widget {
          border-radius: var(--radius-lg);
        }
        .contact-form-panel {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-10);
        }
        .contact-form-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
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
          color: var(--text-secondary);
        }
        .contact-form input,
        .contact-form textarea {
          padding: var(--space-3) var(--space-4);
          font-size: 1rem;
          font-family: inherit;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--bg-elevated);
          color: var(--text);
        }
        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: var(--text-muted);
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
