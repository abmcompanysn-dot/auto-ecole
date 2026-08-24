import { useState } from "react";
import { Icon, Badge, Card, Bar, Avatar, useCountUp, type Tone } from "../components/ui";
import { MRR_HISTORY, MRR_MONTHS, SUBSCRIPTIONS, type Subscription } from "../data";

const PLAN_MRR: Record<Subscription["plan"], number> = { Starter: 49, Pro: 99, Réseau: 249 };
const PLAN_TONE: Record<Subscription["plan"], Tone> = { Starter: "neutral", Pro: "pine", Réseau: "signal" };
const STATUS_TONE: Record<Subscription["status"], Tone> = { Active: "pine", Essai: "info", Suspendue: "danger" };

export default function SuperAdmin({ toast }: { toast: (m: string) => void }) {
  const [subs, setSubs] = useState<Subscription[]>(SUBSCRIPTIONS);

  const mrr = subs.filter((s) => s.status !== "Suspendue").reduce((t, s) => t + s.mrr, 0);
  const active = subs.filter((s) => s.status === "Active").length;
  const seatsUsed = subs.reduce((t, s) => t + s.seatsUsed, 0);
  const seatsTotal = subs.reduce((t, s) => t + s.seats, 0);
  const n = useCountUp(mrr);

  const toggle = (id: string) => {
    setSubs((ss) =>
      ss.map((s) => {
        if (s.id !== id) return s;
        const next: Subscription["status"] = s.status === "Suspendue" ? "Active" : "Suspendue";
        toast(next === "Suspendue" ? `${s.school} suspendue — accès bloqués, données conservées 90 j.` : `${s.school} réactivée — facturation reprise.`);
        return { ...s, status: next };
      })
    );
  };

  const changePlan = (id: string, plan: Subscription["plan"]) => {
    setSubs((ss) => ss.map((s) => (s.id === id ? { ...s, plan, mrr: PLAN_MRR[plan] } : s)));
    toast(`Plan ${plan} appliqué — MRR ajusté à ${PLAN_MRR[plan]} €/mois.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
      <div className="pt-8 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-pine-600 flex items-center gap-2">
            <span className="w-6 h-[3px] bg-signal-500 inline-block" /> Console SaaS · PILOTE HQ
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight mt-2">Abonnements auto-écoles</h1>
        </div>
        <Badge tone="pine"><span className="relative w-1.5 h-1.5 rounded-full bg-pine-600 text-pine-600 ping-dot" /> Tous les systèmes opérationnels</Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card hover className="p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-pine-600" />
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">MRR consolidé</p>
          <p className="font-display font-bold text-4xl tabular text-pine-700 mt-2">{Math.round(n).toLocaleString("fr-FR")} €</p>
          <p className="text-[11px] font-semibold text-pine-700 mt-1.5 flex items-center gap-1"><Icon name="arrow" className="w-3.5 h-3.5 -rotate-45" /> +9,2 % vs mois dernier</p>
        </Card>
        <Card hover className="p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-signal-500" />
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">Écoles actives</p>
          <p className="font-display font-bold text-4xl tabular mt-2">{active}<span className="text-lg text-ink-soft"> / {subs.length}</span></p>
          <p className="text-[11px] font-semibold text-ink-soft mt-1.5">1 en essai · 1 suspendue</p>
        </Card>
        <Card hover className="p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-info-500" />
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">Sièges moniteurs</p>
          <p className="font-display font-bold text-4xl tabular mt-2">{seatsUsed}<span className="text-lg text-ink-soft"> / {seatsTotal}</span></p>
          <Bar value={(seatsUsed / seatsTotal) * 100} tone="info" className="mt-2.5" />
        </Card>
        <Card hover className="p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-pine-600" />
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">Churn 90 jours</p>
          <p className="font-display font-bold text-4xl tabular mt-2">1,8 %</p>
          <p className="text-[11px] font-semibold text-pine-700 mt-1.5">Sous l'objectif de 3 %</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Card className="p-6">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-5">Évolution du MRR (8 mois)</p>
            <div className="grid grid-cols-8 gap-2.5 items-end h-36">
              {MRR_HISTORY.map((v, i) => (
                <div key={MRR_MONTHS[i]} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-bold tabular opacity-0 group-hover:opacity-100 transition-opacity">{v} €</span>
                  <div
                    className={`w-full rounded-t-md transition-all group-hover:scale-x-105 ${i === MRR_HISTORY.length - 1 ? "bg-signal-500" : "bg-pine-600 group-hover:bg-pine-700"}`}
                    style={{ height: `${(v / Math.max(...MRR_HISTORY)) * 100}%` }}
                  />
                  <span className="text-[10px] font-semibold text-ink-soft">{MRR_MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-x-auto">
            <div className="min-w-[780px]">
              <div className="grid grid-cols-[1.3fr_0.9fr_0.9fr_0.6fr_0.8fr_0.9fr] px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-ink-soft border-b-2 border-ink bg-paper">
                <span>Auto-école</span><span>Plan</span><span>Sièges</span><span>MRR</span><span>Statut</span><span className="text-right">Action</span>
              </div>
              {subs.map((s) => (
                <div key={s.id} className={`grid grid-cols-[1.3fr_0.9fr_0.9fr_0.6fr_0.8fr_0.9fr] items-center px-5 py-3.5 border-b border-line last:border-0 hover:bg-pine-50/40 transition-colors ${s.status === "Suspendue" ? "opacity-60" : ""}`}>
                  <span className="flex items-center gap-3">
                    <Avatar name={s.school} />
                    <span>
                      <span className="block font-semibold text-sm">{s.school}</span>
                      <span className="block text-xs text-ink-soft">{s.city} · depuis {s.since}</span>
                    </span>
                  </span>
                  <span>
                    <select value={s.plan} onChange={(e) => changePlan(s.id, e.target.value as Subscription["plan"])}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none cursor-pointer ${s.plan === "Pro" ? "border-pine-300 bg-pine-50 text-pine-800" : s.plan === "Réseau" ? "border-signal-300 bg-signal-100 text-signal-700" : "border-line bg-card text-ink-soft"}`}>
                      {(["Starter", "Pro", "Réseau"] as const).map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </span>
                  <span className="pr-4">
                    <div className="flex justify-between text-[11px] mb-1"><span className="tabular font-bold">{s.seatsUsed}/{s.seats}</span><span className="text-ink-soft">moniteurs</span></div>
                    <Bar value={(s.seatsUsed / s.seats) * 100} tone={s.seatsUsed >= s.seats ? "danger" : "pine"} />
                  </span>
                  <span className="font-display font-bold text-lg tabular">{s.mrr} €</span>
                  <span><Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge></span>
                  <span className="text-right">
                    <button onClick={() => toggle(s.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${s.status === "Suspendue" ? "border-pine-600 text-pine-700 hover:bg-pine-50" : "border-line text-ink-soft hover:border-danger-500 hover:text-danger-600"}`}>
                      {s.status === "Suspendue" ? "Réactiver" : "Suspendre"}
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3 flex items-center gap-2"><Icon name="alert" className="w-4 h-4 text-danger-500" /> Alertes facturation</p>
            <ul className="space-y-2.5 text-sm">
              <li className="p-3 rounded-lg bg-danger-50 border border-danger-500/30">
                <p className="font-semibold">Route Sûre — Bamako</p>
                <p className="text-xs text-ink-soft mt-0.5">2 prélèvements échoués. Suspension auto appliquée, email de relance envoyé.</p>
              </li>
              <li className="p-3 rounded-lg bg-signal-100 border border-signal-300">
                <p className="font-semibold">École Moderne — Lomé</p>
                <p className="text-xs text-ink-soft mt-0.5">Essai Pro : J-5 avant conversion. 1 moniteur actif sur 6 sièges.</p>
              </li>
            </ul>
          </Card>
          <Card className="p-5">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3">Usage plateforme (30 j)</p>
            <div className="space-y-3 text-sm">
              {[
                { l: "Quiz Code passés", v: "41 200", p: 92 },
                { l: "Heures réservées", v: "8 940", p: 74 },
                { l: "Fiches signées", v: "7 315", p: 61 },
                { l: "SMS de rappel", v: "12 480", p: 83 },
              ].map((u) => (
                <div key={u.l}>
                  <div className="flex justify-between mb-1"><span className="text-ink-soft text-xs">{u.l}</span><span className="font-bold tabular text-xs">{u.v}</span></div>
                  <Bar value={u.p} tone="pine" />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-2">Déploiement</p>
            <p className="text-sm">Version <span className="font-mono font-bold">2.9.1</span> — il y a 2 j</p>
            <ul className="mt-3 space-y-1.5 text-xs text-ink-soft">
              <li className="flex gap-2"><Icon name="check" className="w-3.5 h-3.5 text-pine-600 shrink-0" /> Convocations préfecture batch</li>
              <li className="flex gap-2"><Icon name="check" className="w-3.5 h-3.5 text-pine-600 shrink-0" /> Paiement Orange Money CI</li>
              <li className="flex gap-2"><Icon name="check" className="w-3.5 h-3.5 text-pine-600 shrink-0" /> Export comptable Sage</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
