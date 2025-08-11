import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Charts from './pages/Charts.jsx';
import Indicators from './pages/Indicators.jsx';
import Watchlist from './pages/Watchlist.jsx';
import Pricing from './pages/Pricing.jsx';
import './styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/indicators" element={<Indicators />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
