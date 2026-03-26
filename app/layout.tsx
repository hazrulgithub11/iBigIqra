import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Poppins gives the bold, clean sans-serif look specified in the PRD.
// We load only the weights we actually use to keep the bundle small.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  // 400 = body text, 600 = subheadings/buttons, 700 = headings
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Everyday Muslim — Free, AD-Free Prayer Times App",
  description:
    "A free, ad-free and privacy-focused Prayer Times app for every Muslim.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      {/* Apply the Poppins font variable across the whole app */}
      <body className="min-h-full flex flex-col font-[family-name:var(--font-poppins)]">
        {children}
      </body>
    </html>
  );
}
