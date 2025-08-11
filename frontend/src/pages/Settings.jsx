import React from "react";
import Section from "../components/ui/Section";

export default function Settings() {
  return (
    <Section title="Paramètres" subtitle="Préférences du compte et de l'application">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="label mb-2">Thème</div>
          <select className="input"><option>Dark (par défaut)</option><option>Light</option></select>
        </div>
        <div className="card p-5">
          <div className="label mb-2">Notifications</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox"/> Email</label>
          <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox"/> Telegram</label>
        </div>
      </div>
    </Section>
  );
}
