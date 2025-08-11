import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="nav">
      <div style={{ fontWeight: 700, marginRight: 12 }}>Crypto Dashboard</div>

      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
        Accueil
      </NavLink>

      <NavLink to="/charts" className={({ isActive }) => (isActive ? 'active' : undefined)}>
        Graphiques
      </NavLink>

      <NavLink to="/indicators" className={({ isActive }) => (isActive ? 'active' : undefined)}>
        Indicateurs
      </NavLink>

      <NavLink to="/watchlist" className={({ isActive }) => (isActive ? 'active' : undefined)}>
        Watchlist
      </NavLink>

      <NavLink to="/pricing" className={({ isActive }) => (isActive ? 'active' : undefined)}>
        Pricing
      </NavLink>
    </nav>
  );
}
