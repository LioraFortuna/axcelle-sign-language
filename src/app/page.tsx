import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Brain,
  Camera,
  Grid3x3,
  HeartHandshake,
  Layers,
  ScanLine,
  Shuffle,
  Sparkles,
  Target,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroVisual } from "@/components/home/hero-visual"
import { SectionHeading } from "@/components/layout/section-heading"
import { DATASET } from "@/lib/model-info"

const stats = [
  { value: DATASET.classes.toString(), label: "Kelas huruf" },
  { value: DATASET.train.toLocaleString("id-ID"), label: "Citra latih" },
  { value: DATASET.test.toLocaleString("id-ID"), label: "Citra uji" },
  { value: "28×28", label: "Piksel grayscale" },
]

const steps = [
  { icon: Camera, title: "Ambil foto tangan", text: "Unggah gambar atau gunakan kamera. Posisikan tangan di tengah bingkai." },
  { icon: Grid3x3, title: "Praproses", text: "Citra dipotong persegi, diubah ke grayscale, lalu diperkecil menjadi 28×28 piksel." },
  { icon: Brain, title: "Klasifikasi CNN", text: "Lapisan konvolusi mengekstrak pola bentuk jari, lalu softmax menghitung peluang tiap huruf." },
  { icon: Target, title: "Hasil & rangkai kata", text: "Huruf dengan peluang tertinggi ditampilkan dan bisa dirangkai menjadi kata." },
]

const techniques = [
  {
    icon: Shuffle,
    title: "Data Augmentation",
    text: "Rotasi, zoom, dan pergeseran acak saat pelatihan agar model tahan terhadap variasi posisi tangan.",
  },
  {
    icon: Layers,
    title: "Batch Normalization",
    text: "Menormalkan aktivasi tiap lapisan sehingga pelatihan lebih stabil dan konvergen lebih cepat.",
  },
  {
    icon: Sparkles,
    title: "Dropout",
    text: "Menonaktifkan sebagian neuron secara acak untuk mencegah overfitting pada data latih.",
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary" className="gap-1.5">
              <Brain className="size-3.5" /> Proyek Deep Learning · CNN
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Kenali huruf <span className="text-primary">bahasa isyarat</span> dari foto tangan.
            </h1>
            <p className="max-w-lg text-lg text-pretty text-muted-foreground">
              Convolutional Neural Network yang mengklasifikasikan 24 huruf alfabet isyarat dari citra tangan — langkah
              kecil untuk menjembatani komunikasi dengan teman tuli.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="h-10 px-4" render={<Link href="/deteksi" />} nativeButton={false}>
                <ScanLine /> Mulai Deteksi
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-10 px-4"
                render={<Link href="/alfabet" />}
                nativeButton={false}
              >
                <BookOpen /> Pelajari Alfabet
              </Button>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Stats */}
      <section className="border-b">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "flex flex-col gap-1 py-8",
                i % 2 === 1 ? "border-l pl-6" : "",
                i > 0 ? "md:border-l md:pl-8" : "",
                i < 2 ? "border-b md:border-b-0" : "",
              ].join(" ")}
            >
              <dt className="order-2 text-sm text-muted-foreground">{s.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading eyebrow="Cara kerja" title="Dari foto ke huruf dalam empat langkah" />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <s.icon className="size-5" />
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                  </div>
                  <CardTitle>{s.title}</CardTitle>
                  <CardDescription>{s.text}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {/* Techniques */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading
            eyebrow="Teknik model"
            title="CNN multikelas yang dirancang agar tidak mudah overfit"
            text="Output softmax 24 kelas, dilatih dengan categorical cross-entropy dan dievaluasi dengan akurasi."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {techniques.map((t) => (
              <Card key={t.title}>
                <CardContent className="flex flex-col gap-3">
                  <t.icon className="size-5 text-primary" />
                  <h3 className="font-medium">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="link" className="mt-6 px-0" render={<Link href="/model" />} nativeButton={false}>
            Lihat arsitektur lengkap <ArrowRight />
          </Button>
        </div>
      </section>

      {/* Purpose */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-8 rounded-2xl bg-primary p-8 text-primary-foreground md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
          <HeartHandshake className="size-12 opacity-90" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Mendukung komunikasi yang lebih inklusif</h2>
            <p className="max-w-2xl opacity-85">
              Proyek ini membantu orang dengar memahami ejaan jari, sehingga percakapan dengan penyandang tuli bisa
              dimulai dengan lebih mudah. Dataset menggunakan alfabet ASL; huruf J dan Z tidak disertakan karena
              memerlukan gerakan.
            </p>
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="h-10 px-4"
            render={<Link href="/deteksi" />}
            nativeButton={false}
          >
            Coba sekarang <ArrowRight />
          </Button>
        </div>
      </section>
    </>
  )
}
