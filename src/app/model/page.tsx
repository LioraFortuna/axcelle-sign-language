import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, Hourglass } from "lucide-react"
import { SectionHeading } from "@/components/layout/section-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TRAINING_RESULTS } from "@/data/training-results"
import { DATASET, LAYERS, TOTAL_PARAMS, TRAINING_CONFIG, type Layer } from "@/lib/model-info"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Model",
  description: "Arsitektur CNN, dataset, dan hasil evaluasi model pengenalan alfabet bahasa isyarat.",
}

const KIND_STYLE: Record<Layer["kind"], string> = {
  input: "bg-muted text-muted-foreground",
  aug: "bg-chart-3/20 text-foreground",
  conv: "bg-chart-1/15 text-primary",
  norm: "bg-chart-2/20 text-foreground",
  pool: "bg-muted text-foreground",
  drop: "bg-chart-4/15 text-foreground",
  flat: "bg-muted text-muted-foreground",
  dense: "bg-chart-1/15 text-primary",
  out: "bg-primary text-primary-foreground",
}

const CONFUSABLE = [
  ["A", "E", "S", "T"],
  ["M", "N"],
  ["U", "V", "R"],
  ["G", "H"],
  ["K", "P"],
]

const fmt = (n: number) => n.toLocaleString("id-ID")

export default function ModelPage() {
  const r = TRAINING_RESULTS
  const metrics = [
    { label: "Akurasi uji", value: r ? `${(r.testAccuracy * 100).toFixed(2)}%` : null },
    { label: "Loss uji", value: r ? r.testLoss.toFixed(4) : null },
    { label: "Akurasi validasi", value: r ? `${(r.valAccuracy * 100).toFixed(2)}%` : null },
    { label: "Epoch", value: r ? r.epochs.toString() : null },
  ]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12">
      <SectionHeading
        as="h1"
        eyebrow="Model"
        title="Arsitektur & evaluasi CNN"
        text="CNN multikelas dengan output softmax 24 kelas, dilatih menggunakan categorical cross-entropy, dengan Data Augmentation, Batch Normalization, dan Dropout."
      />

      {/* Metrics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} size="sm">
            <CardContent className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              {m.value ? (
                <span className="text-3xl font-semibold tracking-tight tabular-nums">{m.value}</span>
              ) : (
                <span className="flex items-center gap-1.5 text-3xl font-semibold text-muted-foreground/50">
                  —
                </span>
              )}
            </CardContent>
          </Card>
        ))}
        {!r && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2 lg:col-span-4">
            <Hourglass className="size-4" /> Menunggu hasil pelatihan. Isi{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">src/data/training-results.ts</code>{" "}
            setelah model dilatih.
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Architecture */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Arsitektur lapisan</CardTitle>
            <CardDescription>Ringkasan setara dengan model.summary() di Keras.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Lapisan</TableHead>
                  <TableHead>Output</TableHead>
                  <TableHead className="pr-4 text-right">Parameter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LAYERS.map((l, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-4 whitespace-normal">
                      <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", KIND_STYLE[l.kind])}>
                        {l.name}
                      </span>
                      {l.detail && <p className="mt-1 text-xs text-muted-foreground">{l.detail}</p>}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{l.output}</TableCell>
                    <TableCell className="pr-4 text-right font-mono text-xs tabular-nums">
                      {l.params ? fmt(l.params) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="pl-4" colSpan={2}>
                    Total parameter
                  </TableCell>
                  <TableCell className="pr-4 text-right font-mono tabular-nums">{fmt(TOTAL_PARAMS)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          {/* Dataset */}
          <Card>
            <CardHeader>
              <CardTitle>Dataset</CardTitle>
              <CardDescription>{DATASET.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Item label="Data latih" value={fmt(DATASET.train)} />
                <Item label="Data uji" value={fmt(DATASET.test)} />
                <Item label="Kelas" value={`${DATASET.classes} (A–Y, tanpa J)`} />
                <Item label="Ukuran" value={DATASET.size} />
                <Item label="Kanal" value={DATASET.channels} className="col-span-2" />
              </dl>
              <Button
                variant="outline"
                size="sm"
                render={<Link href={DATASET.url} target="_blank" rel="noreferrer" />}
                nativeButton={false}
              >
                Buka di Kaggle <ExternalLink />
              </Button>
            </CardContent>
          </Card>

          {/* Training config */}
          <Card>
            <CardHeader>
              <CardTitle>Konfigurasi pelatihan</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y text-sm">
                {TRAINING_CONFIG.map((c) => (
                  <div key={c.label} className="flex justify-between gap-4 py-2">
                    <dt className="text-muted-foreground">{c.label}</dt>
                    <dd className="text-right font-medium">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Training curves placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Kurva pelatihan</CardTitle>
            <CardDescription>Akurasi & loss per epoch (latih vs validasi).</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState text="Grafik akan tampil setelah riwayat pelatihan tersedia." />
          </CardContent>
        </Card>

        {/* Confusable letters */}
        <Card>
          <CardHeader>
            <CardTitle>Huruf yang rawan tertukar</CardTitle>
            <CardDescription>
              Kelompok huruf dengan bentuk tangan mirip — fokus utama saat menganalisis confusion matrix.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {CONFUSABLE.map((g) => (
              <div key={g.join()} className="flex items-center gap-2">
                {g.map((c, i) => (
                  <span key={c} className="flex items-center gap-2">
                    {i > 0 && <span className="text-muted-foreground">↔</span>}
                    <Badge variant="secondary" className="size-8 justify-center font-mono text-sm">
                      {c}
                    </Badge>
                  </span>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Item({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("rounded-lg bg-muted/50 p-3", className)}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-grid flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
      <span className="rounded-md bg-background px-3 py-1.5">{text}</span>
    </div>
  )
}
