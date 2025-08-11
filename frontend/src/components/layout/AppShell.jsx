import React from "react";
import { Link, NavLink } from "react-router-dom";
import { BarChart3, Bell, Home as HomeIcon, Layers, Star, LineChart, Settings } from "lucide-react";

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-slate-800/60 ${
        isActive ? "bg-slate-800/60 text-white" : "text-slate-300"
      }`}
  >
    <Icon className="h-4 w-4" /> {label}
  </NavLink>
);

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 border-b border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500" />
            <Link to="/" className="font-semibold tracking-tight">Crypto Dashboard</Link>
            <span className="badge ml-2">Beta</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-ghost">Se connecter</button>
            <button className="btn-primary">Créer un compte</button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6 px-4 py-6">
        <aside className="soft p-3 h-fit sticky top-20 hidden md:block">
          <nav className="flex flex-col gap-1">
            <NavItem to="/" icon={HomeIcon} label="Accueil" />
            <NavItem to="/dashboard" icon={BarChart3} label="Dashboard" />
            <NavItem to="/markets" icon={LineChart} label="Marchés" />
            <NavItem to="/watchlist" icon={Star} label="Watchlist" />
            <NavItem to="/alerts" icon={Bell} label="Alertes" />
            <NavItem to="/pricing" icon={Layers} label="Tarifs" />
            <NavItem to="/settings" icon={Settings} label="Paramètres" />
          </nav>
        </aside>
        <main>{children}</main>
      </div>

      <footer className="border-t border-slate-800/60 py-8">
        <div className="mx-auto max-w-7xl px-4 text-sm text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500" />
            <span>Crypto Dashboard © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#">Confidentialité</a>
            <a href="#">Conditions</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
