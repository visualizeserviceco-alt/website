import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

function Maintenance() {
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
        <p className="maintenance-note">
          You can still reach me by email at <span>hello@visualizestudio.com</span>.
        </p>
      </div>
    </div>
  );
}

const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {maintenanceMode ? (
      <Maintenance />
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>
);
