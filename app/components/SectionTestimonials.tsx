/**
 * SectionTestimonials.tsx
 *
 * "What Users Are Saying" — auto-playing testimonial carousel with:
 *   • Loop-back:  after the last group the carousel wraps back to the first.
 *   • Responsive: 3 cards per slide on desktop, 1 card per slide on mobile.
 *   • Bug-fix:    rapid swipes can no longer break the loop by stacking page
 *                 increments faster than the 500ms CSS transition.
 *
 * WHY "use client":
 *   useState, useEffect, useRef, and DOM event handlers are all browser-only.
 *   Next.js server-renders components by default; marking this file as a
 *   client component tells Next.js to skip server rendering for it.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Star } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title?: string;
  stars: number; // 1–5
}

// ---------------------------------------------------------------------------
// Data — 9 testimonials.
// ---------------------------------------------------------------------------
const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      "Alhamdulillah, this is what a Muslim should be looking for. This app makes prayer easy for me wherever I go. I don't need to ask or doubt prayer directions.",
    name: "Jenabu Eliasu",
    title: "Mother and Entrepreneur",
    stars: 5,
  },
  {
    id: 2,
    quote:
      "I love this app's timing accuracy. The athan's timing is so correct. Jazakallah khair for such an amazing app I have been searching for years. Stay blessed.",
    name: "Tayyab",
    stars: 5,
  },
  {
    id: 3,
    quote:
      "Hi everyone, first of all this application is so user friendly, ad-free and it's free to use. Honestly, Mashallah this is the only Muslim app I liked. Thank you!",
    name: "Shahab Shaikh",
    stars: 5,
  },
  {
    id: 4,
    quote:
      "This app has completely transformed my daily prayers. The Qibla direction is incredibly accurate. I use it every single day without fail.",
    name: "Fatima Al-Hassan",
    title: "Teacher",
    stars: 5,
  },
  {
    id: 5,
    quote:
      "The best Islamic app I have ever used. My entire family now uses it for prayer times. JazakAllah khair to the whole team behind this!",
    name: "Ibrahim Malik",
    title: "Engineer",
    stars: 5,
  },
  {
    id: 6,
    quote:
      "Simple, clean, and accurate. Everything I need for daily worship in one place. Cannot imagine my routine without it anymore.",
    name: "Aisha Rahman",
    title: "University Student",
    stars: 5,
  },
  {
    id: 7,
    quote:
      "MashAllah! The app gives me peace of mind knowing I will never miss a prayer. The notifications are always perfectly timed for my location.",
    name: "Yusuf Osman",
    title: "Business Owner",
    stars: 5,
  },
  {
    id: 8,
    quote:
      "Beautiful design and very easy to use. The Quran recitation feature is a wonderful bonus. The whole family benefits from this app daily.",
    name: "Zainab Hussain",
    title: "Doctor",
    stars: 5,
  },
  {
    id: 9,
    quote:
      "Been using this for months now. It never lets me down. The accuracy of prayer times for my location is spot on. Highly recommended to every Muslim!",
    name: "Abdul Aziz",
    title: "Software Developer",
    stars: 5,
  },
];

const AUTOPLAY_MS = 3000;

// ---------------------------------------------------------------------------
// useItemsPerView
//
// Returns how many cards should be visible at once based on the current
// viewport width:
//   <640px  (mobile)  → 1 card
//   ≥640px  (desktop) → 3 cards
//
// WHY matchMedia instead of a resize listener?
//   window.matchMedia fires only when the condition crosses the threshold,
//   not on every single pixel of resize. That is more efficient.
//
// WHY default to 3?
//   Next.js renders on the server first, where window doesn't exist.
//   We default to 3 (desktop) so the server-rendered HTML matches what most
//   visitors (desktop users) will see on first paint. The useEffect then
//   corrects it immediately if the user is on mobile.
// ---------------------------------------------------------------------------
function useItemsPerView(): number {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");

    // Update count whenever the media query match status changes.
    const update = () => setCount(mq.matches ? 1 : 3);

    update(); // run immediately on mount to sync with actual viewport
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []); // empty deps: this effect runs once and the listener handles updates

  return count;
}

// ---------------------------------------------------------------------------
// chunkArray
//
// Splits a flat array into sub-arrays of `size` items.
//   chunkArray([1,2,3,4,5,6], 3) → [[1,2,3], [4,5,6]]
// ---------------------------------------------------------------------------
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size)); // slice does not mutate `arr`
  }
  return result;
}

// ---------------------------------------------------------------------------
// StarRating
// ---------------------------------------------------------------------------
function StarRating({ count }: { count: number }) {
  return (
    <div
      className="flex gap-1 justify-center mt-3"
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {/*
        Array.from({ length: 5 }) creates 5 empty slots we can map over.
        The slot value is unused (hence `_`); we only need the index `i`.
      */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < count
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TestimonialCard
// ---------------------------------------------------------------------------
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-8 flex flex-col items-center text-center">
      {/*
        flex-1 makes the quote grow to fill vertical space so that all cards
        in a row end up the same height regardless of quote length.
      */}
      <p className="text-gray-500 text-sm leading-relaxed flex-1">
        {testimonial.quote}
      </p>

      <div className="mt-5">
        <p className="font-semibold text-gray-800 text-sm">{testimonial.name}</p>
        {testimonial.title && (
          <p className="text-gray-400 text-xs mt-0.5">{testimonial.title}</p>
        )}
      </div>

      <StarRating count={testimonial.stars} />
    </article>
  );
}

// ---------------------------------------------------------------------------
// SectionTestimonials
// ---------------------------------------------------------------------------
export function SectionTestimonials() {
  const itemsPerView = useItemsPerView(); // 1 on mobile, 3 on desktop

  // -------------------------------------------------------------------------
  // Derive the carousel structure from itemsPerView.
  //
  // useMemo recomputes only when itemsPerView changes — not on every render.
  //
  // realGroups:    the actual content groups (3 groups of 3, or 9 groups of 1)
  // extendedGroups: realGroups padded with one clone at each end for looping:
  //   [clone-of-last, ...real-groups, clone-of-first]
  //
  // Example at itemsPerView=3 (desktop):
  //   realGroups    = [[c1,c2,c3], [c4,c5,c6], [c7,c8,c9]]
  //   extendedGroups = [[c7,c8,c9], [c1,c2,c3], [c4,c5,c6], [c7,c8,c9], [c1,c2,c3]]
  //                     ^^^^clone                                          ^^^^clone
  //
  // Example at itemsPerView=1 (mobile):
  //   realGroups    = [[c1],[c2],...,[c9]]           (9 groups of 1)
  //   extendedGroups = [[c9],[c1],[c2],...,[c9],[c1]] (11 items)
  // -------------------------------------------------------------------------
  const realGroups = useMemo(
    () => chunkArray(TESTIMONIALS, itemsPerView),
    [itemsPerView]
  );

  const groupCount = realGroups.length; // 3 on desktop, 9 on mobile

  const extendedGroups = useMemo(
    () => [
      realGroups[groupCount - 1], // clone of last group — index 0
      ...realGroups,               // real groups          — indices 1..groupCount
      realGroups[0],               // clone of first group — last index
    ],
    [realGroups, groupCount]
  );

  const extendedCount = extendedGroups.length; // 5 on desktop, 11 on mobile

  // REAL_START is always 1 (real content starts after the leading clone).
  // realEnd = groupCount (the last real group's index in the extended track).
  const realEnd = groupCount;

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  // `page` — which index in extendedGroups is currently centred.
  // Starts at 1 (first real group, just after the leading clone).
  const [page, setPage] = useState(1);

  // `animate` — controls whether the CSS transition is active.
  // Set to false during the instant "loop jump" so the user doesn't see it.
  const [animate, setAnimate] = useState(true);

  // -------------------------------------------------------------------------
  // Refs
  //
  // These three flags are refs (not state) because they are read inside a
  // setInterval callback. State values captured in a closure go stale between
  // interval fires; refs always reflect the current value.
  // -------------------------------------------------------------------------
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);

  // isTransitioningRef — the stacking-prevention guard.
  //
  // PROBLEM (now fixed): goNext/goPrev could be called multiple times within
  // the 500ms CSS transition window (e.g. rapid swiping). Each call incremented
  // `page`, so after two swipes `page` could be 5 or 6 — outside the valid
  // [0..4] range. The loop-jump conditions (`page === 0` / `page === EXTENDED-1`)
  // were never met, so the carousel got stuck.
  //
  // FIX: once a slide starts we block further navigation until onTransitionEnd
  // fires and flips this flag back to false.
  const isTransitioningRef = useRef(false);

  // -------------------------------------------------------------------------
  // When itemsPerView changes (screen resize), reset to page 1 instantly.
  // We also clear the transitioning flag so the carousel is not stuck.
  // -------------------------------------------------------------------------
  useEffect(() => {
    isTransitioningRef.current = false;
    setAnimate(false); // no animation for the reset
    setPage(1);
  }, [itemsPerView]);

  // -------------------------------------------------------------------------
  // Re-enable animation after a silent jump or a resize reset.
  //
  // WHY requestAnimationFrame?
  // setAnimate(false) and setPage() are batched into one React render.
  // After that render the browser commits the new position. Without rAF we
  // risk React batching setAnimate(false) + setAnimate(true) into a single
  // render (no intermediate "no-transition" frame), which would animate the
  // jump. rAF ensures we wait for the browser to paint first.
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!animate) {
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [animate]);

  // -------------------------------------------------------------------------
  // Active indicator dash (0 or 1)
  //
  // Maps current `page` → real group index (0-based) → dash index.
  //
  // The double-modulo `((x % n) + n) % n` handles clone pages where the raw
  // offset would be -1 or groupCount. JavaScript's % returns negative values
  // for negative x (e.g. -1 % 9 === -1), so the `+ n` step corrects that.
  // -------------------------------------------------------------------------
  const realIndex = (((page - 1) % groupCount) + groupCount) % groupCount;
  const activeDash = realIndex % 2; // cycles 0 → 1 → 0 → 1 …

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------
  const goNext = useCallback(() => {
    if (isTransitioningRef.current) return; // block stacking
    isTransitioningRef.current = true;
    setAnimate(true);
    setPage((p) => p + 1);
  }, []);

  const goPrev = useCallback(() => {
    if (isTransitioningRef.current) return; // block stacking
    isTransitioningRef.current = true;
    setAnimate(true);
    setPage((p) => p - 1);
  }, []);

  // -------------------------------------------------------------------------
  // Loop-back: silent jump after transition ends.
  //
  // The extended track has a clone of the last group at index 0, and a clone
  // of the first group at the last index. When the carousel lands on either
  // clone, we disable the CSS transition and instantly reposition to the
  // matching real group. Since the clone and the real group look identical,
  // the user sees no jump.
  //
  // We use refs (realEndRef, extCountRef) so this callback only needs `page`
  // as a dependency, avoiding recreation on every resize.
  // -------------------------------------------------------------------------
  const realEndRef = useRef(realEnd);
  const extCountRef = useRef(extendedCount);

  // Keep the refs in sync with the latest derived values after a resize.
  useEffect(() => { realEndRef.current = realEnd; }, [realEnd]);
  useEffect(() => { extCountRef.current = extendedCount; }, [extendedCount]);

  const onTransitionEnd = useCallback(() => {
    // Unlock navigation now that the CSS transition has finished.
    isTransitioningRef.current = false;

    if (page === 0) {
      // Landed on clone of last group → silently jump to the real last group.
      setAnimate(false);
      setPage(realEndRef.current);
    } else if (page === extCountRef.current - 1) {
      // Landed on clone of first group → silently jump to the real first group.
      setAnimate(false);
      setPage(1); // REAL_START is always 1
    }
  }, [page]);

  // -------------------------------------------------------------------------
  // Autoplay
  // -------------------------------------------------------------------------
  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current && !draggingRef.current) {
        goNext();
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [goNext]); // goNext is stable (useCallback []), so interval is created once

  // -------------------------------------------------------------------------
  // Drag / swipe helpers (shared by mouse and touch handlers)
  // -------------------------------------------------------------------------
  const onDragStart = (x: number) => {
    draggingRef.current = true;
    pausedRef.current = true;
    dragStartXRef.current = x;
  };

  const onDragEnd = (x: number) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    pausedRef.current = false;

    const delta = dragStartXRef.current - x;
    // 50 px threshold: shorter movements are taps, not intentional swipes.
    if (delta > 50) goNext();
    else if (delta < -50) goPrev();
  };

  // -------------------------------------------------------------------------
  // CSS transform
  //
  // The track is (extendedCount × containerWidth) wide.
  // translateX as a % is relative to the track's OWN width, so:
  //
  //   shift per page    = 1 container-width = track-width / extendedCount
  //   translateX for p  = -(p / extendedCount) × 100%
  //
  // Desktop (extendedCount=5):  page 1 → -20%, page 2 → -40%, page 3 → -60%
  // Mobile  (extendedCount=11): page 1 → -9.09%, page 2 → -18.18%, …
  // -------------------------------------------------------------------------
  const tx = `-${(page / extendedCount) * 100}%`;

  return (
    <section
      id="testimonials"
      className="bg-[#F5F5F5] py-16 md:py-20 px-4"
      aria-roledescription="carousel"
      aria-label="What Users Are Saying"
    >
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          What{" "}
          <span className="text-[#0d3d3f]">Users Are</span>
          {" "}Saying
        </h2>

        {/* Screen-reader-only keyboard hint */}
        <p className="sr-only" id="carousel-kb-hint">
          Use left and right arrow keys to navigate between slides.
        </p>

        {/* -------------------------------------------------------------------
            Viewport — overflow-hidden clips off-screen groups.
            tabIndex={0} makes the element focusable for keyboard navigation.
        ------------------------------------------------------------------- */}
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
          role="region"
          tabIndex={0}
          aria-describedby="carousel-kb-hint"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={(e) => {
            // If the mouse leaves while dragging, end the drag cleanly.
            if (draggingRef.current) onDragEnd(e.clientX);
            pausedRef.current = false;
          }}
          onMouseDown={(e) => onDragStart(e.clientX)}
          onMouseUp={(e) => onDragEnd(e.clientX)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
          }}
        >
          {/* -----------------------------------------------------------------
              Track — wide enough to hold all extended groups side by side.
              Each group occupies exactly (100 / extendedCount)% of the track
              = 100% of the container viewport.
          ----------------------------------------------------------------- */}
          <div
            className="flex"
            style={{
              width: `${extendedCount * 100}%`,
              transform: `translateX(${tx})`,
              transition: animate ? "transform 500ms ease" : "none",
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {extendedGroups.map((group, gIdx) => (
              <div
                key={gIdx}
                // gap-4 between cards when multiple are shown; no gap on mobile (single card)
                className={`flex px-2 ${itemsPerView > 1 ? "gap-3 sm:gap-4" : ""}`}
                style={{ width: `${100 / extendedCount}%` }}
                aria-hidden={gIdx !== page}
              >
                {group.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------------------
            Indicators — 2 decorative dashes, one active at a time.
            activeDash cycles 0 → 1 → 0 → 1 … as groups advance.
        ------------------------------------------------------------------- */}
        <div
          className="flex justify-center gap-2 mt-8"
          role="tablist"
          aria-label="Slide indicators"
        >
          {[0, 1].map((dashIdx) => (
            <div
              key={dashIdx}
              role="tab"
              aria-selected={activeDash === dashIdx}
              aria-label={`Indicator ${dashIdx + 1}`}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                activeDash === dashIdx
                  ? "w-6 bg-gray-700"  // active: wider + darker
                  : "w-4 bg-gray-300", // inactive: narrower + lighter
              ].join(" ")}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
