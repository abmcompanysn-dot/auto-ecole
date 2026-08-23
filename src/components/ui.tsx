import { useEffect, useRef, useState, type ReactNode } from "react";

/* ——————— Icônes SVG maison ——————— */

export type IconName =
  | "wheel" | "road" | "book" | "calendar" | "car" | "clipboard" | "bell" | "gauge"
  | "euro" | "sms" | "check" | "x" | "chevron" | "pen" | "user" | "users" | "shield"
  | "download" | "search" | "cloud" | "store" | "flag" | "phone" | "clock" | "pin"
  | "alert" | "arrow" | "star" | "fuel" | "wrench" | "spark";

const PATHS: Record<IconName, ReactNode> = {
  wheel: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 15v6M9.2 11 3.3 9.5M14.8 11l5.9-1.5M12 9V3" /></>),
  road: (<><path d="M5.5 21 9 3M18.5 21 15 3" /><path d="M12 4v2.5M12 10v2.5M12 16v2.5" /></>),
  book: (<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" /><path d="M4 5.5v15M20 18v3H6.5" /><path d="M8 8h8M8 11.5h5" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /><path d="M8 14h3" /></>),
  car: (<><path d="M4 16v-4l1.8-5A2 2 0 0 1 7.7 5.5h8.6a2 2 0 0 1 1.9 1.5L20 12v4" /><path d="M3.5 12h17M5 12l.6-4.5M19 12l-.6-4.5" /><circle cx="7.5" cy="16.5" r="1.8" /><circle cx="16.5" cy="16.5" r="1.8" /></>),
  clipboard: (<><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M9 10h6M9 13.5h6M9 17h3.5" /></>),
  bell: (<><path d="M6 16v-5.5a6 6 0 1 1 12 0V16l1.5 2.5H4.5Z" /><path d="M10 21a2.2 2.2 0 0 0 4 0" /></>),
  gauge: (<><path d="M4.5 17.5a8.5 8.5 0 1 1 15 0" /><path d="M12 13.5 16 9" /><circle cx="12" cy="14" r="1.6" /></>),
  euro: (<><path d="M17.5 5.5A7 7 0 1 0 17.5 18.5" /><path d="M4.5 10.5h9M4.5 13.5h8" /></>),
  sms: (<><path d="M4 4h16v12H9l-5 4Z" /><path d="M8 9h8M8 12h5" /></>),
  check: (<path d="m4.5 12.5 5 5 10-11" />),
  x: (<path d="M5 5l14 14M19 5 5 19" />),
  chevron: (<path d="m8 5 8 7-8 7" />),
  pen: (<><path d="m14.5 4.5 5 5L8 21H3v-5Z" /><path d="m12.5 6.5 5 5" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" /></>),
  users: (<><circle cx="9" cy="8.5" r="3.5" /><path d="M2.5 20c1-3.2 3.5-5 6.5-5s5.5 1.8 6.5 5" /><path d="M15.5 5.5a3.5 3.5 0 0 1 0 6.4M17.5 15.4c1.8.8 3.3 2.3 4 4.6" /></>),
  shield: (<><path d="M12 3 5 5.5v6c0 4.5 3 8 7 9.5 4-1.5 7-5 7-9.5v-6Z" /><path d="m8.8 12 2.2 2.2 4.2-4.6" /></>),
  download: (<><path d="M12 3v11M7.5 10 12 14.5 16.5 10" /><path d="M4 17v4h16v-4" /></>),
  search: (<><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>),
  cloud: (<><path d="M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 11a3.8 3.8 0 0 1-.8 7.5Z" /></>),
  store: (<><path d="M4 9 5.5 4h13L20 9M4 9v11h16V9M4 9h16" /><path d="M9 20v-6h6v6" /></>),
  flag: (<><path d="M5 21V4" /><path d="M5 4c4-2.5 7 2.5 14 0v9c-7 2.5-10-2.5-14 0" /></>),
  phone: (<><path d="M8 3H5.5A1.5 1.5 0 0 0 4 4.5C4 13 11 20 19.5 20a1.5 1.5 0 0 0 1.5-1.5V16l-4.5-1.5L14.5 17c-3-1-5.5-3.5-6.5-6.5l2.5-2Z" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 6.5V12l4 2.5" /></>),
  pin: (<><path d="M12 21s-7-6.4-7-11a7 7 0 0 1 14 0c0 4.6-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>),
  alert: (<><path d="M12 3 1.8 20.5h20.4Z" /><path d="M12 9.5V14M12 17.2v.3" /></>),
  arrow: (<><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></>),
  star: (<path d="m12 3 2.7 5.8 6.3.8-4.6 4.3 1.2 6.1L12 17l-5.6 3 1.2-6.1L3 9.6l6.3-.8Z" />),
  fuel: (<><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3.5 21h13" /><path d="M15 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9l-3-3M6.5 6.5h5v4h-5Z" /></>),
  wrench: (<path d="M14.5 6.5a4 4 0 0 1 5-1.5l-3 3 .5 3 3 .5 3-3a4 4 0 0 1-6.5 4.5L8 21.5a2 2 0 0 1-3-3l8.5-8.5a4 4 0 0 1 1-3.5Z" transform="scale(0.85) translate(1.5 1.5)" />),
  spark: (<><path d="M12 2.5 14 9l6.5 2-6.5 2L12 21.5 10 13 3.5 11 10 9Z" /></>),
};

export function Icon({ name, className = "w-5 h-5", strokeWidth = 1.7 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

/* ——————— Badges & cartes ——————— */

export type Tone = "pine" | "signal" | "danger" | "info" | "neutral";

const TONE_BADGE: Record<Tone, string> = {
  pine: "bg-pine-100 text-pine-800 border-pine-200",
  signal: "bg-signal-100 text-signal-700 border-signal-300",
  danger: "bg-danger-50 text-danger-700 border-danger-500/30",
  info: "bg-info-50 text-info-600 border-info-500/30",
  neutral: "bg-ink/5 text-ink-soft border-line",
};

export function Badge({ tone = "neutral", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide uppercase ${TONE_BADGE[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`bg-card border border-line rounded-xl shadow-[0_1px_2px_rgba(22,33,27,0.04)] ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(8,58,40,0.35)] hover:border-pine-300" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHead({ kicker, title, desc, right }: { kicker: string; title: string; desc?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <p className="font-mono text-[11px] font-semibold tracking-[0.22em] uppercase text-pine-600 mb-2 flex items-center gap-2">
          <span className="w-6 h-[3px] bg-signal-500 inline-block" />
          {kicker}
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl leading-[0.95] tracking-tight uppercase">{title}</h2>
        {desc && <p className="text-ink-soft text-sm mt-2 max-w-xl">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

/* ——————— Jauges & barres ——————— */

export function ProgressRing({ value, size = 120, stroke = 10, tone = "pine", label }: { value: number; size?: number; stroke?: number; tone?: Tone; label?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(value), 120);
    return () => clearTimeout(t);
  }, [value]);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = tone === "signal" ? "var(--color-signal-500)" : tone === "danger" ? "var(--color-danger-500)" : tone === "info" ? "var(--color-info-500)" : "var(--color-pine-600)";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (Math.min(100, Math.max(0, v)) / 100) * c} className="ring-anim" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-2xl tabular leading-none">{Math.round(value)}%</span>
        {label && <span className="text-[10px] uppercase tracking-widest text-ink-soft mt-1">{label}</span>}
      </div>
    </div>
  );
}

export function Bar({ value, tone = "pine", className = "" }: { value: number; tone?: Tone; className?: string }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 100);
    return () => clearTimeout(t);
  }, [value]);
  const color = tone === "signal" ? "bg-signal-500" : tone === "danger" ? "bg-danger-500" : tone === "info" ? "bg-info-500" : "bg-pine-600";
  return (
    <div className={`h-2 rounded-full bg-ink/8 overflow-hidden ${className}`}>
      <div className={`h-full rounded-full bar-anim ${color}`} style={{ width: `${Math.min(100, Math.max(0, w))}%` }} />
    </div>
  );
}

export function useCountUp(target: number, duration = 1200): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setN(target); return; }
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

/* ——————— Révélation au scroll ——————— */

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ——————— Modale ——————— */

export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-pine-950/60 backdrop-blur-[2px] cursor-default" onClick={onClose} aria-label="Fermer" />
      <div className="pop-in relative bg-card border border-line rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="hazard h-1.5" />
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 className="font-display font-bold text-2xl uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 text-ink-soft transition-colors" aria-label="Fermer">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
        {footer && <div className="px-6 py-4 bg-paper border-t border-line flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

/* ——————— Interrupteur ——————— */

export function Toggle({ on, onChange, disabled = false }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${on ? "bg-pine-600" : "bg-ink/20"} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-all duration-300 ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

/* ——————— Signature canvas ——————— */

export function SignPad({ onSign }: { onSign: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.width = r.width * 2;
    c.height = r.height * 2;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.scale(2, 2);
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#16211b";
    }
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e: React.PointerEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setDirty(true);
  };
  const clear = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    setDirty(false);
  };

  return (
    <div>
      <div className="relative rounded-lg border-2 border-dashed border-pine-300 bg-pine-50/50 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-32 touch-none cursor-crosshair"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => (drawing.current = false)}
          onPointerLeave={() => (drawing.current = false)}
        />
        {!dirty && (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-ink-soft/70 pointer-events-none">
            ✍ Signez ici avec la souris ou le doigt
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={clear} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-line hover:border-danger-500 hover:text-danger-600 transition-colors">
          Effacer
        </button>
        <button
          onClick={() => dirty && onSign(canvasRef.current!.toDataURL())}
          disabled={!dirty}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${dirty ? "bg-pine-700 text-pine-50 hover:bg-pine-800" : "bg-ink/10 text-ink-soft/60 cursor-not-allowed"}`}
        >
          Valider la signature
        </button>
      </div>
    </div>
  );
}

/* ——————— Avatar initiales ——————— */

const AV_COLORS = ["bg-pine-700", "bg-info-600", "bg-signal-600", "bg-danger-600", "bg-pine-500", "bg-ink"];

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const color = AV_COLORS[(name.charCodeAt(0) + name.length) % AV_COLORS.length];
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-display font-bold text-pine-50 ${color} ${size === "sm" ? "w-7 h-7 text-[11px]" : "w-9 h-9 text-sm"} ring-2 ring-card`}>
      {initials}
    </span>
  );
}
