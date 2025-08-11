import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page home">
      <section className="hero card">
        <div className="hero-text">
          <h1>Analyse crypto pro, simple et puissante</h1>
          <p className="lead">
            Suivez vos actifs, visualisez des indicateurs avancés (EMA, RSI, MACD, Bollinger, SuperTrend)
            et évaluez vos risques avec des KPIs pros (Sharpe, Sortino, Corrélation BTC, ADX).
          </p>
          <div className="actions">
            <NavLink to="/indicators" className="btn primary">Explorer les indicateurs</NavLink>
            <NavLink to="/charts" className="btn">Voir les graphiques</NavLink>
          </div>
        </div>
        <div className="hero-aside">
          <div className="mini-kpis">
            <div className="kpi">
              <span className="kpi-label">Actifs suivis</span>
              <span className="kpi-value">3+</span>
            </div>
            <div className="kpi">
              <span className="kpi-label">Indicateurs</span>
              <span className="kpi-value">8</span>
            </div>
            <div className="kpi">
              <span className="kpi-label">KPIs</span>
              <span className="kpi-value">4</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid3">
        <div className="card feature">
          <h3>Indicateurs techniques</h3>
          <p className="muted">EMA, MACD, RSI, Bandes de Bollinger, ATR, SuperTrend, OBV.</p>
        </div>
        <div className="card feature">
          <h3>KPIs avancés</h3>
          <p className="muted">Sharpe 30j, Sortino 30j, ADX(14), Corrélation BTC 30j.</p>
        </div>
        <div className="card feature">
          <h3>Scores propriétaires</h3>
          <p className="muted">LTPI, MTPI, CMVI pour une lecture rapide des tendances.</p>
        </div>
      </section>
    </div>
  );
}
