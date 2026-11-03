"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const MAX_MB = 8

export function UploadZone({ onImage }: { onImage: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file?: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Berkas bukan gambar", { description: "Gunakan format JPG, PNG, atau WEBP." })
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Ukuran gambar melebihi ${MAX_MB} MB`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => onImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Allow pasting an image from the clipboard anywhere on the page
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"))
      if (item) handleFile(item.getAsFile())
    }
    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
      }}
      className={cn(
        "flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors outline-none hover:border-primary/50 hover:bg-accent/40 focus-visible:ring-3 focus-visible:ring-ring/50",
        dragging && "border-primary bg-accent"
      )}
    >
      <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
        <ImagePlus className="size-6" />
      </span>
      <span className="font-medium">{dragging ? "Lepaskan untuk mengunggah" : "Klik atau seret foto tangan ke sini"}</span>
      <span className="text-sm text-muted-foreground">
        JPG, PNG, WEBP · maks {MAX_MB} MB · bisa juga tempel (Ctrl+V)
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ""
        }}
      />
    </button>
  )
}
