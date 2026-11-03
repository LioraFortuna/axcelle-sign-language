import { ArrowRight, Camera } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PixelHand } from "./pixel-hand"

const bars = [
  { c: "B", p: 94 },
  { c: "U", p: 3 },
  { c: "F", p: 2 },
]

export function HeroVisual() {
  return (
    <Card className="relative gap-0 p-5 shadow-xl ring-1 ring-primary/10">
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono">pipeline.preview</span>
        <span className="rounded-full bg-muted px-2 py-0.5">ilustrasi</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
        <Step label="Foto">
          <div className="grid aspect-square place-items-center rounded-lg border border-dashed bg-muted/50">
            <Camera className="size-7 text-muted-foreground" />
          </div>
        </Step>
        <ArrowRight className="size-4 text-muted-foreground" />
        <Step label="28×28">
          <PixelHand />
        </Step>
        <ArrowRight className="size-4 text-muted-foreground" />
        <Step label="Prediksi">
          <div className="grid aspect-square place-items-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-4xl font-bold">B</span>
          </div>
        </Step>
      </div>
      <div className="mt-5 space-y-2">
        {bars.map((b) => (
          <div key={b.c} className="flex items-center gap-3 text-sm">
            <span className="w-4 font-mono font-medium">{b.c}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${b.p}%` }} />
            </div>
            <span className="w-10 text-right font-mono text-xs text-muted-foreground tabular-nums">
              {b.p}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function Step({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {children}
      <span className="text-center text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
