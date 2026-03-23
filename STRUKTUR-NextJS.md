# Struktur Direktori Proyek HiFinance TMA

Berikut adalah struktur utama direktori dan file dari proyek HiFinance TMA secara keseluruhan:

```text
hifinance-tma/
├── app/                  # Direktori utama Next.js App Router
│   ├── (admin)/          # Rute Group: Dashboard Admin Desktop
│   │   └── admin/page.tsx
│   ├── (tma)/            # Rute Group: Telegram Mini App
│   │   ├── page.tsx      # Dashboard Utama (Overview Saldo & Kategori)
│   │   └── transactions/
│   │       └── page.tsx  # Halaman List Transaksi History
│   ├── home/             # Rute Landing Page Baru
│   │   └── page.tsx      # Entry point utama dengan Layout Modern
│   ├── api/              # API Routes Next.js untuk integrasi BE
│   │   ├── export/route.ts
│   │   ├── summary/route.ts
│   │   └── transactions/route.ts
│   ├── globals.css       # Tailwind CSS V4 Konfigurasi Utama
│   └── layout.tsx        # Root HTML Layout dan Global Providers
│
├── components/           # Kumpulan React Komponen
│   ├── BalanceCard.tsx   # Card Saldo Pemasukan & Pengeluaran
│   ├── BottomNav.tsx     # Navigasi Bawah khusus TMA Mobile
│   ├── CategoryChart.tsx # Recharts Visualisasi Kategori Pengeluaran
│   ├── ExportButton.tsx  # Tombol Donwload & Ekspor XLS/PDF
│   ├── Sidebar.tsx       # Sidebar Menu untuk akses Admin Desktop
│   ├── ThemeProvider.tsx # Wrapper Tema Gelap/Terang
│   ├── ThemeToggle.tsx   # Switcher Tema manual
│   ├── TransactionList.tsx # List data transaksi terbaru
│   ├── ui/               # Reusable Components (Shadcn)
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── landing/          # Komponen penyusun halaman Home/Landing
│       ├── BentoGrid.tsx # Penampil Fitur-fitur Inti
│       ├── FAQ.tsx       # Sesi Pertanyaan yang Sering Diajukan
│       ├── Footer.tsx    # Kaki Halaman (Sitemap, Legal)
│       ├── Hero.tsx      # Sesi Pembuka (Mockup 3D & Typografi)
│       └── Navbar.tsx    # Header & Navigasi Sticky
│
├── database/             # Skema & Migrasi SQL 
│   └── migrations/
│       ├── 001_initial.sql
│       ├── 002_create_users.sql
│       └── ...
│
├── lib/                  # Helper fungsi dan Konfigurasi Eksternal
│   ├── supabase.ts       # Konfigurasi klien Supabase
│   ├── types.ts          # Typscript Interfaces (Summary, Transaction)
│   ├── utils.ts          # Kelas Util (cn untuk className)
│   └── validate-init-data.ts # Validasi Auth Telegram TMA
│
├── public/               # Resource Static (SVG, ICO, Foto)
├── proxy.ts              # Script Proxy Server
├── next.config.ts        # Konfigurasi framework Next.js
├── package.json          # Dependencies proyek (Next, React, Framer, dll.)
├── postcss.config.mjs    # PostCSS dan Konfigurasi Tailwind V4
└── tsconfig.json         # Aturan dan kompilasi TypeScript
```

### 💡 Catatan Tambahan
1. **Pembaruan Desain Home:** File landing/marketing dipecah ke dalam folder `components/landing` yang dipanggil pada route baru `app/home/page.tsx`
2. **Modular Components:** File di `components/` luar seperti `BalanceCard` & `CategoryChart` saat ini berbagi styling global warna Aqua/Yellow (Dark Mode base).
