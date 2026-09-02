# Design System & UI/UX Guidelines - Posyandu Loa Duri Ulu

## 1. Design Philosophy
- **Mobile-First & Touch-Friendly**: Dirancang dengan memprioritaskan perangkat genggam (smartphone kader/warga di lapangan), dengan minimum tap target 44x44px.
- **Warm, Human, & Inclusive**: Warna yang menenangkan (Teal, Cyan, Green, Warm Neutral) memberikan kesan kesehatan yang ramah, profesional, dan mudah diakses masyarakat desa.
- **High Performance & Lightweight**: Aset visual teroptimasi WebP, micro-animations yang halus, rendering cepat tanpa lag.

---

## 2. Color Palette & Semantic Tokens

### Primary & Brand Colors
- **Primary Teal**: `#008080` / `rgb(0, 128, 128)` — Identitas utama Posyandu & Kesehatan.
- **Primary Hover / Dark**: `#006666`
- **Primary Light / Subtle**: `#e6f4f4`
- **Secondary Cyan**: `#06b6d4` — Aksen aksi & informasi cepat.
- **Emerald Green (Status Normal/Sehat)**: `#10b981`
- **Warning / Amber (Perlu Perhatian)**: `#f59e0b`
- **Danger / Rose (Risiko / Darurat)**: `#ef4444`

### Neutrals & Backgrounds
- **Background Main**: `#f8fafc` (Slate 50)
- **Card / Surface**: `#ffffff` (Pure White)
- **Border / Divider**: `#e2e8f0` (Slate 200)
- **Text Main / Heading**: `#0f172a` (Slate 900)
- **Text Body / Muted**: `#475569` (Slate 600)
- **Text Subtle**: `#94a3b8` (Slate 400)

---

## 3. Typography Hierarchy
- **Headline Font**: **Quicksand** (Google Fonts)
- **Body & Controls Font**: **Poppins** (Google Fonts)

| Tag / Level | Font Family | Size (Mobile) | Size (Desktop) | Weight | Line Height |
|---|---|---|---|---|---|
| **H1 (Hero Title)** | Quicksand | 28px (1.75rem) | 40px (2.5rem) | 700 (Bold) | 1.2 |
| **H2 (Section Title)** | Quicksand | 22px (1.375rem)| 28px (1.75rem) | 700 (Bold) | 1.25 |
| **H3 (Card Title)** | Quicksand | 18px (1.125rem)| 20px (1.25rem) | 700 (Bold) | 1.3 |
| **Body (Normal)** | Poppins | 15px (0.9375rem)| 16px (1rem) | 400 (Regular) | 1.6 |
| **Body Small / Micro** | Poppins | 13px (0.8125rem)| 14px (0.875rem) | 500 (Medium) | 1.5 |
| **Eyebrow / Badge** | Poppins | 12px (0.75rem) | 12px (0.75rem) | 600 (Semi Bold) | 1.0 |

---

## 4. Spacing & Touch Targets
- **Base Grid Unit**: 4px / 8px.
- **Tap Targets**: Minimum `44px x 44px` untuk semua interactive elements (tombol, input, dropdown, link).
- **Card Padding**: `16px` (Mobile) / `24px` (Desktop).
- **Border Radius**:
  - `8px` (`rounded-md`): Input, Badge, Tag.
  - `12px` (`rounded-lg`): Button, Micro Cards.
  - `16px` (`rounded-xl`): Standard Card, Modal dialog.
  - `24px` (`rounded-2xl`): Hero Container, Large Panels.

---

## 5. UI Components & Micro-Interactions
- **Buttons**: Menggunakan transisi hover 0.2s `ease-in-out` dengan feedback `transform: translateY(-1px)` dan bayangan lembut. State loading dilengkapi spinner beranimasi dan status disabled.
- **Bento Grid**: Tampilan statistik dashboard disusun dalam formasi 4-grid compact dengan visualisasi icon kontras tinggi.
- **Modals**: Menghilangkan scrollbar background (`overflow: hidden` pada `document.body`) saat modal aktif.
- **Responsive Layout**: Satu kolom pada mobile (< 768px), dua kolom pada tablet (768px - 1024px), dan 3-4 kolom pada desktop (> 1024px).
