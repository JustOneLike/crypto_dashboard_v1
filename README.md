# Crypto Dashboard — V1 Skeleton
Cette archive contient un squelette de projet **SaaS** pour Crypto Dashboard :
- `frontend/` : React 18 + Vite minimal
- `backend/` : Node.js + Express API minimal avec calculs LTPI/MTPI/CMVI simplifiés
- README pour lancer les deux parties localement

## Objectif
Fournir une base prête à l'emploi pour démarrer le développement et ajouter les features:
watchlist, alertes Telegram, backtesting, PWA, paiement Stripe, etc.

## Quick start (local)
1. Ouvrir deux terminaux.
2. Backend :
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   L'API écoute par défaut sur `http://localhost:4000`.
3. Frontend :
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Le front tourne par défaut sur `http://localhost:5173`.

## Endpoints utiles (backend)
- `GET /api/health` — test OK
- `GET /api/market?ids=bitcoin,ethereum` — proxie CoinGecko (mock si absent)
- `POST /api/scores` — calcule scores (envoie JSON {prices: [...]})
- `POST /api/watchlist` — sauvegarde watchlist (mock, in-memory)
- `GET /api/watchlist` — récupère watchlist (mock)

## Notes
- Les clés API et secrets ne sont pas inclus.
- Les fonctions de scoring sont simplifiées et doivent être affinées selon ton modèle LTPI/MTPI/CMVI.
- Pour production : ajouter authentification, persistance (Postgres), validation, tests, CI/CD.

Bon dev ! 🚀
