"use client"

import { CircleAlert, Clock, Plus, ScanSearch } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getLetter } from "@/lib/alphabet"
import type { PredictResult } from "@/lib/predict"
import { cn } from "@/lib/utils"

function confidenceLevel(p: number) {
  if (p >= 0.8) return { label: "Keyakinan tinggi", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" }
  if (p >= 0.5) return { label: "Keyakinan sedang", className: "bg-amber-500/15 text-amber-700 dark:text-amber-400" }
  return { label: "Keyakinan rendah", className: "bg-red-500/15 text-red-700 dark:text-red-400" }
}

const pct = (p: number) => `${(p * 100).toFixed(1)}%`

export function ResultPanel({
  result,
  loading,
  onAddLetter,
}: {
  result: PredictResult | null
  loading: boolean
  onAddLetter: (char: string) => void
}) {
  if (loading) return <ResultSkeleton />
  if (!result)
    return (
      <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
          <ScanSearch className="size-6" />
        </span>
        <p className="font-medium">Belum ada hasil</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Unggah foto atau ambil gambar dari kamera, lalu tekan <strong>Deteksi huruf</strong>.
        </p>
      </div>
    )

  const [best, ...rest] = result.top
  const letter = getLetter(best.char)
  const level = confidenceLevel(best.probability)
  const low = best.probability < 0.5

  return (
    <div className="flex flex-col gap-5" aria-live="polite">
      <div className="flex items-center gap-5">
        <div className="grid size-28 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <span className="text-7xl font-bold leading-none">{best.char}</span>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs font-medium", level.className)}>
            {level.label}
          </span>
          <p className="text-4xl font-semibold tracking-tight tabular-nums">{pct(best.probability)}</p>
          <Button size="sm" variant="outline" className="w-fit" onClick={() => onAddLetter(best.char)}>
            <Plus /> Tambah ke kata
          </Button>
        </div>
      </div>

      {letter && <p className="text-sm text-muted-foreground">{letter.description}</p>}

      {low && (
        <Alert>
          <CircleAlert />
          <AlertTitle>Model kurang yakin</AlertTitle>
          <AlertDescription>
            Coba foto ulang dengan latar polos dan pencahayaan merata.
            {letter?.similar.length ? ` Huruf ${best.char} sering tertukar dengan ${letter.similar.join(", ")}.` : ""}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium">Kandidat lain</p>
        <ul className="space-y-2.5">
          {rest.map((p) => (
            <li key={p.char} className="flex items-center gap-3 text-sm">
              <button
                type="button"
                onClick={() => onAddLetter(p.char)}
                title={`Tambah ${p.char} ke kata`}
                className="grid size-7 place-items-center rounded-md border font-mono font-medium hover:bg-muted"
              >
                {p.char}
              </button>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/60 transition-[width] duration-700"
                  style={{ width: `${Math.max(p.probability * 100, 1)}%` }}
                />
              </div>
              <span className="w-14 text-right font-mono text-xs text-muted-foreground tabular-nums">
                {pct(p.probability)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> {result.inferenceMs} ms
        </span>
        {result.mock && (
          <Badge variant="outline" className="text-amber-700 dark:text-amber-400">
            Mode demo — model belum terhubung
          </Badge>
        )}
      </div>
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy>
      <div className="flex items-center gap-5">
        <Skeleton className="size-28 rounded-2xl" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-7 w-36" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">Menganalisis bentuk tangan…</p>
    </div>
  )
}
