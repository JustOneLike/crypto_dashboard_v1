import React from 'react';
import { NavLink } from 'react-router-dom';

function Brand() {
  return (
    <div className="brand">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 17l6-6 4 4 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="4" r="2" fill="currentColor"/>
      </svg>
      <span>Crypto Dashboard</span>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-row">
        <Brand />
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>Accueil</NavLink>
          <NavLink to="/charts" className={({ isActive }) => isActive ? 'active' : undefined}>Graphiques</NavLink>
          <NavLink to="/indicators" className={({ isActive }) => isActive ? 'active' : undefined}>Indicateurs</NavLink>
          <NavLink to="/watchlist" className={({ isActive }) => isActive ? 'active' : undefined}>Watchlist</NavLink>
          <NavLink to="/pricing" className={({ isActive }) => isActive ? 'active' : undefined}>Pricing</NavLink>
        </nav>
      </div>
    </header>
  );
}
