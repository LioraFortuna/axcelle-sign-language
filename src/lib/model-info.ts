export const DATASET = {
  name: "Sign Language MNIST",
  url: "https://www.kaggle.com/datasets/datamunge/sign-language-mnist",
  train: 27455,
  test: 7172,
  classes: 24,
  size: "28 × 28 px",
  channels: "Grayscale (1 kanal)",
}

export type Layer = {
  name: string
  detail: string
  output: string
  params: number
  kind: "input" | "aug" | "conv" | "norm" | "pool" | "drop" | "dense" | "flat" | "out"
}

/** Proposed architecture — update to match the trained Keras model.summary() */
export const LAYERS: Layer[] = [
  { name: "Input", detail: "Citra grayscale dinormalisasi ke [0, 1]", output: "28×28×1", params: 0, kind: "input" },
  { name: "Data Augmentation", detail: "Rotasi ±10°, zoom 10%, geser 10% (hanya saat training)", output: "28×28×1", params: 0, kind: "aug" },
  { name: "Conv2D", detail: "32 filter 3×3, ReLU, padding same", output: "28×28×32", params: 320, kind: "conv" },
  { name: "BatchNormalization", detail: "Menstabilkan distribusi aktivasi", output: "28×28×32", params: 128, kind: "norm" },
  { name: "MaxPooling2D", detail: "Pool 2×2", output: "14×14×32", params: 0, kind: "pool" },
  { name: "Conv2D", detail: "64 filter 3×3, ReLU, padding same", output: "14×14×64", params: 18496, kind: "conv" },
  { name: "BatchNormalization", detail: "", output: "14×14×64", params: 256, kind: "norm" },
  { name: "MaxPooling2D", detail: "Pool 2×2", output: "7×7×64", params: 0, kind: "pool" },
  { name: "Dropout", detail: "rate 0.2", output: "7×7×64", params: 0, kind: "drop" },
  { name: "Conv2D", detail: "128 filter 3×3, ReLU, padding same", output: "7×7×128", params: 73856, kind: "conv" },
  { name: "BatchNormalization", detail: "", output: "7×7×128", params: 512, kind: "norm" },
  { name: "MaxPooling2D", detail: "Pool 2×2", output: "3×3×128", params: 0, kind: "pool" },
  { name: "Flatten", detail: "", output: "1152", params: 0, kind: "flat" },
  { name: "Dense", detail: "256 unit, ReLU", output: "256", params: 295168, kind: "dense" },
  { name: "BatchNormalization", detail: "", output: "256", params: 1024, kind: "norm" },
  { name: "Dropout", detail: "rate 0.5", output: "256", params: 0, kind: "drop" },
  { name: "Dense (Output)", detail: "24 unit, Softmax", output: "24", params: 6168, kind: "out" },
]

export const TOTAL_PARAMS = LAYERS.reduce((s, l) => s + l.params, 0)

export const TRAINING_CONFIG = [
  { label: "Loss", value: "Categorical Cross-Entropy" },
  { label: "Optimizer", value: "Adam (lr 0.001)" },
  { label: "Metrik", value: "Accuracy" },
  { label: "Batch size", value: "128" },
  { label: "Epoch", value: "30 (early stopping)" },
  { label: "Label", value: "One-hot, 24 kelas" },
]
