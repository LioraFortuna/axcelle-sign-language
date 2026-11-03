import { cn } from "@/lib/utils"

const N = 28

/** Deterministic 28×28 "hand" intensity map, evoking a Sign Language MNIST sample */
function handIntensity(x: number, y: number) {
  const palm = 1 - Math.hypot((x - 14) / 7, (y - 19) / 6.5)
  const finger = (cx: number, top: number) =>
    Math.abs(x - cx) < 1.4 && y >= top && y <= 17 ? 1 - Math.abs(x - cx) / 2.2 : 0
  const fingers = Math.max(finger(9.5, 6), finger(12.5, 3), finger(15.5, 4), finger(18.5, 7))
  const tx = x - 5
  const ty = y - 16
  const thumb = tx > 0 && tx < 6 && Math.abs(ty + tx * 0.6) < 1.5 ? 0.85 : 0
  const v = Math.max(palm > 0 ? 0.55 + palm * 0.5 : 0, fingers * 0.95, thumb)
  const shade = 0.75 + 0.25 * Math.sin((x + y) / 6)
  return Math.min(1, v * shade)
}

const CELLS = Array.from({ length: N * N }, (_, i) => handIntensity(i % N, Math.floor(i / N)))

export function PixelHand({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("grid aspect-square w-full overflow-hidden rounded-lg bg-zinc-950", className)}
      style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
    >
      {CELLS.map((v, i) => (
        <div key={i} style={{ backgroundColor: `oklch(${(0.18 + v * 0.75).toFixed(3)} 0 0)` }} />
      ))}
    </div>
  )
}
