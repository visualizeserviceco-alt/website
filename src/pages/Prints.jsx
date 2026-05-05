import { useState } from 'react';
import { Link } from 'react-router-dom';

const TOTAL_STEPS = 7;

const TYPE_OPTIONS = [
  {
    id: 'stickers',
    label: 'Custom Stickers',
    desc: 'Die-cut, circle, square & rectangle. Perfect for branding, packaging, and handouts.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'vinyl',
    label: 'Vinyl Prints',
    desc: 'Durable vinyl for vehicles, windows, walls, and outdoor applications. Weatherproof.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <path d="M8 20h32M16 12v24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 28l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const SHAPE_OPTIONS = [
  { id: 'circle',    label: 'Circle',    preview: <circle cx="24" cy="24" r="18" /> },
  { id: 'square',    label: 'Square',    preview: <rect x="7" y="7" width="34" height="34" rx="3" /> },
  { id: 'rectangle', label: 'Rectangle', preview: <rect x="4" y="12" width="40" height="24" rx="3" /> },
  { id: 'die-cut',   label: 'Die-Cut',   preview: <path d="M24 6 C34 6 42 12 42 20 C42 30 34 42 24 42 C14 42 6 30 6 20 C6 12 14 6 24 6 Z" /> },
];

const SIZE_OPTIONS = [
  { id: '2x2', label: '2" × 2"', note: 'Small / logo mark' },
  { id: '3x3', label: '3" × 3"', note: 'Standard' },
  { id: '4x4', label: '4" × 4"', note: 'Medium' },
  { id: '5x5', label: '5" × 5"', note: 'Large' },
  { id: '6x8', label: '6" × 8"', note: 'XL / banner' },
  { id: 'custom', label: 'Custom', note: 'Specify in notes' },
];

const QTY_OPTIONS = [
  { id: '25',   label: '25' },
  { id: '50',   label: '50' },
  { id: '100',  label: '100' },
  { id: '250',  label: '250' },
  { id: '500',  label: '500' },
  { id: '1000', label: '1,000+' },
];

const FINISH_OPTIONS = [
  { id: 'matte',        label: 'Matte',        desc: 'Clean, flat, non-reflective finish' },
  { id: 'gloss',        label: 'Glossy',       desc: 'Vibrant, shiny surface' },
  { id: 'holographic',  label: 'Holographic',  desc: 'Rainbow shimmer effect' },
  { id: 'transparent',  label: 'Transparent',  desc: 'Clear background, design only' },
];

const DESIGN_OPTIONS = [
  { id: 'ready', label: 'I have artwork ready',    desc: "I'll send print-ready files" },
  { id: 'help',  label: 'I need design help',       desc: 'Design it from scratch for me' },
  { id: 'idea',  label: "I have a concept/idea",    desc: "I'll describe what I'm going for" },
];

const STEP_LABELS = ['Type', 'Shape', 'Size', 'Quantity', 'Finish', 'Design', 'Your Info'];

function ProgressBar({ step }) {
  return (
    <div className="pr-progress">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className={`pr-progress-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
          <div className="pr-progress-dot">
            {i < step ? (
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          <span className="pr-progress-label">{label}</span>
          {i < STEP_LABELS.length - 1 && <div className="pr-progress-line" />}
        </div>
      ))}
    </div>
  );
}

function OrderSummary({ order }) {
  const hasAny = Object.values(order).some(v => v && typeof v === 'string' && !['name','email','phone','notes'].includes(v));
  if (!hasAny) return null;
  const rows = [
    { label: 'Type',     value: TYPE_OPTIONS.find(o => o.id === order.type)?.label },
    { label: 'Shape',    value: SHAPE_OPTIONS.find(o => o.id === order.shape)?.label },
    { label: 'Size',     value: SIZE_OPTIONS.find(o => o.id === order.size)?.label },
    { label: 'Quantity', value: order.quantity ? `${order.quantity} units` : null },
    { label: 'Finish',   value: FINISH_OPTIONS.find(o => o.id === order.finish)?.label },
    { label: 'Design',   value: DESIGN_OPTIONS.find(o => o.id === order.design)?.label },
  ].filter(r => r.value);

  return (
    <div className="pr-summary">
      <p className="pr-summary-title">Your Order</p>
      {rows.map(r => (
        <div key={r.label} className="pr-summary-row">
          <span className="pr-summary-key">{r.label}</span>
          <span className="pr-summary-val">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function StepWrapper({ title, subtitle, children, step, total }) {
  return (
    <div className="pr-step">
      <p className="pr-step-counter">Step {step + 1} of {total}</p>
      <h2 className="pr-step-title">{title}</h2>
      {subtitle && <p className="pr-step-sub">{subtitle}</p>}
      <div className="pr-step-body">{children}</div>
    </div>
  );
}

function SelectTile({ selected, onClick, children }) {
  return (
    <button
      type="button"
      className={`pr-tile ${selected ? 'pr-tile--active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function Prints() {
  const [step, setStep]         = useState(0);
  const [order, setOrder]       = useState({ type: '', shape: '', size: '', quantity: '', finish: '', design: '', name: '', email: '', phone: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]     = useState({});

  const select = (field, value) => {
    setOrder(prev => ({ ...prev, [field]: value }));
    setTimeout(() => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)), 280);
  };

  const validate = () => {
    const e = {};
    if (!order.name.trim())  e.name  = 'Name is required';
    if (!order.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(order.email)) e.email = 'Enter a valid email';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);

    const orderData = {
      id:       Date.now(),
      date:     new Date().toISOString(),
      type:     order.type,
      shape:    order.shape,
      size:     order.size,
      quantity: order.quantity,
      finish:   order.finish,
      design:   order.design,
      name:     order.name,
      email:    order.email,
      phone:    order.phone,
      notes:    order.notes,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('vz_print_orders') || '[]');
      localStorage.setItem('vz_print_orders', JSON.stringify([orderData, ...existing]));
    } catch (_) {}

    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 600);
  };

  if (submitted) {
    return (
      <div className="pr-page">
        <div className="pr-success">
          <div className="pr-success-icon">
            <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" stroke="var(--brand)" strokeWidth="2.5" /><path d="M20 32l8 8 16-16" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h1 className="pr-success-title">Quote Request Sent!</h1>
          <p className="pr-success-sub">
            Thanks, <strong>{order.name}</strong>. I received your request for{' '}
            <strong>{order.quantity} {TYPE_OPTIONS.find(o => o.id === order.type)?.label}</strong>.
            I&apos;ll reach out to <strong>{order.email}</strong> shortly with a quote.
          </p>
          <p className="pr-success-contact">
            Questions? Call or text <a href="tel:+13024687077">(302) 468-7077</a>
          </p>
          <Link to="/" className="btn btn-primary pr-success-btn">Back to Home</Link>
        </div>
        <style>{prStyles}</style>
      </div>
    );
  }

  return (
    <div className="pr-page">
      <div className="pr-bg" aria-hidden="true" />

      <div className="pr-header">
        <Link to="/" className="pr-back-home">← Back to site</Link>
        <h1 className="pr-page-title">Custom Print Order</h1>
        <p className="pr-page-sub">Configure your order below and I&apos;ll send you a quote.</p>
      </div>

      <ProgressBar step={step} />

      <div className="pr-layout">
        <div className="pr-main">

          {/* Step 0 — Type */}
          {step === 0 && (
            <StepWrapper step={0} total={TOTAL_STEPS} title="What would you like to print?" subtitle="Choose the product type for your order.">
              <div className="pr-type-grid">
                {TYPE_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} selected={order.type === opt.id} onClick={() => select('type', opt.id)}>
                    <div className="pr-type-icon">{opt.icon}</div>
                    <strong className="pr-tile-label">{opt.label}</strong>
                    <span className="pr-tile-desc">{opt.desc}</span>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* Step 1 — Shape */}
          {step === 1 && (
            <StepWrapper step={1} total={TOTAL_STEPS} title="Choose a shape">
              <div className="pr-shape-grid">
                {SHAPE_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} selected={order.shape === opt.id} onClick={() => select('shape', opt.id)}>
                    <svg className="pr-shape-svg" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      {opt.preview}
                    </svg>
                    <strong className="pr-tile-label">{opt.label}</strong>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* Step 2 — Size */}
          {step === 2 && (
            <StepWrapper step={2} total={TOTAL_STEPS} title="Select a size">
              <div className="pr-option-grid">
                {SIZE_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} selected={order.size === opt.id} onClick={() => select('size', opt.id)}>
                    <strong className="pr-tile-label">{opt.label}</strong>
                    <span className="pr-tile-desc">{opt.note}</span>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* Step 3 — Quantity */}
          {step === 3 && (
            <StepWrapper step={3} total={TOTAL_STEPS} title="How many do you need?">
              <div className="pr-option-grid">
                {QTY_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} selected={order.quantity === opt.id} onClick={() => select('quantity', opt.id)}>
                    <strong className="pr-tile-label pr-tile-label--xl">{opt.label}</strong>
                    <span className="pr-tile-desc">units</span>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* Step 4 — Finish */}
          {step === 4 && (
            <StepWrapper step={4} total={TOTAL_STEPS} title="Choose a finish">
              <div className="pr-finish-grid">
                {FINISH_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} selected={order.finish === opt.id} onClick={() => select('finish', opt.id)}>
                    <div className={`pr-finish-swatch pr-finish-swatch--${opt.id}`} aria-hidden="true" />
                    <strong className="pr-tile-label">{opt.label}</strong>
                    <span className="pr-tile-desc">{opt.desc}</span>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* Step 5 — Design source */}
          {step === 5 && (
            <StepWrapper step={5} total={TOTAL_STEPS} title="What's your design situation?">
              <div className="pr-design-grid">
                {DESIGN_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} selected={order.design === opt.id} onClick={() => select('design', opt.id)}>
                    <strong className="pr-tile-label">{opt.label}</strong>
                    <span className="pr-tile-desc">{opt.desc}</span>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* Step 6 — Contact info */}
          {step === 6 && (
            <StepWrapper step={6} total={TOTAL_STEPS} title="Almost done — your info" subtitle="I'll send a quote to your email.">
              <form className="pr-form" onSubmit={handleSubmit} noValidate>
                <div className="pr-form-row">
                  <div className="pr-field">
                    <label className="pr-label">Name <span>*</span></label>
                    <input
                      className={`pr-input ${errors.name ? 'pr-input--error' : ''}`}
                      value={order.name}
                      onChange={e => { setOrder(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                      placeholder="Your full name"
                    />
                    {errors.name && <span className="pr-error">{errors.name}</span>}
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">Email <span>*</span></label>
                    <input
                      type="email"
                      className={`pr-input ${errors.email ? 'pr-input--error' : ''}`}
                      value={order.email}
                      onChange={e => { setOrder(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                      placeholder="you@example.com"
                    />
                    {errors.email && <span className="pr-error">{errors.email}</span>}
                  </div>
                </div>
                <div className="pr-field">
                  <label className="pr-label">Phone <span className="pr-label-opt">(optional)</span></label>
                  <input
                    type="tel"
                    className="pr-input"
                    value={order.phone}
                    onChange={e => setOrder(p => ({ ...p, phone: e.target.value }))}
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div className="pr-field">
                  <label className="pr-label">Notes / details <span className="pr-label-opt">(optional)</span></label>
                  <textarea
                    className="pr-input pr-textarea"
                    value={order.notes}
                    onChange={e => setOrder(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Describe your design, colors, any specific requirements, or custom size dimensions..."
                    rows={4}
                  />
                </div>
                <button type="submit" className="btn btn-primary pr-submit-btn" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Submit Quote Request'}
                </button>
              </form>
            </StepWrapper>
          )}

          {step > 0 && (
            <button type="button" className="pr-back-btn" onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
        </div>

        <aside className="pr-aside">
          <OrderSummary order={order} />
          <div className="pr-aside-contact">
            <p className="pr-aside-contact-text">Have a question?</p>
            <a href="tel:+13024687077" className="pr-aside-phone">(302) 468-7077</a>
            <p className="pr-aside-contact-text" style={{ fontSize: '0.78rem', marginTop: '4px' }}>Call or text</p>
          </div>
        </aside>
      </div>

      <style>{prStyles}</style>
    </div>
  );
}

const prStyles = `
  .pr-page {
    position: relative;
    min-height: 100vh;
    background: var(--bg);
    padding: var(--space-12) 0 var(--space-24);
    overflow: hidden;
  }
  .pr-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,76,67,0.09) 0%, transparent 55%);
    pointer-events: none;
  }
  .pr-header {
    max-width: 860px;
    margin: 0 auto var(--space-10);
    padding: 0 var(--space-6);
  }
  .pr-back-home {
    display: inline-block;
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-bottom: var(--space-4);
    transition: color 0.2s;
  }
  .pr-back-home:hover { color: var(--text); }
  .pr-page-title {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: var(--space-2);
  }
  .pr-page-sub {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  /* Progress bar */
  .pr-progress {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 0;
    max-width: 860px;
    margin: 0 auto var(--space-10);
    padding: 0 var(--space-6);
    overflow-x: auto;
  }
  .pr-progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    min-width: 60px;
  }
  .pr-progress-dot {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2px solid var(--border-light);
    background: var(--bg-card);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700;
    color: var(--text-muted);
    transition: border-color 0.25s, background 0.25s, color 0.25s;
    z-index: 1;
    position: relative;
  }
  .pr-progress-step.active .pr-progress-dot {
    border-color: var(--brand);
    background: rgba(212,76,67,0.15);
    color: var(--brand);
  }
  .pr-progress-step.done .pr-progress-dot {
    border-color: var(--brand);
    background: var(--brand);
    color: #fff;
  }
  .pr-progress-dot svg { width: 14px; height: 14px; }
  .pr-progress-label {
    font-size: 0.68rem;
    color: var(--text-muted);
    text-align: center;
    margin-top: var(--space-2);
    white-space: nowrap;
    transition: color 0.25s;
  }
  .pr-progress-step.active .pr-progress-label,
  .pr-progress-step.done   .pr-progress-label { color: var(--text-secondary); }
  .pr-progress-line {
    position: absolute;
    top: 16px; left: 50%;
    width: 100%; height: 2px;
    background: var(--border);
    z-index: 0;
  }
  .pr-progress-step.done .pr-progress-line { background: var(--brand); }

  /* Layout */
  .pr-layout {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: var(--space-8);
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 var(--space-6);
    align-items: start;
  }
  @media (max-width: 860px) {
    .pr-layout { grid-template-columns: 1fr; }
    .pr-aside { order: -1; }
  }

  /* Step */
  .pr-step { }
  .pr-step-counter {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--brand);
    margin-bottom: var(--space-2);
  }
  .pr-step-title {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: var(--space-2);
  }
  .pr-step-sub {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
  }
  .pr-step-body { margin-bottom: var(--space-8); }

  /* Tiles */
  .pr-type-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
  .pr-shape-grid  { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3); }
  .pr-option-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
  .pr-finish-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3); }
  .pr-design-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-3); }
  @media (max-width: 600px) {
    .pr-type-grid   { grid-template-columns: 1fr; }
    .pr-shape-grid  { grid-template-columns: 1fr 1fr; }
    .pr-option-grid { grid-template-columns: 1fr 1fr; }
    .pr-finish-grid { grid-template-columns: 1fr 1fr; }
  }

  .pr-tile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: var(--space-5);
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.18s, background 0.2s;
    width: 100%;
  }
  .pr-tile:hover {
    border-color: rgba(212,76,67,0.5);
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    transform: translateY(-2px);
  }
  .pr-tile--active {
    border-color: var(--brand);
    background: rgba(212,76,67,0.1);
    box-shadow: 0 0 0 1px rgba(212,76,67,0.3), 0 8px 32px rgba(0,0,0,0.2);
  }
  .pr-type-icon {
    width: 48px; height: 48px;
    color: var(--brand);
    margin-bottom: var(--space-3);
  }
  .pr-type-icon svg { width: 100%; height: 100%; }
  .pr-shape-svg {
    width: 52px; height: 52px;
    color: var(--text-muted);
    margin-bottom: var(--space-2);
    transition: color 0.2s;
  }
  .pr-tile--active .pr-shape-svg { color: var(--brand); }
  .pr-tile-label {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
    display: block;
  }
  .pr-tile-label--xl { font-size: 1.5rem; }
  .pr-tile-desc {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  /* Finish swatches */
  .pr-finish-swatch {
    width: 100%; height: 36px;
    border-radius: var(--radius);
    margin-bottom: var(--space-3);
  }
  .pr-finish-swatch--matte       { background: #2a2a2a; border: 1px solid var(--border-light); }
  .pr-finish-swatch--gloss       { background: linear-gradient(135deg, #fff 0%, #aaa 50%, #fff 100%); }
  .pr-finish-swatch--holographic { background: linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff); }
  .pr-finish-swatch--transparent { background: repeating-conic-gradient(#333 0% 25%, #1a1a1a 0% 50%) 0 0 / 14px 14px; }

  /* Back button */
  .pr-back-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }
  .pr-back-btn:hover { color: var(--text); }

  /* Form */
  .pr-form { display: flex; flex-direction: column; gap: var(--space-4); }
  .pr-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
  @media (max-width: 600px) { .pr-form-row { grid-template-columns: 1fr; } }
  .pr-field { display: flex; flex-direction: column; gap: var(--space-2); }
  .pr-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text);
  }
  .pr-label span { color: var(--brand); }
  .pr-label-opt { color: var(--text-muted); font-weight: 400; }
  .pr-input {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius);
    border: 1px solid var(--border-light);
    background: var(--glass-bg);
    color: var(--text);
    font-size: 0.9375rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .pr-input:focus {
    border-color: var(--brand);
    box-shadow: 0 0 0 1px rgba(212,76,67,0.3);
  }
  .pr-input--error { border-color: rgba(220,70,70,0.7); }
  .pr-textarea { resize: vertical; min-height: 100px; }
  .pr-error { font-size: 0.8rem; color: rgba(220,80,80,0.9); }
  .pr-submit-btn {
    padding: var(--space-4) var(--space-8);
    font-size: 1rem;
    margin-top: var(--space-2);
    align-self: flex-start;
  }
  .pr-submit-btn:disabled { opacity: 0.6; cursor: default; }

  /* Aside */
  .pr-aside {
    display: flex; flex-direction: column; gap: var(--space-4);
    position: sticky; top: 96px;
  }
  .pr-summary {
    background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
  }
  .pr-summary-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: var(--space-3);
  }
  .pr-summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    padding: var(--space-2) 0;
    border-top: 1px solid var(--glass-border);
  }
  .pr-summary-key { color: var(--text-muted); }
  .pr-summary-val { color: var(--text); font-weight: 600; }
  .pr-aside-contact {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    text-align: center;
  }
  .pr-aside-contact-text { font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-1); }
  .pr-aside-phone {
    font-size: 1rem;
    font-weight: 700;
    color: var(--brand);
    display: block;
  }
  .pr-aside-phone:hover { text-decoration: underline; }

  /* Success */
  .pr-success {
    max-width: 540px;
    margin: var(--space-24) auto;
    padding: var(--space-12) var(--space-6);
    text-align: center;
  }
  .pr-success-icon { width: 80px; height: 80px; margin: 0 auto var(--space-6); }
  .pr-success-icon svg { width: 100%; height: 100%; }
  .pr-success-title {
    font-size: 2rem; font-weight: 800; letter-spacing: -0.03em;
    color: var(--text); margin-bottom: var(--space-4);
  }
  .pr-success-sub {
    font-size: 1rem; color: var(--text-secondary);
    line-height: 1.7; margin-bottom: var(--space-4);
  }
  .pr-success-contact {
    font-size: 0.9rem; color: var(--text-muted); margin-bottom: var(--space-8);
  }
  .pr-success-contact a { color: var(--brand); font-weight: 600; }
  .pr-success-btn { padding: var(--space-3) var(--space-8); }
`;
