/**
 * Section1Hero.tsx
 *
 * "use client" is required here because the mobile navigation toggle
 * uses React's useState hook. Without this directive, Next.js would
 * try to render the useState call on the server, which isn't allowed.
 *
 * Rule of thumb: add "use client" to the lowest component that needs
 * interactivity, not to the whole page — this keeps the rest of the
 * page server-rendered for performance.
 */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Play, Menu } from "lucide-react";
import phoneImg from "@/app/assets/phone.png";

// ---------------------------------------------------------------------------
// MosqueLogo
// ---------------------------------------------------------------------------
function MosqueLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 50"
      width="60"
      height="38"
      fill="white"
      aria-label="Everyday Muslim logo"
    >
      <ellipse cx="40" cy="28" rx="14" ry="12" />
      <polygon points="40,8 34,26 46,26" />
      <rect x="10" y="18" width="6" height="20" />
      <ellipse cx="13" cy="18" rx="3" ry="5" />
      <rect x="64" y="18" width="6" height="20" />
      <ellipse cx="67" cy="18" rx="3" ry="5" />
      <rect x="5" y="38" width="70" height="4" rx="2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Navbar
//
// Responsive strategy:
//   Mobile  (< lg): Logo on left, hamburger (Menu) icon on right.
//                   Tapping the icon opens a dropdown with all nav links.
//                   The hamburger turns into an X to close the menu.
//   Desktop (≥ lg): Logo | centred links | X icon — matching the mockup.
//
// Why useState here and not in the parent?
//   The toggle state is 100% local to the Navbar. Lifting it up to
//   Section1Hero would force the whole section to re-render on every
//   tap — keeping state as low as possible is a React best practice.
// ---------------------------------------------------------------------------
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");

  const links = [
    { label: "Home", id: "home" },
    { label: "Features", id: "features" },
    { label: "Our Users", id: "our-users" },
    { label: "Why i Big Iqra", id: "why" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Frequently Asked Questions", id: "faq" },
    { label: "About Us", id: "about" },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Smoothly move the target section to the top of the viewport.
    // Note: Tailwind layout doesn't add an offset header, so block: "start"
    // is correct here.
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    // This effect runs only in the browser (client component).
    // We intentionally use simple loops (instead of fancy array chains)
    // to keep the logic easy to follow.
    const sectionsToObserve: HTMLElement[] = [];
    for (const link of links) {
      const el = document.getElementById(link.id);
      if (el) sectionsToObserve.push(el);
    }

    if (sectionsToObserve.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestId: string | null = null;
        let bestRatio = 0;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const el = entry.target as HTMLElement;
          const id = el.id;
          if (!id) continue;

          const ratio = entry.intersectionRatio ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId) {
          setActiveId((prev) => (prev === bestId ? prev : bestId));
        }
      },
      {
        // rootMargin shifts the "active" zone upward so the label changes
        // when a section is near the top third of the viewport.
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.4, 0.6],
      },
    );

    for (const el of sectionsToObserve) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [links]);

  return (
    // relative + z-30 so the dropdown sits on top of hero content
    <nav className="relative z-30">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center px-6 md:px-12 py-5">
        <MosqueLogo />

        {/* Desktop links — hidden below lg breakpoint */}
        <ul className="hidden lg:flex gap-8 text-sm font-medium text-white">
          {links.map(({ label, id }) => {
            const isActive = id === activeId;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(id);
                    scrollToSection(id);
                  }}
                  className={
                    isActive
                      ? "border-b-2 border-white pb-1 cursor-pointer"
                      : "cursor-pointer hover:text-white/70 transition-colors"
                  }
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right-side icon:
            • On mobile  → Menu/X hamburger toggle
            • On desktop → always shows X (per original design) */}
        <button
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="text-white hover:text-white/70 transition-colors"
        >
          {/* lg:hidden makes the animated toggle only visible on mobile.
              On desktop we always render X regardless of mobileMenuOpen state. */}
          <span className="lg:hidden">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </span>
          <span className="hidden lg:block">
            <X size={20} />
          </span>
        </button>
      </div>

      {/* ── Mobile dropdown menu ─────────────────────────────────────── */}
      {/* Conditionally rendered — only mounts when open, so it doesn't
          consume space or cause layout shifts when closed. */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0d3436] border-t border-white/10 shadow-xl z-40">
          <ul className="flex flex-col py-2">
            {links.map(({ label, id }) => {
              const isActive = id === activeId;
              return (
                <li key={label}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(id);
                    setMobileMenuOpen(false);
                    scrollToSection(id);
                  }}
                  className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white bg-white/5"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// DecorativeCircles
// Concentric rings behind the phone. Fixed pixel sizes are fine because
// this element lives inside the right column which is only visible on lg+.
// ---------------------------------------------------------------------------
function DecorativeCircles() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="absolute w-[520px] h-[520px] rounded-full border border-white/10" />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-white/10" />
      <div className="absolute w-[290px] h-[290px] rounded-full border border-white/10" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// PhoneMockup — wireframe phone with realistic app UI content.
// ---------------------------------------------------------------------------
function PhoneMockup() {
  // Subtle vertical float to add life; using a simple translateY keeps it cheap and predictable.
  // (No complex 3D transforms—this avoids motion sickness and layout/perspective artifacts.)
  // phone.png already includes the device frame/shadow, so we remove the wrapper's border/bg/shadow
  // to avoid a "second frame" that makes the image look smaller.
  return (
    <div className="relative w-[260px] h-[520px] md:w-[280px] md:h-[560px] rounded-[40px] border-0 bg-transparent shadow-none overflow-hidden flex flex-col z-10 animate-[floatPhone_6s_ease-in-out_infinite]">
      <Image
        src={phoneImg}
        alt="i Big Iqra app preview"
        fill
        sizes="(max-width: 768px) 280px, 260px"
        // object-cover avoids letterboxing because phone.png is square with the phone centered inside.
        className="object-cover w-full h-full"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// FloatingSidebar
// Hidden on mobile — on narrow screens there isn't enough horizontal
// space and it would overlap the hero content. Shown on lg+ only.
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Section1Hero — public export
// ---------------------------------------------------------------------------
export function Section1Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#0B2527] overflow-hidden"
    >

      {/* White curved bottom-right corner */}

      <Navbar />
      

      {/* ── Hero grid ──────────────────────────────────────────────────
          Mobile  (< lg): single column, text on top, phone below.
                          Text is centered to look balanced at full width.
          Desktop (≥ lg): two equal columns side-by-side.
      ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] items-center px-6 md:px-12 pb-12 gap-8 lg:gap-0">

        {/* ── Left column: copy & CTA ── */}
        <div className="flex flex-col gap-5 z-10 items-center text-center lg:items-start lg:text-left pt-8 lg:pt-0 lg:pl-140">
          {/* Heading scales down on small screens:
              text-4xl  = 36px  on mobile  (fits 320px+ screens)
              text-5xl  = 48px  on md      (tablets)
              text-6xl  = 60px  on lg+     (desktop, matches original) */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            i Big Iqra
          </h1>

          <p className="text-base md:text-lg font-bold text-[#E3B250] leading-snug max-w-md">
            Kelas Mengaji Online
          </p>

          {/* CTA buttons — centered on mobile, left-aligned on desktop */}
          <div className="flex items-center gap-4 mt-2">
            <button className="rounded-full bg-white text-[#0B2527] font-semibold px-7 py-3 text-sm hover:bg-white/90 transition-colors shadow-md">
              Daftar Sekarang
            </button>

            
          </div>
        </div>

        {/* ── Right column: phone mockup + decorations ── */}
        {/* relative is required so the absolute decorative children
            are positioned relative to this column, not the viewport */}
        <div className="relative flex items-center justify-center min-h-[420px] md:min-h-[500px]">

          {/* Concentric rings — decorative, behind the phone */}
          <DecorativeCircles />

          {/* Floating decorative shapes.
              hidden on mobile: their negative offsets reference the gap
              between the two lg columns, which doesn't exist on mobile.
              Showing them on mobile would clip them awkwardly. */}

          {/* Yellow + icon */}
          <span
            className="hidden lg:block absolute left-[-180px] top-[40%] text-[#E3B250] text-3xl font-black select-none z-10"
            aria-hidden="true"
          >
            +
          </span>

          {/* Teal O ring */}
          <div
            className="hidden lg:block absolute left-[-160px] bottom-[8%] w-10 h-10 rounded-full border-2 border-[#00D09C] z-10"
            aria-hidden="true"
          />

          {/* Grey solid circle — partially occluded behind phone */}
          <div
            className="hidden lg:block absolute left-[-20px] top-[36%] w-20 h-20 rounded-full bg-gray-500/50 z-[5]"
            aria-hidden="true"
          />

          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
