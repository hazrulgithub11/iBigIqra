/**
 * Section4Why.tsx
 *
 * Purely static — no interactivity, no browser APIs, no React hooks.
 * No "use client" directive is needed; this renders entirely on the server.
 *
 * Responsive strategy (Option B — dual layouts):
 *   - Desktop (md+): horizontal flex timeline. Each step owns a left-line +
 *     circle + right-line row so the connector spans the full width naturally.
 *   - Mobile (<md): vertical flex stack. A thin vertical bar is drawn between
 *     circle and the next item using a fixed-height div on the left column.
 *
 * The two layouts map over the same STEPS array so there is no data
 * duplication — only two different structural representations.
 */

// ---------------------------------------------------------------------------
// Static content
// ---------------------------------------------------------------------------
const STEPS = [
  {
    number: 1,
    heading: "Inovasi Pembelajaran Hibrid",
    paragraph:
      "Menggabungkan penggunaan buku bercetak dengan imbasan Kod QR untuk akses pantas kepada video panduan PdPc secara terus.",
  },
  {
    number: 2,
    heading: "Kaedah Baca Ikut Guru (BIG)",
    paragraph:
      "Memperkenalkan inovasi pengecaman kod warna merah dan hijau pada huruf berserta baris bernombor bagi memudahkan asas bacaan.",
  },
  {
    number: 3,
    heading: "Integrasi Elemen Gamifikasi",
    paragraph:
      "Mengekalkan minat kanak-kanak melalui kandungan pembelajaran interaktif berasaskan permainan digital seperti platform Wordwall.",
  },
  {
    number: 4,
    heading: "Ekosistem Pendidikan Digital",
    paragraph:
      "Menepati Dasar Pendidikan Digital (DPD) melalui penggunaan Google Classroom sebagai perantara penyebaran data dan sesi langsung.",
  },
];

// The dark teal used for nodes and connecting lines, sampled from the reference.
const NODE_COLOR = "bg-[#0d3d3f]";
const LINE_COLOR = "bg-[#0d3d3f]";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Section4Why() {
  return (
    <section id="why" className="w-full bg-white py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* ----------------------------------------------------------------
            Title
            "Why" is plain bold; "Everyday Muslim" keeps the same weight but
            Poppins naturally renders it with enough contrast at this size.
        ---------------------------------------------------------------- */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-14 md:mb-20">
          Why{" "}
          <span className="font-bold">i Big Iqra</span>
        </h2>

        {/* ================================================================
            DESKTOP LAYOUT (md and above) — horizontal timeline
            Each step is a flex-col that fills equal space (flex-1).
            Inside each step, the top row is: [left-line][circle][right-line].
            The first step's left line and the last step's right line are
            invisible (not removed) so the circles stay evenly spaced.
        ================================================================ */}
        <div className="hidden md:flex items-start">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className="flex flex-col items-center flex-1"
            >
              {/* -- Node row with flanking connector lines -- */}
              <div className="flex items-center w-full">
                {/*
                  Left connector.
                  `invisible` keeps the space but hides the line for step 1,
                  ensuring the first circle aligns with the others.
                */}
                <div
                  className={`flex-1 h-px ${LINE_COLOR} ${index === 0 ? "invisible" : ""}`}
                />

                {/* Circular numbered node */}
                <div
                  className={`w-12 h-12 rounded-full ${NODE_COLOR} flex items-center justify-center shrink-0`}
                >
                  <span className="text-white font-bold text-base leading-none">
                    {step.number}
                  </span>
                </div>

                {/*
                  Right connector.
                  Same invisible trick for the last step.
                */}
                <div
                  className={`flex-1 h-px ${LINE_COLOR} ${index === STEPS.length - 1 ? "invisible" : ""}`}
                />
              </div>

              {/* -- Text block -- */}
              <div className="mt-5 px-3 text-center">
                <h3 className="font-bold text-gray-900 text-sm mb-2">
                  {step.heading}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.paragraph}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================================
            MOBILE LAYOUT (below md) — vertical stack
            Each step is a horizontal row: [left column: circle + line] +
            [right column: text].
            The vertical connector is a fixed-height div below the circle.
            It is omitted for the last step so there is no dangling line.
        ================================================================ */}
        <div className="flex flex-col md:hidden gap-0">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex items-start gap-5">

              {/* Left column: circle + vertical connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-11 h-11 rounded-full ${NODE_COLOR} flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-base leading-none">
                    {step.number}
                  </span>
                </div>

                {/*
                  Vertical connector drawn as a thin bar below the circle.
                  Skipped on the last step — no item follows it.
                  h-16 gives enough height to visually bridge to the next node
                  without being too long for short paragraph text.
                */}
                {index < STEPS.length - 1 && (
                  <div className={`w-px h-16 ${LINE_COLOR} mt-1`} />
                )}
              </div>

              {/* Right column: heading + paragraph */}
              <div className="pt-1 pb-8">
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  {step.heading}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.paragraph}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
