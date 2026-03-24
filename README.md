# HiFinance Telegram Mini App (TMA)

Ini adalah komponen frontend web untuk HiFinance, yang berfungsi sebagai Dashboard interaktif bagi pengguna di dalam Telegram (Mini App) serta Landing Page publik.

## 🚀 Teknologi yang Digunakan
- **Next.js 16 (App Router)**: Framework React full-stack terbaru.
- **React 19**: Library UI dengan fitur Concurrent Rendering.
- **Tailwind CSS v4 & CSS Variables**: Sistem styling yang sangat teroptimasi dengan dukungan tema gelap/terang secara native.
- **Framer Motion**: Library untuk animasi premium dan transisi halus.
- **Recharts**: Library grafik untuk visualisasi pengeluaran bulanan.
- **Supabase JS SDK**: Berinteraksi dengan database untuk mengambil riwayat transaksi.
- **Telegram Apps SDK**: Integrasi mendalam dengan antarmuka Telegram (ThemeParams, InitData, Haptic Feedback).

## 📁 Struktur Proyek & Penjelasan File

### 1. `app/` (Next.js App Router)
Menggunakan fitur **Route Groups** untuk memisahkan logika layout:
- `layout.tsx`: Root layout utama yang menangani font (Plus Jakarta Sans) dan metadata dasar.
- `globals.css`: Definisi token desain (warna, spacing, animasi) untuk tema Dark dan Light.
- **`(tma)/`**: Folder khusus untuk antarmuka dalam Telegram.
  - `layout.tsx`: Menyuntikkan SDK Telegram, mengatur lebar maksimal mobile (390px), dan memuat `BottomNav`.
  - `page.tsx`: Dashboard utama yang memanggil komponen `DashboardUI`.
- **`home/`**: Landing Page publik.
  - `page.tsx`: Berisi section Hero, Features (Bento Grid), FAQ, dan Footer. Memiliki gaya desain yang berbeda dari dashboard.
- **`(admin)/`**: Antarmuka dashboard admin desktop-first.
- **`api/`**: API Route Handlers (Back-end)
  - `summary/`: Mengambil agregasi data untuk grafik dashboard.
  - `transactions/`: Mengambil list riwayat transaksi.
  - `export/`: Menghasilkan file Excel (.xlsx) untuk diunduh pengguna.
  - `settings/`: Mengelola preferensi pengguna (bujet, limit).

### 2. `components/`
- `DashboardUI.tsx`: Komponen utama dashboard. Mengatur *state* loading, error, dan pengambilan data dari API.
- `BalanceCard.tsx`: Menampilkan saldo total, pemasukan, dan pengeluaran dengan visual yang premium.
- `CategoryChart.tsx`: Visualisasi pengeluaran per kategori menggunakan Pie Chart yang interaktif.
- `TransactionList.tsx`: Komponen untuk menampilkan daftar transaksi terbaru dengan ikon kategori.
- `landing/`: Sub-folder berisi komponen khusus landing page (BentoGrid, Hero, FAQ, Footer, Navbar).
- `ui/`: Komponen dasar yang *reusable* (Button, Input, Card, dll).

### 3. `lib/` (Core Logic)
- `supabase.ts`: Inisialisasi klien Supabase dengan *Service Role Key* untuk operasi server-side yang aman.
- `validate-init-data.ts`: Logika keamanan kritis untuk memvalidasi `initData` Telegram menggunakan HMAC-SHA256 agar data tidak bisa dipalsukan.
- `health-logic.ts`: Algoritma perhitungan skor kesehatan keuangan berdasarkan rasio pengeluaran terhadap pendapatan.

## 🛡️ Keamanan & Validasi
Setiap permintaan data dari frontend ke API Route melalui mekanisme validasi:
1. Frontend mengirim `initData` dari Telegram.
2. Back-end (`lib/validate-init-data.ts`) melakukan verifikasi tanda tangan digital menggunakan `TELEGRAM_BOT_TOKEN`.
3. Jika valid, sistem baru akan melakukan query ke Supabase berdasarkan `user_id` yang terverifikasi.

## 🛠️ Pengembangan & Build

1. Instal dependensi:
   ```bash
   npm install
   ```
2. Jalankan mode pengembangan:
   ```bash
   npm run dev
   ```
3. Build untuk produksi:
   ```bash
   npm run build
   ```
