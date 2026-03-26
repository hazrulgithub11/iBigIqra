/**
 * Section5About.tsx
 *
 * Static Server Component (no "use client"):
 * About Us content rendered as simple paragraphs for readability/SEO.
 */

const paragraphs = [
  "Assalamu’alaikum w.b.t kepada ibu bapa dan pendidik sekalian.",
  "Saya Faizal bin Jailani, seorang Guru Pendidikan Islam dengan pengalaman mengajar selama 15 tahun. Saya kini berkhidmat di SK Tunku Mahmood 1 dan fokus utama kerjaya saya adalah kepada inovasi serta kreativiti dalam Pendidikan Islam.",
  "Inovasi i BIG Iqra terhasil daripada pemerhatian saya terhadap cabaran yang dihadapi oleh murid-murid dalam menguasai asas bacaan Al-Quran. Matlamat utama pembangunan i BIG Iqra 2.0 adalah untuk menyelesaikan masalah ini melalui pendekatan pengajaran hibrid. Dengan menggabungkan kaedah fizikal (kod warna dan baris bernombor) bersama integrasi digital (video PdPc dan gamifikasi), saya ingin memastikan sesi pembelajaran menjadi lebih tersusun. Sistem ini juga direka khas untuk membolehkan ibu bapa yang mempunyai sifar pengetahuan asas Al-Quran membimbing anak-anak mereka di rumah secara efektif.",
  "Alhamdulillah, sejak versi terawal dibangunkan pada 2015, usaha ini telah menerima pelbagai pengiktirafan. Terkini, inovasi i BIG Iqra 2.0 telah merangkul pelbagai anugerah di peringkat kebangsaan dan antarabangsa, termasuk Silver Award di IICFE 2025 dan Johan Inovasi Berkumpulan AGI 2025 (Kluang).",
  "Semoga platform dan kit inovasi ini dipermudahkan oleh Allah SWT untuk memberi manfaat yang luas dalam melahirkan generasi celik Al-Quran. Jazakumullahu khairan.",
];

export function Section5About() {
  return (
    <section id="about" className="w-full bg-white py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900">
          About Us
        </h2>

        <div className="mt-6 flex flex-col space-y-4">
          {paragraphs.map((text, idx) => (
            <p
              // Paragraphs are intentionally split into multiple <p> blocks for
              // the screenshot-like vertical rhythm.
              key={idx}
              className="text-center text-xs md:text-sm text-gray-600 leading-relaxed"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

