import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="brand">
          <span className="logo-dot" />
          <span>Crypto Dashboard</span>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Accueil</NavLink>
          <NavLink to="/charts" className={({isActive}) => isActive ? 'active' : ''}>Graphiques</NavLink>
          <NavLink to="/indicators" className={({isActive}) => isActive ? 'active' : ''}>Indicateurs</NavLink>
          <NavLink to="/watchlist" className={({isActive}) => isActive ? 'active' : ''}>Watchlist</NavLink>
          <NavLink to="/pricing" className={({isActive}) => isActive ? 'active' : ''}>Tarifs</NavLink>
        </nav>
      </div>
    </header>
  );
}
