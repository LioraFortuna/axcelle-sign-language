# Isyarat — Pengenalan Bahasa Isyarat Alfabet dengan CNN

Proyek UTS mata kuliah **Pembelajaran Mendalam**, Semester Ganjil TA. 2026-2027 — **Kelompok Axcelle**.

Website ini mengenali huruf alfabet bahasa isyarat (ASL, 24 huruf statis A–Y tanpa J dan Z) dari foto tangan. Model CNN dijalankan **langsung di browser** dengan TensorFlow.js, sehingga foto tidak dikirim ke server.

| NIM | Nama |
|---|---|
| 231110962 | Franscesco |
| 231110626 | Stephanie |
| 231112281 | Sarah Cicilia |
| 231112680 | Vanessa |
| 231111763 | Liora Fortuna Tania |

## Ringkasan

- **Dataset:** [Sign Language MNIST](https://www.kaggle.com/datasets/datamunge/sign-language-mnist) — 27.455 citra train + 7.172 citra test, 28 × 28 grayscale, 24 kelas.
- **Model:** CNN dari nol (3 blok Conv2D 32-64-128 + BatchNorm + Dropout, Global Average Pooling, Dense 128, softmax 24 kelas), 112.952 parameter, augmentasi sebagai layer di dalam model.
- **Pelatihan:** Adam (lr 0,001), batch 128, maks. 40 epoch, categorical cross-entropy, EarlyStopping + ReduceLROnPlateau.
- **Fitur unik:** (1) confidence threshold untuk menolak input di luar domain (diuji dengan Fashion-MNIST dan noise), (2) Grad-CAM untuk menjelaskan area citra yang dipakai model (dibuktikan dengan uji oklusi).
- **Hasil evaluasi:** lihat notebook di `training/` dan laporan teknis. Semua angka berasal dari satu kali run notebook yang sama.

## Struktur repositori

```
training/Axcelle_ASL_CNN.ipynb   Notebook lengkap: EDA, preprocessing, model, evaluasi, fitur unik, ekspor
public/model/                    Model TensorFlow.js hasil ekspor notebook (model.json + bobot)
src/data/training-results.ts     Riwayat training dan akurasi (ditulis otomatis oleh notebook)
src/lib/preprocess.ts            Preprocessing foto di browser: crop tangan → 28×28 → grayscale → autokontras → [0,1]
src/lib/predict.ts               Memuat model TF.js dan menjalankan prediksi top-5
src/lib/model-info.ts            Informasi dataset dan arsitektur yang ditampilkan di halaman Model
src/app/                         Halaman: beranda, /deteksi, /alfabet, /model
```

## Menjalankan notebook

1. Buka `training/Axcelle_ASL_CNN.ipynb` di Google Colab (Runtime → GPU T4).
2. Jalankan semua sel. Dataset diunduh otomatis dengan `kagglehub`.
3. Sel terakhir menghasilkan `hasil_axcelle.zip` berisi model (`.keras`, `.tflite`, TF.js), grafik, dan tabel hasil.
4. Salin `web/model/*` ke `public/model/` dan `web/training-results.ts` ke `src/data/`.

## Menjalankan website secara lokal

Butuh Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # build produksi
```

## Teknologi

Python 3.13, TensorFlow 2.21 (tf_keras), NumPy, Pandas, scikit-learn, Matplotlib, Seaborn, Pillow · Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, TensorFlow.js 4.22 · Google Colab (GPU T4), Vercel.
