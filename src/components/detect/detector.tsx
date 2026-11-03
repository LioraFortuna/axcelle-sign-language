"use client"

import { useState } from "react"
import { Camera, Lightbulb, Loader2, RotateCcw, ScanLine, Upload } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { loadImage, preprocess, type Preprocessed } from "@/lib/preprocess"
import { predict, type PredictResult } from "@/lib/predict"
import { CameraCapture } from "./camera-capture"
import { ResultPanel } from "./result-panel"
import { UploadZone } from "./upload-zone"
import { WordBuilder } from "./word-builder"

const TIPS = [
  "Gunakan latar belakang polos dan kontras dengan warna kulit.",
  "Pastikan pencahayaan merata, hindari bayangan tajam.",
  "Gunakan tangan kanan dengan telapak menghadap kamera.",
  "Isi sebagian besar bingkai dengan tangan.",
]

export function Detector() {
  const [mode, setMode] = useState<string>("upload")
  const [image, setImage] = useState<string | null>(null)
  const [processed, setProcessed] = useState<Preprocessed | null>(null)
  const [result, setResult] = useState<PredictResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState("")

  const onImage = async (dataUrl: string) => {
    setImage(dataUrl)
    setResult(null)
    try {
      setProcessed(preprocess(await loadImage(dataUrl)))
    } catch {
      toast.error("Gambar tidak dapat dibaca")
      reset()
    }
  }

  const reset = () => {
    setImage(null)
    setProcessed(null)
    setResult(null)
  }

  const run = async () => {
    if (!processed) return
    setLoading(true)
    try {
      setResult(await predict(processed.pixels))
    } catch {
      toast.error("Deteksi gagal", { description: "Terjadi kesalahan saat menjalankan model." })
    } finally {
      setLoading(false)
    }
  }

  const addLetter = (c: string) => {
    setText((t) => t + c)
    toast.success(`Huruf ${c} ditambahkan`)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Step 1 — input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StepNumber n={1} /> Masukkan citra tangan
          </CardTitle>
          <CardDescription>Unggah foto atau gunakan kamera perangkat.</CardDescription>
          <CardAction>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Tips foto" />}>
                <Lightbulb />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-64">
                <ul className="list-disc space-y-1 pl-4">
                  {TIPS.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {image ? (
            <>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Citra tangan yang dipilih" className="aspect-square w-full rounded-xl object-cover" />
                {processed && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <div className="absolute right-3 bottom-3 rounded-lg bg-background/90 p-1.5 shadow-md ring-1 ring-border backdrop-blur" />
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={processed.previewUrl}
                        alt="Input model 28×28 grayscale"
                        className="pixelated size-20 rounded sm:size-24"
                      />
                      <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">input 28×28</p>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-56">
                      Inilah yang &ldquo;dilihat&rdquo; CNN: citra grayscale 28×28 piksel, sama seperti format dataset Sign
                      Language MNIST.
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="flex gap-2">
                <Button className="h-10 flex-1" onClick={run} disabled={loading || !processed}>
                  {loading ? <Loader2 className="animate-spin" /> : <ScanLine />}
                  {loading ? "Mendeteksi…" : "Deteksi huruf"}
                </Button>
                <Button variant="outline" className="h-10" onClick={reset} disabled={loading}>
                  <RotateCcw /> Ganti
                </Button>
              </div>
            </>
          ) : (
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList className="w-full">
                <TabsTrigger value="upload">
                  <Upload /> Unggah foto
                </TabsTrigger>
                <TabsTrigger value="camera">
                  <Camera /> Kamera
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="pt-2">
                <UploadZone onImage={onImage} />
              </TabsContent>
              <TabsContent value="camera" className="pt-2">
                <CameraCapture onImage={onImage} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Step 2 — result */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StepNumber n={2} /> Hasil prediksi
          </CardTitle>
          <CardDescription>Peluang softmax untuk 5 huruf teratas.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ResultPanel result={result} loading={loading} onAddLetter={addLetter} />
        </CardContent>
      </Card>

      {/* Step 3 — word builder */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StepNumber n={3} /> Rangkai kata
          </CardTitle>
          <CardDescription>
            Gabungkan huruf hasil deteksi menjadi kata, lalu dengarkan atau salin untuk berkomunikasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WordBuilder text={text} setText={setText} />
        </CardContent>
      </Card>
    </div>
  )
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
      {n}
    </span>
  )
}
