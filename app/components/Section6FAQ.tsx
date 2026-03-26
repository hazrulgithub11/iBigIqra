"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "free",
    question:
      "Is the app always going to be 100% free, no ads ever and no strings attached?",
    answer:
      "Yes. This app is built purely for the sake of Allah, and we will never show ads or sell your data. We want it to stay simple, free, and trustworthy.",
  },
  {
    id: "location",
    question: "If it does not collect our data, why does it ask to locate us?",
    answer:
      "Location is used only to show accurate prayer times for where you are. If you disable location, the timing may not match your current area.",
  },
  {
    id: "adhan",
    question: "Why does it not play the adhan sound when it’s time to pray?",
    answer:
      "Adhan alerts depend on your device notification/sound settings. Make sure notifications are allowed for the app, and that the correct prayer alert settings are enabled.",
  },
  {
    id: "timing-method",
    question:
      "Why is the prayer timing different than that of my local Mosque?",
    answer:
      "Prayer times can differ due to calculation methods and timing rules used by each mosque. This app uses a consistent method for your current location.",
  },
];

export function Section6FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="w-full bg-[#F5F5F5] py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-10 md:mb-14">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-button-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <article
                key={item.id}
                className={[
                  "rounded-xl border border-gray-200 shadow-sm overflow-hidden",
                  isOpen ? "border-[#0B2527]" : "",
                ].join(" ")}
              >
                {/* Single button owns both the question and the toggle state. */}
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => {
                    // Single-open accordion:
                    // - if already open -> collapse
                    // - if closed -> open this item
                    setOpenId(isOpen ? null : item.id);
                  }}
                  className={[
                    "w-full flex items-center justify-between gap-4 px-6 py-4 text-left",
                    "transition-colors duration-200",
                    isOpen
                      ? "bg-[#0B2527] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <span className="font-semibold text-sm md:text-base">
                    {item.question}
                  </span>

                  <span
                    className={[
                      "shrink-0 flex items-center justify-center",
                      isOpen ? "text-white" : "text-[#0d3d3f]",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </button>

                {/* Slide-down animation using CSS grid rows (no height guessing). */}
                <div
                  className={[
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      aria-hidden={!isOpen}
                      className={[
                        "px-6 py-4 text-sm leading-relaxed",
                        isOpen ? "bg-[#0B2527] text-white/90" : "bg-white text-gray-600",
                      ].join(" ")}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

