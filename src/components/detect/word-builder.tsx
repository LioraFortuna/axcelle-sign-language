"use client"

import { Copy, Delete, Space, Trash2, Volume2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function WordBuilder({ text, setText }: { text: string; setText: (fn: (t: string) => string) => void }) {
  const speak = () => {
    if (!("speechSynthesis" in window)) return toast.error("Browser tidak mendukung text-to-speech")
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text.toLowerCase())
    u.lang = "id-ID"
    window.speechSynthesis.speak(u)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    toast.success("Teks disalin")
  }

  const empty = text.length === 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-20 items-center rounded-xl border bg-muted/40 px-5 py-4 font-mono text-3xl tracking-[0.2em] break-all">
        {empty ? (
          <span className="font-sans text-base tracking-normal text-muted-foreground">
            Huruf hasil deteksi akan muncul di sini…
          </span>
        ) : (
          <span>
            {text}
            <span className="ml-0.5 inline-block h-8 w-0.5 translate-y-1 animate-pulse bg-primary" />
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setText((t) => (t.endsWith(" ") || !t ? t : t + " "))}>
          <Space /> Spasi
        </Button>
        <Button variant="outline" disabled={empty} onClick={() => setText((t) => t.slice(0, -1))}>
          <Delete /> Hapus
        </Button>
        <div className="ml-auto flex gap-2">
          <IconAction label="Dengarkan" disabled={empty} onClick={speak}>
            <Volume2 />
          </IconAction>
          <IconAction label="Salin" disabled={empty} onClick={copy}>
            <Copy />
          </IconAction>
          <IconAction label="Bersihkan" disabled={empty} onClick={() => setText(() => "")}>
            <Trash2 />
          </IconAction>
        </div>
      </div>
    </div>
  )
}

function IconAction({
  label,
  children,
  ...props
}: { label: string; children: React.ReactNode } & React.ComponentProps<typeof Button>) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon" aria-label={label} {...props} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
