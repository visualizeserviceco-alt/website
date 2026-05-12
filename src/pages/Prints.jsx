import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconCheck, IconSend, IconUser, IconArrowRight, IconLock } from '@tabler/icons-react';
import SplashScreen from '../components/SplashScreen';

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

const VINYL_PRESET_OPTIONS = [
  {
    id: 'instagram',
    label: 'Instagram Handle Vinyl',
    desc: 'Your @handle printed twice — one for each side of your car.',
    badge: '$10 flat',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="32" height="32" rx="10" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="34.5" cy="13.5" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'custom',
    label: 'Custom Vinyl Design',
    desc: 'Any shape, size, and design. Die-cut, window decal, vehicle wrap, and more.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 38 L24 10 L38 38 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="24" cy="26" r="4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

const SHAPE_OPTIONS = [
  { id: 'circle',    label: 'Circle',    preview: <circle cx="24" cy="24" r="18" /> },
  { id: 'square',    label: 'Square',    preview: <rect x="7" y="7" width="34" height="34" rx="3" /> },
  { id: 'rectangle', label: 'Rectangle', preview: <rect x="4" y="12" width="40" height="24" rx="3" /> },
  { id: 'die-cut',   label: 'Die-Cut',   preview: <path d="M24 6 C34 6 42 12 42 20 C42 30 34 42 24 42 C14 42 6 30 6 20 C6 12 14 6 24 6 Z" />, popular: true },
];

const SIZE_OPTIONS = [
  { id: '2x2',    label: '2" × 2"',  note: 'Small / logo mark' },
  { id: '3x3',    label: '3" × 3"',  note: 'Standard' },
  { id: '4x4',    label: '4" × 4"',  note: 'Medium' },
  { id: '5x5',    label: '5" × 5"',  note: 'Large' },
  { id: '6x8',    label: '6" × 8"',  note: 'XL / banner' },
  { id: 'custom', label: 'Custom',    note: 'Specify in notes' },
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
  { id: 'matte',       label: 'Matte',       desc: 'Clean, flat, non-reflective' },
  { id: 'gloss',       label: 'Glossy',      desc: 'Vibrant, shiny surface', popular: true },
  { id: 'holographic', label: 'Holographic', desc: 'Rainbow shimmer effect' },
  { id: 'transparent', label: 'Transparent', desc: 'Clear background' },
];

const DESIGN_OPTIONS = [
  { id: 'ready', label: 'I have artwork ready',  desc: "I'll send print-ready files" },
  { id: 'help',  label: 'I need design help',    desc: 'Design it from scratch for me' },
  { id: 'idea',  label: 'I have a concept/idea', desc: "I'll describe what I'm going for" },
];

const IG_FINISH_OPTIONS = [];

const STEP_LABELS = ['Type', 'Shape', 'Size', 'Quantity', 'Finish', 'Design', 'Your Info'];

function ProgressBar({ step, labels = STEP_LABELS }) {
  return (
    <div className="pr-progress">
      {labels.map((label, i) => (
        <div key={label} className={`pr-progress-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
          <div className="pr-progress-dot">
            {i < step ? <IconCheck size={14} stroke={2.2} /> : <span>{i + 1}</span>}
          </div>
          <span className="pr-progress-label">{label}</span>
          {i < labels.length - 1 && <div className="pr-progress-line" />}
        </div>
      ))}
    </div>
  );
}

function OrderSummary({ order }) {
  const hasAny = order.type || order.shape || order.size || order.quantity;
  if (!hasAny) return null;
  const rows = [
    { label: 'Type',     value: TYPE_OPTIONS.find(o => o.id === order.type)?.label },
    { label: 'Shape',    value: SHAPE_OPTIONS.find(o => o.id === order.shape)?.label },
    { label: 'Size',     value: SIZE_OPTIONS.find(o => o.id === order.size)?.label },
    { label: 'Quantity', value: order.quantity ? `${order.quantity} units` : null },
    { label: 'Finish',   value: FINISH_OPTIONS.find(o => o.id === order.finish)?.label },
    { label: 'Design',   value: DESIGN_OPTIONS.find(o => o.id === order.design)?.label },
    { label: 'Social',   value: order.social || null },
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

function SelectTile({ selected, onClick, children, popular }) {
  return (
    <button
      type="button"
      className={`pr-tile ${selected ? 'pr-tile--active' : ''} ${popular ? 'pr-tile--popular' : ''}`}
      onClick={onClick}
    >
      {popular && <span className="pr-popular-tag">Popular</span>}
      {children}
    </button>
  );
}

export default function Prints() {
  const navigate = useNavigate();
  const [splashDone, setSplashDone] = useState(false);
  const [step, setStep]             = useState(0);
  const [order, setOrder]           = useState({ type: '', shape: '', size: '', quantity: '', finish: '', design: '', name: '', email: '', phone: '', social: '', notes: '' });
  const [igForm, setIgForm]         = useState({ handle: '', finish: 'gloss', carColor: '', name: '', email: '', phone: '', notes: '' });
  const [vinylSubtype, setVinylSubtype] = useState(''); // '' | 'instagram' | 'custom'
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paidReturn, setPaidReturn] = useState(false);
  const [errors, setErrors]         = useState({});

  // Handle return from Stripe Payment Link (?paid=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === '1') {
      window.history.replaceState({}, '', '/prints');
      const raw = sessionStorage.getItem('vz_pending_ig_order');
      if (raw) {
        try {
          const pending = JSON.parse(raw);
          const confirmed = { ...pending, status: 'pending', paymentConfirmed: true };
          const existing = JSON.parse(localStorage.getItem('vz_print_orders') || '[]');
          localStorage.setItem('vz_print_orders', JSON.stringify([confirmed, ...existing]));
          sessionStorage.removeItem('vz_pending_ig_order');
          setOrder(confirmed);
          setPaidReturn(true);
          setSubmitted(true);
        } catch {}
      } else {
        setPaidReturn(true);
        setSubmitted(true);
      }
    }
  }, []);

  const isInstagram = order.type === 'vinyl' && vinylSubtype === 'instagram';

  const resetAll = () => {
    setStep(0);
    setOrder({ type: '', shape: '', size: '', quantity: '', finish: '', design: '', name: '', email: '', phone: '', social: '', notes: '' });
    setIgForm({ handle: '', finish: 'gloss', carColor: '', name: '', email: '', phone: '', notes: '' });
    setVinylSubtype('');
    setSubmitted(false);
    setPaidReturn(false);
    setErrors({});
  };

  const handleBack = () => {
    if (order.type === 'vinyl' && vinylSubtype) {
      setVinylSubtype('');
    } else {
      setStep(s => s - 1);
    }
  };

  const buildSummary = (o) =>
    [
      TYPE_OPTIONS.find(x => x.id === o.type)?.label,
      SHAPE_OPTIONS.find(x => x.id === o.shape)?.label,
      SIZE_OPTIONS.find(x => x.id === o.size)?.label,
      o.quantity ? `${o.quantity} units` : null,
      FINISH_OPTIONS.find(x => x.id === o.finish)?.label,
    ].filter(Boolean).join(' · ');

  const select = (field, value) => {
    setOrder(prev => ({ ...prev, [field]: value }));
    setTimeout(() => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)), 280);
  };

  const selectType = (value) => {
    setOrder(prev => ({ ...prev, type: value }));
    setTimeout(() => setStep(1), 280);
  };

  const validate = () => {
    const e = {};
    if (!order.name.trim())  e.name  = 'First name is required';
    if (!order.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(order.email)) e.email = 'Enter a valid email';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    const orderData = { id: Date.now(), date: new Date().toISOString(), status: 'pending', ...order };
    try {
      const existing = JSON.parse(localStorage.getItem('vz_print_orders') || '[]');
      localStorage.setItem('vz_print_orders', JSON.stringify([orderData, ...existing]));
    } catch {}
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 600);
  };

  const handleInstagramPay = (e) => {
    e.preventDefault();
    const errs = {};
    const rawHandle = igForm.handle.trim().replace(/^@+/, '');
    if (!rawHandle) errs.handle = 'Instagram handle is required';
    if (!igForm.name.trim()) errs.name = 'Your name is required';
    if (!igForm.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(igForm.email)) errs.email = 'Enter a valid email';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const cleanHandle = `@${rawHandle}`;
    const orderData = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'payment_pending',
      type: 'vinyl',
      subtype: 'instagram-vinyl',
      name: igForm.name.trim(),
      email: igForm.email.trim(),
      phone: igForm.phone.trim(),
      handle: cleanHandle,
      finish: 'gloss',
      vinylColor: 'white',
      notes: igForm.notes.trim(),
      amount: 10,
    };

    sessionStorage.setItem('vz_pending_ig_order', JSON.stringify(orderData));

    const stripeLink = import.meta.env.VITE_STRIPE_IG_LINK;
    if (stripeLink) {
      try {
        const url = new URL(stripeLink);
        url.searchParams.set('prefilled_email', igForm.email.trim());
        window.location.href = url.toString();
      } catch {
        window.location.href = stripeLink;
      }
    } else {
      // Dev fallback: skip payment
      const confirmed = { ...orderData, status: 'pending', paymentConfirmed: true };
      const existing = JSON.parse(localStorage.getItem('vz_print_orders') || '[]');
      localStorage.setItem('vz_print_orders', JSON.stringify([confirmed, ...existing]));
      sessionStorage.removeItem('vz_pending_ig_order');
      setOrder(confirmed);
      setPaidReturn(true);
      setSubmitted(true);
    }
  };

  const previewHandle = igForm.handle
    ? `@${igForm.handle.replace(/^@+/, '')}`
    : '@yourhandle';

  // ── Success screen ──────────────────────────────────────────────────────
  if (submitted) {
    const isIgOrder = order.subtype === 'instagram-vinyl' || paidReturn;
    return (
      <div className="pr-page">
        <div className="pr-success">
          <div className="pr-success-icon">
            <svg viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="var(--brand)" strokeWidth="2.5" />
              <path d="M20 32l8 8 16-16" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {isIgOrder ? (
            <>
              <h1 className="pr-success-title">Payment Confirmed!</h1>
              <p className="pr-success-sub">
                Thanks, <strong>{order.name}</strong>! Your Instagram handle vinyl for{' '}
                <strong>{order.handle}</strong> is confirmed — printed twice, one for each side of your car.
              </p>
              <p className="pr-success-note">
                I&apos;ll send a proof to <strong>{order.email}</strong> before printing. Usually within 1 business day.
              </p>
            </>
          ) : (
            <>
              <h1 className="pr-success-title">Quote Request Submitted!</h1>
              <p className="pr-success-sub">
                Thanks, <strong>{order.name}</strong>. I received your request for{' '}
                <strong>{buildSummary(order) || 'custom prints'}</strong>.
                I&apos;ll reach out to <strong>{order.email}</strong> with a quote and payment details.
              </p>
              <p className="pr-success-note">
                I personally review every order before sending a quote — usually within 1 business day.
              </p>
            </>
          )}

          <div className="pr-portal-prompt">
            <div className="pr-portal-prompt-icon" aria-hidden="true">
              <IconUser size={22} stroke={1.8} />
            </div>
            <div>
              <p className="pr-portal-title">Track your order status</p>
              <p className="pr-portal-desc">Create a free client account to see live updates on your order and invoices.</p>
            </div>
            <button className="btn btn-primary pr-portal-btn" onClick={() => navigate('/portal')}>
              Create Account <IconArrowRight size={14} stroke={2} />
            </button>
          </div>

          <p className="pr-success-contact">
            Questions? Call or text <a href="tel:+13024687077">(302) 468-7077</a>
          </p>
          <div className="pr-success-actions">
            <button className="btn btn-primary" onClick={resetAll}>
              Place Another Order
            </button>
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
          </div>
        </div>
        <style>{prStyles}</style>
      </div>
    );
  }

  // ── Instagram Handle Vinyl form ─────────────────────────────────────────
  if (isInstagram && step >= 1) {
    return (
      <div className="pr-page">
        <div className="pr-bg" aria-hidden="true" />
        <div className="pr-header">
          <Link to="/" className="pr-back-home">
            <IconArrowLeft size={14} stroke={2} /> Back to site
          </Link>
          <h1 className="pr-page-title">Instagram Handle Vinyl</h1>
          <p className="pr-page-sub">Printed twice — one for each side of your car. $10 flat rate.</p>
        </div>

        <ProgressBar step={1} labels={['Choose Type', 'Details & Pay']} />

        <div className="pr-layout pr-ig-layout">
          <div className="pr-main">
            <form onSubmit={handleInstagramPay} noValidate>
              <div className="pr-step">
                <p className="pr-step-counter">Step 2 of 2</p>
                <h2 className="pr-step-title">Your details</h2>
                <p className="pr-step-sub">Fill in your handle and info, then pay $10 securely via Stripe.</p>
                <div className="pr-form pr-step-body">

                  {/* Handle field */}
                  <div className="pr-field">
                    <label className="pr-label">Instagram Handle <span>*</span></label>
                    <div className="pr-ig-handle-wrap">
                      <span className="pr-ig-at">@</span>
                      <input
                        className={`pr-input pr-ig-handle-input ${errors.handle ? 'pr-input--error' : ''}`}
                        value={igForm.handle.replace(/^@+/, '')}
                        onChange={e => { setIgForm(f => ({ ...f, handle: e.target.value })); setErrors(p => ({ ...p, handle: '' })); }}
                        placeholder="yourhandle"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                      />
                    </div>
                    {errors.handle && <span className="pr-error">{errors.handle}</span>}
                    <span className="pr-field-hint">Printed twice — once for each side of your car.</span>
                  </div>

                  {/* Color note */}
                  <div className="pr-ig-color-note">
                    <span className="pr-ig-color-swatch" />
                    <p>Printed in <strong>white gloss</strong> by default. Need a different color? Mention it in the notes below.</p>
                  </div>

                  {/* Name + Email */}
                  <div className="pr-form-row">
                    <div className="pr-field">
                      <label className="pr-label">Your Name <span>*</span></label>
                      <input
                        className={`pr-input ${errors.name ? 'pr-input--error' : ''}`}
                        value={igForm.name}
                        onChange={e => { setIgForm(f => ({ ...f, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                        placeholder="First name"
                        autoComplete="given-name"
                      />
                      {errors.name && <span className="pr-error">{errors.name}</span>}
                    </div>
                    <div className="pr-field">
                      <label className="pr-label">Email <span>*</span></label>
                      <input
                        type="email"
                        className={`pr-input ${errors.email ? 'pr-input--error' : ''}`}
                        value={igForm.email}
                        onChange={e => { setIgForm(f => ({ ...f, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                      {errors.email && <span className="pr-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="pr-field">
                    <label className="pr-label">Phone <span className="pr-label-opt">(optional)</span></label>
                    <input
                      type="tel"
                      className="pr-input"
                      value={igForm.phone}
                      onChange={e => setIgForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="(555) 000-0000"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="pr-field">
                    <label className="pr-label">Notes <span className="pr-label-opt">(optional)</span></label>
                    <textarea
                      className="pr-input pr-textarea"
                      value={igForm.notes}
                      onChange={e => setIgForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Any special requests, sizing preferences, etc."
                      rows={3}
                    />
                  </div>

                  {/* Payment box */}
                  <div className="pr-ig-payment-box">
                    <div className="pr-ig-payment-price">
                      <span className="pr-ig-payment-label">Total Today</span>
                      <span className="pr-ig-payment-amount">$10.00</span>
                      <span className="pr-ig-payment-desc">Instagram handle vinyl × 2 (both car sides)</span>
                    </div>
                    <button type="submit" className="btn btn-primary pr-ig-pay-btn">
                      <IconLock size={15} stroke={2} />
                      Pay $10 with Stripe
                    </button>
                    <p className="pr-ig-pay-note">
                      Secure checkout via Stripe. You&apos;ll be redirected to complete payment, then returned here with your confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </form>

            <button
              type="button"
              className="pr-back-btn"
              onClick={() => setVinylSubtype('')}
            >
              <IconArrowLeft size={14} stroke={2} /> Back
            </button>
          </div>

          {/* Preview aside */}
          <aside className="pr-aside">
            <div className="pr-ig-preview-card">
              <p className="pr-ig-preview-title">Handle Preview</p>
              <div className="pr-ig-preview-vinyl">
                <span className="pr-ig-preview-handle">{previewHandle}</span>
              </div>
              <p className="pr-ig-preview-sub">Printed twice — driver &amp; passenger sides</p>
            </div>
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

  // ── Standard configurator ───────────────────────────────────────────────
  return (
    <div className="pr-page">
      {!splashDone && (
        <SplashScreen
          subtitle="Loading order system…"
          duration={800}
          onDone={() => setSplashDone(true)}
        />
      )}
      <div className="pr-bg" aria-hidden="true" />

      <div className="pr-header">
        <Link to="/" className="pr-back-home">
          <IconArrowLeft size={14} stroke={2} />
          Back to site
        </Link>
        <h1 className="pr-page-title">Custom Print Order</h1>
        <p className="pr-page-sub">Configure your order and I&apos;ll send you a quote.</p>
      </div>

      <ProgressBar step={step} />

      <div className="pr-layout">
        <div className="pr-main">

          {step === 0 && (
            <StepWrapper step={0} total={TOTAL_STEPS} title="What would you like to print?" subtitle="Choose your product type.">
              <div className="pr-type-grid">
                {TYPE_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} selected={order.type === opt.id} onClick={() => selectType(opt.id)}>
                    {opt.badge && <span className="pr-type-badge">{opt.badge}</span>}
                    <div className="pr-type-icon">{opt.icon}</div>
                    <strong className="pr-tile-label">{opt.label}</strong>
                    <span className="pr-tile-desc">{opt.desc}</span>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* Vinyl preset picker — shown before shape when vinyl type is not yet chosen */}
          {step === 1 && order.type === 'vinyl' && !vinylSubtype && (
            <StepWrapper step={1} total={TOTAL_STEPS} title="What kind of vinyl?" subtitle="Choose a preset or go fully custom.">
              <div className="pr-vinyl-preset-grid">
                {VINYL_PRESET_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} onClick={() => setVinylSubtype(opt.id)}>
                    {opt.badge && <span className="pr-type-badge">{opt.badge}</span>}
                    <div className="pr-type-icon">{opt.icon}</div>
                    <strong className="pr-tile-label">{opt.label}</strong>
                    <span className="pr-tile-desc">{opt.desc}</span>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 1 && (order.type !== 'vinyl' || vinylSubtype === 'custom') && (
            <StepWrapper step={1} total={TOTAL_STEPS} title="Choose a shape">
              <div className="pr-shape-grid">
                {SHAPE_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} selected={order.shape === opt.id} popular={opt.popular} onClick={() => select('shape', opt.id)}>
                    <svg className="pr-shape-svg" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      {opt.preview}
                    </svg>
                    <strong className="pr-tile-label">{opt.label}</strong>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

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

          {step === 4 && (
            <StepWrapper step={4} total={TOTAL_STEPS} title="Choose a finish">
              <div className="pr-finish-grid">
                {FINISH_OPTIONS.map(opt => (
                  <SelectTile key={opt.id} selected={order.finish === opt.id} popular={opt.popular} onClick={() => select('finish', opt.id)}>
                    <div className={`pr-finish-swatch pr-finish-swatch--${opt.id}`} aria-hidden="true" />
                    <strong className="pr-tile-label">{opt.label}</strong>
                    <span className="pr-tile-desc">{opt.desc}</span>
                  </SelectTile>
                ))}
              </div>
            </StepWrapper>
          )}

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

          {step === 6 && (
            <StepWrapper step={6} total={TOTAL_STEPS} title="Almost done — your info" subtitle="I'll send your quote to this email.">
              <form className="pr-form" onSubmit={handleSubmit} noValidate>
                <div className="pr-form-row">
                  <div className="pr-field">
                    <label className="pr-label">First Name <span>*</span></label>
                    <input
                      className={`pr-input ${errors.name ? 'pr-input--error' : ''}`}
                      value={order.name}
                      onChange={e => { setOrder(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                      placeholder="Your first name"
                      autoComplete="given-name"
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
                      autoComplete="email"
                    />
                    {errors.email && <span className="pr-error">{errors.email}</span>}
                  </div>
                </div>
                <div className="pr-form-row">
                  <div className="pr-field">
                    <label className="pr-label">Phone <span className="pr-label-opt">(optional)</span></label>
                    <input
                      type="tel"
                      className="pr-input"
                      value={order.phone}
                      onChange={e => setOrder(p => ({ ...p, phone: e.target.value }))}
                      placeholder="(555) 000-0000"
                      autoComplete="tel"
                    />
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">Social Media <span className="pr-label-opt">(optional)</span></label>
                    <input
                      className="pr-input"
                      value={order.social}
                      onChange={e => setOrder(p => ({ ...p, social: e.target.value }))}
                      placeholder="@handle or profile link"
                    />
                  </div>
                </div>
                <div className="pr-field">
                  <label className="pr-label">Notes / details <span className="pr-label-opt">(optional)</span></label>
                  <textarea
                    className="pr-input pr-textarea"
                    value={order.notes}
                    onChange={e => setOrder(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Describe your design, colors, requirements, or custom size dimensions..."
                    rows={4}
                  />
                </div>
                <button type="submit" className="btn btn-primary pr-submit-btn" disabled={submitting}>
                  <IconSend size={16} stroke={1.8} />
                  {submitting ? 'Submitting…' : 'Submit Quote Request'}
                </button>
              </form>
            </StepWrapper>
          )}

          {step > 0 && (
            <button type="button" className="pr-back-btn" onClick={handleBack}>
              <IconArrowLeft size={14} stroke={2} />
              Back
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
  @media (max-width: 600px) {
    .pr-page { padding: var(--space-6) 0 var(--space-16); }
    .pr-header { margin-bottom: var(--space-6); padding: 0 var(--space-4); }
    .pr-layout { padding: 0 var(--space-4); }
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
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.875rem; color: var(--text-muted);
    margin-bottom: var(--space-4); transition: color 0.2s;
  }
  .pr-back-home:hover { color: var(--text); }
  .pr-page-title {
    font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800;
    letter-spacing: -0.03em; color: var(--text); margin-bottom: var(--space-2);
  }
  .pr-page-sub { color: var(--text-secondary); font-size: 1rem; }

  /* Progress */
  .pr-progress {
    display: flex; align-items: flex-start; justify-content: center;
    max-width: 860px; margin: 0 auto var(--space-10);
    padding: 0 var(--space-6); overflow-x: auto;
  }
  .pr-progress-step {
    display: flex; flex-direction: column; align-items: center;
    position: relative; flex: 1; min-width: 60px;
  }
  .pr-progress-dot {
    width: 32px; height: 32px; border-radius: 50%;
    border: 2px solid var(--border-light); background: var(--bg-card);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; color: var(--text-muted);
    transition: all 0.25s; z-index: 1; position: relative;
  }
  .pr-progress-step.active .pr-progress-dot {
    border-color: var(--brand); background: rgba(212,76,67,0.15); color: var(--brand);
  }
  .pr-progress-step.done .pr-progress-dot {
    border-color: var(--brand); background: var(--brand); color: #fff;
  }
  .pr-progress-dot svg { width: 14px; height: 14px; }
  .pr-progress-label {
    font-size: 0.68rem; color: var(--text-muted);
    text-align: center; margin-top: var(--space-2); white-space: nowrap;
    transition: color 0.25s;
  }
  .pr-progress-step.active .pr-progress-label,
  .pr-progress-step.done   .pr-progress-label { color: var(--text-secondary); }
  .pr-progress-line {
    position: absolute; top: 16px; left: 50%;
    width: 100%; height: 2px; background: var(--border); z-index: 0;
  }
  .pr-progress-step.done .pr-progress-line { background: var(--brand); }
  @media (max-width: 600px) {
    .pr-progress { margin-bottom: var(--space-6); padding: 0 var(--space-4); gap: 0; }
    .pr-progress-step { min-width: 32px; }
    .pr-progress-dot { width: 24px; height: 24px; font-size: 0.65rem; }
    .pr-progress-dot svg { width: 11px; height: 11px; }
    .pr-progress-label { display: none; }
    .pr-progress-line { top: 12px; }
    .pr-progress-step.active .pr-progress-label { display: block; font-size: 0.7rem; }
  }

  /* Layout */
  .pr-layout {
    display: grid; grid-template-columns: 1fr 280px;
    gap: var(--space-8); max-width: 1000px;
    margin: 0 auto; padding: 0 var(--space-6); align-items: start;
  }
  @media (max-width: 860px) {
    .pr-layout { grid-template-columns: 1fr; }
    .pr-aside { order: -1; }
  }

  /* Step */
  .pr-step-counter {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--brand); margin-bottom: var(--space-2);
  }
  .pr-step-title {
    font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800;
    letter-spacing: -0.02em; color: var(--text); margin-bottom: var(--space-2);
  }
  .pr-step-sub { font-size: 0.9375rem; color: var(--text-secondary); margin-bottom: var(--space-6); }
  .pr-step-body { margin-bottom: var(--space-8); }

  /* Tile grids */
  .pr-type-grid         { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
  .pr-vinyl-preset-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
  .pr-shape-grid        { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3); }
  .pr-option-grid       { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
  .pr-finish-grid       { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3); }
  .pr-design-grid       { display: grid; grid-template-columns: 1fr; gap: var(--space-3); }
  @media (max-width: 600px) {
    .pr-type-grid         { grid-template-columns: 1fr; }
    .pr-vinyl-preset-grid { grid-template-columns: 1fr; }
    .pr-shape-grid  { grid-template-columns: 1fr 1fr; }
    .pr-option-grid { grid-template-columns: 1fr 1fr; }
    .pr-finish-grid { grid-template-columns: 1fr 1fr; }
  }

  /* Tile */
  .pr-tile {
    display: flex; flex-direction: column; align-items: flex-start;
    text-align: left; padding: var(--space-5);
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border); border-radius: var(--radius-lg);
    cursor: pointer; width: 100%; position: relative; min-height: 56px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.18s, background 0.2s;
    -webkit-tap-highlight-color: transparent;
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
  .pr-tile--popular { border-color: rgba(212,76,67,0.35); }
  .pr-popular-tag {
    position: absolute; top: -9px; right: 10px;
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; background: var(--brand);
    color: #fff; padding: 2px 8px; border-radius: 999px;
  }
  .pr-type-badge {
    position: absolute; top: var(--space-3); right: var(--space-3);
    font-size: 0.7rem; font-weight: 800;
    background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.35);
    color: #22c55e; padding: 2px 8px; border-radius: 999px;
  }
  .pr-type-icon { width: 48px; height: 48px; color: var(--brand); margin-bottom: var(--space-3); }
  .pr-type-icon svg { width: 100%; height: 100%; }
  .pr-shape-svg { width: 52px; height: 52px; color: var(--text-muted); margin-bottom: var(--space-2); transition: color 0.2s; }
  .pr-tile--active .pr-shape-svg { color: var(--brand); }
  .pr-tile-label { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 4px; display: block; }
  .pr-tile-label--xl { font-size: 1.5rem; }
  .pr-tile-desc { font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5; }

  /* Finish swatches */
  .pr-finish-swatch { width: 100%; height: 36px; border-radius: var(--radius); margin-bottom: var(--space-3); }
  .pr-finish-swatch--matte       { background: #2a2a2a; border: 1px solid var(--border-light); }
  .pr-finish-swatch--gloss       { background: linear-gradient(135deg, #fff 0%, #aaa 50%, #fff 100%); }
  .pr-finish-swatch--holographic { background: linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff); }
  .pr-finish-swatch--transparent { background: repeating-conic-gradient(#333 0% 25%, #1a1a1a 0% 50%) 0 0 / 14px 14px; }

  /* Back btn */
  .pr-back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: none; color: var(--text-muted);
    font-size: 0.875rem; cursor: pointer; padding: 0; transition: color 0.2s;
  }
  .pr-back-btn:hover { color: var(--text); }

  /* Form */
  .pr-form { display: flex; flex-direction: column; gap: var(--space-4); }
  .pr-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
  @media (max-width: 600px) { .pr-form-row { grid-template-columns: 1fr; } }
  .pr-field { display: flex; flex-direction: column; gap: var(--space-2); }
  .pr-label { font-size: 0.875rem; font-weight: 600; color: var(--text); }
  .pr-label span { color: var(--brand); }
  .pr-label-opt { color: var(--text-muted); font-weight: 400; }
  .pr-field-hint { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
  .pr-input {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius); border: 1px solid var(--border-light);
    background: var(--glass-bg); color: var(--text); font-size: 0.9375rem;
    font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
  }
  .pr-input:focus { border-color: var(--brand); box-shadow: 0 0 0 1px rgba(212,76,67,0.3); }
  .pr-input--error { border-color: rgba(220,70,70,0.7); }
  .pr-textarea { resize: vertical; min-height: 100px; }
  .pr-error { font-size: 0.8rem; color: rgba(220,80,80,0.9); }
  .pr-submit-btn { display: inline-flex; align-items: center; gap: 7px; padding: var(--space-4) var(--space-8); font-size: 1rem; margin-top: var(--space-2); align-self: flex-start; }
  .pr-submit-btn:disabled { opacity: 0.6; cursor: default; }
  @media (max-width: 600px) {
    .pr-submit-btn { width: 100%; justify-content: center; padding: var(--space-4); }
  }

  /* IG color note */
  .pr-ig-color-note {
    display: flex; align-items: center; gap: var(--space-3);
    background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border);
    border-radius: var(--radius); padding: var(--space-3) var(--space-4);
    font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5;
  }
  .pr-ig-color-swatch {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: #fff;
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }

  /* Instagram Handle input */
  .pr-ig-handle-wrap { display: flex; align-items: center; }
  .pr-ig-at {
    padding: var(--space-3) var(--space-3) var(--space-3) var(--space-4);
    border: 1px solid var(--border-light); border-right: none;
    border-radius: var(--radius) 0 0 var(--radius);
    background: rgba(255,255,255,0.04); color: var(--text-muted);
    font-size: 1rem; font-weight: 700; line-height: 1;
    display: flex; align-items: center;
  }
  .pr-ig-handle-input { border-radius: 0 var(--radius) var(--radius) 0 !important; }

  /* IG finish row */
  .pr-ig-finish-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
  @media (max-width: 500px) { .pr-ig-finish-row { grid-template-columns: 1fr; } }
  .pr-ig-finish-tile { padding: var(--space-3) var(--space-4); min-height: 0; }

  /* Payment box */
  .pr-ig-payment-box {
    margin-top: var(--space-2);
    background: linear-gradient(135deg, rgba(212,76,67,0.1), rgba(212,76,67,0.04));
    border: 1px solid rgba(212,76,67,0.25);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    display: flex; flex-direction: column; gap: var(--space-4);
  }
  .pr-ig-payment-price { text-align: center; }
  .pr-ig-payment-label {
    display: block; font-size: 0.7rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: var(--space-2);
  }
  .pr-ig-payment-amount {
    display: block; font-size: 2.8rem; font-weight: 900;
    color: var(--text); letter-spacing: -0.04em; line-height: 1;
  }
  .pr-ig-payment-desc { display: block; font-size: 0.8125rem; color: var(--text-muted); margin-top: var(--space-2); }
  .pr-ig-pay-btn {
    width: 100%; justify-content: center; gap: 8px;
    padding: var(--space-4); font-size: 1rem; font-weight: 700;
  }
  .pr-ig-pay-note {
    font-size: 0.78rem; color: var(--text-muted); text-align: center; line-height: 1.55;
  }

  /* IG Preview card */
  .pr-ig-preview-card {
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-5); text-align: center;
  }
  .pr-ig-preview-title {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: var(--space-4);
  }
  .pr-ig-preview-vinyl {
    background: linear-gradient(135deg, #1a1a1a, #111);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    padding: var(--space-4) var(--space-5);
    margin-bottom: var(--space-3);
    display: flex; align-items: center; justify-content: center;
  }
  .pr-ig-preview-handle {
    font-size: 1.1rem; font-weight: 800; color: #fff;
    letter-spacing: -0.01em; font-family: 'Inter', sans-serif;
    word-break: break-all;
  }
  .pr-ig-preview-sub { font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; }

  /* Aside */
  .pr-aside { display: flex; flex-direction: column; gap: var(--space-4); position: sticky; top: 96px; }
  .pr-summary {
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-5);
  }
  .pr-summary-title {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: var(--space-3);
  }
  .pr-summary-row {
    display: flex; justify-content: space-between;
    font-size: 0.875rem; padding: var(--space-2) 0;
    border-top: 1px solid var(--glass-border);
  }
  .pr-summary-key { color: var(--text-muted); }
  .pr-summary-val { color: var(--text); font-weight: 600; }
  .pr-aside-contact {
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-4); text-align: center;
  }
  .pr-aside-contact-text { font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-1); }
  .pr-aside-phone { font-size: 1rem; font-weight: 700; color: var(--brand); display: block; }
  .pr-aside-phone:hover { text-decoration: underline; }

  /* Success screen */
  .pr-success {
    max-width: 520px; margin: var(--space-16) auto;
    padding: 0 var(--space-6); text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: var(--space-4);
  }
  .pr-success-icon { width: 80px; height: 80px; }
  .pr-success-icon svg { width: 100%; height: 100%; }
  .pr-success-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; color: var(--text); }
  .pr-success-sub { font-size: 1rem; color: var(--text-secondary); line-height: 1.7; }
  .pr-success-note {
    font-size: 0.875rem; color: var(--text-muted);
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg); padding: var(--space-4) var(--space-5); line-height: 1.6;
  }
  .pr-success-contact { font-size: 0.875rem; color: var(--text-muted); }
  .pr-success-contact a { color: var(--brand); font-weight: 600; }
  .pr-success-actions {
    display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: center;
  }
  .pr-success-actions .btn { padding: var(--space-3) var(--space-6); }
  @media (max-width: 500px) {
    .pr-success-actions { flex-direction: column; width: 100%; }
    .pr-success-actions .btn { width: 100%; justify-content: center; }
  }

  /* Portal prompt box */
  .pr-portal-prompt {
    width: 100%; display: flex; align-items: center; gap: var(--space-4);
    background: var(--glass-bg-strong); border: 1px solid var(--glass-border-brand);
    border-radius: var(--radius-lg); padding: var(--space-5) var(--space-6);
    text-align: left; flex-wrap: wrap;
  }
  .pr-portal-prompt-icon {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    background: rgba(212,76,67,0.12);
    display: flex; align-items: center; justify-content: center; color: var(--brand);
  }
  .pr-portal-title { font-size: 0.9375rem; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .pr-portal-desc { font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.55; flex: 1; }
  .pr-portal-btn { flex-shrink: 0; font-size: 0.875rem; padding: 8px 16px; white-space: nowrap; }
`;
