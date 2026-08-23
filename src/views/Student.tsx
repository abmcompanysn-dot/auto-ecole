import { useEffect, useMemo, useState } from "react";
import { Icon, Badge, Card, Modal, ProgressRing, Bar, SignPad, type IconName } from "../components/ui";
import {
  HOURS, MEETING_POINTS, PAYMENTS, QUESTIONS, REMC, SERIES_HISTORY,
  fmtDay, fmtEuro, hoursUntil, slotDateTime,
  type LessonEntry, type Question, type Session, type Slot,
} from "../data";

type Tab = "apercu" | "code" | "conduite" | "livret" | "facturation";

type Props = {
  slots: Slot[];
  onBook: (id: string, point: string, duration: number) => void;
  onCancel: (id: string) => void;
  skills: Record<string, boolean>;
  lessonLog: LessonEntry[];
  contractSig: { url: string; at: string } | null;
  onSignContract: (url: string) => void;
  sessionAssigned: Session | null;
  toast: (m: string) => void;
};

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "apercu", label: "Aperçu", icon: "gauge" },
  { id: "code", label: "Code", icon: "book" },
  { id: "conduite", label: "Conduite", icon: "wheel" },
  { id: "livret", label: "Livret", icon: "clipboard" },
  { id: "facturation", label: "Facturation", icon: "euro" },
];

/* ————————— Moteur de quiz ————————— */

function CodeModule({ toast }: { toast: (m: string) => void }) {
  const [history, setHistory] = useState(SERIES_HISTORY);
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [time, setTime] = useState(20);

  const readiness = useMemo(() => {
    const last = history.slice(-5);
    return Math.round((last.reduce((s, h) => s + h.score / h.total, 0) / last.length) * 100);
  }, [history]);

  const start = () => {
    setQuiz([...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10));
    setQi(0); setAnswers([]); setPicked(null); setTime(20);
    setPhase("run");
  };

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setAnswers((a) => [...a, i]);
  };

  useEffect(() => {
    if (phase !== "run" || picked !== null) return;
    if (time <= 0) { pick(-1); return; }
    const t = setTimeout(() => setTime((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, phase, picked]);

  const next = () => {
    if (qi + 1 >= quiz.length) {
      const score = answers.filter((a, i) => a === quiz[i].answer).length;
      setHistory((h) => [...h, { label: `Série ${18 + h.length} — Chrono`, score, total: 10, kind: "chrono" as const }]);
      setPhase("done");
      toast(`Série terminée : ${score}/10 — score de préparation mis à jour.`);
      return;
    }
    setQi((i) => i + 1); setPicked(null); setTime(20);
  };

  if (phase === "run") {
    const q = quiz[qi];
    const score = answers.filter((a, i) => a === quiz[i].answer).length;
    return (
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-pine-900 text-pine-100">
            <span className="font-mono text-xs tracking-widest uppercase">Examen blanc · {qi + 1}/10</span>
            <span className={`font-mono text-xs tabular ${time <= 5 ? "text-danger-500 font-bold" : "text-signal-400"}`}>00:{String(Math.max(0, time)).padStart(2, "0")}</span>
          </div>
          <div className="h-1.5 bg-ink/10">
            <div className={`h-full transition-all duration-1000 ease-linear ${time <= 5 ? "bg-danger-500" : "bg-signal-500"}`} style={{ width: `${(Math.max(0, time) / 20) * 100}%` }} />
          </div>
          <div className="p-6">
            <Badge tone="pine">{q.theme}</Badge>
            <h3 className="font-semibold text-xl mt-3 leading-snug">{q.text}</h3>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              {q.options.map((o, i) => {
                const isAns = i === q.answer;
                const cls = picked === null
                  ? "border-line hover:border-pine-500 hover:bg-pine-50 hover:-translate-y-0.5"
                  : isAns ? "border-pine-600 bg-pine-100" : picked === i ? "border-danger-500 bg-danger-50" : "border-line opacity-40";
                return (
                  <button key={o} onClick={() => pick(i)} className={`text-left flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 font-medium text-sm transition-all duration-200 ${cls}`}>
                    <span className="font-display font-bold text-lg w-7 h-7 rounded-md bg-ink/6 flex items-center justify-center shrink-0">{"ABCD"[i]}</span>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="pop-in mt-5 p-4 rounded-lg bg-signal-100 border border-signal-300 text-sm leading-relaxed">
                <strong className={`font-display uppercase tracking-wide ${picked === q.answer ? "text-pine-700" : "text-danger-600"}`}>
                  {picked === q.answer ? "Bonne réponse · " : picked === -1 ? "Temps écoulé · " : "Mauvaise réponse · "}
                </strong>
                {q.explain}
                <button onClick={next} className="mt-4 flex items-center gap-2 bg-ink text-paper px-4 py-2 rounded-lg font-display font-bold uppercase tracking-wide hover:bg-pine-800 transition-colors">
                  {qi + 1 >= quiz.length ? "Voir mes résultats" : "Question suivante"} <Icon name="arrow" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3">Progression</p>
            <div className="flex gap-1.5 flex-wrap">
              {quiz.map((qq, i) => (
                <span key={qq.id} className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center tabular ${i > qi ? "bg-ink/8 text-ink-soft" : answers[i] === qq.answer ? "bg-pine-600 text-pine-50" : "bg-danger-500 text-white"}`}>{i + 1}</span>
              ))}
            </div>
            <p className="text-sm mt-4">Bonnes réponses : <strong className="tabular">{score}</strong></p>
            <p className="text-xs text-ink-soft mt-1">Examen réel : 40 questions, 5 erreurs max.</p>
          </Card>
          <Card className="p-5">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-2">Règle du chrono</p>
            <p className="text-sm text-ink-soft leading-relaxed">20 secondes par question, comme en salle. Sans réponse à 0, la question est comptée fausse.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const score = answers.filter((a, i) => a === quiz[i].answer).length;
    const pass = score >= 9;
    return (
      <Card className="p-8 md:p-12 text-center relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-2 ${pass ? "bg-pine-600" : "bg-danger-500"}`} />
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-ink-soft">Résultat de la série chrono</p>
        <p className="font-display font-bold text-7xl md:text-8xl tabular mt-4">{score}<span className="text-3xl text-ink-soft">/10</span></p>
        <span className={`stamp inline-block mt-5 px-6 py-2 font-display font-bold uppercase tracking-[0.2em] text-xl ${pass ? "text-pine-700" : "text-danger-600"}`}>
          {pass ? "Reçu" : "Ajourné"}
        </span>
        <p className="text-ink-soft mt-6 max-w-md mx-auto text-sm leading-relaxed">
          {pass
            ? "Excellent ! À ce rythme, l'algorithme estime que vous serez prête pour la session officielle. Visez 9/10 stable sur 3 séries d'affilée."
            : "Il faut 9/10 minimum (35/40 à l'examen réel). Concentrez-vous sur les thèmes ratés ci-dessous, puis repassez une série chrono."}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {quiz.map((qq, i) => {
            const ok = answers[i] === qq.answer;
            return <span key={qq.id} title={qq.theme} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${ok ? "border-pine-300 bg-pine-50 text-pine-800" : "border-danger-500/40 bg-danger-50 text-danger-700"}`}>{qq.theme}</span>;
          })}
        </div>
        <div className="flex justify-center gap-3 mt-8">
          <button onClick={start} className="px-6 py-3 rounded-lg bg-pine-700 text-pine-50 font-display font-bold uppercase tracking-wide hover:bg-pine-800 transition-colors">Nouvelle série</button>
          <button onClick={() => setPhase("idle")} className="px-6 py-3 rounded-lg border border-line font-semibold hover:border-pine-600 hover:text-pine-700 transition-colors">Retour à mes séries</button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-5">
      <Card className="p-6 flex flex-col items-center text-center">
        <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft">Algorithme de prédiction</p>
        <div className="my-5">
          <ProgressRing value={readiness} size={150} stroke={12} tone={readiness >= 70 ? "pine" : readiness >= 45 ? "signal" : "danger"} label="Préparation" />
        </div>
        <p className="text-xs text-ink-soft leading-relaxed">
          Moyenne pondérée de vos <strong>5 dernières séries</strong>. Au-delà de <strong>80 %</strong>, la réservation de session officielle est recommandée.
        </p>
        <div className="w-full mt-5 space-y-1.5">
          {history.slice(-5).map((h) => (
            <div key={h.label} className="flex items-center gap-2">
              <span className="text-[10px] text-ink-soft w-14 text-left truncate">{h.label.split(" — ")[0]}</span>
              <Bar value={(h.score / h.total) * 100} tone={h.score >= 9 ? "pine" : h.score >= 7 ? "signal" : "danger"} className="flex-1" />
              <span className="text-[11px] font-bold tabular w-9 text-right">{h.score}/10</span>
            </div>
          ))}
        </div>
      </Card>
      <div className="space-y-4">
        <Card className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-2xl uppercase tracking-tight">Examen blanc chrono</h3>
            <p className="text-sm text-ink-soft mt-1">10 questions tirées au sort · 20 s par question · conditions réelles</p>
          </div>
          <button onClick={start} className="group flex items-center gap-2.5 bg-signal-500 hover:bg-signal-400 text-ink font-display font-bold uppercase tracking-wide text-lg px-6 py-3 rounded-lg transition-all">
            Démarrer <Icon name="flag" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </Card>
        <Card className="p-6">
          <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-4">Mes dernières séries</p>
          <div className="divide-y divide-line">
            {history.map((h) => (
              <div key={h.label} className="py-3 flex items-center gap-4">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${h.score >= 9 ? "bg-pine-100 text-pine-700" : h.score >= 7 ? "bg-signal-100 text-signal-700" : "bg-danger-50 text-danger-600"}`}>
                  <Icon name={h.kind === "chrono" ? "clock" : "book"} className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{h.label}</p>
                  <Bar value={(h.score / h.total) * 100} tone={h.score >= 9 ? "pine" : h.score >= 7 ? "signal" : "danger"} className="mt-1.5 max-w-[220px]" />
                </div>
                <span className="font-display font-bold text-xl tabular">{h.score}<span className="text-xs text-ink-soft">/10</span></span>
                <Badge tone={h.score >= 9 ? "pine" : h.score >= 7 ? "signal" : "danger"}>{h.score >= 9 ? "Reçu" : h.score >= 7 ? "Presque" : "À revoir"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ————————— Planning conduite ————————— */

function BookingModule({ slots, onBook, onCancel }: Pick<Props, "slots" | "onBook" | "onCancel">) {
  const [booking, setBooking] = useState<Slot | null>(null);
  const [cancelling, setCancelling] = useState<Slot | null>(null);
  const [point, setPoint] = useState(MEETING_POINTS[0]);
  const [duration, setDuration] = useState(1);

  const days = [...new Set(slots.map((s) => s.dayOffset))].sort((a, b) => a - b);
  const cancellingHours = cancelling ? hoursUntil(cancelling) : 0;
  const fee = cancellingHours <= 48;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-ink-soft">
          <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded border-2 border-dashed border-pine-400 bg-pine-50" /> Disponible</span>
          <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-pine-700" /> Réservé par vous</span>
          <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-ink/12" /> Occupé</span>
        </div>
        <p className="text-xs text-ink-soft flex items-center gap-1.5"><Icon name="alert" className="w-4 h-4 text-signal-600" /> Annulation gratuite jusqu'à 48 h avant · sinon 20 € retenus</p>
      </div>
      <Card className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}>
            <div />
            {days.map((d) => (
              <div key={d} className="px-2 py-3 text-center font-display font-bold uppercase tracking-wide text-lg border-b-2 border-ink bg-paper">
                {fmtDay(d)}
              </div>
            ))}
            {HOURS.map((h) => (
              <div key={h} className="contents">
                <div className="px-2 py-2 text-right font-mono text-xs text-ink-soft border-b border-line flex items-center justify-end tabular">{h}h</div>
                {days.map((d) => {
                  const s = slots.find((x) => x.dayOffset === d && x.hour === h);
                  if (!s) return <div key={`x${d}-${h}`} className="border-b border-l border-line bg-ink/4" />;
                  if (s.status === "other")
                    return (
                      <div key={s.id} className="border-b border-l border-line p-1">
                        <div className="h-full rounded-md bg-ink/8 px-1.5 py-1 text-[10px] font-semibold text-ink-soft leading-tight truncate" title={`${s.student} · ${s.instructor}`}>
                          {s.student}
                        </div>
                      </div>
                    );
                  if (s.status === "mine")
                    return (
                      <div key={s.id} className="border-b border-l border-line p-1">
                        <button onClick={() => setCancelling(s)} className="w-full h-full rounded-md bg-pine-700 hover:bg-danger-600 text-pine-50 px-1.5 py-1.5 text-[10px] font-bold leading-tight text-left transition-colors group" title="Cliquer pour gérer">
                          <span className="block truncate">Vous · {s.instructor?.split(" ")[0]}</span>
                          <span className="text-pine-200 group-hover:text-white block text-[9px]">Gérer ce créneau</span>
                        </button>
                      </div>
                    );
                  return (
                    <div key={s.id} className="border-b border-l border-line p-1">
                      <button onClick={() => { setBooking(s); setPoint(MEETING_POINTS[(d + h) % MEETING_POINTS.length]); setDuration(1); }}
                        className="w-full h-full min-h-9 rounded-md border-2 border-dashed border-pine-300 bg-pine-50/40 hover:bg-pine-100 hover:border-pine-500 hover:scale-[1.03] transition-all" aria-label={`Réserver ${fmtDay(d)} ${h}h`} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
      <p className="text-xs text-ink-soft flex items-center gap-1.5"><Icon name="pin" className="w-4 h-4" /> Points de prise en charge : {MEETING_POINTS.join(" · ")}</p>

      <Modal open={!!booking} onClose={() => setBooking(null)} title="Réserver un créneau"
        footer={
          <>
            <button onClick={() => setBooking(null)} className="px-4 py-2 rounded-lg border border-line font-semibold text-ink-soft hover:border-danger-500 hover:text-danger-600 transition-colors">Annuler</button>
            <button onClick={() => { if (booking) onBook(booking.id, point, duration); setBooking(null); }}
              className="px-5 py-2 rounded-lg bg-pine-700 text-pine-50 font-display font-bold uppercase tracking-wide hover:bg-pine-800 transition-colors">Confirmer la réservation</button>
          </>
        }>
        {booking && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-pine-50 border border-pine-200">
              <Icon name="calendar" className="w-6 h-6 text-pine-700" />
              <div>
                <p className="font-display font-bold text-xl uppercase">{fmtDay(booking.dayOffset)} · {booking.hour}h00</p>
                <p className="text-xs text-ink-soft">Créneau confirmé instantanément — SMS de rappel envoyé à J-1.</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5 mb-2"><Icon name="pin" className="w-4 h-4" /> Point de rendez-vous</label>
              <div className="grid sm:grid-cols-2 gap-2">
                {MEETING_POINTS.map((p) => (
                  <button key={p} onClick={() => setPoint(p)} className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-left transition-all ${point === p ? "border-pine-600 bg-pine-100 text-pine-900" : "border-line hover:border-pine-400"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2 block">Durée de la leçon</label>
              <div className="flex gap-2">
                {[1, 2].map((d) => (
                  <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-2.5 rounded-lg border font-display font-bold text-lg uppercase transition-all ${duration === d ? "border-pine-600 bg-pine-100 text-pine-900" : "border-line hover:border-pine-400"}`}>
                    {d} heure{d > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!cancelling} onClose={() => setCancelling(null)} title="Gérer ma réservation"
        footer={
          <>
            <button onClick={() => setCancelling(null)} className="px-4 py-2 rounded-lg border border-line font-semibold text-ink-soft hover:border-pine-600 hover:text-pine-700 transition-colors">Garder ce créneau</button>
            <button onClick={() => { if (cancelling) onCancel(cancelling.id); setCancelling(null); }}
              className={`px-5 py-2 rounded-lg font-display font-bold uppercase tracking-wide text-white transition-colors ${fee ? "bg-danger-600 hover:bg-danger-700" : "bg-pine-700 hover:bg-pine-800"}`}>
              {fee ? "Annuler (20 € de frais)" : "Annuler gratuitement"}
            </button>
          </>
        }>
        {cancelling && (
          <div className="space-y-3">
            <p className="font-display font-bold text-2xl uppercase">{fmtDay(cancelling.dayOffset)} · {cancelling.hour}h00</p>
            <p className="text-sm text-ink-soft">{cancelling.instructor} · {cancelling.vehicle} · {cancelling.point}</p>
            <div className={`p-3.5 rounded-lg border text-sm flex gap-2.5 items-start ${fee ? "bg-danger-50 border-danger-500/40 text-danger-700" : "bg-pine-50 border-pine-200 text-pine-800"}`}>
              <Icon name="alert" className="w-5 h-5 shrink-0" />
              {fee
                ? `Ce cours a lieu dans ${Math.max(0, Math.round(cancellingHours))} h : le préavis de 48 h n'est plus respecté. Des frais de 20 € seront appliqués pour indemniser le moniteur.`
                : `Préavis de 48 h respecté (cours dans ${Math.round(cancellingHours)} h) : l'annulation est gratuite et le créneau est remis en vente immédiatement.`}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ————————— Vue principale élève ————————— */

export default function Student(props: Props) {
  const { slots, skills, lessonLog, contractSig, onSignContract, sessionAssigned, toast } = props;
  const [tab, setTab] = useState<Tab>("apercu");

  const mySlots = slots.filter((s) => s.status === "mine").sort((a, b) => slotDateTime(a).getTime() - slotDateTime(b).getTime());
  const next = mySlots[0];
  const totalSkills = REMC.reduce((s, b) => s + b.skills.length, 0);
  const doneSkills = REMC.flatMap((b) => b.skills).filter((s) => skills[s.id]).length;
  const livretPct = Math.round((doneSkills / totalSkills) * 100);
  const readiness = Math.min(97, 62 + livretPct / 5 + (sessionAssigned ? 10 : 0));
  const paid = PAYMENTS.filter((p) => p.status === "Payée").reduce((s, p) => s + p.amount, 0);
  const total = PAYMENTS.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
      <div className="pt-8 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-pine-600 flex items-center gap-2">
            <span className="w-6 h-[3px] bg-signal-500 inline-block" /> Portail élève · Dossier n° 2026-0148
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight mt-2">Bonjour, Awa</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="pine"><Icon name="shield" className="w-3.5 h-3.5" /> NEPH Validé</Badge>
          <Badge tone="info">Conduite accompagnée</Badge>
          <Badge tone="signal">17 ans</Badge>
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

      {tab === "code" && <CodeModule toast={toast} />}
      {tab === "conduite" && <BookingModule slots={slots} onBook={props.onBook} onCancel={props.onCancel} />}

      {tab === "apercu" && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 flex flex-col items-center text-center">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft">Prédiction de réussite Code</p>
            <div className="my-4"><ProgressRing value={82} size={130} stroke={11} tone="pine" label="Prêt à 82 %" /></div>
            <p className="text-xs text-ink-soft leading-relaxed">Basée sur vos 5 dernières séries. Session officielle conseillée dès 80 %.</p>
            <button onClick={() => setTab("code")} className="mt-4 text-sm font-display font-bold uppercase tracking-wide text-pine-700 hover:text-pine-900 flex items-center gap-2">Passer une série <Icon name="arrow" className="w-4 h-4" /></button>
          </Card>
          <Card className="p-6">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-4">Prochaine heure de conduite</p>
            {next ? (
              <>
                <p className="font-display font-bold text-3xl uppercase leading-none">{fmtDay(next.dayOffset)}</p>
                <p className="font-display font-bold text-5xl tabular text-pine-700 mt-1">{next.hour}h00</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex items-center gap-2"><Icon name="user" className="w-4 h-4 text-pine-600" /> {next.instructor}</p>
                  <p className="flex items-center gap-2"><Icon name="car" className="w-4 h-4 text-pine-600" /> {next.vehicle}</p>
                  <p className="flex items-center gap-2"><Icon name="pin" className="w-4 h-4 text-pine-600" /> {next.point}</p>
                </div>
                <button onClick={() => setTab("conduite")} className="mt-4 text-sm font-semibold text-pine-700 hover:text-pine-900 flex items-center gap-1.5">Gérer mes créneaux <Icon name="chevron" className="w-4 h-4" /></button>
              </>
            ) : (
              <div>
                <p className="text-sm text-ink-soft">Aucun créneau réservé pour le moment.</p>
                <button className="underline font-semibold mt-1 text-pine-700" onClick={() => setTab("conduite")}>Réserver maintenant</button>
              </div>
            )}
          </Card>
          <Card className="p-6">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-4">Ma progression</p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold">Code</span><span className="tabular font-bold">82 %</span></div>
                <Bar value={82} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold">Heures de conduite</span><span className="tabular font-bold">14/20 h</span></div>
                <Bar value={70} tone="info" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold">Livret numérique</span><span className="tabular font-bold">{doneSkills}/{totalSkills} compétences</span></div>
                <Bar value={livretPct} tone="signal" />
              </div>
            </div>
            <button onClick={() => setTab("livret")} className="mt-4 text-sm font-semibold text-pine-700 hover:text-pine-900 flex items-center gap-1.5">Ouvrir mon livret <Icon name="chevron" className="w-4 h-4" /></button>
          </Card>
          <Card className={`p-6 md:col-span-2 ${sessionAssigned ? "border-pine-300 bg-pine-50/60" : ""}`}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft flex items-center gap-2"><Icon name="flag" className="w-4 h-4 text-pine-600" /> Examen pratique</p>
              <Badge tone={sessionAssigned ? "pine" : "neutral"}>{sessionAssigned ? "Convoquée" : "En attente"}</Badge>
            </div>
            {sessionAssigned ? (
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <div>
                  <p className="font-display font-bold text-2xl uppercase">{sessionAssigned.date}</p>
                  <p className="text-sm text-ink-soft">{sessionAssigned.center}</p>
                </div>
                <p className="text-sm text-pine-800 leading-relaxed max-w-sm">Votre convocation officielle et le plan d'accès ont été envoyés par SMS. Présentez-vous 15 min avant avec votre pièce d'identité.</p>
              </div>
            ) : (
              <p className="text-sm text-ink-soft leading-relaxed">
                L'école répartit les places de la préfecture selon le <strong>score de préparation</strong>. Vous êtes à <strong className="tabular">{readiness} %</strong> — encore quelques heures validées au livret et une place vous sera attribuée automatiquement pour la session du 07 avril.
              </p>
            )}
          </Card>
          <Card className="p-6">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-4">Activité récente</p>
            <ul className="space-y-3 text-sm">
              {lessonLog.slice(0, 2).map((l) => (
                <li key={l.id} className="flex gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-pine-600 mt-1.5 shrink-0" /><span><strong>{l.topic}</strong> — fiche signée par {l.instructor} <span className="text-ink-soft">({l.date})</span></span></li>
              ))}
              <li className="flex gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-signal-500 mt-1.5 shrink-0" /><span>Échéance 2/4 payée par carte — <span className="text-ink-soft">05 févr.</span></span></li>
            </ul>
          </Card>
        </div>
      )}

      {tab === "livret" && (
        <div className="space-y-5">
          <div className="grid lg:grid-cols-[280px_1fr] gap-5">
            <Card className="p-6 flex flex-col items-center text-center h-fit lg:sticky lg:top-32">
              <ProgressRing value={livretPct} size={140} stroke={12} tone={livretPct >= 60 ? "pine" : "signal"} label={`${doneSkills}/${totalSkills}`} />
              <p className="font-display font-bold text-xl uppercase mt-4 tracking-tight">Livret d'apprentissage</p>
              <p className="text-xs text-ink-soft mt-2 leading-relaxed">Conforme au référentiel REMC. Chaque compétence est validée par votre moniteur puis signée numériquement en fin d'heure.</p>
            </Card>
            <div className="grid sm:grid-cols-2 gap-4 content-start">
              {REMC.map((b, bi) => {
                const done = b.skills.filter((s) => skills[s.id]).length;
                return (
                  <Card key={b.id} className="p-5" hover>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display font-bold uppercase text-lg tracking-tight flex items-center gap-2">
                        <span className="w-7 h-7 rounded-md bg-pine-700 text-pine-50 flex items-center justify-center text-sm">{bi + 1}</span>
                        {b.title}
                      </span>
                      <span className="font-mono text-xs tabular text-ink-soft">{done}/4</span>
                    </div>
                    <Bar value={(done / 4) * 100} className="mb-4" tone={done === 4 ? "pine" : "signal"} />
                    <ul className="space-y-2">
                      {b.skills.map((s) => (
                        <li key={s.id} className={`flex items-start gap-2.5 text-[13px] leading-snug ${skills[s.id] ? "" : "text-ink-soft"}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 ${skills[s.id] ? "bg-pine-600 border-pine-600 text-pine-50" : "border-line"}`}>
                            {skills[s.id] && <Icon name="check" className="w-3 h-3" strokeWidth={2.4} />}
                          </span>
                          <span className={skills[s.id] ? "font-medium" : ""}>{s.label}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </div>
          <Card className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <h3 className="font-display font-bold text-2xl uppercase tracking-tight flex items-center gap-2"><Icon name="pen" className="w-5 h-5 text-pine-600" /> Contrat d'enseignement</h3>
                <p className="text-sm text-ink-soft mt-1">Signature électronique conforme à la réglementation (forfait 1 290 €, échelonné en 4 versements).</p>
              </div>
              <Badge tone={contractSig ? "pine" : "signal"}>{contractSig ? "Signé" : "À signer"}</Badge>
            </div>
            {contractSig ? (
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-lg bg-pine-50 border border-pine-200">
                <img src={contractSig.url} alt="Signature d'Awa Ndiaye" className="h-16 bg-card rounded border border-line px-3" />
                <div>
                  <p className="font-semibold text-sm">Awa Ndiaye</p>
                  <p className="text-xs text-ink-soft">Signé électroniquement le {contractSig.at}</p>
                  <button onClick={() => toast("Contrat PDF horodaté téléchargé.")} className="text-xs font-semibold text-pine-700 hover:text-pine-900 flex items-center gap-1 mt-1"><Icon name="download" className="w-3.5 h-3.5" /> Télécharger le PDF</button>
                </div>
              </div>
            ) : (
              <SignPad onSign={(url) => onSignContract(url)} />
            )}
          </Card>
        </div>
      )}

      {tab === "facturation" && (
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">
          <Card className="overflow-hidden">
            <div className="px-6 py-4 bg-pine-900 text-pine-50 flex items-center justify-between">
              <p className="font-display font-bold text-xl uppercase tracking-wide">Échéancier — 4 versements</p>
              <span className="font-mono text-xs text-pine-300">Facture n° F-2026-0148</span>
            </div>
            <div className="divide-y divide-line">
              {PAYMENTS.map((p) => (
                <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-pine-50/40 transition-colors">
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${p.status === "Payée" ? "bg-pine-100 text-pine-700" : p.status === "En retard" ? "bg-danger-50 text-danger-600" : "bg-ink/6 text-ink-soft"}`}>
                    <Icon name={p.status === "Payée" ? "check" : "euro"} className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{p.label}</p>
                    <p className="text-xs text-ink-soft">Échéance : {p.due} · {p.method}</p>
                  </div>
                  <span className="font-display font-bold text-xl tabular">{fmtEuro(p.amount)}</span>
                  <Badge tone={p.status === "Payée" ? "pine" : p.status === "En retard" ? "danger" : "neutral"}>{p.status}</Badge>
                  {p.status === "Payée" && (
                    <button onClick={() => toast(`Reçu ${p.id.toUpperCase()} téléchargé (PDF).`)} className="p-2 rounded-lg border border-line hover:border-pine-600 hover:text-pine-700 transition-colors" aria-label="Télécharger le reçu">
                      <Icon name="download" className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
          <div className="space-y-4">
            <Card className="p-6">
              <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-4">Récapitulatif</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-ink-soft">Forfait Code + 20 h</span><strong className="tabular">{fmtEuro(total)}</strong></div>
                <div className="flex justify-between"><span className="text-ink-soft">Déjà réglé</span><strong className="tabular text-pine-700">{fmtEuro(paid)}</strong></div>
                <div className="flex justify-between border-t border-line pt-2.5"><span className="font-semibold">Reste à payer</span><strong className="tabular text-lg">{fmtEuro(total - paid)}</strong></div>
              </div>
              <Bar value={(paid / total) * 100} className="mt-4" />
            </Card>
            <Card className="p-6">
              <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3">Moyens de paiement acceptés</p>
              <div className="flex flex-wrap gap-2">
                {["Wave", "Orange Money", "Carte bancaire", "Espèces (agence)"].map((m) => (
                  <span key={m} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-line bg-paper">{m}</span>
                ))}
              </div>
              <button onClick={() => toast("Lien de paiement 3x/4x envoyé par SMS au +221 77 512 34 08.")} className="mt-4 w-full py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-ink font-display font-bold uppercase tracking-wide text-sm transition-colors">
                Payer l'échéance 3/4
              </button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
