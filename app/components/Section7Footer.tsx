import Link from "next/link";

const linkBaseClassName =
  "text-sm text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950 rounded-sm transition-colors";

export default function Section7Footer() {
  return (
    <footer className="bg-teal-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <section aria-labelledby="footer-about-us">
            <h2
              id="footer-about-us"
              className="text-sm font-semibold tracking-wide text-white/90"
            >
              About Us
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/70">
              We&apos;re i Big Iqra like you who just want to empower our
              students with reliable apps that can help us practice our deen with
              ease.
            </p>
            <div className="mt-6">
              <p className="text-sm font-semibold text-white/90">Write to us at</p>
              <a
                className={`${linkBaseClassName} mt-2 inline-block`}
                href="mailto:admin@ibigiqra.com"
              >
                admin@ibigiqra.com
              </a>
            </div>
          </section>

          <nav aria-labelledby="footer-company">
            <h2
              id="footer-company"
              className="text-sm font-semibold tracking-wide text-white/90"
            >
              Features
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link className={linkBaseClassName} href="/#about">
                  Kelas Mengaji Online
                </Link>
              </li>
              <li>
                <Link className={linkBaseClassName} href="/privacy">
                  Kursus Mengaji
                </Link>
              </li>
              <li>
                <Link className={linkBaseClassName} href="/apps">
                  Kursus Bacaan Al-Quran
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-quick-links">
            <h2
              id="footer-quick-links"
              className="text-sm font-semibold tracking-wide text-white/90"
            >
              Testimonials
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link className={linkBaseClassName} href="/#home">
                  Testimoni 1
                </Link>
              </li>
              <li>
                <Link className={linkBaseClassName} href="/#features">
                  Testimoni 2
                </Link>
              </li>
              <li>
                <Link className={linkBaseClassName} href="/#our-users">
                    Testimoni 3
                </Link>
              </li>
              <li>
                <Link className={linkBaseClassName} href="/#testimonials">
                  Testimoni 4
                </Link>
              </li>
              <li>
                <Link className={linkBaseClassName} href="/#why">
                  Testimoni 5
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-social-pages">
            <h2
              id="footer-social-pages"
              className="text-sm font-semibold tracking-wide text-white/90"
            >
              Social Pages
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link className={linkBaseClassName} href="/facebook">
                  Facebook
                </Link>
              </li>
              <li>
                <Link className={linkBaseClassName} href="/twitter">
                  Twitter
                </Link>
              </li>
              <li>
                <Link className={linkBaseClassName} href="/instagram">
                  Instagram
                </Link>
              </li>
              <li>
                <Link className={linkBaseClassName} href="/apps">
                  All Our Apps
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/70">©2026 @ i Big Iqra</p>
        </div>
      </div>
    </footer>
  );
}

