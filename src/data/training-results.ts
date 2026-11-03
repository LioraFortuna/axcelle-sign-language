/**
 * Paste real results here after training the model.
 * While these are null, the UI shows an empty "waiting for results" state.
 */
export type TrainingResults = {
  testAccuracy: number // 0–1
  testLoss: number
  valAccuracy: number // 0–1
  epochs: number
  history: { epoch: number; acc: number; valAcc: number; loss: number; valLoss: number }[]
}

export const TRAINING_RESULTS: TrainingResults | null = null
