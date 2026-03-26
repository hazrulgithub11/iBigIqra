/**
 * page.tsx — Landing page composition root.
 *
 * This file intentionally contains no layout logic of its own.
 * Its only job is to import and sequence the section components.
 * This matches the single-responsibility principle: each Section file
 * owns its own markup, colors, and internal sub-components.
 *
 * To add a new section, import it here and drop it into the JSX below.
 */

import { Section1Hero } from "@/app/components/Section1Hero";
import { Section2Features } from "@/app/components/Section2Features";
import { Section3OurUsers } from "@/app/components/Section3OurUsers";
import { Section4Why } from "@/app/components/Section4Why";
import { SectionTestimonials } from "@/app/components/SectionTestimonials";
import { Section5About } from "@/app/components/Section5About";
import { Section6FAQ } from "@/app/components/Section6FAQ";
import Section7Footer from "@/app/components/Section7Footer";

export default function Home() {
  return (
    <main>
      <Section1Hero />
      <Section2Features />
      <Section3OurUsers />
      <Section4Why />
      <SectionTestimonials />
      <Section5About />
      <Section6FAQ />
      <Section7Footer />
      {/* Future sections will be added here as individual imports:
          <Section3Screenshots />
          <Section5About />
          <Section7Footer />
      */}
    </main>
  );
}
