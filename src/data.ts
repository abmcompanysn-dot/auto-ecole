/* ————————————————— Types & données métier PILOTE ————————————————— */

export type SkillBlock = { id: string; title: string; skills: { id: string; label: string }[] };

export const REMC: SkillBlock[] = [
  {
    id: "m",
    title: "Maîtrise du véhicule",
    skills: [
      { id: "m1", label: "S'installer et régler commandes & rétroviseurs" },
      { id: "m2", label: "Démarrer et s'arrêter en toute sécurité" },
      { id: "m3", label: "Manier le volant et tenir la trajectoire" },
      { id: "m4", label: "Utiliser la boîte de vitesses avec souplesse" },
    ],
  },
  {
    id: "a",
    title: "Appréhender la route",
    skills: [
      { id: "a1", label: "Observer et prendre l'information loin devant" },
      { id: "a2", label: "Adapter son allure aux situations" },
      { id: "a3", label: "Respecter distances et marges de sécurité" },
      { id: "a4", label: "Franchir les intersections et céder le passage" },
    ],
  },
  {
    id: "p",
    title: "Partager la route",
    skills: [
      { id: "p1", label: "Communiquer avec les autres usagers" },
      { id: "p2", label: "Partager la chaussée (piétons, cycles, bus)" },
      { id: "p3", label: "Anticiper les comportements des autres" },
      { id: "p4", label: "Adopter une conduite citoyenne et éco-responsable" },
    ],
  },
  {
    id: "c",
    title: "Autonomie & situations complexes",
    skills: [
      { id: "c1", label: "Conduire seul, sans assistance du moniteur" },
      { id: "c2", label: "Conduire de nuit et par intempéries" },
      { id: "c3", label: "Réussir manœuvres et stationnements" },
      { id: "c4", label: "Réagir à une panne ou un incident" },
    ],
  },
];

export type Question = {
  id: number;
  theme: string;
  text: string;
  options: string[];
  answer: number;
  explain: string;
};

export const QUESTIONS: Question[] = [
  { id: 1, theme: "Signalisation", text: "Un panneau triangulaire à fond blanc bordé de rouge signale…", options: ["Une interdiction", "Un danger", "Une obligation", "Une indication"], answer: 1, explain: "La forme triangulaire pointe vers le haut = danger. Le rond = prescription (interdiction ou obligation)." },
  { id: 2, theme: "Priorités", text: "En l'absence de signalisation à une intersection, la priorité revient…", options: ["Au véhicule le plus rapide", "Au véhicule venant de droite", "Au véhicule venant de gauche", "Au véhicule le plus lourd"], answer: 1, explain: "C'est la priorité à droite, règle générale du Code de la route (art. R415-5)." },
  { id: 3, theme: "Alcool & vigilance", text: "Pour un conducteur en permis probatoire, le taux d'alcoolémie maximal est…", options: ["0,5 g/l de sang", "0,2 g/l de sang", "0,8 g/l de sang", "Aucune limite"], answer: 1, explain: "0,2 g/l pour les permis probatoires : en pratique, zéro verre, car le seuil est atteint dès le premier." },
  { id: 4, theme: "Vitesse", text: "Vitesse maximale autorisée sur autoroute pour un jeune conducteur :", options: ["130 km/h", "120 km/h", "110 km/h", "100 km/h"], answer: 2, explain: "110 km/h sur autoroute, 100 sur voies rapides à 110, et 80 sur routes à double sens pendant le permis probatoire." },
  { id: 5, theme: "Signalisation", text: "Un feu jaune fixe signifie :", options: ["Accélérez pour passer", "Arrêtez-vous si vous le pouvez", "Préparez-vous à démarrer", "Priorité à droite"], answer: 1, explain: "Le jaune fixe impose l'arrêt, sauf si l'arrêt brutal créerait un danger. Le jaune clignotant autorise le passage avec prudence." },
  { id: 6, theme: "Distances", text: "À 90 km/h, la distance de sécurité minimale avec le véhicule qui précède est d'environ…", options: ["25 mètres", "50 mètres", "75 mètres", "100 mètres"], answer: 1, explain: "Règle des 2 secondes : à 90 km/h ≈ 50 m (90 km/h ≈ 25 m/s × 2 s)." },
  { id: 7, theme: "Manœuvres", text: "Avant de dépasser un véhicule, vous devez notamment…", options: ["Klaxonner pour prévenir", "Vérifier l'angle mort et la voie de gauche", "Passer au plus près", "Allumer les feux de détresse"], answer: 1, explain: "Vérifications : angle mort, rétroviseurs, voie libre, et qu'aucun véhicule derrière n'a déjà engagé le dépassement." },
  { id: 8, theme: "Sécurité passive", text: "L'airbag est pleinement efficace…", options: ["Seul, sans ceinture", "Uniquement à l'avant", "En complément de la ceinture de sécurité", "Seulement en ville"], answer: 2, explain: "Sans ceinture, le corps est projeté trop tôt vers l'airbag : risque de blessure grave. Ceinture + airbag = duo indissociable." },
  { id: 9, theme: "Éco-conduite", text: "Pour réduire sa consommation de carburant, il faut…", options: ["Rester au point mort en descente", "Passer le rapport supérieur dès que possible", "Rouler vitres ouvertes sur autoroute", "Laisser le moteur chauffer 10 minutes"], answer: 1, explain: "Rouler à bas régime sur le rapport supérieur économise jusqu'à 20 % de carburant. Le point mort en descente est interdit et dangereux." },
  { id: 10, theme: "Piétons", text: "Un piéton s'engage sur un passage protégé sans feu. Vous devez…", options: ["Klaxonner pour le presser", "Le laisser passer", "Passer en premier si vous êtes engagé", "Faire un appel de phares"], answer: 1, explain: "Le piéton engagé ou manifestant l'intention de traverser est toujours prioritaire. Refus de priorité : 135 € et 6 points." },
  { id: 11, theme: "Stationnement", text: "Le stationnement très gênant (trottoir, passage piéton, piste cyclable) est sanctionné de…", options: ["17 €", "35 €", "135 €", "1 500 €"], answer: 2, explain: "Depuis 2015, le stationnement très gênant est une contravention de 4e classe : 135 € et mise en fourrière possible." },
  { id: 12, theme: "Autoroute", text: "Sur autoroute, par circulation fluide, on circule…", options: ["Sur la voie centrale", "Sur la voie la plus à droite", "Sur la bande d'arrêt d'urgence", "Sur n'importe quelle voie"], answer: 1, explain: "La voie de droite est la voie normale de circulation. Les autres voies servent uniquement au dépassement." },
  { id: 13, theme: "Météo", text: "Sous forte pluie, la distance de freinage sur route…", options: ["Reste identique", "Peut doubler", "Est réduite de moitié", "Dépend uniquement des pneus"], answer: 1, explain: "Route mouillée : distance de freinage multipliée par 2 en moyenne, et risque d'aquaplanage au-delà de 80 km/h." },
  { id: 14, theme: "Téléphone", text: "Téléphone tenu en main au volant, c'est…", options: ["Aucune sanction si à l'arrêt au feu", "135 € et retrait de 3 points", "35 € sans retrait de points", "90 € et 1 point"], answer: 1, explain: "135 € et 3 points, même à l'arrêt au feu rouge. Le kit mains libres est toléré mais déconseillé : il divise l'attention." },
  { id: 15, theme: "Ceinture", text: "La ceinture de sécurité est obligatoire…", options: ["Uniquement à l'avant", "À toutes les places équipées", "Uniquement hors agglomération", "Sauf pour les trajets courts"], answer: 1, explain: "Obligatoire à toutes les places qui en sont équipées, à l'arrêt moteur coupé non, mais dès que le véhicule circule." },
  { id: 16, theme: "Intersections", text: "Face à un panneau « Cédez le passage », vous devez…", options: ["Toujours marquer l'arrêt complet", "Céder sans nécessairement s'arrêter", "Klaxonner en arrivant", "Passer en priorité"], answer: 1, explain: "Contrairement au STOP, le cédez-le-passage n'impose l'arrêt que si un véhicule arrive. Sans trafic, on ralentit et on passe." },
];

export type Neph = "Validé" | "En attente" | "À compléter";
export type PayState = "À jour" | "Partiel" | "Retard";

export type Student = {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  formation: "Code + 20h" | "Conduite accompagnée" | "Permis B" | "Code seul";
  neph: Neph;
  codePct: number;
  hoursDone: number;
  hoursPlan: number;
  pay: PayState;
  readiness: number;
  registered: string;
};

export const STUDENTS: Student[] = [
  { id: "s1", name: "Awa Ndiaye", age: 18, phone: "+221 77 512 34 08", email: "awa.ndiaye@mail.com", formation: "Conduite accompagnée", neph: "Validé", codePct: 82, hoursDone: 14, hoursPlan: 20, pay: "À jour", readiness: 76, registered: "12 janv. 2026" },
  { id: "s2", name: "Moussa Diop", age: 21, phone: "+221 78 220 15 44", email: "m.diop@mail.com", formation: "Code + 20h", neph: "Validé", codePct: 91, hoursDone: 20, hoursPlan: 20, pay: "À jour", readiness: 88, registered: "03 nov. 2025" },
  { id: "s3", name: "Fatou Sarr", age: 19, phone: "+221 76 883 02 17", email: "fatou.sarr@mail.com", formation: "Code + 20h", neph: "En attente", codePct: 64, hoursDone: 8, hoursPlan: 20, pay: "Partiel", readiness: 52, registered: "28 janv. 2026" },
  { id: "s4", name: "Karim Benali", age: 24, phone: "+33 6 51 22 98 40", email: "k.benali@mail.com", formation: "Permis B", neph: "Validé", codePct: 100, hoursDone: 26, hoursPlan: 30, pay: "À jour", readiness: 81, registered: "19 sept. 2025" },
  { id: "s5", name: "Aïssatou Fall", age: 17, phone: "+221 77 906 31 25", email: "a.fall@mail.com", formation: "Conduite accompagnée", neph: "À compléter", codePct: 38, hoursDone: 2, hoursPlan: 20, pay: "Retard", readiness: 24, registered: "15 févr. 2026" },
  { id: "s6", name: "Jean-Marc Kouassi", age: 28, phone: "+225 07 44 81 09", email: "jm.kouassi@mail.com", formation: "Permis B", neph: "Validé", codePct: 100, hoursDone: 30, hoursPlan: 30, pay: "À jour", readiness: 93, registered: "22 juil. 2025" },
  { id: "s7", name: "Aminata Touré", age: 20, phone: "+221 70 118 77 02", email: "aminata.t@mail.com", formation: "Code seul", neph: "En attente", codePct: 55, hoursDone: 0, hoursPlan: 0, pay: "À jour", readiness: 0, registered: "02 févr. 2026" },
  { id: "s8", name: "Yassine El Amrani", age: 22, phone: "+212 6 61 20 44 71", email: "y.elamrani@mail.com", formation: "Code + 20h", neph: "Validé", codePct: 77, hoursDone: 12, hoursPlan: 20, pay: "Partiel", readiness: 61, registered: "09 déc. 2025" },
  { id: "s9", name: "Sophie Lambert", age: 31, phone: "+33 7 82 40 19 66", email: "s.lambert@mail.com", formation: "Permis B", neph: "Validé", codePct: 100, hoursDone: 18, hoursPlan: 24, pay: "À jour", readiness: 70, registered: "05 oct. 2025" },
  { id: "s10", name: "Ousmane Bâ", age: 19, phone: "+221 78 660 23 91", email: "ousmane.ba@mail.com", formation: "Code + 20h", neph: "En attente", codePct: 47, hoursDone: 5, hoursPlan: 20, pay: "Retard", readiness: 33, registered: "21 déc. 2025" },
];

export const DEMO_STUDENT_ID = "s1";

/* ——————— Fiches de suivi signées ——————— */

export type LessonEntry = {
  id: string;
  studentId: string;
  studentName: string;
  instructor: string;
  date: string;
  hours: number;
  topic: string;
  note?: string;
  signature?: string;
};

export const INITIAL_LOG: LessonEntry[] = [
  { id: "l1", studentId: "s1", studentName: "Awa Ndiaye", instructor: "Karim Haddad", date: "Sam. 28 févr. · 10h", hours: 2, topic: "Intersections & priorités", note: "Bonne lecture des cédez-le-passage. Travailler le freinage dégressif." },
  { id: "l2", studentId: "s1", studentName: "Awa Ndiaye", instructor: "Nadia Ferhat", date: "Mer. 25 févr. · 14h", hours: 1, topic: "Créneaux en agglomération", note: "Repères acquis, garder les yeux loin devant pendant la manœuvre." },
];

/* ——————— Planning ——————— */

export type SlotStatus = "free" | "other" | "mine";
export type Slot = {
  id: string;
  dayOffset: number;
  hour: number;
  status: SlotStatus;
  student?: string;
  instructor?: string;
  vehicle?: string;
  point?: string;
  duration?: number;
};

export const MEETING_POINTS = ["Agence — Rue de la Gare", "Gare centrale", "Lycée Blaise Diagne", "Parking Stade"];
export const INSTRUCTOR_NAMES = ["Karim Haddad", "Nadia Ferhat", "Jean-Luc Morel", "Salimata Diallo"];
export const VEHICLE_NAMES = ["Clio 5 · AB-482-CD", "Peugeot 208 · EF-119-GH", "Citroën C3 · IJ-733-KL", "Dacia Sandero · MN-205-OP"];
export const HOURS = [8, 9, 10, 11, 12, 14, 15, 16, 17];

const OTHER_STUDENTS = ["Moussa Diop", "Fatou Sarr", "Karim Benali", "Sophie Lambert", "Yassine El Amrani", "Ousmane Bâ", "Aïssatou Fall", "Jean-Marc Kouassi"];

export function makeSlots(): Slot[] {
  const slots: Slot[] = [];
  const today = new Date();
  for (let d = 1; d <= 6; d++) {
    const day = new Date(today);
    day.setDate(today.getDate() + d);
    if (day.getDay() === 0) continue; // dimanche fermé
    HOURS.forEach((h, hi) => {
      const seed = (d * 31 + h * 7 + hi * 3) % 10;
      let slot: Slot = { id: `d${d}h${h}`, dayOffset: d, hour: h, status: "free" };
      if (seed < 4) {
        slot = {
          ...slot,
          status: "other",
          student: OTHER_STUDENTS[(d + hi) % OTHER_STUDENTS.length],
          instructor: INSTRUCTOR_NAMES[(d + hi) % INSTRUCTOR_NAMES.length],
          vehicle: VEHICLE_NAMES[(d + h) % VEHICLE_NAMES.length],
          point: MEETING_POINTS[(d * h) % MEETING_POINTS.length],
        };
      }
      slots.push(slot);
    });
  }
  // Créneaux déjà réservés par Awa (élève de démonstration)
  const mine: [string, string, number][] = [
    ["d1h14", "Karim Haddad", 0], // demain → annulation payante (< 48 h)
    ["d3h10", "Nadia Ferhat", 1],
    ["d2h16", "Karim Haddad", 2],
  ];
  mine.forEach(([id, instructor, pi]) => {
    const s = slots.find((x) => x.id === id);
    if (s) {
      s.status = "mine";
      s.student = "Awa Ndiaye";
      s.instructor = instructor;
      s.vehicle = VEHICLE_NAMES[(pi + 1) % VEHICLE_NAMES.length];
      s.point = MEETING_POINTS[pi];
      s.duration = pi === 1 ? 2 : 1;
    }
  });
  return slots;
}

export function slotDateTime(s: Slot): Date {
  const d = new Date();
  d.setDate(d.getDate() + s.dayOffset);
  d.setHours(s.hour, 0, 0, 0);
  return d;
}

export function hoursUntil(s: Slot): number {
  return (slotDateTime(s).getTime() - Date.now()) / 3_600_000;
}

export function fmtDay(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

export function fmtEuro(n: number): string {
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
}

/* ——————— Flotte ——————— */

export type Vehicle = {
  id: string;
  model: string;
  plate: string;
  fuel: number;
  km: number;
  serviceIn: number;
  ct: string;
  ctOk: boolean;
  instructor: string;
  online: boolean;
};

export const VEHICLES: Vehicle[] = [
  { id: "v1", model: "Renault Clio 5", plate: "AB-482-CD", fuel: 62, km: 48210, serviceIn: 1790, ct: "12/2026", ctOk: true, instructor: "Karim Haddad", online: true },
  { id: "v2", model: "Peugeot 208", plate: "EF-119-GH", fuel: 34, km: 61080, serviceIn: 920, ct: "09/2026", ctOk: true, instructor: "Nadia Ferhat", online: true },
  { id: "v3", model: "Citroën C3", plate: "IJ-733-KL", fuel: 78, km: 22450, serviceIn: 4300, ct: "03/2027", ctOk: true, instructor: "Salimata Diallo", online: true },
  { id: "v4", model: "Dacia Sandero", plate: "MN-205-OP", fuel: 12, km: 85330, serviceIn: -210, ct: "28/02/2026", ctOk: false, instructor: "—", online: false },
  { id: "v5", model: "Toyota Yaris", plate: "QR-967-ST", fuel: 55, km: 37910, serviceIn: 2650, ct: "06/2026", ctOk: true, instructor: "Jean-Luc Morel", online: true },
];

/* ——————— Moniteurs ——————— */

export type Instructor = { id: string; name: string; hoursWeek: number; extra: number; studentsCount: number; rating: number; vehicle: string };

export const INSTRUCTORS: Instructor[] = [
  { id: "i1", name: "Karim Haddad", hoursWeek: 28, extra: 3, studentsCount: 9, rating: 4.9, vehicle: "Clio 5 · AB-482-CD" },
  { id: "i2", name: "Nadia Ferhat", hoursWeek: 24, extra: 0, studentsCount: 7, rating: 4.8, vehicle: "Peugeot 208 · EF-119-GH" },
  { id: "i3", name: "Jean-Luc Morel", hoursWeek: 26, extra: 1, studentsCount: 8, rating: 4.6, vehicle: "Yaris · QR-967-ST" },
  { id: "i4", name: "Salimata Diallo", hoursWeek: 21, extra: 0, studentsCount: 6, rating: 4.9, vehicle: "C3 · IJ-733-KL" },
];

/* ——————— Facturation (Awa) ——————— */

export type Payment = { id: string; label: string; amount: number; due: string; status: "Payée" | "À venir" | "En retard"; method: string };

export const PAYMENTS: Payment[] = [
  { id: "f1", label: "Échéance 1/4 — Inscription", amount: 323, due: "05 janv. 2026", status: "Payée", method: "Wave" },
  { id: "f2", label: "Échéance 2/4", amount: 323, due: "05 févr. 2026", status: "Payée", method: "Carte •• 4821" },
  { id: "f3", label: "Échéance 3/4", amount: 322, due: "05 mars 2026", status: "À venir", method: "Orange Money" },
  { id: "f4", label: "Échéance 4/4", amount: 322, due: "05 avr. 2026", status: "À venir", method: "—" },
];

/* ——————— Historique séries Code ——————— */

export const SERIES_HISTORY: { label: string; score: number; total: number; kind: "thème" | "chrono" }[] = [
  { label: "Série 14 — Priorités", score: 6, total: 10, kind: "thème" },
  { label: "Série 15 — Chrono", score: 7, total: 10, kind: "chrono" },
  { label: "Série 16 — Chrono", score: 7, total: 10, kind: "chrono" },
  { label: "Série 17 — Examen blanc", score: 8, total: 10, kind: "chrono" },
];

/* ——————— Convocations examen pratique ——————— */

export type Session = { id: string; date: string; center: string; capacity: number; assigned: string[] };

export const SESSIONS: Session[] = [
  { id: "e1", date: "Mardi 24 mars 2026 — 08h30", center: "Centre d'examen · Plateau", capacity: 4, assigned: ["s6"] },
  { id: "e2", date: "Mardi 07 avril 2026 — 09h00", center: "Centre d'examen · Almadies", capacity: 3, assigned: [] },
];

/* ——————— Rappels automatiques ——————— */

export type Reminder = { id: string; channel: "SMS" | "Email"; label: string; audience: string; when: string; active: boolean };

export const REMINDERS: Reminder[] = [
  { id: "r1", channel: "SMS", label: "Rappel cours de conduite J-1", audience: "32 élèves concernés", when: "Chaque jour · 18h00", active: true },
  { id: "r2", channel: "SMS", label: "Rappel cours de Code J-1 (classe virtuelle)", audience: "18 élèves concernés", when: "Chaque jour · 18h00", active: true },
  { id: "r3", channel: "Email", label: "Relance échéance impayée", audience: "4 élèves concernés", when: "À la date d'échéance + 3 j", active: true },
  { id: "r4", channel: "Email", label: "Pièce d'identité expirant sous 30 jours", audience: "2 élèves concernés", when: "Hebdomadaire · lundi 09h00", active: false },
  { id: "r5", channel: "SMS", label: "Convocation examen + plan d'accès", audience: "Par session préfecture", when: "J-7 avant l'épreuve", active: true },
];

/* ——————— Abonnements SaaS ——————— */

export type Subscription = {
  id: string;
  school: string;
  city: string;
  plan: "Starter" | "Pro" | "Réseau";
  seats: number;
  seatsUsed: number;
  mrr: number;
  status: "Active" | "Essai" | "Suspendue";
  since: string;
};

export const SUBSCRIPTIONS: Subscription[] = [
  { id: "a1", school: "Auto-École Riviera", city: "Abidjan", plan: "Pro", seats: 8, seatsUsed: 6, mrr: 99, status: "Active", since: "Mars 2025" },
  { id: "a2", school: "Conduite Plus", city: "Dakar", plan: "Starter", seats: 3, seatsUsed: 2, mrr: 49, status: "Active", since: "Juin 2025" },
  { id: "a3", school: "Volant d'Or", city: "Casablanca", plan: "Réseau", seats: 25, seatsUsed: 21, mrr: 249, status: "Active", since: "Janv. 2025" },
  { id: "a4", school: "École Moderne", city: "Lomé", plan: "Pro", seats: 6, seatsUsed: 1, mrr: 99, status: "Essai", since: "Févr. 2026" },
  { id: "a5", school: "Route Sûre", city: "Bamako", plan: "Starter", seats: 3, seatsUsed: 3, mrr: 49, status: "Suspendue", since: "Août 2025" },
  { id: "a6", school: "Campus Conduite", city: "Tunis", plan: "Pro", seats: 10, seatsUsed: 7, mrr: 99, status: "Active", since: "Nov. 2025" },
];

export const MRR_HISTORY = [312, 361, 361, 410, 459, 510, 544, 594];
export const MRR_MONTHS = ["Août", "Sept.", "Oct.", "Nov.", "Déc.", "Janv.", "Févr.", "Mars"];

/* ——————— Divers vitrine ——————— */

export const LIVE_STATS = [
  { value: "12 480", label: "élèves gérés sur la plateforme" },
  { value: "81 %", label: "de réussite au Code (moy. clients)" },
  { value: "−38 %", label: "d'absences grâce aux rappels SMS" },
  { value: "4 min", label: "pour une inscription complète" },
];
