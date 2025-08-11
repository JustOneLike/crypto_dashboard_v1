import React from "react";
export default function NotFound(){
  return (
    <div className="card p-10 text-center">
      <div className="text-2xl font-semibold">404</div>
      <div className="text-slate-400 mt-2">La page demandée est introuvable.</div>
      <a href="/" className="btn-primary inline-flex mt-4">Retour à l'accueil</a>
    </div>
  );
}
