import { useState } from "react";
import { Icon, Badge, Card, Bar, ProgressRing, SignPad, Avatar, type IconName } from "../components/ui";
import { INSTRUCTORS, REMC, STUDENTS, fmtDay, type LessonEntry, type Slot } from "../data";

type Tab = "jour" | "fiches" | "suivi";

type Props = {
  slots: Slot[];
  skillsByStudent: Record<string, Record<string, boolean>>;
  onToggleSkill: (studentId: string, skillId: string) => void;
  lessonLog: LessonEntry[];
  onAddLog: (e: LessonEntry) => void;
  toast: (m: string) => void;
};

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "jour", label: "Ma journée", icon: "clock" },
  { id: "fiches", label: "Fiche de suivi", icon: "clipboard" },
  { id: "suivi", label: "Historique", icon: "users" },
];

const ME = INSTRUCTORS[0];

export default function Instructor(props: Props) {
  const { slots, skillsByStudent, onToggleSkill, lessonLog, onAddLog, toast } = props;
  const [tab, setTab] = useState<Tab>("jour");
  const [studentId, setStudentId] = useState("s1");
  const [note, setNote] = useState("");
  const [sig, setSig] = useState<string | null>(null);

  const student = STUDENTS.find((s) => s.id === studentId) ?? STUDENTS[0];
  const skills = skillsByStudent[student.id] ?? {};
  const totalSkills = REMC.reduce((s, b) => s + b.skills.length, 0);
  const doneSkills = REMC.flatMap((b) => b.skills).filter((s) => skills[s.id]).length;

  const todayLessons = slots
    .filter((s) => s.dayOffset === 1 && s.instructor === ME.name && s.status !== "free")
    .sort((a, b) => a.hour - b.hour);
  const weekLessons = slots.filter((s) => s.instructor === ME.name && s.status !== "free").length;

  const closeSession = () => {
    if (!sig) return;
    onAddLog({
      id: `l${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      instructor: ME.name,
      date: `${fmtDay(1)} · ${new Date().getHours()}h`,
      hours: 2,
      topic: note.trim() ? note.trim().split("\n")[0].slice(0, 42) : "Séance de conduite",
      note: note.trim() || undefined,
      signature: sig,
    });
    toast(`Fiche signée et ajoutée au livret de ${student.name}.`);
    setNote("");
    setSig(null);
    setTab("suivi");
  };

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
      <div className="pt-8 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-pine-600 flex items-center gap-2">
            <span className="w-6 h-[3px] bg-signal-500 inline-block" /> Espace moniteur · {ME.name}
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight mt-2">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </h1>
        </div>
        <div className="flex gap-3">
          {[
            { v: `${ME.hoursWeek} h`, l: "cette semaine" },
            { v: `+${ME.extra} h`, l: "supplémentaires" },
            { v: `${ME.studentsCount}`, l: "élèves suivis" },
          ].map((s) => (
            <div key={s.l} className="bg-card border border-line rounded-xl px-4 py-3 text-center min-w-[92px]">
              <p className="font-display font-bold text-2xl tabular leading-none">{s.v}</p>
              <p className="text-[10px] uppercase tracking-widest text-ink-soft mt-1">{s.l}</p>
            </div>
          ))}
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

      {tab === "jour" && (
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">
          <div className="space-y-3">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft">Cours de demain — {fmtDay(1)} · {todayLessons.length} leçons</p>
            {todayLessons.length === 0 && (
              <Card className="p-8 text-center text-ink-soft">Aucune leçon planifiée demain. Profitez-en pour mettre à jour les livrets.</Card>
            )}
            {todayLessons.map((l, i) => (
              <Card key={l.id} hover className="p-5 flex flex-wrap items-center gap-4">
                <div className="w-20 text-center shrink-0">
                  <p className="font-display font-bold text-3xl tabular leading-none">{l.hour}h</p>
                  <p className="text-[10px] uppercase tracking-widest text-ink-soft mt-1">{l.duration ?? 1} h</p>
                </div>
                <span className="w-px self-stretch bg-line" />
                <div className="flex-1 min-w-[180px]">
                  <p className="font-semibold flex items-center gap-2"><Avatar name={l.student ?? "?"} size="sm" /> {l.student}</p>
                  <p className="text-xs text-ink-soft mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1"><Icon name="pin" className="w-3.5 h-3.5" /> {l.point}</span>
                    <span className="flex items-center gap-1"><Icon name="car" className="w-3.5 h-3.5" /> {l.vehicle}</span>
                  </p>
                </div>
                <button onClick={() => { setStudentId(STUDENTS.find((s) => s.name === l.student)?.id ?? "s1"); setTab("fiches"); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pine-700 text-pine-50 font-display font-bold uppercase tracking-wide text-sm hover:bg-pine-800 transition-colors">
                  <Icon name="clipboard" className="w-4 h-4" /> Fiche de suivi
                </button>
                {i === 0 && <Badge tone="signal">Prochain cours</Badge>}
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card className="p-5">
              <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3">Ma semaine</p>
              <p className="font-display font-bold text-4xl tabular">{weekLessons} <span className="text-lg text-ink-soft font-body font-medium">leçons à venir</span></p>
              <Bar value={(weekLessons / 28) * 100} className="mt-3" />
              <p className="text-xs text-ink-soft mt-2">Taux de remplissage : {Math.round((weekLessons / 28) * 100)} % des 28 h contrat.</p>
            </Card>
            <Card className="p-5">
              <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-3">Mon véhicule</p>
              <p className="font-semibold flex items-center gap-2"><Icon name="car" className="w-5 h-5 text-pine-600" /> {ME.vehicle}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
                <Icon name="fuel" className="w-4 h-4 text-signal-600" />
                <Bar value={62} tone="signal" className="flex-1" />
                <span className="font-bold tabular">62 %</span>
              </div>
              <p className="text-[11px] text-ink-soft mt-2">Plein à faire avant vendredi (seuil 30 %).</p>
            </Card>
            <Card className="p-5">
              <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-2">Note des élèves</p>
              <p className="flex items-center gap-2">
                <span className="font-display font-bold text-4xl tabular">{ME.rating}</span>
                <span className="flex text-signal-500">
                  {[...Array(5)].map((_, i) => <Icon key={i} name="star" className="w-4 h-4" />)}
                </span>
              </p>
              <p className="text-xs text-ink-soft mt-1">Sur 47 avis d'élèves vérifiés.</p>
            </Card>
          </div>
        </div>
      )}

      {tab === "fiches" && (
        <div className="grid lg:grid-cols-[300px_1fr] gap-5">
          <Card className="p-6 h-fit lg:sticky lg:top-32">
            <label className="font-mono text-[11px] tracking-widest uppercase text-ink-soft block mb-2">Élève suivi</label>
            <select value={studentId} onChange={(e) => { setStudentId(e.target.value); setSig(null); }}
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-card font-semibold text-sm focus:outline-none focus:border-pine-600">
              {STUDENTS.filter((s) => s.hoursPlan > 0).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="flex items-center justify-center my-6">
              <ProgressRing value={Math.round((doneSkills / totalSkills) * 100)} size={130} stroke={11} tone={doneSkills >= 12 ? "pine" : "signal"} label={`${doneSkills}/${totalSkills}`} />
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-ink-soft">Heures effectuées</span><strong className="tabular">{student.hoursDone}/{student.hoursPlan} h</strong></div>
              <Bar value={(student.hoursDone / Math.max(1, student.hoursPlan)) * 100} tone="info" />
              <div className="flex justify-between pt-2"><span className="text-ink-soft">Préparation examen</span><strong className="tabular">{student.readiness} %</strong></div>
            </div>
          </Card>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {REMC.map((b, bi) => {
                const done = b.skills.filter((s) => skills[s.id]).length;
                return (
                  <Card key={b.id} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display font-bold uppercase tracking-tight flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-pine-700 text-pine-50 flex items-center justify-center text-xs">{bi + 1}</span>
                        {b.title}
                      </span>
                      <Badge tone={done === 4 ? "pine" : "neutral"}>{done}/4</Badge>
                    </div>
                    <ul className="space-y-1.5">
                      {b.skills.map((s) => (
                        <li key={s.id}>
                          <button onClick={() => { onToggleSkill(student.id, s.id); }}
                            className={`w-full flex items-start gap-2.5 text-left text-[13px] leading-snug px-2.5 py-2 rounded-lg border transition-all ${skills[s.id] ? "border-pine-300 bg-pine-50" : "border-transparent hover:bg-ink/4"}`}>
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2 transition-colors ${skills[s.id] ? "bg-pine-600 border-pine-600 text-pine-50" : "border-line"}`}>
                              {skills[s.id] && <Icon name="check" className="w-3 h-3" strokeWidth={2.6} />}
                            </span>
                            <span className={skills[s.id] ? "font-medium text-pine-900" : "text-ink-soft"}>{s.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
            <Card className="p-6">
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight mb-1">Clôturer la séance</h3>
              <p className="text-sm text-ink-soft mb-4">Le commentaire et la double signature (moniteur + élève) sont archivés au livret numérique.</p>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Ex. : travail des créneaux, penser au freinage dégressif…"
                className="w-full px-3.5 py-3 rounded-lg border border-line bg-card text-sm focus:outline-none focus:border-pine-600 resize-none" />
              <div className="grid sm:grid-cols-2 gap-5 mt-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">Signature du moniteur</p>
                  {sig ? (
                    <div className="p-3 rounded-lg bg-pine-50 border border-pine-200 flex items-center gap-3">
                      <img src={sig} alt="Signature du moniteur" className="h-12 bg-card rounded border border-line px-2" />
                      <span className="text-xs font-semibold text-pine-800 flex items-center gap-1"><Icon name="check" className="w-4 h-4" /> Signé</span>
                    </div>
                  ) : (
                    <SignPad onSign={setSig} />
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">Validation</p>
                  <div className="flex-1 p-3.5 rounded-lg border border-dashed border-line text-xs text-ink-soft leading-relaxed">
                    {sig
                      ? `Prêt à archiver la séance de ${student.name} (2 h). L'élève recevra la fiche signée par notification.`
                      : "Signez pour débloquer la clôture de séance."}
                  </div>
                  <button onClick={closeSession} disabled={!sig}
                    className={`mt-3 w-full py-3 rounded-lg font-display font-bold uppercase tracking-wide transition-colors ${sig ? "bg-pine-700 text-pine-50 hover:bg-pine-800" : "bg-ink/10 text-ink-soft/60 cursor-not-allowed"}`}>
                    Archiver la fiche signée
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "suivi" && (
        <div className="grid lg:grid-cols-[1fr_340px] gap-5">
          <Card className="p-6">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-4">Fiches signées récentes</p>
            <div className="space-y-4">
              {lessonLog.map((l) => (
                <div key={l.id} className="p-4 rounded-lg border border-line hover:border-pine-300 transition-colors">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-semibold text-sm">{l.topic}</p>
                    <Badge tone="pine"><Icon name="pen" className="w-3 h-3" /> Signée</Badge>
                  </div>
                  <p className="text-xs text-ink-soft mt-1">{l.studentName} · {l.instructor} · {l.date} · {l.hours} h</p>
                  {l.note && <p className="text-[13px] mt-2 text-ink-soft italic border-l-2 border-signal-500 pl-3">{l.note}</p>}
                  {l.signature && <img src={l.signature} alt="Signature" className="h-10 mt-2 bg-paper rounded border border-line px-2" />}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 h-fit">
            <p className="font-mono text-[11px] tracking-widest uppercase text-ink-soft mb-4">Progression de mes élèves</p>
            <div className="space-y-3.5">
              {STUDENTS.filter((s) => s.hoursPlan > 0).slice(0, 7).map((s) => {
                const sk = skillsByStudent[s.id] ?? {};
                const done = REMC.flatMap((b) => b.skills).filter((x) => sk[x.id]).length;
                return (
                  <div key={s.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold flex items-center gap-2"><Avatar name={s.name} size="sm" /> {s.name}</span>
                      <span className="tabular text-xs font-bold">{done}/{16}</span>
                    </div>
                    <Bar value={(done / 16) * 100} tone={done >= 12 ? "pine" : done >= 6 ? "signal" : "danger"} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
