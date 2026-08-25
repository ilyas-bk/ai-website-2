import { useState, useEffect, useRef } from "react";

// ── Real photos (reused from your verified asset set) ───────────────────────
import imgHero        from "@/assets/703432a5fcb56e67a41d0f46e4538e3a43968100.png";
import imgPortrait1   from "@/assets/2af44579108020ea641e506123286f8a8c1cc76b.png";
import imgPortrait2   from "@/assets/bbc436bbc08a30d121dc0fe5e00b51da913ec261.png";
import imgPortrait3   from "@/assets/d3a6871fd80422d83b461eb75939e32e3421b9e1.png";
import imgPortrait7   from "@/assets/d84741470c25cf5aa7c49667a999fb596b7b5089.png";
import imgPortrait12  from "@/assets/72507aa8629ee5118196e6f119230e10653da8e9.png";
import imgPortrait13  from "@/assets/faad31936791cffc3b8052d98baeaa24fe385519.png";
import imgPortrait14  from "@/assets/752501fbb40b692a09c75bf1a78802aa47cacffd.png";
import imgPortrait15  from "@/assets/7c3ed2b81d5062fc087512990742e71603eecd82.png";

// ═════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — same system as the rest of your site
// ═════════════════════════════════════════════════════════════════════════
const C = {
  bg: "#F1EEEC",
  text: "#3d3b5b",
  purple: "#888FCD",
  lavender: "#E4E0F0",
  lav2: "#EAE7F5",
  lavCard: "#EDEBF7",
  lavStrong: "#C9C6E8",
  white: "#FFFFFF",
  border: "#D4D0E4",
  borderWarm: "#D8D4C8",
  textSub: "#6B6890",
} as const;

const NAV_LINKS = ["What We Do", "Our Work", "Contact"];

// ═════════════════════════════════════════════════════════════════════════
// PRIMITIVES (shared design system)
// ═════════════════════════════════════════════════════════════════════════
function PillButton({
  href, children, variant = "dark", className = "", onClick,
}: { href?: string; children: React.ReactNode; variant?: "dark" | "purple" | "light" | "outline"; className?: string; onClick?: () => void }) {
  const styles = {
    dark: { backgroundColor: C.text, color: C.white, border: "none" },
    purple: { backgroundColor: C.purple, color: C.white, border: "none" },
    light: { backgroundColor: C.bg, color: C.text, border: "none" },
    outline: { backgroundColor: "transparent", color: C.text, border: `1.5px solid ${C.text}` },
  }[variant];
  const cls = `inline-block rounded-full px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.1em] no-underline transition-opacity hover:opacity-85 ${className}`;
  if (href) return <a href={href} className={cls} style={styles}>{children}</a>;
  return <button onClick={onClick} className={cls} style={styles}>{children}</button>;
}

function ArrowDown({ color = C.purple, className = "" }: { color?: string; className?: string }) {
  return (
    <div className={`flex justify-center mb-1 ${className}`}>
      <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
        <line x1="7" y1="0" x2="7" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <polyline points="2,14 7,20 12,14" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: C.textSub }}>{children}</p>;
}

function Card({ children, className = "", accent = false, tint = false }: { children: React.ReactNode; className?: string; accent?: boolean; tint?: boolean }) {
  return (
    <div className={`rounded-[20px] p-6 md:p-7 ${className}`} style={{ backgroundColor: tint ? C.lavCard : C.white, border: `1px solid ${accent ? C.purple : C.border}` }}>
      {children}
    </div>
  );
}

function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 z-[200] flex items-center justify-center p-6 cursor-zoom-out" style={{ backgroundColor: "rgba(20,18,32,0.86)" }}>
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close" className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full text-white text-lg" style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)" }}>✕</button>
      <img src={src} alt="" onClick={(e) => e.stopPropagation()} className="rounded-[20px] object-contain" style={{ maxWidth: "min(90vw, 720px)", maxHeight: "85vh", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }} />
    </div>
  );
}

function TiltCard({
  children, className = "", onClick, extraTransform = "",
}: { children: React.ReactNode; className?: string; onClick?: () => void; extraTransform?: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -14, y: px * 14, active: true });
  }
  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, active: false })}
      onClick={onClick}
      className={className}
      style={{
        transform: `${extraTransform} perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.active ? 1.04 : 1})`,
        transition: tilt.active ? "transform 0.08s ease-out, box-shadow 0.08s ease-out" : "transform 0.45s ease, box-shadow 0.45s ease",
        transformStyle: "preserve-3d",
        boxShadow: tilt.active ? `${-tilt.y * 1.4}px ${-tilt.x * 1.4 + 14}px 28px rgba(61,59,91,0.28)` : "0 0px 0px rgba(0,0,0,0)",
      }}
    >
      {children}
    </div>
  );
}

function FormSelect({
  defaultLabel, options, className = "",
}: { defaultLabel: string; options: string[]; className?: string }) {
  return (
    <div className="relative">
      <select
        defaultValue=""
        className={`w-full rounded-xl px-4 py-3 pr-10 text-[13px] outline-none ${className}`}
        style={{
          border: `1px solid ${C.border}`,
          backgroundColor: C.bg,
          color: C.textSub,
          // Reset native control styling on every browser engine. Without
          // this, Safari (WebKit) ignores the custom border/background and
          // falls back to its own pill-shaped system control, which is why
          // it looked inconsistent with the rest of the form while Chrome
          // rendered the custom styles fine.
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
        }}
      >
        <option value="" disabled>{defaultLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {/* Custom chevron — appearance:none removes the native arrow on every browser, so we draw our own. */}
      <svg
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        width="12" height="8" viewBox="0 0 12 8" fill="none"
      >
        <path d="M1 1.5L6 6.5L11 1.5" stroke={C.textSub} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ZoomImg({ src, alt = "", className = "", onClick }: { src: string; alt?: string; className?: string; onClick: (src: string) => void }) {
  return (
    <div className={`overflow-hidden cursor-zoom-in ${className}`} style={{ backgroundColor: C.lavender }} onClick={() => onClick(src)}>
      <img src={src} alt={alt} className="h-full w-full object-cover block" />
    </div>
  );
}

function ExpandingGallery({ images, onImageClick, scrollY }: { images: string[]; onImageClick: (src: string) => void; scrollY: number }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex gap-2 px-6 h-[210px] sm:h-[320px]">
      {images.map((src, i) => {
        const isActive = active === i;
        const drift = (i % 2 === 0 ? 1 : -1) * Math.min(scrollY * 0.06, 34);
        return (
          <div key={i} onClick={() => (isActive ? onImageClick(src) : setActive(i))} className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ease-out" style={{ flexGrow: isActive ? 6 : 1, flexBasis: 0, minWidth: isActive ? 110 : 36, backgroundColor: C.lavender }}>
            <img src={src} alt="" className="absolute left-0 w-full object-cover block transition-transform duration-300" style={{ height: "122%", top: "-11%", transform: `translateY(${drift}px) scale(${isActive ? 1 : 1.15})` }} />
            {!isActive && <div className="absolute inset-0" style={{ background: "rgba(30,25,50,0.18)" }} />}
            {isActive && (
              <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm" style={{ backgroundColor: "rgba(255,255,255,0.85)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="2" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><line x1="15.3" y1="15.3" x2="21" y2="21" /></svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExpandCard({
  title, teaser, children, align = "center", tint = false,
}: { title: string; teaser: string; children: React.ReactNode; align?: "center" | "left"; tint?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer rounded-[20px] p-6 md:p-7 transition-shadow" style={{ backgroundColor: tint ? C.lavCard : C.white, border: `1px solid ${open ? C.purple : C.border}`, boxShadow: open ? "0 12px 30px rgba(61,59,91,0.12)" : "none", textAlign: align }}>
      <div className={`flex items-center gap-2.5 mb-2.5 ${align === "center" ? "justify-center" : "justify-between"}`}>
        <p className="text-[13px] font-extrabold uppercase tracking-[0.05em]" style={{ color: C.text }}>{title}</p>
        <span className="inline-block flex-shrink-0 text-lg leading-none transition-transform" style={{ color: C.purple, transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </div>
      {teaser && <p className="text-[15px] leading-relaxed" style={{ color: C.textSub, marginBottom: open ? 14 : 0 }}>{teaser}</p>}
      {open && <div onClick={(e) => e.stopPropagation()} style={{ marginTop: teaser ? 0 : 14 }}>{children}</div>}
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transform: visible ? "none" : "perspective(1200px) rotateX(14deg) translateY(70px) scale(0.96)", opacity: visible ? 1 : 0, transition: "transform 1s cubic-bezier(0.22,0.68,0,1.02), opacity 1s ease", transformOrigin: "top center", willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/**
 * Ambient floating gradient blobs — the "aura" background treatment common
 * in current SaaS/product landing pages. Purely decorative, pointer-events
 * disabled, sits behind content via z-index.
 */
/**
 * Forces a guaranteed-smooth blend at a section's top or bottom edge,
 * regardless of what gradient/blob math is happening underneath.
 *
 * Percentage-sized radial gradients (and blurred blobs clipped by
 * overflow-hidden) only fade smoothly if their math happens to resolve to
 * the page background before the section's actual edge — which breaks on
 * tall or variable-height sections. This overlay sidesteps that entirely:
 * a fixed-height strip of the exact page background, fading to transparent,
 * so the seam between sections is always invisible.
 */
function EdgeFade({ position, height = 110 }: { position: "top" | "bottom"; height?: number }) {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-[1]"
      style={{
        [position]: 0,
        height,
        background: position === "top"
          ? `linear-gradient(to bottom, ${C.bg} 0%, transparent 100%)`
          : `linear-gradient(to top, ${C.bg} 0%, transparent 100%)`,
      }}
    />
  );
}

function BlobField({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute rounded-full"
        style={{
          width: 560, height: 560, top: "-12%", left: "-8%",
          background: `radial-gradient(circle, ${C.purple}55 0%, transparent 70%)`,
          filter: "blur(60px)",
          animation: "blob-float-a 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 480, height: 480, top: "10%", right: "-10%",
          background: `radial-gradient(circle, ${C.lavStrong}88 0%, transparent 70%)`,
          filter: "blur(70px)",
          animation: "blob-float-b 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 420, height: 420, bottom: "-15%", left: "30%",
          background: `radial-gradient(circle, ${C.lav2} 0%, transparent 70%)`,
          filter: "blur(60px)",
          animation: "blob-float-c 30s ease-in-out infinite",
        }}
      />
      <div className="grain-overlay absolute inset-0" style={{ opacity: 0.4 }} />
    </div>
  );
}

/** Radial glow that follows the cursor within its container — subtle, modern interactivity. */
function Spotlight({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50, active: false });

  useEffect(() => {
    const el = containerRef.current;
    const parent = el?.parentElement;
    if (!parent) return;

    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100, active: true });
    };
    const handleLeave = () => setPos((p) => ({ ...p, active: false }));

    parent.addEventListener("mousemove", handleMove);
    parent.addEventListener("mouseleave", handleLeave);
    return () => {
      parent.removeEventListener("mousemove", handleMove);
      parent.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${className}`}
      style={{
        opacity: pos.active ? 1 : 0,
        background: `radial-gradient(480px circle at ${pos.x}% ${pos.y}%, ${C.purple}22 0%, transparent 65%)`,
      }}
    />
  );
}

/** Small qualitative trust badge — deliberately non-numeric so we never present unverifiable stats as fact. */
function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full px-5 py-2.5" style={{ backgroundColor: "rgba(255,255,255,0.6)", border: `1px solid ${C.border}`, backdropFilter: "blur(6px)" }}>
      <span className="text-[16px]">{icon}</span>
      <span className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: C.text }}>{label}</span>
    </div>
  );
}

/** One step in a process timeline, with an icon badge instead of a plain number. */
function ProcessStep({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex-1 text-left">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-[22px]"
        style={{ backgroundColor: C.white, border: `1.5px solid ${C.purple}55`, boxShadow: `0 6px 16px ${C.purple}22` }}
      >
        {icon}
      </div>
      <h4 className="mb-1.5 text-[16px] font-extrabold">{title}</h4>
      <p className="text-[13px] leading-relaxed" style={{ color: C.textSub }}>{desc}</p>
    </div>
  );
}

/** Descriptive hero visual: shows the actual pipeline (brand → AI → content) instead of a stock photo. */
function PipelineVisual() {
  const outputs = [
    { icon: "📸", label: "Product Shots" },
    { icon: "📱", label: "Social Posts" },
    { icon: "🎬", label: "Video & Reels" },
  ];
  return (
    <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.55)", border: `1px solid ${C.border}`, backdropFilter: "blur(14px)" }}>
      <BlobField className="opacity-70" />
      <div className="relative flex flex-col items-center gap-6">
        {/* Input */}
        <div className="rounded-2xl px-6 py-4 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, minWidth: 180 }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: C.textSub }}>Your Brand</p>
          <p className="text-[13px] font-semibold">Goal, product, story</p>
        </div>

        <div className="text-[22px]" style={{ color: C.purple, animation: "blob-float-b 6s ease-in-out infinite" }}>↓</div>

        {/* AI engine */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full text-[30px]"
          style={{ backgroundColor: C.purple, boxShadow: `0 0 0 10px ${C.lavStrong}55`, animation: "blob-float-a 8s ease-in-out infinite" }}
        >
          🤖
        </div>
        <p className="-mt-4 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: C.purple }}>AI Content Engine</p>

        <div className="text-[22px]" style={{ color: C.purple, animation: "blob-float-c 6s ease-in-out infinite" }}>↓</div>

        {/* Outputs */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {outputs.map((o) => (
            <div key={o.label} className="rounded-2xl px-3 py-4 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
              <p className="mb-1 text-[20px]">{o.icon}</p>
              <p className="text-[10px] font-semibold leading-tight">{o.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


const BRAND = "Content Collective AI";
const INSTAGRAM_HANDLE = "@contentcollective.ai";
const INSTAGRAM_URL = "https://www.instagram.com/contentcollective.ai";
// TODO: replace with the live URL once the course site (ai-pay-bills) is deployed.
const COURSE_URL = "#";

const WORK_ROW = [imgHero, imgPortrait1, imgPortrait2, imgPortrait3, imgPortrait7, imgPortrait12, imgPortrait13, imgPortrait14, imgPortrait15];
const WORK_TAGS = ["AI Avatars", "Product Photography", "Social Content", "Consistent Realism"];



const BRAND_DELIVERABLES = [
  { icon: "📸", title: "AI Product Photography", desc: "Studio-quality product shots — no camera, no studio, no shoot day." },
  { icon: "📱", title: "Social Media Content Packs", desc: "Ready-to-post images and reels sized and styled for every platform." },
  { icon: "🎬", title: "Video Ads & Reels", desc: "Scroll-stopping short-form video built from AI-generated footage and avatars." },
  { icon: "🚀", title: "Full Brand Campaigns", desc: "A complete, consistent visual system across every channel you post to." },
];

const PROCESS_STEPS = [
  { icon: "📝", title: "Brief", desc: "You tell us your brand, your goals, and the content you need." },
  { icon: "🎨", title: "Concept", desc: "We design the avatar, visual direction, and Character DNA." },
  { icon: "⚙️", title: "Production", desc: "We generate and refine every image, video, and campaign asset." },
  { icon: "✅", title: "Delivery", desc: "You get ready-to-post content, with revisions included." },
];

const COURSE_PREVIEW = [
  {
    icon: "🧬", title: "Avatar Foundation",
    desc: "Build a character that stays consistent across every image.",
    bullets: ["Define your avatar goal", "Create your Character DNA", "Generate realistic base images"],
  },
  {
    icon: "🖼️", title: "Image Generation",
    desc: "Turn your avatar into a full creative system.",
    bullets: ["Generate scenes & environments", "Product and campaign shots", "Consistent, natural realism"],
  },
  {
    icon: "🎥", title: "Video & Content",
    desc: "Animate everything into publishable posts and campaigns.",
    bullets: ["Animate images into video", "Add voice and movement", "Assemble into social posts"],
  },
];

const TESTIMONIALS = [
  { name: "Sofia M.", role: "UGC Creator", text: "I had zero experience with AI and now I have a full avatar with a consistent look across dozens of images." },
  { name: "Lumé Cosmetics", role: "Client", text: "We replaced our monthly photoshoots with AI campaign visuals. The quality is genuinely impressive." },
  { name: "Marco R.", role: "Freelancer", text: "The workflow they taught me is the reason I can offer AI content as a service now." },
];

const FAQ_ITEMS = [
  { q: "How fast can you deliver content?", a: "Most content packs are delivered within 5–10 business days, depending on scope. We'll give you a clear timeline in your quote." },
  { q: "Do you work with any industry?", a: "Yes — we've built AI content systems for beauty, fashion, hospitality, and personal brands. If you sell a product or a service, we can help." },
  { q: "Is the course beginner-friendly?", a: "Completely. It's built for people with zero AI experience as well as creators who want to add AI to an existing workflow." },
  { q: "Can I hire you AND take the course?", a: "Absolutely — some clients start by hiring us, then take the course later to bring production in-house." },
];

// ═════════════════════════════════════════════════════════════════════════
// APP
// ═════════════════════════════════════════════════════════════════════════
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const scrollY = useScrollY();

  return (
    <div className="font-['Inter',sans-serif] overflow-x-hidden" style={{ color: C.text, backgroundColor: C.bg }}>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />

      {/* ═══ NAV + HERO share one continuous animated backdrop ═══ */}
      <div className="relative" style={{ background: `radial-gradient(140% 90% at 0% 0%, ${C.lavStrong} 0%, ${C.lavender} 28%, ${C.lav2} 50%, ${C.bg} 75%)` }}>
      <BlobField />
      <nav className="relative z-10 sticky top-0 px-4 py-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3">
          <div className="flex flex-1 items-center justify-between gap-4 rounded-full px-6 sm:px-8 h-16" style={{ border: `1px solid ${C.purple}55`, background: "rgba(255,255,255,0.45)", backdropFilter: "blur(14px)" }}>
            <span className="text-[14px] font-extrabold uppercase tracking-[0.14em] whitespace-nowrap">{BRAND}</span>
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} className="text-[13px] font-semibold uppercase tracking-[0.08em] no-underline opacity-75 transition-opacity hover:opacity-100 whitespace-nowrap" style={{ color: C.text }}>{l}</a>
              ))}
            </div>
          </div>
          <PillButton href="#contact" variant="purple" className="hidden md:inline-block !px-8 !py-4 !text-[13px] flex-shrink-0">Get in Touch</PillButton>
          <button className="md:hidden p-1 flex-shrink-0" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg width="26" height="26" stroke={C.text} strokeWidth="1.8" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
          </button>
        </div>
        {menuOpen && (
          <div className="mt-3 flex flex-col gap-4 rounded-2xl px-6 py-5" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold uppercase tracking-[0.1em] no-underline" style={{ color: C.text }}>{l}</a>
            ))}
            <PillButton href="#contact" variant="purple" className="text-center">Get in Touch</PillButton>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 pb-16">
        <div className="mx-auto max-w-[1320px] px-6 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: descriptive copy */}
            <div>
              <SectionLabel>{BRAND}</SectionLabel>
              <h1 className="mb-5 text-[36px] sm:text-[46px] md:text-[54px] font-extrabold leading-[1.08] tracking-[-0.01em]">
                AI content for brands.<br />AI skills for creators.
              </h1>
              <p className="mb-8 max-w-[480px] text-[16px] leading-relaxed" style={{ color: C.textSub }}>
                We build ready-to-post AI content for businesses, and we teach creators the exact system to make it
                themselves — same workflow, two ways to use it.
              </p>
              <div className="flex flex-wrap gap-3">
                <PillButton href="#what-we-do" variant="purple" className="!text-[13px]">See What We Offer</PillButton>
                <PillButton href="#contact" variant="outline" className="!text-[13px]">Get a Quote</PillButton>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <TrustBadge icon="🤖" label="AI-Native Production" />
                <TrustBadge icon="⚡" label="Fast Turnaround" />
                <TrustBadge icon="🎓" label="Built by Practitioners" />
              </div>
            </div>

            {/* Right: descriptive pipeline visual — no photography, just what we do */}
            <PipelineVisual />
          </div>
        </div>
      </section>
      <EdgeFade position="bottom" height={140} />
      </div>

      {/* ═══ WHAT WE DO — the two paths ═══ */}
      <section id="what-we-do" className="relative px-6 py-16 overflow-hidden">
        <BlobField className="opacity-30" />
        <EdgeFade position="top" />
        <EdgeFade position="bottom" />
        <Reveal>
        <div className="mx-auto max-w-[1150px] text-center">
          <SectionLabel>What we do</SectionLabel>
          <h2 className="mb-14 text-[30px] md:text-[36px] font-extrabold leading-[1.25] tracking-[-0.01em]">
            Two ways to work with us.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <TiltCard className="rounded-[24px] overflow-hidden" >
              <div className="relative p-8 md:p-10 overflow-hidden" style={{ backgroundColor: C.lavCard, border: `1px solid ${C.border}` }}>
                <Spotlight />
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: C.lavStrong }}>🎨</div>
                <h3 className="relative mb-3 text-[22px] font-extrabold">AI Content for Your Brand</h3>
                <p className="relative mb-7 text-[15px] leading-relaxed" style={{ color: C.textSub }}>
                  Ready-to-post AI content for your business — product photography, social content, campaigns, and
                  video. Tell us your goal and we handle the rest.
                </p>
                <PillButton href="#services" variant="purple" className="relative">See Our Services</PillButton>
              </div>
            </TiltCard>

            <TiltCard className="rounded-[24px] overflow-hidden" >
              <div className="relative p-8 md:p-10 overflow-hidden" style={{ backgroundColor: C.lavCard, border: `1px solid ${C.border}` }}>
                <Spotlight />
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: C.lavStrong }}>🚀</div>
                <h3 className="relative mb-3 text-[22px] font-extrabold">Learn to Create with AI</h3>
                <p className="relative mb-7 text-[15px] leading-relaxed" style={{ color: C.textSub }}>
                  Our online course teaches you the exact workflow to build AI avatars, generate content, and turn it
                  into real posts and campaigns — step by step.
                </p>
                <PillButton href="#course" variant="purple" className="relative">See What's Inside</PillButton>
              </div>
            </TiltCard>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ SERVICES — what "AI Content for Your Brand" actually includes ═══ */}
      <section id="services" className="relative px-6 py-16 overflow-hidden" style={{ background: `radial-gradient(85% 65% at 50% 45%, ${C.lavender} 0%, ${C.lav2} 45%, ${C.bg} 85%)` }}>
        <BlobField className="opacity-60" />
        <EdgeFade position="top" />
        <EdgeFade position="bottom" height={140} />
        <Reveal>
        <div className="relative mx-auto max-w-[1150px] text-center">
          <SectionLabel>For brands</SectionLabel>
          <h2 className="mb-4 text-[28px] md:text-[32px] font-extrabold tracking-[-0.01em]">What's included</h2>
          <p className="mx-auto mb-12 max-w-[600px] text-[15px] leading-loose" style={{ color: C.textSub }}>
            Every project starts with your goal, not a template. Here's what we build.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {BRAND_DELIVERABLES.map((d) => (
              <div key={d.title} className="rounded-2xl p-7" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl" style={{ backgroundColor: C.lav2 }}>{d.icon}</div>
                <h4 className="mb-1.5 text-[16px] font-extrabold">{d.title}</h4>
                <p className="text-[13px] leading-relaxed" style={{ color: C.textSub }}>{d.desc}</p>
              </div>
            ))}
          </div>

          {/* Process timeline */}
          <div className="relative mt-16 overflow-hidden rounded-3xl p-8 md:p-10" style={{ backgroundColor: "rgba(255,255,255,0.55)", border: `1px solid ${C.border}`, backdropFilter: "blur(10px)" }}>
            <BlobField className="opacity-40" />
            <p className="relative mb-8 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: C.textSub }}>How we work</p>
            <div className="relative flex flex-col sm:flex-row gap-8 sm:gap-4 sm:items-start">
              {PROCESS_STEPS.map((s, i) => (
                <div key={s.title} className="flex flex-1 items-start gap-4">
                  <ProcessStep icon={s.icon} title={s.title} desc={s.desc} />
                  {i < PROCESS_STEPS.length - 1 && (
                    <span className="hidden sm:block mt-6 flex-shrink-0 text-[20px]" style={{ color: C.purple }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <PillButton href="#contact" variant="purple" className="mt-10">Get a Quote</PillButton>
        </div>
        </Reveal>
      </section>

      {/* ═══ COURSE PREVIEW ═══ */}
      <section id="course" className="relative px-6 py-16">
        <Reveal>
        <div className="mx-auto max-w-[1150px] text-center">
          <SectionLabel>For creators</SectionLabel>
          <h2 className="mb-4 text-[28px] md:text-[32px] font-extrabold tracking-[-0.01em]">What's inside the course</h2>
          <p className="mx-auto mb-12 max-w-[600px] text-[15px] leading-loose" style={{ color: C.textSub }}>
            A complete, three-part system — from your first AI avatar to a full content pipeline.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {COURSE_PREVIEW.map((m) => (
              <ExpandCard key={m.title} title={`${m.icon}  ${m.title}`} teaser={m.desc} align="left" tint>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: C.textSub }}>Inside this module:</p>
                <div className="flex flex-col gap-1.5">
                  {m.bullets.map((b) => (
                    <p key={b} className="text-[13px] leading-relaxed">• {b}</p>
                  ))}
                </div>
              </ExpandCard>
            ))}
          </div>

          <PillButton href={COURSE_URL} variant="purple" className="mt-10">View the Full Course</PillButton>
        </div>
        </Reveal>
      </section>

      {/* ═══ OUR WORK — grid gallery, description below ═══ */}
      <section id="our-work" className="relative overflow-hidden" style={{ background: `radial-gradient(85% 65% at 50% 45%, ${C.lavender} 0%, ${C.lav2} 45%, ${C.bg} 85%)` }}>
        <BlobField className="opacity-30" />
        <EdgeFade position="top" />
        <EdgeFade position="bottom" />
        <Reveal>
        <div className="relative mx-auto max-w-[1150px] px-6 py-16">
          <div className="mb-9 text-center">
            <h2 className="mb-2.5 text-[26px] md:text-[30px] font-extrabold tracking-[-0.01em]">Our Work</h2>
            <p className="text-[13px] leading-relaxed" style={{ color: C.textSub }}>
              Every image here was created with AI — the same system we use for clients and teach in the course.
            </p>
          </div>

          {/* Grid gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {WORK_ROW.map((src, i) => (
              <ZoomImg
                key={src + i}
                src={src}
                onClick={setLightbox}
                className="h-[180px] sm:h-[220px] rounded-2xl transition-transform duration-300 hover:scale-[1.03]"
              />
            ))}
          </div>

          {/* Description panel below the grid */}
          <div className="mt-8 rounded-3xl p-8 md:p-10 text-left" style={{ backgroundColor: "rgba(255,255,255,0.6)", border: `1px solid ${C.border}`, backdropFilter: "blur(10px)" }}>
            <h3 className="mb-3 text-[20px] md:text-[22px] font-extrabold">Content that feels native to social media</h3>
            <p className="mb-6 max-w-[720px] text-[14px] leading-relaxed" style={{ color: C.textSub }}>
              Natural skin, believable lighting, varied scenes, and consistent characters across every shot. The
              focus isn't one lucky image — it's a repeatable system for getting this level of realism every time,
              for every brand or avatar we build.
            </p>
            <div className="flex flex-wrap gap-2">
              {WORK_TAGS.map((tag) => (
                <span key={tag} className="rounded-full px-4 py-1.5 text-[11px] font-semibold" style={{ backgroundColor: C.lav2, color: C.text }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="relative px-6 py-16 overflow-hidden">
        <BlobField className="opacity-25" />
        <EdgeFade position="top" />
        <EdgeFade position="bottom" />
        <Reveal>
        <div className="mx-auto max-w-[1150px] text-center">
          <h2 className="mb-12 text-[26px] md:text-[30px] font-extrabold tracking-[-0.01em]">What people say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <p className="mb-4 text-[14px] leading-relaxed opacity-85">"{t.text}"</p>
                <p className="text-[12px] font-semibold" style={{ color: C.purple }}>{t.name} <span style={{ color: C.textSub, fontWeight: 500 }}>— {t.role}</span></p>
              </Card>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="px-6 pb-16" style={{ background: `radial-gradient(90% 70% at 30% 40%, ${C.lavender} 0%, ${C.lav2} 42%, ${C.bg} 82%)` }}>
        <Reveal>
        <div className="mx-auto max-w-[800px]">
          <h2 className="mb-9 text-center text-[26px] md:text-[30px] font-extrabold tracking-[-0.01em]">Frequently Asked</h2>
          <div className="flex flex-col gap-2.5">
            {FAQ_ITEMS.map((item) => (
              <ExpandCard key={item.q} title={item.q} teaser="" align="left">
                <p className="text-[14px] leading-relaxed opacity-80">{item.a}</p>
              </ExpandCard>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="relative px-6 py-16 overflow-hidden">
        <BlobField className="opacity-25" />
        <EdgeFade position="top" />
        <EdgeFade position="bottom" />
        <Reveal>
        <div className="mx-auto max-w-[700px]">
          <h2 className="mb-2 text-center text-[28px] md:text-[32px] font-extrabold tracking-[-0.01em]">Get in Touch</h2>
          <p className="mb-10 text-center text-[14px]" style={{ color: C.textSub }}>
            Tell us about your brand and what you need — we'll reply with next steps.
          </p>

          <Card className="!p-8">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 text-left">
              <input placeholder="Your name" className="rounded-xl px-4 py-3 text-[13px] outline-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
              <input placeholder="Your email" type="email" className="rounded-xl px-4 py-3 text-[13px] outline-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
              <input placeholder="Your WhatsApp (optional)" className="rounded-xl px-4 py-3 text-[13px] outline-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
              <FormSelect
                defaultLabel="What are you interested in?"
                options={["AI product photography", "Social media content", "Video / campaigns", "Something else"]}
              />
              <textarea placeholder="Tell us a bit about your brand and goal" rows={4} className="rounded-xl px-4 py-3 text-[13px] outline-none resize-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
              <PillButton variant="purple" className="mt-2">Send Message</PillButton>
            </form>
          </Card>
        </div>
        </Reveal>
      </section>

      {/* ═══ INSTAGRAM ═══ */}
      <section className="px-6 pb-16">
        <Reveal>
        <div className="mx-auto max-w-[700px] rounded-3xl px-8 py-9 text-center md:px-12" style={{ backgroundColor: C.lavStrong, border: `1px solid ${C.purple}55` }}>
          <p className="mb-5 text-[15px] font-semibold leading-relaxed">See more of our work on Instagram.</p>
          <PillButton href={INSTAGRAM_URL} variant="dark">{INSTAGRAM_HANDLE}</PillButton>
        </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 py-6" style={{ backgroundColor: C.lavender }}>
        <div className="mx-auto flex max-w-[1100px] flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em]">{BRAND}</span>
          <div className="flex flex-wrap justify-center gap-6">
            <a href={INSTAGRAM_URL} className="text-[11px] font-medium uppercase tracking-[0.1em] no-underline" style={{ color: C.textSub }}>Instagram</a>
            <a href="#" className="text-[11px] font-medium uppercase tracking-[0.1em] no-underline" style={{ color: C.textSub }}>Privacy Policy</a>
            <a href="#" className="text-[11px] font-medium uppercase tracking-[0.1em] no-underline" style={{ color: C.textSub }}>Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
