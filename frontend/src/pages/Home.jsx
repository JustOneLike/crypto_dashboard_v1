import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Analyse crypto claire et actionnable.</h1>
          <p className="subtitle">
            Suivez vos actifs, visualisez le marché en temps réel et appuyez vos décisions
            avec les scores LTPI / MTPI / CMVI.
          </p>
          <div className="hero-cta">
            <Link to="/charts" className="btn btn-primary">Voir les graphiques</Link>
            <Link to="/watchlist" className="btn btn-ghost">Configurer ma watchlist</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="hero-card" />
          <div className="hero-card offset" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="grid3">
          <div className="card">
            <div className="icon">📈</div>
            <h3>Scores propriétaires</h3>
            <p>LTPI/MTPI/CMVI calculés côté serveur pour des signaux plus fiables.</p>
          </div>
          <div className="card">
            <div className="icon">⭐</div>
            <h3>Watchlist personnalisée</h3>
            <p>Concentrez-vous sur vos coins. Ajoutez, réordonnez, suivez.</p>
          </div>
          <div className="card">
            <div className="icon">🔔</div>
            <h3>Alertes (à venir)</h3>
            <p>Recevez des notifications Telegram quand un seuil est atteint.</p>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="preview">
        <h2>Aperçu du tableau de bord</h2>
        <div className="grid2">
          <div className="card tall">
            <div className="placeholder-chart" />
          </div>
          <div className="stack">
            <div className="card small">LTPI • MTPI • CMVI</div>
            <div className="card small">Watchlist (extraits)</div>
            <div className="card small">Variations 24h</div>
          </div>
        </div>
      </section>
    </div>
  );
}
