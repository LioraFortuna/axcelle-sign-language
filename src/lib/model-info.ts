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

/** Arsitektur model inferensi, identik dengan model.summary() pada notebook (tanpa layer augmentasi saat inferensi). */
export const LAYERS: Layer[] = [
  { name: "Input", detail: "Citra grayscale dinormalisasi ke [0, 1]", output: "28×28×1", params: 0, kind: "input" },
  { name: "Data Augmentation", detail: "Rotasi ±18°, zoom 10%, geser 10%, kontras 15% (hanya saat training)", output: "28×28×1", params: 0, kind: "aug" },
  { name: "Conv2D", detail: "32 filter 3×3, padding same, tanpa bias (diikuti BatchNorm)", output: "28×28×32", params: 288, kind: "conv" },
  { name: "BatchNormalization + ReLU", detail: "Menstabilkan distribusi aktivasi, lalu ReLU", output: "28×28×32", params: 128, kind: "norm" },
  { name: "MaxPooling2D", detail: "Pool 2×2", output: "14×14×32", params: 0, kind: "pool" },
  { name: "Dropout", detail: "rate 0.2", output: "14×14×32", params: 0, kind: "drop" },
  { name: "Conv2D", detail: "64 filter 3×3, padding same, tanpa bias", output: "14×14×64", params: 18432, kind: "conv" },
  { name: "BatchNormalization + ReLU", detail: "", output: "14×14×64", params: 256, kind: "norm" },
  { name: "MaxPooling2D", detail: "Pool 2×2", output: "7×7×64", params: 0, kind: "pool" },
  { name: "Dropout", detail: "rate 0.2", output: "7×7×64", params: 0, kind: "drop" },
  { name: "Conv2D", detail: "128 filter 3×3, padding same, tanpa bias", output: "7×7×128", params: 73728, kind: "conv" },
  { name: "BatchNormalization + ReLU", detail: "", output: "7×7×128", params: 512, kind: "norm" },
  { name: "GlobalAveragePooling2D", detail: "Rata-rata tiap peta fitur", output: "128", params: 0, kind: "flat" },
  { name: "Dense", detail: "128 unit, ReLU", output: "128", params: 16512, kind: "dense" },
  { name: "Dropout", detail: "rate 0.4", output: "128", params: 0, kind: "drop" },
  { name: "Dense (Output)", detail: "24 unit, Softmax", output: "24", params: 3096, kind: "out" },
]

export const TOTAL_PARAMS = LAYERS.reduce((s, l) => s + l.params, 0)

export const TRAINING_CONFIG = [
  { label: "Loss", value: "Categorical Cross-Entropy" },
  { label: "Optimizer", value: "Adam (lr 0.001, ReduceLROnPlateau ×0.5)" },
  { label: "Metrik", value: "Accuracy" },
  { label: "Batch size", value: "128" },
  { label: "Epoch", value: "maks. 40 (early stopping, patience 8)" },
  { label: "Label", value: "One-hot, 24 kelas" },
]
