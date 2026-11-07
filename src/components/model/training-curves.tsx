import type { TrainingResults } from "@/data/training-results"

type Point = { epoch: number; train: number; val: number }

const W = 320
const H = 200
const PAD = { top: 12, right: 12, bottom: 28, left: 40 }

function Chart({ title, data, format }: { title: string; data: Point[]; format: (n: number) => string }) {
  const values = data.flatMap((d) => [d.train, d.val])
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = hi - lo || 1
  const yMin = lo - span * 0.08
  const yMax = hi + span * 0.08

  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (epoch: number) => PAD.left + (data.length === 1 ? innerW / 2 : ((epoch - 1) / (data.length - 1)) * innerW)
  const y = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * innerH
  const path = (key: "train" | "val") => data.map((d, i) => `${i ? "L" : "M"}${x(d.epoch).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ")

  const yTicks = Array.from({ length: 4 }, (_, i) => yMin + ((yMax - yMin) * i) / 3)
  const xTicks = [1, Math.ceil(data.length / 2), data.length].filter((v, i, a) => a.indexOf(v) === i)

  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="text-sm font-medium">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Grafik ${title} per epoch`}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
            <text x={PAD.left - 6} y={y(t) + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
              {format(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={H - 10} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            {t}
          </text>
        ))}
        <text x={PAD.left + innerW / 2} y={H - 0} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          epoch
        </text>
        <path d={path("train")} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinejoin="round" />
        <path d={path("val")} fill="none" stroke="var(--chart-4)" strokeWidth={2} strokeLinejoin="round" strokeDasharray="5 3" />
      </svg>
    </figure>
  )
}

export function TrainingCurves({ history }: { history: TrainingResults["history"] }) {
  if (history.length === 0) return null
  const acc = history.map((h) => ({ epoch: h.epoch, train: h.acc, val: h.valAcc }))
  const loss = history.map((h) => ({ epoch: h.epoch, train: h.loss, val: h.valLoss }))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Chart title="Akurasi" data={acc} format={(n) => `${(n * 100).toFixed(0)}%`} />
        <Chart title="Loss" data={loss} format={(n) => n.toFixed(2)} />
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded bg-chart-1" /> Latih
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded border-t-2 border-dashed border-chart-4" /> Validasi
        </span>
      </div>
    </div>
  )
}
