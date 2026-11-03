"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Camera, CameraOff, Loader2, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { squareSnapshot } from "@/lib/preprocess"
import { cn } from "@/lib/utils"

type Status = "idle" | "starting" | "live" | "denied" | "unsupported"

export function CameraCapture({ onImage }: { onImage: (dataUrl: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [mirror, setMirror] = useState(true)
  const [useTimer, setUseTimer] = useState(true)
  const [countdown, setCountdown] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setStatus("idle")
  }, [])

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported")
      return
    }
    setStatus("starting")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus("live")
    } catch {
      setStatus("denied")
    }
  }

  // Release the camera when the tab is switched away (panel unmounts) or the page is left
  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (timerRef.current) clearInterval(timerRef.current)
    },
    []
  )

  const capture = () => {
    const video = videoRef.current
    if (!video) return
    onImage(squareSnapshot(video, mirror))
    stop()
  }

  const onCapture = () => {
    if (!useTimer) return capture()
    let n = 3
    setCountdown(n)
    timerRef.current = setInterval(() => {
      n -= 1
      if (n === 0) {
        clearInterval(timerRef.current!)
        setCountdown(null)
        capture()
      } else setCountdown(n)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-950">
        <video
          ref={videoRef}
          playsInline
          muted
          className={cn("size-full object-cover", mirror && "-scale-x-100", status !== "live" && "invisible")}
        />

        {status === "live" && (
          <>
            {/* framing guide */}
            <div className="pointer-events-none absolute inset-[12%] rounded-2xl border-2 border-dashed border-white/60" />
            <span className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              Posisikan tangan di dalam bingkai
            </span>
          </>
        )}

        {countdown !== null && (
          <div className="absolute inset-0 grid place-items-center bg-black/30">
            <span key={countdown} className="animate-in text-8xl font-bold text-white zoom-in-50 fade-in">
              {countdown}
            </span>
          </div>
        )}

        {status !== "live" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-zinc-300">
            {status === "starting" ? (
              <Loader2 className="size-8 animate-spin" />
            ) : status === "denied" || status === "unsupported" ? (
              <>
                <CameraOff className="size-8" />
                <p className="text-sm">
                  {status === "denied"
                    ? "Akses kamera ditolak. Izinkan kamera di pengaturan browser, lalu coba lagi."
                    : "Browser ini tidak mendukung akses kamera. Gunakan opsi unggah foto."}
                </p>
                {status === "denied" && (
                  <Button variant="secondary" onClick={start}>
                    Coba lagi
                  </Button>
                )}
              </>
            ) : (
              <>
                <Camera className="size-8" />
                <p className="text-sm">Kamera belum aktif</p>
                <Button variant="secondary" onClick={start}>
                  Aktifkan kamera
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <label className="flex items-center gap-2">
          <Switch checked={mirror} onCheckedChange={setMirror} /> Cermin
        </label>
        <label className="flex items-center gap-2">
          <Switch checked={useTimer} onCheckedChange={setUseTimer} />
          <Timer className="size-4 text-muted-foreground" /> Hitung mundur 3 dtk
        </label>
      </div>

      {status === "live" && (
        <div className="flex gap-2">
          <Button className="h-10 flex-1" onClick={onCapture} disabled={countdown !== null}>
            <Camera /> {countdown !== null ? "Bersiap…" : "Ambil gambar"}
          </Button>
          <Button variant="outline" className="h-10" onClick={stop}>
            Matikan
          </Button>
        </div>
      )}
    </div>
  )
}
