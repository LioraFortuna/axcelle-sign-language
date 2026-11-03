import type { Metadata } from "next"
import { Detector } from "@/components/detect/detector"
import { SectionHeading } from "@/components/layout/section-heading"

export const metadata: Metadata = {
  title: "Deteksi",
  description: "Unggah foto tangan atau gunakan kamera untuk mengenali huruf bahasa isyarat.",
}

export default function DeteksiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        as="h1"
        eyebrow="Deteksi"
        title="Kenali huruf dari foto tangan"
        text="Gambar diproses di browser menjadi citra 28×28 grayscale sebelum diklasifikasikan oleh CNN."
        className="mb-10"
      />
      <Detector />
    </div>
  )
}
