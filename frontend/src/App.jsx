import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Charts from './pages/Charts';
import Indicators from './pages/Indicators';
import Watchlist from './pages/Watchlist';
import Pricing from './pages/Pricing';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/indicators" element={<Indicators />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} Crypto Dashboard</span>
          <nav className="footer-nav">
            <a href="/pricing">Tarifs</a>
            <a href="mailto:contact@example.com">Contact</a>
          </nav>
        </div>
      </footer>
    </BrowserRouter>
  );
}
