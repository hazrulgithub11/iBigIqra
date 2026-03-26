/**
 * Section2Features.tsx
 *
 * "use client" is required because:
 *   1. useState tracks the centred card index (drives indicator dots).
 *   2. useRef gives direct DOM access to the scroll container.
 *   3. useEffect attaches scroll, pointer, and touch listeners.
 *
 * Architecture: CSS Scroll Snap for native momentum + touch swipe, combined
 * with a scroll-event tracker for indicator dots, and a recursive-setTimeout
 * autoplay that pauses on user interaction and resumes after inactivity.
 */
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { BookOpen, Clock, BarChart2, Video, Users, Star, Gamepad2, Palette, Monitor } from "lucide-react";

// How long between automatic slide advances (ms).
const AUTOPLAY_DELAY = 3500;

// How long after the last user interaction before autoplay resumes (ms).
const RESUME_DELAY = 5000;

// ---------------------------------------------------------------------------
// Feature data — no decorator fields needed after removal
// ---------------------------------------------------------------------------
const FEATURES = [
  {
    id: 1,
    Icon: BookOpen,
    iconBg: "#0B2527",
    iconColor: "white",
    title: "Panduan Digital Interaktif",
    description: "Buku bercetak yang dilengkapi dengan imbasan kod QR untuk memberikan akses mudah kepada panduan digital secara terus.",
  },
  {
    id: 2,
    Icon: Gamepad2,
    iconBg: "#E3B250",
    iconColor: "white",
    title: "Konten Gamifikasi",
    description: "Elemen pembelajaran berasaskan permainan interaktif seperti Wordwall untuk menarik minat dan mengekalkan fokus kanak-kanak.",
  },
  {
    id: 3,
    Icon: Palette,
    iconBg: "#0B2527",
    iconColor: "white",
    title: "Teknik Warna & Nombor",
    description: "Pengenalan kod warna merah dan hijau pada huruf serta baris bernombor untuk menyokong kaedah Baca Ikut Guru (BIG).",
  },
  {
    id: 4,
    Icon: Monitor,
    iconBg: "#E3B250",
    iconColor: "white",
    title: "Integrasi Kelas Maya",
    description: "Penggunaan platform Google Classroom sebagai perantara global antara guru dan murid dengan penerimaan data secara langsung.",
  },
  {
    id: 5,
    Icon: Video,
    iconBg: "#0B2527",
    iconColor: "white",
    title: "Video Panduan PdPc",
    description: "Akses mudah kepada video Pengajaran dan Pemudahcaraan (PdPc) yang membolehkan ibu bapa tanpa asas Al-Quran membimbing anak di rumah.",
  },
  {
    id: 6,
    Icon: BookOpen,
    iconBg: "#E3B250",
    iconColor: "white",
    title: "Rekaan Mesra Kanak-Kanak",
    description: "Penggunaan fon tulisan yang jelas dan reka bentuk visual dalaman serta muka depan baharu yang segar untuk mata kanak-kanak.",
  },
];

// ---------------------------------------------------------------------------
// FeatureCard
// ---------------------------------------------------------------------------
type Feature = (typeof FEATURES)[number];

function FeatureCard({ feature }: { feature: Feature }) {
  const { Icon, iconBg, iconColor, title, description } = feature;

  return (
    // snap-start: the card's LEFT edge snaps to the container's snap port.
    //   This is correct for a multi-card view — after snapping you see N full
    //   cards starting cleanly from the left, rather than one centred card.
    // flex-shrink-0: prevents flex from collapsing cards below their declared width.
    // w-[85vw] / sm:w-[44vw] / lg:w-[30vw]:
    //   Mobile  → ~1 full card + a sliver of the next (85% viewport)
    //   Tablet  → ~2 cards visible (44% each + gap ≈ 92%)
    //   Desktop → ~3 cards visible (30% each + 2 gaps ≈ 94%)
    <div className="snap-start flex-shrink-0 w-[85vw] sm:w-[44vw] lg:w-[30vw] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 flex flex-col items-center text-center">

      {/* ── Icon circle ── */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={28} color={iconColor} strokeWidth={1.8} />
      </div>

      {/* ── Title ── */}
      <h3 className="mt-6 text-xl font-bold text-black">{title}</h3>

      {/* ── Description ── */}
      <p className="mt-4 text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section2Features — public export
// ---------------------------------------------------------------------------
export function Section2Features() {
  // Which card index is currently snapped / centred.
  const [activeIndex, setActiveIndex] = useState(0);

  // Direct DOM reference to the scroll container.
  const scrollRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // activeIndexRef — a ref that mirrors the activeIndex state value.
  //
  // Why is this needed?
  //   setTimeout callbacks close over the values that existed when the timeout
  //   was created (a "stale closure"). If the autoplay timer read `activeIndex`
  //   directly, it would always see the value from the render in which the
  //   timeout was first scheduled — usually 0. Reading a ref instead always
  //   gives the latest value because refs are mutable and not frozen by closures.
  // ---------------------------------------------------------------------------
  const activeIndexRef = useRef(0);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Timer refs — stored as refs (not state) so updating them never triggers a
  // re-render. They are pure bookkeeping for side-effect cleanup.
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // RAF ref for debouncing the scroll handler (same pattern as before).
  const rafIdRef = useRef<number | null>(null);

  // ---------------------------------------------------------------------------
  // scrollToCard — wrapped in useCallback so its reference is stable.
  // It reads the DOM at call time (via scrollRef) — no stale closure risk.
  // ---------------------------------------------------------------------------
  const scrollToCard = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const firstCard = el.firstElementChild as HTMLElement | null;
    if (!firstCard) return;

    // Read the card's pixel width at runtime so this works at any breakpoint
    // without hard-coding a value. 24px = gap-6.
    const cardSlotWidth = firstCard.offsetWidth + 24;
    el.scrollTo({ left: index * cardSlotWidth, behavior: "smooth" });
  }, []);

  // ---------------------------------------------------------------------------
  // Autoplay: recursive setTimeout pattern
  //
  // Why setTimeout instead of setInterval?
  //   setInterval fires on a fixed clock regardless of what has happened.
  //   If we cancel and restart a setInterval (to implement pause), the first
  //   fire after resuming could be almost immediate. With recursive setTimeout
  //   we always get the full AUTOPLAY_DELAY after the previous slide finishes.
  //
  // Why scheduleAutoplayRef instead of useCallback?
  //   The function calls itself recursively inside a setTimeout. If defined with
  //   useCallback([]), the closure captures `scrollToCard` once and never updates.
  //   By storing the function in a ref and updating it on every render (the line
  //   `scheduleAutoplayRef.current = ...` below), the setTimeout closure always
  //   invokes the *current* version of the function via the ref, preventing
  //   any stale-closure bugs.
  // ---------------------------------------------------------------------------
  const scheduleAutoplayRef = useRef<() => void>(() => {});

  // This assignment runs on every render (it's not inside a hook), which means
  // `scheduleAutoplayRef.current` always holds the latest closure.
  scheduleAutoplayRef.current = () => {
    if (autoplayTimerRef.current !== null) clearTimeout(autoplayTimerRef.current);

    autoplayTimerRef.current = setTimeout(() => {
      // Loop back to 0 after the last card using modulo arithmetic.
      const next = (activeIndexRef.current + 1) % FEATURES.length;
      scrollToCard(next);
      // Re-schedule — this always calls the latest ref version.
      scheduleAutoplayRef.current();
    }, AUTOPLAY_DELAY);
  };

  // ---------------------------------------------------------------------------
  // pauseAutoplay — called on user interaction (pointerdown / touchstart).
  //
  // Why NOT called on the scroll event?
  //   The scroll event fires for BOTH manual dragging AND programmatic
  //   scrollTo() calls (which autoplay uses). Pausing on scroll would cancel
  //   autoplay every time it advances a slide — effectively disabling it.
  //   Listening to pointer/touch events instead only fires on real user input.
  // ---------------------------------------------------------------------------
  const pauseAutoplay = useCallback(() => {
    // Cancel the pending advance.
    if (autoplayTimerRef.current !== null) clearTimeout(autoplayTimerRef.current);
    // Cancel any previously scheduled resume so we don't stack timers.
    if (resumeTimerRef.current !== null) clearTimeout(resumeTimerRef.current);

    // Schedule a resume after RESUME_DELAY ms of inactivity.
    resumeTimerRef.current = setTimeout(() => {
      scheduleAutoplayRef.current();
    }, RESUME_DELAY);
  }, []);

  // Start autoplay when the component mounts; clean up both timers on unmount.
  useEffect(() => {
    scheduleAutoplayRef.current();

    return () => {
      if (autoplayTimerRef.current !== null) clearTimeout(autoplayTimerRef.current);
      if (resumeTimerRef.current !== null) clearTimeout(resumeTimerRef.current);
    };
    // Empty deps: we deliberately run this once on mount.
    // The ref pattern ensures the callbacks are always fresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Scroll handler — updates activeIndex to keep indicator dots in sync.
  // Uses a requestAnimationFrame guard to avoid running 60 times per second.
  // ---------------------------------------------------------------------------
  const handleScroll = useCallback(() => {
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);

    rafIdRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;

      const firstCard = el.firstElementChild as HTMLElement | null;
      if (!firstCard) return;

      const cardSlotWidth = firstCard.offsetWidth + 24;
      const index = Math.round(el.scrollLeft / cardSlotWidth);
      const clamped = Math.max(0, Math.min(index, FEATURES.length - 1));
      setActiveIndex(clamped);
    });
  }, []);

  // Attach all event listeners in one effect for clarity.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // scroll → update active indicator dot
    el.addEventListener("scroll", handleScroll, { passive: true });
    // pointerdown → covers mouse click-drag and stylus on desktop
    el.addEventListener("pointerdown", pauseAutoplay, { passive: true });
    // touchstart → covers finger swipe on mobile (pointerdown also fires on
    // mobile, but touchstart fires first and some browsers suppress pointer
    // events — using both guarantees coverage across all devices)
    el.addEventListener("touchstart", pauseAutoplay, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("pointerdown", pauseAutoplay);
      el.removeEventListener("touchstart", pauseAutoplay);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [handleScroll, pauseAutoplay]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <section id="features" className="w-full bg-white py-24 overflow-hidden">

      {/* ── Section heading ── */}
      <h2 className="text-4xl font-bold text-center text-gray-900">
        Awesome{" "}
        <span className="text-[#0B2527]">Features</span>
      </h2>

      {/* ── Carousel wrapper ──────────────────────────────────────────────
          overflow-x-auto   — enables horizontal scrolling
          snap-x            — activates CSS scroll snapping on x-axis
          snap-mandatory    — forces container to always rest on a snap point
          flex + gap-6      — row layout with 24px gutters
          hide-scrollbar    — hides native scrollbar track (defined in globals.css)
                              while keeping scrolling + touch swipe functional
          px-6              — simple edge padding; works with snap-start cards
      ──────────────────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="mt-14 flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6"
      >
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>

      {/* ── Indicator dashes ── */}
      <div className="mt-12 flex justify-center gap-2">
        {FEATURES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            aria-label={`Go to feature ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-8 bg-[#0B2527]"
                : "w-8 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
