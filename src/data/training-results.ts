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
  "testAccuracy": 0.981,
  "testLoss": 0.0591,
  "valAccuracy": 0.9949,
  "epochs": 33,
  "history": [
    {
      "epoch": 1,
      "acc": 0.2256,
      "valAcc": 0.0716,
      "loss": 2.5133,
      "valLoss": 4.7771
    },
    {
      "epoch": 2,
      "acc": 0.467,
      "valAcc": 0.0675,
      "loss": 1.5601,
      "valLoss": 5.145
    },
    {
      "epoch": 3,
      "acc": 0.6164,
      "valAcc": 0.4105,
      "loss": 1.1161,
      "valLoss": 1.7106
    },
    {
      "epoch": 4,
      "acc": 0.7068,
      "valAcc": 0.4812,
      "loss": 0.8527,
      "valLoss": 1.7528
    },
    {
      "epoch": 5,
      "acc": 0.7701,
      "valAcc": 0.3489,
      "loss": 0.6764,
      "valLoss": 3.5454
    },
    {
      "epoch": 6,
      "acc": 0.8121,
      "valAcc": 0.8954,
      "loss": 0.5599,
      "valLoss": 0.3181
    },
    {
      "epoch": 7,
      "acc": 0.8444,
      "valAcc": 0.8046,
      "loss": 0.469,
      "valLoss": 0.505
    },
    {
      "epoch": 8,
      "acc": 0.8679,
      "valAcc": 0.471,
      "loss": 0.403,
      "valLoss": 2.1899
    },
    {
      "epoch": 9,
      "acc": 0.8873,
      "valAcc": 0.6215,
      "loss": 0.3493,
      "valLoss": 1.4521
    },
    {
      "epoch": 10,
      "acc": 0.9099,
      "valAcc": 0.9318,
      "loss": 0.2856,
      "valLoss": 0.1931
    },
    {
      "epoch": 11,
      "acc": 0.9137,
      "valAcc": 0.8407,
      "loss": 0.2687,
      "valLoss": 0.3745
    },
    {
      "epoch": 12,
      "acc": 0.9218,
      "valAcc": 0.9279,
      "loss": 0.2507,
      "valLoss": 0.1982
    },
    {
      "epoch": 13,
      "acc": 0.9275,
      "valAcc": 0.9029,
      "loss": 0.2314,
      "valLoss": 0.2444
    },
    {
      "epoch": 14,
      "acc": 0.9389,
      "valAcc": 0.8988,
      "loss": 0.2044,
      "valLoss": 0.2544
    },
    {
      "epoch": 15,
      "acc": 0.9411,
      "valAcc": 0.8631,
      "loss": 0.1977,
      "valLoss": 0.3477
    },
    {
      "epoch": 16,
      "acc": 0.9424,
      "valAcc": 0.933,
      "loss": 0.1911,
      "valLoss": 0.1722
    },
    {
      "epoch": 17,
      "acc": 0.9457,
      "valAcc": 0.9388,
      "loss": 0.1836,
      "valLoss": 0.1503
    },
    {
      "epoch": 18,
      "acc": 0.9472,
      "valAcc": 0.8657,
      "loss": 0.1751,
      "valLoss": 0.3772
    },
    {
      "epoch": 19,
      "acc": 0.9487,
      "valAcc": 0.9206,
      "loss": 0.1737,
      "valLoss": 0.2004
    },
    {
      "epoch": 20,
      "acc": 0.9474,
      "valAcc": 0.9587,
      "loss": 0.1696,
      "valLoss": 0.1165
    },
    {
      "epoch": 21,
      "acc": 0.9516,
      "valAcc": 0.8524,
      "loss": 0.1634,
      "valLoss": 0.4151
    },
    {
      "epoch": 22,
      "acc": 0.9525,
      "valAcc": 0.9704,
      "loss": 0.1593,
      "valLoss": 0.0853
    },
    {
      "epoch": 23,
      "acc": 0.958,
      "valAcc": 0.9898,
      "loss": 0.1504,
      "valLoss": 0.0358
    },
    {
      "epoch": 24,
      "acc": 0.9556,
      "valAcc": 0.9835,
      "loss": 0.1493,
      "valLoss": 0.0481
    },
    {
      "epoch": 25,
      "acc": 0.9573,
      "valAcc": 0.9949,
      "loss": 0.1433,
      "valLoss": 0.0296
    },
    {
      "epoch": 26,
      "acc": 0.9577,
      "valAcc": 0.9772,
      "loss": 0.1413,
      "valLoss": 0.0628
    },
    {
      "epoch": 27,
      "acc": 0.9609,
      "valAcc": 0.9218,
      "loss": 0.1314,
      "valLoss": 0.2086
    },
    {
      "epoch": 28,
      "acc": 0.9626,
      "valAcc": 0.9456,
      "loss": 0.1333,
      "valLoss": 0.1352
    },
    {
      "epoch": 29,
      "acc": 0.967,
      "valAcc": 0.9422,
      "loss": 0.1197,
      "valLoss": 0.1381
    },
    {
      "epoch": 30,
      "acc": 0.9672,
      "valAcc": 0.9124,
      "loss": 0.1148,
      "valLoss": 0.2371
    },
    {
      "epoch": 31,
      "acc": 0.9654,
      "valAcc": 0.9886,
      "loss": 0.1175,
      "valLoss": 0.0381
    },
    {
      "epoch": 32,
      "acc": 0.9676,
      "valAcc": 0.9767,
      "loss": 0.1126,
      "valLoss": 0.0557
    },
    {
      "epoch": 33,
      "acc": 0.9669,
      "valAcc": 0.9735,
      "loss": 0.1124,
      "valLoss": 0.0637
    }
  ]
}
