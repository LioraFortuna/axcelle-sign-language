export type Preprocessed = {
  /** 784 grayscale values in [0, 1], row-major — the CNN input */
  pixels: Float32Array
  /** 28×28 preview as data URL (render with image-rendering: pixelated) */
  previewUrl: string
}

const SIZE = 28

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Mirrors the Sign Language MNIST format:
 * center square crop → resize to 28×28 → grayscale → normalize to [0, 1].
 */
export function preprocess(source: CanvasImageSource & { width: number; height: number }): Preprocessed {
  const w = "videoWidth" in source ? (source as HTMLVideoElement).videoWidth : source.width
  const h = "videoHeight" in source ? (source as HTMLVideoElement).videoHeight : source.height
  const side = Math.min(w, h)
  const sx = (w - side) / 2
  const sy = (h - side) / 2

  const canvas = document.createElement("canvas")
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(source, sx, sy, side, side, 0, 0, SIZE, SIZE)

  const img = ctx.getImageData(0, 0, SIZE, SIZE)
  const pixels = new Float32Array(SIZE * SIZE)
  for (let i = 0; i < pixels.length; i++) {
    const r = img.data[i * 4]
    const g = img.data[i * 4 + 1]
    const b = img.data[i * 4 + 2]
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    pixels[i] = gray / 255
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = gray
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
