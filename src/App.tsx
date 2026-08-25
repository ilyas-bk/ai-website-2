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

const NAV_LINKS = ["What We Offer", "Workflows", "Our Work", "Get Started"];

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

// ── Data ──────────────────────────────────────────────────────────────────
const CREATOR_STEPS = [
  { n: 1, label: "Trend → Script → Video", sub: "Hook + short script + final output" },
  { n: 2, label: "Image → Video", sub: "Wow image → animation → reel" },
  { n: 3, label: "Faceless Reel Factory", sub: "Template + voiceover + caption + posting" },
  { n: 4, label: "Viral Loop", sub: "Hook → payoff → \"save it\" → comment trigger" },
];

const TOOL_TAGS = ["Nano Banana Pro", "Kling AI", "Kling Native Audio", "Sora", "Veo", "Runway", "Pika", "Luma Dream Machine", "CapCut AI", "Prompt Engineering", "Voiceover AI", "AI UGC", "Faceless Content"];

const WORK_CATEGORIES = [
  { img: imgPortrait3, title: "Product Photography", sub: "AI-generated studio quality" },
  { img: imgPortrait13, title: "Social Media", sub: "Scroll-stopping content" },
  { img: imgPortrait14, title: "Brand Visuals", sub: "Consistent aesthetic" },
  { img: imgPortrait15, title: "Video & Motion", sub: "Dynamic storytelling" },
];

// ═════════════════════════════════════════════════════════════════════════
// APP
// ═════════════════════════════════════════════════════════════════════════
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [formTab, setFormTab] = useState<"business" | "creator">("business");
  const scrollY = useScrollY();

  const showcaseRow = [imgPortrait7, imgPortrait12, imgPortrait1, imgPortrait2];

  return (
    <div className="font-['Inter',sans-serif]" style={{ color: C.text, backgroundColor: C.bg }}>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />

      {/* ═══ NAV + HERO share one continuous top-left gradient backdrop ═══ */}
      <div style={{ background: `radial-gradient(140% 90% at 0% 0%, ${C.lavStrong} 0%, ${C.lavender} 28%, ${C.lav2} 50%, ${C.bg} 75%)` }}>
      <nav className="sticky top-0 z-50 px-4 py-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3">
          <div className="flex flex-1 items-center justify-between gap-4 rounded-full px-6 sm:px-8 h-16" style={{ border: `1px solid ${C.purple}55`, background: `linear-gradient(90deg, ${C.lavStrong}99 0%, ${C.lavCard}40 55%, transparent 100%)` }}>
            <span className="text-[14px] font-extrabold uppercase tracking-[0.14em] whitespace-nowrap">AI New Era</span>
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} className="text-[13px] font-semibold uppercase tracking-[0.08em] no-underline opacity-75 transition-opacity hover:opacity-100 whitespace-nowrap" style={{ color: C.text }}>{l}</a>
              ))}
            </div>
          </div>
          <PillButton href="#get-started" variant="purple" className="hidden md:inline-block !px-8 !py-4 !text-[13px] flex-shrink-0">Get Started</PillButton>
          <button className="md:hidden p-1 flex-shrink-0" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg width="26" height="26" stroke={C.text} strokeWidth="1.8" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
          </button>
        </div>
        {menuOpen && (
          <div className="mt-3 flex flex-col gap-4 rounded-2xl px-6 py-5" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold uppercase tracking-[0.1em] no-underline" style={{ color: C.text }}>{l}</a>
            ))}
            <PillButton href="#get-started" variant="purple" className="text-center">Get Started</PillButton>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1320px] px-6 pt-10">
          <TiltCard className="relative overflow-hidden rounded-3xl" extraTransform={`perspective(1200px) rotateX(${Math.min(scrollY * 0.02, 8)}deg) scale(${1 - Math.min(scrollY * 0.00012, 0.05)})`}>
            <div className="relative h-[460px] md:h-[680px] w-full cursor-zoom-in" style={{ backgroundColor: C.lavender }} onClick={() => setLightbox(imgHero)}>
              <img src={imgHero} alt="AI New Era" className="absolute left-0 w-full object-cover block" style={{ height: "150%", top: `-${Math.min(scrollY * 0.4, 220)}px`, transform: `scale(${1 + Math.min(scrollY * 0.0006, 0.18)})`, transition: "transform 0.05s linear" }} />
              <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,25,50,0.68) 0%, rgba(0,0,0,0) 55%)" }} />
              <div className="absolute top-5 right-5 rounded-full px-5 py-2 backdrop-blur-md" style={{ backgroundColor: "rgba(61,59,91,0.55)" }}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white whitespace-nowrap">🚀 Welcome to the New AI Era</span>
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 max-w-[680px] px-7 pb-10 md:px-14 md:pb-14">
                <h1 className="mb-4 text-[36px] sm:text-[46px] md:text-[58px] font-extrabold leading-[1.08] tracking-[-0.01em] text-white">AI New Era</h1>
                <p className="mb-7 text-[16px] md:text-[17px] leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                  A community for people who want to build with AI and turn ideas into outcomes. Brands come here to
                  grow with smarter content and automation. Creators come here to learn the workflow and improve fast.
                </p>
                <PillButton href="#what-we-offer" variant="light" className="!text-[13px] pointer-events-auto">Choose Your Path</PillButton>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>
      </div>

      {/* ═══ WHAT WE OFFER ═══ */}
      <section id="what-we-offer" className="px-6 py-16">
        <Reveal>
        <div className="mx-auto max-w-[1200px] text-center">
          <SectionLabel>What we offer</SectionLabel>
          <h2 className="mb-11 text-[30px] md:text-[36px] font-extrabold leading-[1.25] tracking-[-0.01em]">
            Two paths. Same standard: <span style={{ color: C.purple }}>high-quality output</span> with{" "}
            <span style={{ color: C.purple }}>repeatable AI workflows</span>.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <Card tint className="!p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: C.lavStrong }}>🎨</div>
              <h3 className="mb-2 text-[21px] font-extrabold">For Brands & Businesses</h3>
              <p className="mb-5 text-[15px] leading-relaxed" style={{ color: C.textSub }}>
                Ready-to-post visual content created with AI. Images, videos, and complete marketing campaigns that
                stop the scroll and drive results.
              </p>
              {["AI Product Photography", "Social Media Content Packs", "Video Ads & Reels", "Complete Brand Campaigns"].map((b, i) => (
                <div key={i} className="mb-2.5 flex items-center gap-2.5">
                  <span className="flex-shrink-0 text-[13px] font-bold" style={{ color: C.purple }}>✓</span>
                  <span className="text-[13px]">{b}</span>
                </div>
              ))}
            </Card>

            <Card tint className="!p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: C.lavStrong }}>🚀</div>
              <h3 className="mb-2 text-[21px] font-extrabold">For AI Creators</h3>
              <p className="mb-5 text-[15px] leading-relaxed" style={{ color: C.textSub }}>
                Master the workflows, learn the secrets, build faster. Get the exact prompts, tools, and strategies we
                use in our agency every day.
              </p>
              {["Secret Workflow PDFs", "1-on-1 Training Calls", "Prompt Libraries & Templates", "Agency-Level Techniques"].map((b, i) => (
                <div key={i} className="mb-2.5 flex items-center gap-2.5">
                  <span className="flex-shrink-0 text-[13px] font-bold" style={{ color: C.purple }}>✓</span>
                  <span className="text-[13px]">{b}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ AI EXAMPLES + VIRAL WORKFLOWS ═══ */}
      <section id="workflows" className="px-6 py-16" style={{ background: `radial-gradient(85% 65% at 50% 45%, ${C.lavender} 0%, ${C.lav2} 45%, ${C.bg} 85%)` }}>
        <Reveal>
        <div className="mx-auto max-w-[1150px] text-center">
          <h2 className="mb-3.5 text-[28px] md:text-[34px] font-extrabold leading-[1.3] tracking-[-0.01em]">AI Examples + Viral Workflows</h2>
          <p className="mx-auto mb-11 max-w-[600px] text-[15px] leading-loose" style={{ color: C.textSub }}>
            We don't teach theory. We ship proven step-by-step processes you can replicate in 30–60 minutes and we
            show real examples that brands can use immediately.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { img: imgPortrait2, tag: "For Brands", title: "High-Quality UGC & Product Marketing", desc: "Ads, product visuals, reels, campaigns — ready to post." },
              { img: imgPortrait12, tag: "For Creators", title: "Viral AI Workflows", desc: "From idea → script → reel, with prompts + templates." },
            ].map((item, i) => (
              <div key={i}>
                <TiltCard onClick={() => setLightbox(item.img)} className="relative mb-3 overflow-hidden rounded-2xl cursor-zoom-in">
                  <img src={item.img} alt={item.title} className="h-[220px] sm:h-[280px] w-full object-cover block" />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.08em]" style={{ backgroundColor: "rgba(255,255,255,0.9)", color: C.text }}>{item.tag}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10" style={{ background: "linear-gradient(to top, rgba(30,25,50,0.75) 0%, transparent 100%)" }}>
                    <p className="text-[15px] font-extrabold text-white">{item.title}</p>
                  </div>
                </TiltCard>
                <p className="text-[13px] text-left" style={{ color: C.textSub }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ FOR BUSINESSES ═══ */}
      <section className="px-6 py-16">
        <Reveal>
        <div className="mx-auto max-w-[1020px] text-center">
          <SectionLabel>💼 For Businesses</SectionLabel>
          <h2 className="mb-4 text-[26px] md:text-[28px] font-extrabold tracking-[-0.01em]">We create content that sells</h2>
          <p className="mx-auto mb-10 max-w-[560px] text-[15px] leading-loose" style={{ color: C.textSub }}>
            If you don't know tools or models, no problem. You tell us the goal, we deliver scroll-stopping creatives.
          </p>

          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              { t: "UGC Ads Workflow", d: "Brief → scene list → b-roll → CTA" },
              { t: "Product Visuals", d: "Studio look, lifestyle, premium packs" },
              { t: "Before/After AI", d: "Product / room / outfit / logo" },
              { t: "Short Reels", d: "Optimized for attention + retention" },
            ].map((b, i) => (
              <div key={i} className="rounded-2xl px-6 py-4" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                <p className="text-[13px]"><strong>{b.t}</strong> — {b.d}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <PillButton href="#get-started" variant="purple">Get a Quote</PillButton>
            <PillButton href="#our-work" variant="outline">Show Me Examples</PillButton>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ FOR CREATORS ═══ */}
      <section className="px-6 py-16" style={{ background: `radial-gradient(80% 60% at 50% 35%, ${C.lav2} 0%, ${C.bg} 80%)` }}>
        <Reveal>
        <div className="mx-auto max-w-[1150px] text-center">
          <SectionLabel>🧠 For Creators</SectionLabel>
          <h2 className="mb-4 text-[26px] md:text-[28px] font-extrabold tracking-[-0.01em]">Learn the exact workflow</h2>
          <p className="mx-auto mb-14 max-w-[600px] text-[15px] leading-loose" style={{ color: C.textSub }}>
            For people who already "get AI": we teach the pipeline, prompts, templates and posting system. Built
            around trending tools like <strong>Nano Banana Pro</strong> and <strong>Kling AI</strong>.
          </p>

          <div className="mb-12 flex flex-wrap items-start justify-center gap-1.5">
            {CREATOR_STEPS.map((step, i, arr) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-[110px] sm:w-[150px] text-center">
                  <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full text-[16px] font-extrabold" style={{ backgroundColor: C.lavStrong, border: `1.5px solid ${C.purple}55`, color: C.purple }}>{step.n}</div>
                  <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.04em] leading-snug">{step.label}</p>
                  <p className="text-[10px] leading-tight" style={{ color: C.textSub }}>{step.sub}</p>
                </div>
                {i < arr.length - 1 && <span className="mb-8 flex-shrink-0 text-lg hidden sm:inline" style={{ color: C.purple }}>→</span>}
              </div>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {TOOL_TAGS.map((tag) => (
              <span key={tag} className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold" style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, color: C.textSub }}>{tag}</span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <PillButton href="#get-started" variant="purple">Apply as Creator</PillButton>
            <PillButton href="#get-started" variant="outline">Send Me the Workflow</PillButton>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ OUR AI WORK ═══ */}
      <section id="our-work" className="px-6 py-16">
        <Reveal>
        <div className="mx-auto max-w-[1150px] text-center">
          <h2 className="mb-4 text-[26px] md:text-[28px] font-extrabold tracking-[-0.01em]">Our AI Work</h2>
          <p className="mx-auto mb-10 max-w-[600px] text-[15px] leading-loose" style={{ color: C.textSub }}>
            Every image crafted with AI. This is what we create for clients and what we teach creators to build. Same
            tools, same workflow, different results.
          </p>
        </div>
        </Reveal>
        <Reveal>
        <ExpandingGallery images={showcaseRow} onImageClick={setLightbox} scrollY={scrollY} />
        </Reveal>
        <Reveal>
        <div className="mx-auto mt-8 grid max-w-[1150px] grid-cols-2 md:grid-cols-4 gap-4 px-6">
          {WORK_CATEGORIES.map((c, i) => (
            <div key={i} className="text-center">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.03em]">{c.title}</p>
              <p className="text-[11px]" style={{ color: C.textSub }}>{c.sub}</p>
            </div>
          ))}
        </div>
        </Reveal>
      </section>

      {/* ═══ WHAT HAPPENS NEXT ═══ */}
      <section className="px-6 py-16" style={{ background: `radial-gradient(95% 70% at 30% 40%, ${C.lavender} 0%, ${C.lav2} 42%, ${C.bg} 82%)` }}>
        <Reveal>
        <div className="mx-auto max-w-[1020px] text-center">
          <h2 className="mb-4 text-[32px] md:text-[38px] font-extrabold tracking-[-0.01em]">✨ What Happens Next</h2>
          <p className="mx-auto mb-2.5 max-w-[600px] text-[15px] leading-relaxed opacity-85">
            Pick your path and send a message. If you're looking for AI work for your business, choose New Client. If
            you want to learn as a creator, choose AI Creator and tell us what you want to build.
          </p>
          <p className="mx-auto mb-10 text-[15px] leading-relaxed opacity-85">We read every message and reply with a clear next step.</p>

          <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: C.textSub }}>Choose Your Path</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div onClick={() => setFormTab("business")} className="cursor-pointer">
              <Card accent={formTab === "business"} tint={formTab === "business"} className="text-center">
                <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-full text-xl" style={{ backgroundColor: C.lavStrong }}>💼</div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: C.textSub }}>For Businesses</p>
                <p className="mb-2 text-[17px] font-extrabold">New Client</p>
                <p className="text-[14px]" style={{ color: C.textSub }}>Get ready-to-use AI content for your brand. Tell us your goal and we'll show you what's possible.</p>
              </Card>
            </div>
            <div onClick={() => setFormTab("creator")} className="cursor-pointer">
              <Card accent={formTab === "creator"} tint={formTab === "creator"} className="text-center">
                <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-full text-xl" style={{ backgroundColor: C.lavStrong }}>🧠</div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: C.textSub }}>For Creators</p>
                <p className="mb-2 text-[17px] font-extrabold">AI Creator</p>
                <p className="text-[14px]" style={{ color: C.textSub }}>Learn our workflows and techniques. Apply and tell us what you want to create next.</p>
              </Card>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ GET STARTED (form) ═══ */}
      <section id="get-started" className="px-6 py-16">
        <Reveal>
        <div className="mx-auto max-w-[820px]">
          <h2 className="mb-2 text-center text-[32px] md:text-[38px] font-extrabold tracking-[-0.01em]">Get Started</h2>
          <p className="mb-8 text-center text-[14px]" style={{ color: C.textSub }}>Fill out the form below and we'll be in touch.</p>

          <div className="mx-auto mb-8 flex w-fit rounded-full p-1" style={{ backgroundColor: C.lav2, border: `1px solid ${C.border}` }}>
            {(["business", "creator"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFormTab(tab)}
                className="rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors"
                style={{ backgroundColor: formTab === tab ? C.purple : "transparent", color: formTab === tab ? C.white : C.text }}
              >
                {tab === "business" ? "💼 New Client" : "🧠 AI Creator"}
              </button>
            ))}
          </div>

          <Card className="!p-8">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 text-left">
              <input placeholder="Your name" className="rounded-xl px-4 py-3 text-[13px] outline-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
              <input placeholder="Your email" type="email" className="rounded-xl px-4 py-3 text-[13px] outline-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
              {formTab === "business" ? (
                <>
                  <input placeholder="Your WhatsApp" className="rounded-xl px-4 py-3 text-[13px] outline-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
                  <FormSelect
                    defaultLabel="What are you interested in?"
                    options={["AI content", "Automation", "AI video", "Strategy", "Other"]}
                  />
                </>
              ) : (
                <>
                  <input placeholder="Your social account" className="rounded-xl px-4 py-3 text-[13px] outline-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
                  <input placeholder="Portfolio link (optional)" className="rounded-xl px-4 py-3 text-[13px] outline-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
                  <FormSelect
                    defaultLabel="What do you want to learn?"
                    options={["AI video workflow", "Prompts and consistency", "Editing and publishing", "Automation", "Other"]}
                  />
                </>
              )}
              <input placeholder="Subject" className="rounded-xl px-4 py-3 text-[13px] outline-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
              <textarea placeholder={formTab === "business" ? "Your message" : "Tell us about yourself"} rows={4} className="rounded-xl px-4 py-3 text-[13px] outline-none resize-none" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }} />
              <PillButton variant="purple" className="mt-2">Send Message</PillButton>
            </form>
          </Card>
        </div>
        </Reveal>
      </section>

      {/* ═══ DISCORD + TRUST ═══ */}
      <section className="px-6 pb-16">
        <Reveal>
        <div className="mx-auto max-w-[840px] rounded-3xl px-8 py-10 text-center md:px-12" style={{ backgroundColor: C.lavStrong, border: `1px solid ${C.purple}55` }}>
          <p className="mb-6 text-[15px] font-semibold leading-relaxed">Join our Creator Community on Discord and get free educational material.</p>
          <PillButton href="https://discord.gg/Mry7ebX3" variant="dark" className="mb-4">Enter Discord</PillButton>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em]" style={{ color: C.text, opacity: 0.7 }}>Free access • Templates • Prompts • Resources • Support</p>
        </div>

        <div className="mx-auto mt-8 flex max-w-[840px] flex-wrap justify-center gap-3">
          {["🔒 Privacy First", "⚡ Fast Reply", "🤝 Human Support"].map((t) => (
            <span key={t} className="rounded-full px-5 py-2 text-[11px] font-semibold" style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, color: C.textSub }}>{t}</span>
          ))}
        </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 py-6" style={{ backgroundColor: C.lavender }}>
        <div className="mx-auto flex max-w-[1100px] flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Built by AI New Era</span>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-[11px] font-medium uppercase tracking-[0.1em] no-underline" style={{ color: C.textSub }}>Privacy Policy</a>
            <a href="#" className="text-[11px] font-medium uppercase tracking-[0.1em] no-underline" style={{ color: C.textSub }}>Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
