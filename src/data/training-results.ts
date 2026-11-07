/**
 * Dihasilkan otomatis oleh notebook (bagian 12). Timpa file ini setelah menjalankan ulang notebook.
 */
export type TrainingResults = {
  testAccuracy: number // 0-1
  testLoss: number
  valAccuracy: number // 0-1
  epochs: number
  history: { epoch: number; acc: number; valAcc: number; loss: number; valLoss: number }[]
}

export const TRAINING_RESULTS: TrainingResults | null = {
  "testAccuracy": 0.9823,
  "testLoss": 0.0535,
  "valAccuracy": 0.9908,
  "epochs": 40,
  "history": [
    {
      "epoch": 1,
      "acc": 0.2228,
      "valAcc": 0.0544,
      "loss": 2.5185,
      "valLoss": 4.8316
    },
    {
      "epoch": 2,
      "acc": 0.463,
      "valAcc": 0.0651,
      "loss": 1.5743,
      "valLoss": 5.3013
    },
    {
      "epoch": 3,
      "acc": 0.6155,
      "valAcc": 0.4173,
      "loss": 1.1219,
      "valLoss": 1.6956
    },
    {
      "epoch": 4,
      "acc": 0.702,
      "valAcc": 0.5178,
      "loss": 0.8644,
      "valLoss": 1.4908
    },
    {
      "epoch": 5,
      "acc": 0.7707,
      "valAcc": 0.304,
      "loss": 0.6789,
      "valLoss": 4.5042
    },
    {
      "epoch": 6,
      "acc": 0.8084,
      "valAcc": 0.8463,
      "loss": 0.5683,
      "valLoss": 0.4341
    },
    {
      "epoch": 7,
      "acc": 0.8421,
      "valAcc": 0.6992,
      "loss": 0.4737,
      "valLoss": 0.9397
    },
    {
      "epoch": 8,
      "acc": 0.8685,
      "valAcc": 0.4817,
      "loss": 0.403,
      "valLoss": 2.4259
    },
    {
      "epoch": 9,
      "acc": 0.8873,
      "valAcc": 0.5882,
      "loss": 0.3458,
      "valLoss": 1.6057
    },
    {
      "epoch": 10,
      "acc": 0.9083,
      "valAcc": 0.9126,
      "loss": 0.2873,
      "valLoss": 0.2341
    },
    {
      "epoch": 11,
      "acc": 0.9162,
      "valAcc": 0.8109,
      "loss": 0.2677,
      "valLoss": 0.4813
    },
    {
      "epoch": 12,
      "acc": 0.9224,
      "valAcc": 0.9667,
      "loss": 0.2472,
      "valLoss": 0.1118
    },
    {
      "epoch": 13,
      "acc": 0.929,
      "valAcc": 0.9109,
      "loss": 0.2287,
      "valLoss": 0.2274
    },
    {
      "epoch": 14,
      "acc": 0.9359,
      "valAcc": 0.8682,
      "loss": 0.2115,
      "valLoss": 0.3526
    },
    {
      "epoch": 15,
      "acc": 0.9385,
      "valAcc": 0.8801,
      "loss": 0.2029,
      "valLoss": 0.2974
    },
    {
      "epoch": 16,
      "acc": 0.9445,
      "valAcc": 0.933,
      "loss": 0.1805,
      "valLoss": 0.1739
    },
    {
      "epoch": 17,
      "acc": 0.9484,
      "valAcc": 0.9507,
      "loss": 0.1713,
      "valLoss": 0.1224
    },
    {
      "epoch": 18,
      "acc": 0.9517,
      "valAcc": 0.9167,
      "loss": 0.1651,
      "valLoss": 0.2012
    },
    {
      "epoch": 19,
      "acc": 0.9535,
      "valAcc": 0.9675,
      "loss": 0.1611,
      "valLoss": 0.0885
    },
    {
      "epoch": 20,
      "acc": 0.9519,
      "valAcc": 0.9808,
      "loss": 0.1565,
      "valLoss": 0.0632
    },
    {
      "epoch": 21,
      "acc": 0.9539,
      "valAcc": 0.9442,
      "loss": 0.1523,
      "valLoss": 0.1365
    },
    {
      "epoch": 22,
      "acc": 0.9547,
      "valAcc": 0.9563,
      "loss": 0.1516,
      "valLoss": 0.1064
    },
    {
      "epoch": 23,
      "acc": 0.9568,
      "valAcc": 0.9869,
      "loss": 0.1445,
      "valLoss": 0.0442
    },
    {
      "epoch": 24,
      "acc": 0.9581,
      "valAcc": 0.9784,
      "loss": 0.145,
      "valLoss": 0.0616
    },
    {
      "epoch": 25,
      "acc": 0.9583,
      "valAcc": 0.984,
      "loss": 0.1419,
      "valLoss": 0.0518
    },
    {
      "epoch": 26,
      "acc": 0.9576,
      "valAcc": 0.9857,
      "loss": 0.1409,
      "valLoss": 0.0429
    },
    {
      "epoch": 27,
      "acc": 0.9605,
      "valAcc": 0.974,
      "loss": 0.1332,
      "valLoss": 0.0689
    },
    {
      "epoch": 28,
      "acc": 0.9608,
      "valAcc": 0.9777,
      "loss": 0.1349,
      "valLoss": 0.0631
    },
    {
      "epoch": 29,
      "acc": 0.9633,
      "valAcc": 0.9876,
      "loss": 0.1299,
      "valLoss": 0.0414
    },
    {
      "epoch": 30,
      "acc": 0.9637,
      "valAcc": 0.8983,
      "loss": 0.125,
      "valLoss": 0.3043
    },
    {
      "epoch": 31,
      "acc": 0.9611,
      "valAcc": 0.983,
      "loss": 0.1292,
      "valLoss": 0.0511
    },
    {
      "epoch": 32,
      "acc": 0.9648,
      "valAcc": 0.9765,
      "loss": 0.1238,
      "valLoss": 0.0594
    },
    {
      "epoch": 33,
      "acc": 0.9655,
      "valAcc": 0.9716,
      "loss": 0.1194,
      "valLoss": 0.0683
    },
    {
      "epoch": 34,
      "acc": 0.9679,
      "valAcc": 0.9842,
      "loss": 0.1128,
      "valLoss": 0.0413
    },
    {
      "epoch": 35,
      "acc": 0.9658,
      "valAcc": 0.9932,
      "loss": 0.1166,
      "valLoss": 0.0299
    },
    {
      "epoch": 36,
      "acc": 0.9665,
      "valAcc": 0.9791,
      "loss": 0.1165,
      "valLoss": 0.0481
    },
    {
      "epoch": 37,
      "acc": 0.968,
      "valAcc": 0.9881,
      "loss": 0.1117,
      "valLoss": 0.0344
    },
    {
      "epoch": 38,
      "acc": 0.9681,
      "valAcc": 0.9874,
      "loss": 0.1143,
      "valLoss": 0.0371
    },
    {
      "epoch": 39,
      "acc": 0.9671,
      "valAcc": 0.9823,
      "loss": 0.1139,
      "valLoss": 0.0475
    },
    {
      "epoch": 40,
      "acc": 0.9688,
      "valAcc": 0.9908,
      "loss": 0.1121,
      "valLoss": 0.0298
    }
  ]
}
