import { useCallback, useState } from "react";
import { Icon, Avatar, type IconName } from "./components/ui";
import {
  INITIAL_LOG, INSTRUCTOR_NAMES, SESSIONS, STUDENTS, VEHICLE_NAMES, hoursUntil, makeSlots,
  type LessonEntry, type Session, type Slot,
} from "./data";
import Landing from "./views/Landing";
import Student from "./views/Student";
import Instructor from "./views/Instructor";
import Admin from "./views/Admin";
import SuperAdmin from "./views/SuperAdmin";

type Role = "landing" | "student" | "instructor" | "admin" | "super";

const ROLES: { id: Role; label: string; icon: IconName; user: string; userRole: string }[] = [
  { id: "landing", label: "Vitrine", icon: "store", user: "Visiteur", userRole: "Site public" },
  { id: "student", label: "Élève", icon: "book", user: "Awa Ndiaye", userRole: "Dossier 2026-0148" },
  { id: "instructor", label: "Moniteur", icon: "wheel", user: "Karim Haddad", userRole: "Moniteur B · AAC" },
  { id: "admin", label: "Direction", icon: "gauge", user: "Mamadou Sène", userRole: "Gérant & secrétariat" },
  { id: "super", label: "SaaS", icon: "cloud", user: "Super Admin", userRole: "PILOTE HQ" },
];

const SEED_SKILLS: Record<string, boolean> = {
  m1: true, m2: true, m3: true, m4: true,
  a1: true, a2: true, a3: true,
  p1: true, p2: true,
};

type Toast = { id: number; msg: string };

export default function App() {
  const [role, setRole] = useState<Role>("landing");
  const [slots, setSlots] = useState<Slot[]>(() => makeSlots());
  const [skillsByStudent, setSkillsByStudent] = useState<Record<string, Record<string, boolean>>>({ s1: { ...SEED_SKILLS } });
  const [lessonLog, setLessonLog] = useState<LessonEntry[]>(INITIAL_LOG);
  const [sessions, setSessions] = useState<Session[]>(() => SESSIONS.map((s) => ({ ...s, assigned: [...s.assigned] })));
  const [contractSig, setContractSig] = useState<{ url: string; at: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  /* ——— Actions partagées entre espaces ——— */

  const bookSlot = (id: string, point: string, duration: number) => {
    setSlots((ss) =>
      ss.map((x) =>
        x.id === id
          ? {
              ...x, status: "mine", student: "Awa Ndiaye", point, duration,
              instructor: INSTRUCTOR_NAMES[x.hour % INSTRUCTOR_NAMES.length],
              vehicle: VEHICLE_NAMES[(x.hour + x.dayOffset) % VEHICLE_NAMES.length],
            }
          : x
      )
    );
    toast("Créneau réservé — rappel SMS programmé la veille à 18h.");
  };

  const cancelSlot = (id: string) => {
    const s = slots.find((x) => x.id === id);
    if (!s) return;
    const free = hoursUntil(s) > 48;
    setSlots((ss) =>
      ss.map((x) => (x.id === id ? { ...x, status: "free", student: undefined, instructor: undefined, vehicle: undefined, point: undefined, duration: undefined } : x))
    );
    toast(free ? "Créneau annulé gratuitement et remis en vente." : "Créneau annulé — frais de 20 € ajoutés à l'échéance 3/4.");
  };

  const toggleSkill = (studentId: string, skillId: string) => {
    setSkillsByStudent((m) => ({
      ...m,
      [studentId]: { ...(m[studentId] ?? {}), [skillId]: !(m[studentId] ?? {})[skillId] },
    }));
  };

  const addLog = (e: LessonEntry) => setLessonLog((l) => [e, ...l]);

  const assignSession = (sessionId: string, studentId: string) => {
    setSessions((ss) => ss.map((s) => (s.id === sessionId && !s.assigned.includes(studentId) ? { ...s, assigned: [...s.assigned, studentId] } : s)));
    toast("Convocation attribuée — SMS officiel envoyé à l'élève avec plan d'accès.");
  };

  const signContract = (url: string) => {
    const at = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    setContractSig({ url, at });
    toast("Contrat d'enseignement signé et archivé au dossier.");
  };

  const current = ROLES.find((r) => r.id === role)!;
  const sessionAssigned = sessions.find((s) => s.assigned.includes("s1")) ?? null;

  return (
    <div className="noise min-h-screen bg-paper text-ink relative">
      {/* ——— Barre latérale ——— */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 bg-pine-950 text-pine-100 flex-col z-40">
        <div className="absolute top-0 bottom-0 right-0 w-1 lane-edge dash-drift opacity-60" />
        <button onClick={() => setRole("landing")} className="flex items-center gap-3 px-5 py-5 text-left group">
          <span className="w-10 h-10 rounded-xl bg-signal-500 text-ink flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Icon name="wheel" className="w-6 h-6" strokeWidth={2} />
          </span>
          <span>
            <span className="block font-display font-bold text-2xl uppercase tracking-wide text-pine-50 leading-none">Pilote</span>
            <span className="block font-mono text-[9px] tracking-[0.28em] uppercase text-pine-400 mt-1">SaaS Auto-École</span>
          </span>
        </button>

        <p className="px-5 pt-3 pb-2 font-mono text-[10px] tracking-[0.25em] uppercase text-pine-500">Espaces</p>
        <nav className="px-3 space-y-1">
          {ROLES.map((r) => (
            <button key={r.id} onClick={() => setRole(r.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === r.id ? "bg-pine-800 text-pine-50 shadow-[inset_3px_0_0_var(--color-signal-500)]" : "text-pine-300 hover:bg-pine-900 hover:text-pine-100 hover:translate-x-1"}`}>
              <Icon name={r.icon} className="w-4.5 h-4.5" />
              {r.label}
              {r.id === "admin" && role !== "admin" && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-signal-500" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-4 pb-5 space-y-3">
          <div className="rounded-xl bg-pine-900 border border-pine-800 p-3.5 text-[11px] space-y-2">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-pine-500">État des services</p>
            {[["API Préfecture / ANTS", true], ["Paiements Wave · OM", true], ["Passerelle SMS", true]].map(([l, ok]) => (
              <p key={l as string} className="flex items-center gap-2 text-pine-200">
                <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-pine-400" : "bg-danger-500"}`} /> {l as string}
              </p>
            ))}
          </div>
          <p className="px-1 font-mono text-[9px] tracking-widest text-pine-600 uppercase">v2.9.1 — démo interactive</p>
        </div>
      </aside>

      {/* ——— Zone principale ——— */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-line">
          <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center gap-4">
            <button onClick={() => setRole("landing")} className="lg:hidden flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-signal-500 text-ink flex items-center justify-center"><Icon name="wheel" className="w-5 h-5" strokeWidth={2} /></span>
              <span className="font-display font-bold text-xl uppercase">Pilote</span>
            </button>
            <p className="hidden lg:block font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft">
              {current.label === "Vitrine" ? "plateforme / vitrine" : `plateforme / ${current.label.toLowerCase()}`}
            </p>
            <div className="ml-auto flex items-center gap-3">
              <button onClick={() => toast("3 notifications : rappel cours demain, échéance 3/4 à J-5, convocation en attente.")}
                className="relative p-2 rounded-lg hover:bg-ink/6 text-ink-soft transition-colors" aria-label="Notifications">
                <Icon name="bell" className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-paper" />
              </button>
              <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-line">
                <Avatar name={current.user} />
                <div className="leading-tight">
                  <p className="text-sm font-bold">{current.user}</p>
                  <p className="text-[10px] text-ink-soft uppercase tracking-wider">{current.userRole}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Sélecteur d'espace mobile */}
          <div className="lg:hidden flex gap-1.5 px-4 pb-2.5 overflow-x-auto">
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${role === r.id ? "bg-ink text-paper" : "bg-ink/6 text-ink-soft"}`}>
                <Icon name={r.icon} className="w-3.5 h-3.5" /> {r.label}
              </button>
            ))}
          </div>
        </header>

        <main key={role} className="fade-up relative z-[2]">
          {role === "landing" && <Landing toast={toast} go={(r) => setRole(r)} />}
          {role === "student" && (
            <Student
              slots={slots}
              onBook={bookSlot}
              onCancel={cancelSlot}
              skills={skillsByStudent["s1"] ?? {}}
              lessonLog={lessonLog.filter((l) => l.studentId === "s1")}
              contractSig={contractSig}
              onSignContract={signContract}
              sessionAssigned={sessionAssigned}
              toast={toast}
            />
          )}
          {role === "instructor" && (
            <Instructor
              slots={slots}
              skillsByStudent={skillsByStudent}
              onToggleSkill={toggleSkill}
              lessonLog={lessonLog}
              onAddLog={addLog}
              toast={toast}
            />
          )}
          {role === "admin" && (
            <Admin
              students={STUDENTS}
              slots={slots}
              sessions={sessions}
              onAssign={assignSession}
              toast={toast}
            />
          )}
          {role === "super" && <SuperAdmin toast={toast} />}
        </main>
      </div>

      {/* ——— Toasts ——— */}
      <div className="fixed bottom-5 right-5 z-[60] space-y-2.5 max-w-sm">
        {toasts.map((t) => (
          <div key={t.id} className="toast-in flex items-start gap-3 bg-pine-950 text-pine-50 pl-4 pr-5 py-3.5 rounded-xl shadow-2xl border border-pine-800">
            <span className="w-5 h-5 rounded-full bg-signal-500 text-ink flex items-center justify-center shrink-0 mt-0.5">
              <Icon name="check" className="w-3 h-3" strokeWidth={2.6} />
            </span>
            <p className="text-sm leading-snug">{t.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
