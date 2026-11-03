import { CLASSES } from "@/lib/alphabet"

export type Prediction = { char: string; probability: number }

export type PredictResult = {
  top: Prediction[]
  inferenceMs: number
  mock: boolean
}

/**
 * MOCK — returns a plausible softmax distribution derived from the pixels so the
 * same image always gives the same answer. Replace with a real call, e.g.:
 *   - TensorFlow.js: tf.loadLayersModel("/model/model.json") → model.predict(...)
 *   - API route:     fetch("/api/predict", { method: "POST", body: pixels })
 */
export async function predict(pixels: Float32Array): Promise<PredictResult> {
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
    .slice(0, 5)

  return { top, inferenceMs: Math.round(performance.now() - start), mock: true }
}
