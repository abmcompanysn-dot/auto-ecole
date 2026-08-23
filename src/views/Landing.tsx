import { useState } from "react";
import { Icon, Badge, Card, Reveal, useCountUp, type IconName } from "../components/ui";
import { QUESTIONS, LIVE_STATS } from "../data";

type Props = { toast: (m: string) => void; go: (role: "student" | "admin") => void };

function MiniQuiz() {
  const [idx, setIdx] = useState(4);
  const [picked, setPicked] = useState<number | null>(null);
  const q = QUESTIONS[idx];
  const next = () => {
    setPicked(null);
    setIdx((idx + 3) % QUESTIONS.length);
  };
  return (
    <div className="bg-card border border-line rounded-xl overflow-hidden shadow-[0_30px_60px_-25px_rgba(5,42,29,0.5)] rotate-1 hover:rotate-0 transition-transform duration-500">
      <div className="flex items-center justify-between px-4 py-2.5 bg-pine-900 text-pine-100">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Série chrono · Question 23/40</span>
        <span className="font-mono text-[10px] text-signal-400">● 00:14</span>
      </div>
      <div className="p-5">
        <Badge tone="pine" className="mb-3">{q.theme}</Badge>
        <p className="font-semibold text-[15px] leading-snug mb-4">{q.text}</p>
        <div className="space-y-2">
          {q.options.map((o, i) => {
            const isAns = i === q.answer;
            const isPick = picked === i;
            const cls =
              picked === null
                ? "border-line hover:border-pine-500 hover:bg-pine-50 hover:translate-x-1"
                : isAns
                  ? "border-pine-600 bg-pine-100 text-pine-900"
                  : isPick
                    ? "border-danger-500 bg-danger-50 text-danger-700"
                    : "border-line opacity-45";
            return (
              <button
                key={o}
                onClick={() => picked === null && setPicked(i)}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${cls}`}
              >
                <span className="font-display font-bold w-6 h-6 rounded-md bg-ink/6 flex items-center justify-center text-xs shrink-0">
                  {"ABCD"[i]}
                </span>
                {o}
                {picked !== null && isAns && <Icon name="check" className="w-4 h-4 ml-auto text-pine-700" />}
                {picked !== null && isPick && !isAns && <Icon name="x" className="w-4 h-4 ml-auto text-danger-600" />}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="pop-in mt-4 p-3.5 rounded-lg bg-signal-100 border border-signal-300 text-[13px] leading-relaxed">
            <strong className="font-display uppercase tracking-wide text-signal-700">Explication — </strong>
            {q.explain}
            <button onClick={next} className="mt-3 flex items-center gap-2 font-semibold text-pine-700 hover:gap-3 transition-all text-sm">
              Question suivante <Icon name="arrow" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCounter({ value, label }: { value: string; label: string }) {
  const numeric = parseFloat(value.replace(/[^\d,.-]/g, "").replace(",", "."));
  const n = useCountUp(numeric);
  const prefix = value.startsWith("−") ? "−" : "";
  const suffix = value.includes("%") ? " %" : value.includes("min") ? " min" : "";
  const display = isNaN(numeric) ? value : prefix + Math.round(n).toLocaleString("fr-FR") + suffix;
  return (
    <div className="text-center">
      <p className="font-display font-bold text-4xl md:text-5xl text-signal-400 tabular">{display}</p>
      <p className="text-pine-200 text-xs md:text-sm mt-2 max-w-[160px] mx-auto">{label}</p>
    </div>
  );
}

const MODULES: { icon: IconName; sign: string; title: string; desc: string; points: string[]; big?: boolean }[] = [
  {
    icon: "book", sign: "B 21", title: "Formation Code en ligne", big: true,
    desc: "Banque de +2 400 questions conformes à l'examen, séries chrono et thématiques, examens blancs et algorithme de prédiction de réussite. Les élèves s'entraînent où ils veulent — vous gardez la main sur leur progression.",
    points: ["Tests chrono & examens blancs", "Score de prédiction sur 10 séries", "Classe virtuelle & cours du soir", "Réservation session officielle"],
  },
  { icon: "clipboard", sign: "A 14", title: "Inscription & CRM", desc: "Pré-demande NEPH, pièces justificatives, paiement 3×/4× par carte, Wave ou Orange Money, contrat à signature électronique.", points: ["Dossier NEPH complet", "Échéancier automatique"] },
  { icon: "calendar", sign: "C 25", title: "Planning & Conduite", desc: "Grille de réservation par moniteur et véhicule, règle de préavis 48 h, points de rendez-vous géolocalisés.", points: ["Créneaux 1 h / 2 h", "Annulation avec préavis"] },
  { icon: "pen", sign: "D 40", title: "Livret numérique", desc: "Suivi compétence par compétence selon le REMC, signé numériquement à chaque fin d'heure par l'élève et le moniteur.", points: ["4 compétences, 16 sous-objectifs", "Signature de fin d'heure"] },
  { icon: "car", sign: "E 12", title: "Flotte & Moniteurs", desc: "Révisions, contrôles techniques, carburant, heures effectuées et heures sup calculées automatiquement.", points: ["Alertes entretien & CT", "Rappels SMS/Email J-1"] },
  { icon: "flag", sign: "F 52", title: "Examen pratique", desc: "Répartition des places préfecture selon le niveau réel, bilan pré-examen au barème inspecteur, suivi des résultats.", points: ["Convocations intelligentes", "Taux de réussite par session"] },
];

export default function Landing({ toast, go }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
      {/* ——— Panneau d'ouverture ——— */}
      <section className="pt-10 md:pt-16 grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
        <div>
          <Reveal>
            <div className="sign-panel rounded-2xl p-7 md:p-10 text-pine-50 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-2 lane-edge dash-drift" />
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-signal-500 text-ink font-display font-bold text-sm px-2.5 py-1 rounded-md tracking-wide">SAAS AUTO-ÉCOLE</span>
                <span className="font-mono text-[11px] text-pine-200 tracking-[0.25em] uppercase">Sortie 114 · Admin</span>
              </div>
              <h1 className="font-display font-bold uppercase leading-[0.9] tracking-tight text-5xl md:text-7xl">
                Toute votre<br />auto-école,<br />
                <span className="text-signal-400">sur la bonne voie.</span>
              </h1>
              <p className="text-pine-100 mt-5 max-w-md text-[15px] leading-relaxed">
                Inscription et NEPH, Code en ligne avec prédiction de réussite, planning de conduite, livret numérique, flotte et examens — un seul outil, quatre espaces connectés.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <button
                  onClick={() => go("admin")}
                  className="group flex items-center gap-2.5 bg-signal-500 hover:bg-signal-400 text-ink font-display font-bold uppercase tracking-wide text-lg px-6 py-3 rounded-lg transition-all hover:gap-4"
                >
                  Ouvrir le tableau de bord <Icon name="arrow" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => go("student")}
                  className="flex items-center gap-2 border-2 border-pine-300/50 text-pine-50 hover:bg-pine-800 font-semibold px-5 py-3 rounded-lg transition-colors"
                >
                  Voir l'espace élève
                </button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-mono text-[11px] text-ink-soft tracking-wider mt-4 flex items-center gap-2">
              <span className="relative w-2 h-2 rounded-full bg-pine-600 text-pine-600 ping-dot" />
              Essayez le quiz — c'est une vraie question du Code, à droite.
            </p>
          </Reveal>
        </div>
        <Reveal delay={180}>
          <MiniQuiz />
        </Reveal>
      </section>

      {/* ——— Bandeau défilant ——— */}
      <Reveal>
        <div className="hazard h-2 rounded-full mt-14 mb-14" />
        <div className="overflow-hidden -mx-5 md:-mx-8 border-y-2 border-ink bg-signal-400 py-3 mb-16">
          <div className="ticker-track flex whitespace-nowrap w-max font-display font-bold uppercase tracking-wide text-xl text-ink">
            {[0, 1].map((k) => (
              <span key={k} className="flex items-center">
                {["CRM & NEPH", "Code en ligne", "Planning moniteurs", "Livret REMC", "Flotte & entretiens", "Rappels SMS", "Convocations", "Paiement 4×"].map((t) => (
                  <span key={t} className="flex items-center">
                    <span className="px-6">{t}</span>
                    <Icon name="spark" className="w-4 h-4" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ——— Modules ——— */}
      <section>
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
            <div>
              <p className="font-mono text-[11px] font-semibold tracking-[0.22em] uppercase text-pine-600 mb-2 flex items-center gap-2">
                <span className="w-6 h-[3px] bg-signal-500 inline-block" />Signalétique complète
              </p>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight leading-none">6 modules, 4 espaces,<br />zéro papier</h2>
            </div>
            <p className="text-ink-soft text-sm max-w-xs">Chaque module fonctionne seul. Ensemble, ils alimentent un dossier élève unique, du premier clic à la remise du permis.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {MODULES.map((m, i) => (
            <Reveal key={m.title} delay={i * 70} className={m.big ? "md:col-span-2" : ""}>
              <Card hover className={`p-6 h-full relative overflow-hidden group ${m.big ? "bg-pine-800 border-pine-800 text-pine-50" : ""}`}>
                <div className="flex items-start justify-between">
                  <span className={`w-11 h-11 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${m.big ? "bg-signal-500 text-ink" : "bg-pine-100 text-pine-700"}`}>
                    <Icon name={m.icon} className="w-6 h-6" />
                  </span>
                  <span className={`font-display font-bold text-sm tracking-widest ${m.big ? "text-pine-300" : "text-line"}`}>{m.sign}</span>
                </div>
                <h3 className={`font-display font-bold uppercase text-2xl tracking-tight mt-4 ${m.big ? "text-pine-50" : ""}`}>{m.title}</h3>
                <p className={`text-sm mt-2 leading-relaxed ${m.big ? "text-pine-200" : "text-ink-soft"}`}>{m.desc}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {m.points.map((p) => (
                    <li key={p} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${m.big ? "border-pine-600 text-pine-100 bg-pine-900/60" : "border-line text-ink-soft"}`}>
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Chiffres ——— */}
      <Reveal>
        <section className="mt-16 sign-panel rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 lane-edge dash-drift" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {LIVE_STATS.map((s) => (
              <StatCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* ——— Tarifs ——— */}
      <section className="mt-20">
        <Reveal>
          <div className="text-center mb-10">
            <p className="font-mono text-[11px] font-semibold tracking-[0.22em] uppercase text-pine-600 mb-2">Péage — tarifs transparents</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight">Choisissez votre voie</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-[1fr_1.25fr_1fr] gap-4 items-stretch">
          <Reveal delay={60}>
            <Card hover className="p-6 h-full flex flex-col">
              <Badge>Starter</Badge>
              <p className="font-display font-bold text-5xl mt-4 tabular">49 €<span className="text-base text-ink-soft font-body font-medium"> /mois</span></p>
              <p className="text-sm text-ink-soft mt-2">Pour démarrer sans papier.</p>
              <ul className="mt-5 space-y-2.5 text-sm flex-1">
                {["Jusqu'à 3 moniteurs", "CRM & inscriptions", "Planning de conduite", "Rappels SMS (100/mois)"].map((f) => (
                  <li key={f} className="flex gap-2.5"><Icon name="check" className="w-4 h-4 text-pine-600 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <button onClick={() => toast("Essai gratuit Starter activé — bienvenue à bord !")} className="mt-6 w-full py-2.5 rounded-lg border-2 border-pine-600 text-pine-700 font-display font-bold uppercase tracking-wide hover:bg-pine-50 transition-colors">Essayer 14 jours</button>
            </Card>
          </Reveal>
          <Reveal delay={120}>
            <div className="sign-panel rounded-xl p-7 h-full flex flex-col text-pine-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 hazard" />
              <div className="flex items-center justify-between">
                <Badge tone="signal">Pro · Recommandé</Badge>
                <span className="font-mono text-[10px] tracking-[0.2em] text-pine-300 uppercase">Voie rapide</span>
              </div>
              <p className="font-display font-bold text-6xl mt-5 tabular">99 €<span className="text-lg text-pine-200 font-body font-medium"> /mois</span></p>
              <p className="text-sm text-pine-200 mt-2">Tout le nécessaire pour une école complète.</p>
              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {["Moniteurs illimités", "E-learning Code + prédiction", "Livret numérique signé", "Paiement 3×/4× Wave & Orange Money", "Rappels SMS illimités", "Convocations préfecture"].map((f) => (
                  <li key={f} className="flex gap-2.5"><Icon name="check" className="w-4 h-4 text-signal-400 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <button onClick={() => go("admin")} className="mt-7 w-full py-3 rounded-lg bg-signal-500 hover:bg-signal-400 text-ink font-display font-bold uppercase tracking-wide text-lg transition-colors">Ouvrir la démo Pro</button>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <Card hover className="p-6 h-full flex flex-col">
              <Badge>Réseau</Badge>
              <p className="font-display font-bold text-5xl mt-4 tabular">Sur devis</p>
              <p className="text-sm text-ink-soft mt-2">Multi-agences & franchises.</p>
              <ul className="mt-5 space-y-2.5 text-sm flex-1">
                {["Tout Pro, multi-sites", "Console super-admin", "API & exports compta", "Support dédié 7j/7"].map((f) => (
                  <li key={f} className="flex gap-2.5"><Icon name="check" className="w-4 h-4 text-pine-600 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <button onClick={() => toast("Notre équipe vous rappelle sous 24 h ouvrées.")} className="mt-6 w-full py-2.5 rounded-lg border-2 border-line text-ink-soft font-display font-bold uppercase tracking-wide hover:border-pine-600 hover:text-pine-700 transition-colors">Être rappelé</button>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ——— Pied de page ——— */}
      <Reveal>
        <footer className="mt-20 border-t-2 border-ink pt-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-display font-bold text-2xl uppercase tracking-tight flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-pine-700 text-pine-50 flex items-center justify-center"><Icon name="wheel" className="w-5 h-5" /></span>
              Pilote
            </p>
            <p className="text-xs text-ink-soft mt-2 max-w-sm">Plateforme de gestion tout-en-un pour auto-écoles. Démo interactive — toutes les données sont fictives.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => go("student")} className="px-4 py-2 rounded-lg border border-line text-sm font-semibold hover:border-pine-600 hover:text-pine-700 transition-colors">Espace élève</button>
            <button onClick={() => go("admin")} className="px-4 py-2 rounded-lg bg-ink text-paper text-sm font-semibold hover:bg-pine-800 transition-colors">Espace direction</button>
          </div>
        </footer>
      </Reveal>
    </div>
  );
}
