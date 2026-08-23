import { useMemo, useState } from "react";
import { Icon, Badge, Card, Bar, Avatar, Toggle, useCountUp, type IconName, type Tone } from "../components/ui";
import {
  HOURS, INSTRUCTORS, REMINDERS, VEHICLES, fmtDay,
  type Session, type Slot, type Student, type Vehicle, type Reminder,
} from "../data";

type Tab = "bord" | "crm" | "planning" | "flotte" | "examens" | "rappels";

type Props = {
  students: Student[];
  slots: Slot[];
  sessions: Session[];
  onAssign: (sessionId: string, studentId: string) => void;
  toast: (m: string) => void;
};

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "bord", label: "Tableau de bord", icon: "gauge" },
  { id: "crm", label: "Élèves", icon: "users" },
  { id: "planning", label: "Planning", icon: "calendar" },
  { id: "flotte", label: "Flotte", icon: "car" },
  { id: "examens", label: "Examens", icon: "flag" },
  { id: "rappels", label: "Rappels", icon: "bell" },
];

const NEPH_TONE: Record<Student["neph"], Tone> = { "Validé": "pine", "En attente": "signal", "À compléter": "danger" };
const PAY_TONE: Record<Student["pay"], Tone> = { "À jour": "pine", "Partiel": "signal", "Retard": "danger" };

function Kpi({ label, value, suffix, delta, tone }: { label: string; value: number; suffix: string; delta: string; tone: Tone }) {
  const n = useCountUp(value);
  const color = tone === "signal" ? "text-signal-600" : tone === "danger" ? "text-danger-600" : "text-pine-700";
  return (
    <Card hover className="p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${tone === "signal" ? "bg-signal-500" : tone === "danger" ? "bg-danger-500" : "bg-pine-600"}`} />
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">{label}</p>
      <p className={`font-display font-bold text-4xl tabular mt-2 ${color}`}>
        {Math.round(n).toLocaleString("fr-FR")}<span className="text-lg">{suffix}</span>
      </p>
      <p className="text-[11px] font-semibold text-pine-700 mt-1.5 flex items-center gap-1"><Icon name="arrow" className="w-3.5 h-3.5 -rotate-45" /> {delta}</p>
    </Card>
  );
}

const SUCCESS_MONTHS = [
  { m: "Oct.", code: 71, permis: 58 },
  { m: "Nov.", code: 74, permis: 61 },
  { m: "Déc.", code: 72, permis: 64 },
  { m: "Janv.", code: 78, permis: 66 },
  { m: "Févr.", code: 81, permis: 70 },
  { m: "Mars", code: 84, permis: 73 },
];

export default function Admin({ students, slots, sessions, onAssign, toast }: Props) {
  const [tab, setTab] = useState<Tab>("bord");
  const [search, setSearch] = useState("");
  const [nephFilter, setNephFilter] = useState("Tous");
  const [payFilter, setPayFilter] = useState("Tous");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES);
  const [reminders, setReminders] = useState<Reminder[]>(REMINDERS);
  const [pick, setPick] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          (nephFilter === "Tous" || s.neph === nephFilter) &&
          (payFilter === "Tous" || s.pay === payFilter) &&
          s.name.toLowerCase().includes(search.toLowerCase())
      ),
    [students, search, nephFilter, payFilter]
  );

  const days = [...new Set(slots.map((s) => s.dayOffset))].sort((a, b) => a - b);
  const occupied = slots.filter((s) => s.status !== "free").length;
  const fillRate = Math.round((occupied / slots.length) * 100);

  const eligible = students.filter((s) => s.readiness >= 65 && !sessions.some((se) => se.assigned.includes(s.id)));

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
      <div className="pt-8 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-pine-600 flex items-center gap-2">
            <span className="w-6 h-[3px] bg-signal-500 inline-block" /> Direction · Auto-École du Plateau
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight mt-2">Tableau de bord</h1>
        </div>
        <div className="flex gap-2">
          <Badge tone="pine"><span className="relative w-1.5 h-1.5 rounded-full bg-pine-600 text-pine-600 ping-dot" /> Préfecture connectée</Badge>
          <Badge tone="info">4 moniteurs en ligne</Badge>
        </div>
      </div>

      <nav className="sticky top-[57px] z-30 -mx-5 md:-mx-8 px-5 md:px-8 py-3 bg-paper/95 backdrop-blur border-b border-line mb-7 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold uppercase tracking-wide text-sm whitespace-nowrap transition-all ${tab === t.id ? "bg-ink text-paper shadow-md" : "text-ink-soft hover:bg-ink/6 hover:text-ink"}`}>
            <Icon name={t.icon} className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </nav>

      {tab === "bord" && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi label="Encaissé ce mois" value={8450} suffix=" €" delta="+12 % vs févr." tone="pine" />
            <Kpi label="Élèves actifs" value={128} suffix="" delta="+9 inscriptions" tone="pine" />
            <Kpi label="Réussite Code (mars)" value={84} suffix=" %" delta="+3 pts" tone="signal" />
            <Kpi label="Heures planifiées" value={96} suffix=" h" delta={`${fillRate} % de remplissage`} tone="pine" />
          </div>
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft">Taux de réussite par mois</p>
                <div className="flex gap-3 text-[11px] font-semibold text-ink-soft">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-pine-600" /> Code</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-signal-500" /> Permis</span>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 items-end h-44">
                {SUCCESS_MONTHS.map((s) => (
                  <div key={s.m} className="flex flex-col items-center gap-1 h-full justify-end group">
                    <span className="text-[10px] font-bold tabular opacity-0 group-hover:opacity-100 transition-opacity">{s.code} / {s.permis}</span>
                    <div className="w-full flex items-end justify-center gap-1 flex-1">
                      <div className="w-1/2 max-w-6 bg-pine-600 rounded-t-md group-hover:bg-pine-700 transition-all" style={{ height: `${s.code}%` }} />
                      <div className="w-1/2 max-w-6 bg-signal-500 rounded-t-md group-hover:bg-signal-600 transition-all" style={{ height: `${s.permis}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-ink-soft">{s.m}</span>
                  </div>
                ))}
              </div>
            </Card>
            <div className="space-y-4">
              <Card className="p-5">
                <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3 flex items-center gap-2"><Icon name="alert" className="w-4 h-4 text-danger-500" /> Alertes à traiter</p>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-center gap-2.5 p-2.5 rounded-lg bg-danger-50 border border-danger-500/30">
                    <Icon name="car" className="w-4 h-4 text-danger-600 shrink-0" /> Sandero MN-205-OP : contrôle technique expiré, révision dépassée de 210 km.
                  </li>
                  <li className="flex items-center gap-2.5 p-2.5 rounded-lg bg-signal-100 border border-signal-300">
                    <Icon name="euro" className="w-4 h-4 text-signal-700 shrink-0" /> 2 échéances en retard (Aïssatou Fall, Ousmane Bâ) — relance auto prête.
                  </li>
                  <li className="flex items-center gap-2.5 p-2.5 rounded-lg bg-info-50 border border-info-500/25">
                    <Icon name="clipboard" className="w-4 h-4 text-info-600 shrink-0" /> 3 dossiers NEPH en attente à l'ANTS depuis plus de 15 jours.
                  </li>
                </ul>
              </Card>
              <Card className="p-5">
                <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3">Prochains cours</p>
                <ul className="space-y-2 text-sm">
                  {slots.filter((s) => s.status !== "free").slice(0, 4).map((s) => (
                    <li key={s.id} className="flex items-center gap-3">
                      <span className="font-mono text-xs tabular bg-ink/6 px-2 py-1 rounded-md">{fmtDay(s.dayOffset).split(" ").slice(1).join(" ")} · {s.hour}h</span>
                      <span className="font-semibold truncate">{s.student}</span>
                      <span className="text-xs text-ink-soft ml-auto shrink-0">{s.instructor?.split(" ")[0]}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      )}

      {tab === "crm" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2.5">
            <div className="relative flex-1 min-w-[220px]">
              <Icon name="search" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un élève…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-line bg-card text-sm focus:outline-none focus:border-pine-600" />
            </div>
            {(["Tous", "Validé", "En attente", "À compléter"] as const).map((n) => (
              <button key={n} onClick={() => setNephFilter(n)} className={`px-3.5 py-2 rounded-lg border text-sm font-semibold transition-all ${nephFilter === n ? "bg-ink text-paper border-ink" : "border-line hover:border-pine-500"}`}>NEPH : {n}</button>
            ))}
            <select value={payFilter} onChange={(e) => setPayFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-line bg-card text-sm font-semibold focus:outline-none focus:border-pine-600">
              {["Tous", "À jour", "Partiel", "Retard"].map((p) => <option key={p}>{p === "Tous" ? "Paiement : tous" : p}</option>)}
            </select>
          </div>
          <Card className="overflow-x-auto">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-[1.4fr_1fr_0.7fr_0.8fr_0.8fr_0.7fr_40px] px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-ink-soft border-b-2 border-ink bg-paper">
                <span>Élève</span><span>Formation</span><span>NEPH</span><span>Code</span><span>Conduite</span><span>Paiement</span><span />
              </div>
              {filtered.map((s) => (
                <div key={s.id} className="border-b border-line last:border-0">
                  <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className={`w-full grid grid-cols-[1.4fr_1fr_0.7fr_0.8fr_0.8fr_0.7fr_40px] items-center px-5 py-3.5 text-left hover:bg-pine-50/50 transition-colors ${expanded === s.id ? "bg-pine-50/60" : ""}`}>
                    <span className="flex items-center gap-3 font-semibold text-sm"><Avatar name={s.name} /> {s.name}<span className="text-xs text-ink-soft font-normal">{s.age} ans</span></span>
                    <span className="text-sm text-ink-soft">{s.formation}</span>
                    <span><Badge tone={NEPH_TONE[s.neph]}>{s.neph}</Badge></span>
                    <span className="flex items-center gap-2"><Bar value={s.codePct} className="w-16" /><span className="text-xs font-bold tabular">{s.codePct} %</span></span>
                    <span className="text-sm tabular">{s.hoursDone}/{s.hoursPlan} h</span>
                    <span><Badge tone={PAY_TONE[s.pay]}>{s.pay}</Badge></span>
                    <Icon name="chevron" className={`w-4 h-4 text-ink-soft transition-transform ${expanded === s.id ? "rotate-90" : ""}`} />
                  </button>
                  {expanded === s.id && (
                    <div className="pop-in px-5 pb-5 grid md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-paper border border-line text-sm space-y-1.5">
                        <p className="font-bold text-xs uppercase tracking-widest text-ink-soft mb-2">Contact</p>
                        <p className="flex items-center gap-2"><Icon name="phone" className="w-3.5 h-3.5 text-pine-600" /> {s.phone}</p>
                        <p className="flex items-center gap-2"><Icon name="sms" className="w-3.5 h-3.5 text-pine-600" /> {s.email}</p>
                        <p className="text-xs text-ink-soft pt-1">Inscrit le {s.registered}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-paper border border-line text-sm">
                        <p className="font-bold text-xs uppercase tracking-widest text-ink-soft mb-2">Préparation examen</p>
                        <div className="flex items-center gap-3">
                          <span className="font-display font-bold text-3xl tabular">{s.readiness} %</span>
                          <Bar value={s.readiness} tone={s.readiness >= 70 ? "pine" : s.readiness >= 45 ? "signal" : "danger"} className="flex-1" />
                        </div>
                        <p className="text-xs text-ink-soft mt-2">{s.readiness >= 70 ? "Prêt pour une convocation." : "Poursuivre la formation avant convocation."}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-paper border border-line flex flex-col gap-2">
                        <p className="font-bold text-xs uppercase tracking-widest text-ink-soft mb-1">Actions rapides</p>
                        <button onClick={() => toast(`Rappel SMS envoyé à ${s.name}.`)} className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg border border-line hover:border-pine-600 hover:text-pine-700 transition-colors"><Icon name="sms" className="w-4 h-4" /> Relancer par SMS</button>
                        <button onClick={() => toast(`Facture de ${s.name} régénérée (PDF).`)} className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg border border-line hover:border-pine-600 hover:text-pine-700 transition-colors"><Icon name="download" className="w-4 h-4" /> Régénérer la facture</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && <p className="px-5 py-10 text-center text-ink-soft">Aucun élève ne correspond à ces critères.</p>}
            </div>
          </Card>
          <p className="text-xs text-ink-soft">{filtered.length} dossier(s) affiché(s) sur {students.length} · export CSV disponible dans Comptabilité.</p>
        </div>
      )}

      {tab === "planning" && (
        <div className="space-y-4">
          <Card className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid" style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}>
                <div className="px-2 py-3 font-mono text-[10px] uppercase text-ink-soft flex items-end">Taux : <strong className="text-ink ml-1">{fillRate} %</strong></div>
                {days.map((d) => (
                  <div key={d} className="px-2 py-3 text-center font-display font-bold uppercase tracking-wide text-lg border-b-2 border-ink bg-paper">{fmtDay(d)}</div>
                ))}
                {HOURS.map((h) => (
                  <div key={h} className="contents">
                    <div className="px-2 py-2 text-right font-mono text-xs text-ink-soft border-b border-line flex items-center justify-end tabular">{h}h</div>
                    {days.map((d) => {
                      const s = slots.find((x) => x.dayOffset === d && x.hour === h);
                      if (!s) return <div key={`x${d}-${h}`} className="border-b border-l border-line bg-ink/4" />;
                      const busy = s.status !== "free";
                      return (
                        <div key={s.id} className="border-b border-l border-line p-1">
                          <div className={`h-full rounded-md px-1.5 py-1 text-[10px] font-semibold leading-tight truncate ${busy ? (s.status === "mine" ? "bg-signal-400 text-ink" : "bg-pine-700 text-pine-50") : "bg-ink/5 text-ink-soft/50"}`}
                            title={busy ? `${s.student} — ${s.instructor} — ${s.point}` : "Libre"}>
                            {busy ? s.student : "·"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INSTRUCTORS.map((i) => {
              const count = slots.filter((s) => s.instructor === i.name && s.status !== "free").length;
              return (
                <Card key={i.id} className="p-5" hover>
                  <p className="font-semibold text-sm flex items-center gap-2"><Avatar name={i.name} size="sm" /> {i.name}</p>
                  <p className="font-display font-bold text-3xl tabular mt-2">{count} <span className="text-sm text-ink-soft font-body font-medium">leçons / 6 j</span></p>
                  <Bar value={(count / 24) * 100} className="mt-2" tone={count >= 18 ? "signal" : "pine"} />
                  <p className="text-[11px] text-ink-soft mt-2">{i.hoursWeek} h contractualisées · +{i.extra} h sup</p>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {tab === "flotte" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <Card key={v.id} hover className={`p-5 relative overflow-hidden ${!v.online ? "opacity-90" : ""}`}>
              {!v.online && <div className="absolute top-0 left-0 right-0 hazard h-1.5" />}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display font-bold text-2xl uppercase tracking-tight leading-none">{v.model}</p>
                  <p className="font-mono text-xs text-ink-soft mt-1.5 tracking-wider">{v.plate}</p>
                </div>
                <Badge tone={v.online ? "pine" : "danger"}>{v.online ? "En ligne" : "Atelier"}</Badge>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="flex items-center gap-1.5 font-semibold"><Icon name="fuel" className="w-3.5 h-3.5" /> Carburant</span><span className="tabular font-bold">{v.fuel} %</span></div>
                  <Bar value={v.fuel} tone={v.fuel < 25 ? "danger" : v.fuel < 50 ? "signal" : "pine"} />
                </div>
                <div className="flex justify-between text-xs"><span className="text-ink-soft">Kilométrage</span><span className="tabular font-bold">{v.km.toLocaleString("fr-FR")} km</span></div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-ink-soft flex items-center gap-1.5"><Icon name="wrench" className="w-3.5 h-3.5" /> Révision</span>
                  <Badge tone={v.serviceIn < 0 ? "danger" : v.serviceIn < 1000 ? "signal" : "pine"}>{v.serviceIn < 0 ? `Dépassée de ${-v.serviceIn} km` : `Dans ${v.serviceIn.toLocaleString("fr-FR")} km`}</Badge>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-ink-soft">Contrôle technique</span>
                  <Badge tone={v.ctOk ? "pine" : "danger"}>{v.ctOk ? `OK · ${v.ct}` : `Expiré · ${v.ct}`}</Badge>
                </div>
                <div className="pt-2 border-t border-line">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink-soft block mb-1.5">Moniteur attribué</label>
                  <select value={v.instructor}
                    onChange={(e) => { setVehicles((vs) => vs.map((x) => (x.id === v.id ? { ...x, instructor: e.target.value } : x))); toast(`${v.model} attribuée à ${e.target.value}.`); }}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-card text-sm font-semibold focus:outline-none focus:border-pine-600">
                    <option>—</option>
                    {INSTRUCTORS.map((i) => <option key={i.id} value={i.name}>{i.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-soft">{v.online ? "Passer en maintenance" : "Remettre en ligne"}</span>
                  <Toggle on={v.online} onChange={(on) => { setVehicles((vs) => vs.map((x) => (x.id === v.id ? { ...x, online: on } : x))); toast(on ? `${v.model} remise en service.` : `${v.model} immobilisée — créneaux réattribués.`); }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "examens" && (
        <div className="grid lg:grid-cols-2 gap-4">
          {sessions.map((se) => (
            <Card key={se.id} className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-display font-bold text-2xl uppercase tracking-tight">{se.date}</p>
                  <p className="text-sm text-ink-soft">{se.center}</p>
                </div>
                <div className="flex gap-1.5">
                  {[...Array(se.capacity)].map((_, i) => (
                    <span key={i} className={`w-4 h-4 rounded-full border-2 ${i < se.assigned.length ? "bg-pine-600 border-pine-600" : "border-line"}`} />
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {se.assigned.map((id) => {
                  const st = students.find((s) => s.id === id);
                  return st ? (
                    <div key={id} className="flex items-center gap-3 p-2.5 rounded-lg bg-pine-50 border border-pine-200 text-sm">
                      <Avatar name={st.name} size="sm" />
                      <span className="font-semibold">{st.name}</span>
                      <Badge tone="pine" className="ml-auto">{st.readiness} % prêt</Badge>
                    </div>
                  ) : null;
                })}
                {se.assigned.length < se.capacity ? (
                  <div className="flex gap-2">
                    <select value={pick[se.id] ?? ""} onChange={(e) => setPick((p) => ({ ...p, [se.id]: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-lg border border-dashed border-pine-400 bg-card text-sm focus:outline-none focus:border-pine-600">
                      <option value="">Attribuer une place…</option>
                      {[...eligible].sort((a, b) => b.readiness - a.readiness).map((s) => (
                        <option key={s.id} value={s.id}>{s.name} — {s.readiness} % prêt · {s.hoursDone}/{s.hoursPlan} h</option>
                      ))}
                    </select>
                    <button
                      onClick={() => { const id = pick[se.id]; if (id) { onAssign(se.id, id); setPick((p) => ({ ...p, [se.id]: "" })); } else toast("Sélectionnez d'abord un élève."); }}
                      className="px-4 py-2 rounded-lg bg-pine-700 text-pine-50 font-display font-bold uppercase tracking-wide text-sm hover:bg-pine-800 transition-colors">
                      Convoquer
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-ink-soft text-center py-2">Session complète — {se.capacity}/{se.capacity} places attribuées.</p>
                )}
              </div>
            </Card>
          ))}
          <Card className="p-6 lg:col-span-2">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3">Algorithme d'attribution</p>
            <p className="text-sm text-ink-soft leading-relaxed max-w-3xl">
              Les places fournies par la préfecture sont proposées aux élèves triés par <strong>score de préparation</strong> (moyenne des examens blancs, heures validées au livret, assiduité).
              Un élève convoqué reçoit sa convocation officielle par SMS J-7 avec le plan d'accès, et l'école suit le résultat pour mettre à jour le taux de réussite permis.
            </p>
          </Card>
        </div>
      )}

      {tab === "rappels" && (
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">
          <Card className="divide-y divide-line">
            {reminders.map((r) => (
              <div key={r.id} className="px-6 py-4 flex items-center gap-4">
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${r.channel === "SMS" ? "bg-signal-100 text-signal-700" : "bg-info-50 text-info-600"}`}>
                  <Icon name={r.channel === "SMS" ? "sms" : "pen"} className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{r.label}</p>
                  <p className="text-xs text-ink-soft">{r.audience} · {r.when}</p>
                </div>
                <Badge tone={r.channel === "SMS" ? "signal" : "info"}>{r.channel}</Badge>
                <button onClick={() => toast(`Test ${r.channel} envoyé à votre numéro de direction.`)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line hover:border-pine-600 hover:text-pine-700 transition-colors">Tester</button>
                <Toggle on={r.active} onChange={(on) => { setReminders((rs) => rs.map((x) => (x.id === r.id ? { ...x, active: on } : x))); toast(on ? `Rappel activé : ${r.label}` : `Rappel désactivé : ${r.label}`); }} />
              </div>
            ))}
          </Card>
          <div className="space-y-4">
            <Card className="p-5">
              <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3">Impact ce mois</p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-pine-50 border border-pine-200">
                  <p className="font-display font-bold text-3xl tabular">1 240</p>
                  <p className="text-[10px] uppercase tracking-widest text-ink-soft mt-1">SMS envoyés</p>
                </div>
                <div className="p-3 rounded-lg bg-pine-50 border border-pine-200">
                  <p className="font-display font-bold text-3xl tabular">98 %</p>
                  <p className="text-[10px] uppercase tracking-widest text-ink-soft mt-1">délivrés</p>
                </div>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed mt-4">Les rappels J-1 ont réduit les absences non remplacées de <strong className="text-pine-700">38 %</strong> sur le trimestre.</p>
            </Card>
            <Card className="p-5">
              <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3">Pièces expirant bientôt</p>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>CNI — Aïssatou Fall</span><Badge tone="danger">J-12</Badge></li>
                <li className="flex justify-between"><span>e-photo — Ousmane Bâ</span><Badge tone="signal">J-25</Badge></li>
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
