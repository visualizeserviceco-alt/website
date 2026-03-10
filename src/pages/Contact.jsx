import { useEffect } from 'react';

export default function Contact() {
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

  return (
    <>
      <section className="contact-hero section" id="book">
        <div className="contact-hero-bg" aria-hidden="true" />
        <div className="wrap">
          <h1 className="section-title">Contact</h1>
          <p className="section-subtitle">
            Book a consultation below. I&apos;ll confirm and we&apos;ll talk through your project.
          </p>
        </div>
      </section>
      <section className="contact-main section">
        <div className="contact-main-bg" aria-hidden="true" />
        <div className="wrap contact-wrap">
          <div className="calendly-panel">
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/contactvisualize/15min-onboarding-meeting?hide_event_type_details=1&hide_gdpr_banner=1"
              style={{ minWidth: '320px', height: '700px' }}
            />
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
          max-width: 900px;
          margin: 0 auto;
        }
        .calendly-panel {
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .calendly-panel .calendly-inline-widget {
          border-radius: var(--radius-lg);
        }
      `}</style>
    </>
  );
}
