import React, { useEffect, useState } from 'react';
import { getWatchlist, saveWatchlist } from '../services/api';

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('bitcoin');

  useEffect(() => {
    (async () => {
      const w = await getWatchlist();
      setItems(w?.watchlist || []);
    })();
  }, []);

  async function add() {
    const list = Array.from(new Set([...items, ...input.split(',').map(s=>s.trim()).filter(Boolean)]));
    await saveWatchlist({ items: list });
    setItems(list);
    setInput('');
  }

  async function remove(symbol) {
    const list = items.filter(x => x !== symbol);
    await saveWatchlist({ items: list });
    setItems(list);
  }

  return (
    <div className="page">
      <h2>Watchlist</h2>
      <div className="toolbar">
        <input placeholder="ex: bitcoin,ethereum" value={input} onChange={(e)=>setInput(e.target.value)} />
        <button className="btn" onClick={add}>Ajouter</button>
      </div>

      <div className="tags">
        {items.map(sym => (
          <span key={sym} className="tag">
            {sym}
            <button className="tag-x" onClick={()=>remove(sym)} aria-label={`retirer ${sym}`}>×</button>
          </span>
        ))}
        {items.length === 0 && <p className="muted">Aucun élément pour l’instant.</p>}
      </div>
    </div>
  );
}
