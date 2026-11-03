"use client"

import { useMemo, useState } from "react"
import { Move, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ALPHABET } from "@/lib/alphabet"
import { cn } from "@/lib/utils"

export function AlphabetGrid() {
  const [query, setQuery] = useState("")
  const [showMotion, setShowMotion] = useState(true)
  const [highlight, setHighlight] = useState<string | null>(null)

  const letters = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALPHABET.filter((l) => (showMotion || l.supported) && (!q || l.char.toLowerCase() === q || l.description.toLowerCase().includes(q)))
  }, [query, showMotion])

  const focus = (char: string) => {
    setHighlight(char)
    document.getElementById(`huruf-${char}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    setTimeout(() => setHighlight(null), 1600)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari huruf atau bentuk, mis. “kelingking”"
            aria-label="Cari huruf"
            className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={showMotion} onCheckedChange={setShowMotion} /> Tampilkan J &amp; Z
        </label>
      </div>

      {/* quick jump */}
      <nav aria-label="Lompat ke huruf" className="flex flex-wrap gap-1.5">
        {ALPHABET.map((l) => (
          <button
            key={l.char}
            type="button"
            onClick={() => focus(l.char)}
            disabled={!showMotion && !l.supported}
            className={cn(
              "grid size-8 place-items-center rounded-md border font-mono text-sm hover:bg-muted disabled:opacity-30",
              !l.supported && "border-dashed text-muted-foreground"
            )}
          >
            {l.char}
          </button>
        ))}
      </nav>

      {letters.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">Tidak ada huruf yang cocok dengan &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {letters.map((l) => (
            <Card
              key={l.char}
              id={`huruf-${l.char}`}
              className={cn(
                "scroll-mt-24 transition-shadow",
                !l.supported && "border-dashed bg-muted/30 shadow-none",
                highlight === l.char && "ring-2 ring-primary"
              )}
            >
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "grid size-16 place-items-center rounded-xl text-4xl font-bold",
                      l.supported ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {l.char}
                  </span>
                  {l.supported ? (
                    <span className="font-mono text-xs text-muted-foreground">label {l.label}</span>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Move className="size-3" /> Butuh gerakan
                    </Badge>
                  )}
                </div>
                <p className="text-sm">{l.description}</p>
                {l.similar.length > 0 && (
                  <div className="mt-auto flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    Mirip:
                    {l.similar.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => focus(s)}
                        className="rounded border px-1.5 py-0.5 font-mono hover:bg-muted hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
