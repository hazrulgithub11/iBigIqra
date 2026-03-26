/**
 * Section3OurUsers.tsx
 *
 * This is intentionally a React Server Component — no "use client" directive.
 * The section is fully static: no state, no event handlers, no browser-only
 * APIs. Next.js renders it entirely on the server and ships plain HTML to the
 * browser, which is faster and better for SEO than a client component would be.
 *
 * Rule of thumb used here: only reach for "use client" when you actually need
 * it (state, refs, browser events). Everything else stays server-rendered.
 */

// ---------------------------------------------------------------------------
// Stat card data
//
// Keeping data separate from markup is the key "Option B" trade-off decision.
// To update a number or label, you change ONE line here — no hunting through JSX.
//
// IMPORTANT for Tailwind: each bgColor must be a complete, literal class string
// (e.g. "bg-[#E8006B]", NOT "bg-[" + color + "]"). Tailwind's build-time
// scanner looks for full class strings in source files. Constructing them at
// runtime would cause the CSS to be missing in production.
// ---------------------------------------------------------------------------
const STATS = [
  {
    id: 1,
    value: "400K+",
    label: "USERS",
    bgColor: "bg-[#E8006B]", // Hot pink — top-left card in screenshot
  },
  {
    id: 2,
    value: "1K+",
    label: "5 STAR RATINGS",
    bgColor: "bg-[#F5A623]", // Amber/orange — top-right card
  },
  {
    id: 3,
    value: "20K+",
    label: "SOCIAL FOLLOWERS",
    bgColor: "bg-[#00C897]", // Emerald green — bottom-left card
  },
  {
    id: 4,
    value: "12",
    label: "STATES",
    bgColor: "bg-[#0B2527]", // Dark teal — bottom-right card (same dark teal as the design system)
  },
];

// ---------------------------------------------------------------------------
// StatCard
//
// An internal sub-component that owns the card markup in one place.
// "Internal" means it's not exported — it's only used inside this file.
// Declaring the prop types explicitly (instead of using `any`) makes the
// contract clear and catches typos at compile time.
// ---------------------------------------------------------------------------
interface StatCardProps {
  value: string; // The big number/text, e.g. "400K+"
  label: string; // The uppercase label beneath, e.g. "DOWNLOADS"
  bgColor: string; // A complete Tailwind bg-* class string
}

function StatCard({ value, label, bgColor }: StatCardProps) {
  return (
    // Using <article> here is semantic: each card is an independent,
    // self-contained piece of content (a stat) that makes sense on its own.
    <article
      className={`
        ${bgColor}
        rounded-2xl
        shadow-md
        flex flex-col items-center justify-center
        p-8
        min-h-[160px]
      `}
      // min-h-[160px]: gives each card a consistent height so the 2×2 grid
      // looks visually balanced even when label text lengths differ.
    >
      {/* Large bold stat number — uses <strong> because it IS the most
          important piece of information in this card */}
      <strong className="text-5xl font-extrabold text-white leading-none">
        {value}
      </strong>

      {/* Label — tracking-widest adds the letter-spacing seen in the screenshot */}
      <span className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/90">
        {label}
      </span>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Section3OurUsers — the exported page section
// ---------------------------------------------------------------------------
export function Section3OurUsers() {
  return (
    <section id="our-users" className="bg-white py-24 px-4">
      {/*
        max-w-2xl keeps the two-column grid from stretching too wide on
        large monitors, matching the visual weight of the screenshot where
        the cards fill roughly half the viewport width.
      */}
      <div className="max-w-2xl mx-auto">

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-gray-900">
          Our Users
        </h2>

        {/* Subtitle — max-w-prose constrains line length for readability */}
        <p className="mt-4 text-center text-gray-500 leading-relaxed max-w-prose mx-auto">
          We currently have people using i Big Iqra from all around the
          states with majority of them being in Malaysia.
        </p>

        {/*
          Stat cards grid:
            - grid-cols-1: single column stack on mobile
            - md:grid-cols-2: two-column, two-row layout on medium screens and up
          gap-4 matches the visible gutter between cards in the screenshot.
        */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATS.map((stat) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              label={stat.label}
              bgColor={stat.bgColor}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
