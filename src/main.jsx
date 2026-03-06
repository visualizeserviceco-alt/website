import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

function Maintenance({ onUnlock }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUnlock) onUnlock(password.trim());
  };

  return (
    <div className="maintenance-screen">
      <div className="maintenance-glow" aria-hidden="true" />
      <div className="wrap maintenance-inner">
        <div className="maintenance-badge">Temporary Maintenance</div>
        <h1 className="maintenance-title">I&apos;m updating the studio.</h1>
        <p className="maintenance-sub">
          The site is briefly offline while I update projects and improve the experience.
          In the meantime, follow along on Instagram for updates, new work, and openings.
        </p>
        <a
          href="https://instagram.com/yourhandle"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary maintenance-cta"
        >
          <span className="maintenance-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.5" cy="6.5" r="1.2" />
            </svg>
          </span>
          Follow on Instagram
        </a>
        <form className="maintenance-form" onSubmit={handleSubmit}>
          <label className="maintenance-label">
            Enter access password to continue:
            <input
              type="password"
              className="maintenance-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="btn btn-secondary maintenance-enter">
            Enter site
          </button>
        </form>
      </div>
    </div>
  );
}

const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

const maintenancePassword = import.meta.env.VITE_MAINTENANCE_PASSWORD || '';

function Root() {
  const [unlocked, setUnlocked] = useState(false);

  if (maintenanceMode && !unlocked) {
    return (
      <Maintenance
        onUnlock={(entered) => {
          if (!maintenancePassword || entered === maintenancePassword) {
            setUnlocked(true);
          }
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
