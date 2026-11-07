import type { LayersModel, Tensor } from "@tensorflow/tfjs"
import { CLASSES } from "@/lib/alphabet"

export type Prediction = { char: string; probability: number }

export type PredictResult = {
  top: Prediction[]
  inferenceMs: number
  /** true = model asli tidak ditemukan, hasil hanyalah simulasi */
  mock: boolean
}

/** Hasil konversi training/train_sign_language_cnn.ipynb, salin folder `model/` ke public/model/ */
const MODEL_URL = "/model/model.json"
const TOP_K = 5

let modelPromise: Promise<LayersModel | null> | null = null

/** Memuat model TensorFlow.js sekali saja (di-cache). Mengembalikan null bila file model belum ada. */
export function loadModel(): Promise<LayersModel | null> {
  if (!modelPromise) {
    modelPromise = (async () => {
      try {
        const tf = await import("@tensorflow/tfjs")
        await tf.ready()
        const model = await tf.loadLayersModel(MODEL_URL)
        // Pemanasan: inferensi pertama lambat karena kompilasi shader WebGL
        tf.tidy(() => {
          model.predict(tf.zeros([1, 28, 28, 1]))
        })
        return model
      } catch (err) {
        console.warn("[predict] Model tidak dapat dimuat, memakai mode demo:", err)
        modelPromise = null // coba lagi pada pemanggilan berikutnya
        return null
      }
    })()
  }
  return modelPromise
}

/** Panggil saat halaman deteksi dibuka agar klik pertama terasa cepat */
export function preloadModel() {
  void loadModel()
}

/**
 * Klasifikasi citra 28×28 grayscale (784 nilai [0,1], row-major) memakai CNN di browser.
 * Urutan output model = urutan CLASSES (A–Y tanpa J).
 */
export async function predict(pixels: Float32Array): Promise<PredictResult> {
  const model = await loadModel()
  if (!model) return mockPredict(pixels)

  const tf = await import("@tensorflow/tfjs")
  const start = performance.now()
  const input = tf.tensor4d(pixels, [1, 28, 28, 1])
  const output = model.predict(input) as Tensor
  try {
    const probs = (await output.data()) as Float32Array
    if (probs.length !== CLASSES.length) {
      throw new Error(`Output model ${probs.length} kelas, seharusnya ${CLASSES.length}`)
    }
    const top = CLASSES.map((c, i) => ({ char: c.char, probability: probs[i] }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, TOP_K)
    return { top, inferenceMs: Math.round(performance.now() - start), mock: false }
  } finally {
    input.dispose()
    output.dispose()
  }
}

/** Simulasi deterministik, hanya dipakai bila model belum dipasang (UI menampilkan label "Mode demo"). */
async function mockPredict(pixels: Float32Array): Promise<PredictResult> {
  const start = performance.now()
  await new Promise((r) => setTimeout(r, 700))

  let seed = 0
  for (let i = 0; i < pixels.length; i += 7) seed = (seed * 31 + Math.round(pixels[i] * 255)) >>> 0
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 2 ** 32
  }

  const winner = Math.floor(rand() * CLASSES.length)
  const logits = CLASSES.map((_, i) => (i === winner ? 6 + rand() * 3 : rand() * 4))
  const max = Math.max(...logits)
  const exps = logits.map((l) => Math.exp(l - max))
  const sum = exps.reduce((a, b) => a + b, 0)

  const top = CLASSES.map((c, i) => ({ char: c.char, probability: exps[i] / sum }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, TOP_K)

  return { top, inferenceMs: Math.round(performance.now() - start), mock: true }
}
