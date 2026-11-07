export type Preprocessed = {
  /** 784 grayscale values in [0, 1], row-major — the CNN input */
  pixels: Float32Array
  /** 28×28 preview as data URL (render with image-rendering: pixelated) */
  previewUrl: string
}

const SIZE = 28
const WORK = 512 // sisi terpanjang citra kerja sebelum dipotong

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

type Src = CanvasImageSource & { width: number; height: number }

function gray(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

/** Gambar sumber utuh (tanpa crop) pada resolusi kerja, ukuran asli dipertahankan proporsinya. */
function toWorkCanvas(source: Src): HTMLCanvasElement {
  const w = "videoWidth" in source ? (source as HTMLVideoElement).videoWidth : source.width
  const h = "videoHeight" in source ? (source as HTMLVideoElement).videoHeight : source.height
  const k = Math.min(1, WORK / Math.max(w, h))
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(w * k))
  canvas.height = Math.max(1, Math.round(h * k))
  const ctx = canvas.getContext("2d")!
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas
}

/**
 * Potong rapat di sekitar tangan, meniru citra Sign Language MNIST (potongan ketat di sekitar tangan).
 * Latar diperkirakan dari median piksel tepi; piksel yang berbeda jauh dari latar dianggap tangan.
 * Bar/bingkai di tepi foto (mis. footer watermark stok foto) dibuang dulu agar tidak dianggap tangan.
 * Bila hasilnya tidak masuk akal (latar ramai / tangan tidak terdeteksi), kembali ke crop persegi di tengah.
 */
function cropAroundHand(work: HTMLCanvasElement): HTMLCanvasElement {
  const w = work.width
  const h = work.height
  const data = work.getContext("2d")!.getImageData(0, 0, w, h).data
  const g = new Float32Array(w * h)
  for (let i = 0; i < g.length; i++) g[i] = gray(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])

  // latar = median piksel di bingkai tepi
  const border: number[] = []
  for (let x = 0; x < w; x++) border.push(g[x], g[(h - 1) * w + x])
  for (let y = 0; y < h; y++) border.push(g[y * w], g[y * w + w - 1])
  border.sort((a, b) => a - b)
  const bg = border[border.length >> 1]

  const THRESH = 18
  const mask = new Uint8Array(w * h)
  for (let i = 0; i < mask.length; i++) mask[i] = Math.abs(g[i] - bg) > THRESH ? 1 : 0

  // buang baris/kolom di tepi yang hampir seluruhnya "foreground" (bar footer, bingkai), maksimal 15% per sisi
  const rowFrac = (y: number) => {
    let n = 0
    for (let x = 0; x < w; x++) n += mask[y * w + x]
    return n / w
  }
  const colFrac = (x: number) => {
    let n = 0
    for (let y = 0; y < h; y++) n += mask[y * w + x]
    return n / h
  }
  const clearRow = (y: number) => mask.fill(0, y * w, y * w + w)
  const clearCol = (x: number) => {
    for (let y = 0; y < h; y++) mask[y * w + x] = 0
  }
  const BAR = 0.6
  const maxR = Math.floor(h * 0.15)
  const maxC = Math.floor(w * 0.15)
  for (let n = 0; n < maxR && rowFrac(h - 1 - n) > BAR; n++) clearRow(h - 1 - n)
  for (let n = 0; n < maxR && rowFrac(n) > BAR; n++) clearRow(n)
  for (let n = 0; n < maxC && colFrac(w - 1 - n) > BAR; n++) clearCol(w - 1 - n)
  for (let n = 0; n < maxC && colFrac(n) > BAR; n++) clearCol(n)

  const MIN_FRAC = 0.05 // baris/kolom dihitung "berisi tangan" bila >5% pikselnya foreground
  const colCount = new Uint32Array(w)
  const rowCount = new Uint32Array(h)
  let fg = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x]) {
        colCount[x]++
        rowCount[y]++
        fg++
      }
    }
  }
  const fgFrac = fg / (w * h)

  const first = (arr: Uint32Array, min: number) => arr.findIndex((v) => v > min)
  const last = (arr: Uint32Array, min: number) => {
    for (let i = arr.length - 1; i >= 0; i--) if (arr[i] > min) return i
    return -1
  }
  const x0 = first(colCount, h * MIN_FRAC)
  const x1 = last(colCount, h * MIN_FRAC)
  const y0 = first(rowCount, w * MIN_FRAC)
  const y1 = last(rowCount, w * MIN_FRAC)

  let cx: number, cy: number, side: number
  if (fgFrac < 0.03 || fgFrac > 0.75 || x0 < 0 || y0 < 0 || x1 <= x0 || y1 <= y0) {
    // cadangan: persegi di tengah
    side = Math.min(w, h)
    cx = w / 2
    cy = h / 2
  } else {
    side = Math.max(x1 - x0, y1 - y0) * 1.2 // margin 10% tiap sisi
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
  }

  // area di luar foto diisi warna latar (bukan hitam) agar autokontras tidak terganggu
  const out = document.createElement("canvas")
  out.width = out.height = Math.max(2, Math.round(side))
  const ctx = out.getContext("2d")!
  ctx.fillStyle = `rgb(${Math.round(bg)},${Math.round(bg)},${Math.round(bg)})`
  ctx.fillRect(0, 0, out.width, out.height)
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(work, Math.round(side / 2 - cx), Math.round(side / 2 - cy))
  return out
}

/** Perkecil bertahap (÷2) agar tidak terjadi aliasing saat foto besar langsung diubah ke 28×28. */
function downscale(src: HTMLCanvasElement): HTMLCanvasElement {
  let cur = src
  while (cur.width > SIZE * 2) {
    const next = document.createElement("canvas")
    next.width = next.height = Math.max(SIZE, Math.floor(cur.width / 2))
    const ctx = next.getContext("2d")!
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(cur, 0, 0, next.width, next.height)
    cur = next
  }
  const fin = document.createElement("canvas")
  fin.width = fin.height = SIZE
  const ctx = fin.getContext("2d", { willReadFrequently: true })!
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(cur, 0, 0, SIZE, SIZE)
  return fin
}

/**
 * Foto → input CNN, sejalan dengan preprocess_photo() di notebook:
 * potong rapat di sekitar tangan → perkecil bertahap ke 28×28 → grayscale → autokontras → normalisasi [0, 1].
 */
export function preprocess(source: Src): Preprocessed {
  const canvas = downscale(cropAroundHand(toWorkCanvas(source)))
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!
  const img = ctx.getImageData(0, 0, SIZE, SIZE)

  const vals = new Float32Array(SIZE * SIZE)
  for (let i = 0; i < vals.length; i++) {
    vals[i] = gray(img.data[i * 4], img.data[i * 4 + 1], img.data[i * 4 + 2])
  }

  // autokontras: regangkan persentil 1–99 ke 0–255 (seperti ImageOps.autocontrast di notebook)
  const sorted = Array.from(vals).sort((a, b) => a - b)
  const lo = sorted[Math.floor(sorted.length * 0.01)]
  const hi = sorted[Math.ceil(sorted.length * 0.99) - 1]
  const range = Math.max(hi - lo, 1)

  const pixels = new Float32Array(SIZE * SIZE)
  for (let i = 0; i < pixels.length; i++) {
    const v = Math.min(1, Math.max(0, (vals[i] - lo) / range))
    pixels[i] = v
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = Math.round(v * 255)
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)

  return { pixels, previewUrl: canvas.toDataURL("image/png") }
}

/** Square-cropped full-resolution snapshot, used as the visible preview */
export function squareSnapshot(video: HTMLVideoElement, mirror: boolean): string {
  const side = Math.min(video.videoWidth, video.videoHeight)
  const canvas = document.createElement("canvas")
  canvas.width = side
  canvas.height = side
  const ctx = canvas.getContext("2d")!
  if (mirror) {
    ctx.translate(side, 0)
    ctx.scale(-1, 1)
  }
  ctx.drawImage(
    video,
    (video.videoWidth - side) / 2,
    (video.videoHeight - side) / 2,
    side,
    side,
    0,
    0,
    side,
    side
  )
  return canvas.toDataURL("image/jpeg", 0.92)
}
