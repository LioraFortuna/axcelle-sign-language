import type { Metadata } from "next"
import { Info } from "lucide-react"
import { AlphabetGrid } from "@/components/alphabet/alphabet-grid"
import { SectionHeading } from "@/components/layout/section-heading"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Alfabet",
  description: "Panduan bentuk tangan untuk setiap huruf alfabet bahasa isyarat.",
}

export default function AlfabetPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        as="h1"
        eyebrow="Panduan"
        title="Alfabet ejaan jari"
        text="Bentuk tangan untuk setiap huruf yang dikenali model. Gunakan sebagai referensi sebelum mencoba deteksi."
        className="mb-6"
      />
      <Alert className="mb-8">
        <Info />
        <AlertDescription>
          Dataset Sign Language MNIST menggunakan alfabet <strong>ASL</strong> (American Sign Language). Sebagian besar
          bentuknya mirip dengan abjad jari SIBI. Huruf J dan Z memerlukan gerakan sehingga tidak dapat dikenali dari
          satu foto.
        </AlertDescription>
      </Alert>
      <AlphabetGrid />
    </div>
  )
}
