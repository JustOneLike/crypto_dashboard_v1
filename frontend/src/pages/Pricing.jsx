import React from 'react';

export default function Pricing() {
  return (
    <div className="page">
      <h2>Tarifs</h2>
      <div className="grid3">
        <div className="card pricing">
          <h3>Gratuit</h3>
          <ul>
            <li>Watchlist</li>
            <li>Graphiques de base</li>
            <li>Scores simplifiés</li>
          </ul>
          <button className="btn btn-ghost">Commencer</button>
        </div>
        <div className="card pricing featured">
          <h3>Pro</h3>
          <ul>
            <li>Scores avancés LTPI/MTPI/CMVI</li>
            <li>Alertes Telegram</li>
            <li>Portefeuilles connectés</li>
          </ul>
          <button className="btn btn-primary">Choisir Pro</button>
        </div>
        <div className="card pricing">
          <h3>Entreprise</h3>
          <ul>
            <li>Accès API</li>
            <li>SLAs & support</li>
            <li>Features custom</li>
          </ul>
          <button className="btn btn-ghost">Nous contacter</button>
        </div>
      </div>
    </div>
  );
}
