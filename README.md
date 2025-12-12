# SmartEcoApp - Aplikasi Manajemen Sampah Pintar

SmartEcoApp adalah aplikasi web berbasis Next.js yang menggunakan AI (Gemini Pro Vision) untuk mengidentifikasi jenis sampah, memberikan estimasi harga, dan membantu pengguna menemukan bank sampah terdekat.

## Fitur Utama

### 1. Autentikasi & Manajemen User
- Login/Register dengan Firebase Auth
- Sistem level (Bronze, Silver, Gold, Platinum)
- Tracking poin dan statistik pengguna
- Profile management lengkap

### 2. Scan & Identifikasi Sampah (AI-Powered)
- Upload atau ambil foto sampah dengan kamera
- Analisis otomatis menggunakan Gemini Pro Vision
- Identifikasi kategori: Organik, Plastik, Kertas, Logam, B3, Residu
- Estimasi harga jual per kilogram
- Saran pengolahan yang actionable
- Confidence score untuk setiap analisis

### 3. Riwayat Scan
- Menyimpan semua hasil scan dengan foto
- Filter berdasarkan kategori sampah
- Search berdasarkan nama item
- Statistik total scan dan berat sampah
- Geo-tagging lokasi scan

### 4. Peta Bank Sampah
- Daftar bank sampah terdekat
- Detail lengkap: alamat, kontak, jam operasional
- Harga beli untuk setiap kategori sampah
- Rating dan jumlah transaksi
- Integrasi WhatsApp dan petunjuk arah
- Verifikasi bank sampah

### 5. Sistem Poin & Gamification
- Earning poin setiap scan (10 + bonus berat)
- Level progression berdasarkan total poin
- Environmental impact tracking:
  - CO₂ yang dikurangi
  - Pohon yang diselamatkan
  - Air yang dihemat

## Arsitektur Database (Firestore)

### 4 Model Utama:

1. **Users**
   - User profile data
   - Total poin, level, statistik scan
   - Join date dan last active

2. **RiwayatScan**
   - Hasil analisis AI
   - Image URL dari Storage
   - Geo-location data
   - Berat sampah dan catatan

3. **BankSampah**
   - Lokasi bank sampah
   - Detail kontak dan jam operasional
   - Harga beli per kategori
   - Rating dan verification status

4. **TransaksiPoin**
   - History transaksi poin
   - Tipe: Scan, Tukar, Bonus, Referral
   - Tracking poin before/after

## Teknologi Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS v4, shadcn/ui
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth
- **AI**: Google Gemini Pro Vision API
- **Deployment**: Vercel

## Setup & Installation

### 1. Environment Variables

Buat file `.env.local` di root project:

\`\`\`env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Mode Demo (set ke "true" untuk testing tanpa Firebase)
NEXT_PUBLIC_DEMO_MODE=true
\`\`\`

**DEMO MODE**: Untuk testing cepat tanpa setup Firebase, set `NEXT_PUBLIC_DEMO_MODE=true`. Aplikasi akan menggunakan data demo dan auto-login.

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Seed Data (Optional)

Untuk menambahkan data bank sampah initial:

\`\`\`bash
npx tsx scripts/seed-bank-sampah.ts
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Cara Menggunakan Aplikasi

### Mode Demo (Tanpa Firebase)
Untuk mencoba aplikasi tanpa setup Firebase:
1. Set `NEXT_PUBLIC_DEMO_MODE=true` di `.env.local`
2. Run `npm run dev`
3. Aplikasi akan auto-login dengan demo user
4. Semua fitur bisa dicoba dengan data demo

### Mode Production (Dengan Firebase)
1. Setup Firebase project di console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Copy credentials ke `.env.local`
5. Set `NEXT_PUBLIC_DEMO_MODE=false`
6. Run seeding script untuk bank sampah data

### 1. Registrasi/Login
- Buat akun baru atau login dengan akun existing
- Email dan password minimal 6 karakter

### 2. Scan Sampah
- Klik tombol "Mulai Scan" di dashboard
- Pilih foto dari galeri atau ambil foto baru
- Tunggu AI menganalisis (biasanya 2-5 detik)
- Review hasil analisis

### 3. Simpan Hasil
- Input berat sampah (dalam kg)
- Tambahkan catatan jika perlu
- Klik "Simpan ke Riwayat"
- Dapatkan poin otomatis

### 4. Cari Bank Sampah
- Buka menu "Peta"
- Lihat daftar bank sampah terdekat
- Klik bank sampah untuk detail lengkap
- Hubungi via WhatsApp atau lihat petunjuk arah

## API Integration

### Gemini API Route

Endpoint: `POST /api/gemini-analyze`

Request body:
\`\`\`json
{
  "image": "base64_encoded_image",
  "prompt": "AI_prompt_string"
}
\`\`\`

Response:
\`\`\`json
{
  "is_sampah": true,
  "kategori_sampah": "Plastik",
  "nama_item": "Botol PET",
  "estimasi_harga_jual_rp_per_kg": 3500,
  "saran_pengolahan": "Cuci bersih dan kumpulkan...",
  "confidence_score": 95,
  "detail_analisis": "Botol plastik PET..."
}
\`\`\`

## Design System

### Color Palette (Eco-Friendly Theme)
- **Primary**: Green (#22c55e) - Eco action color
- **Accent**: Yellow-green - Energy & growth
- **Secondary**: Light green - Subtle backgrounds
- **Charts**: Green spectrum for consistency

### Typography
- **Font**: Geist (sans-serif) untuk clean, modern look
- **Headings**: Bold weights untuk hierarchy
- **Body**: Regular weights dengan good line-height

## Deployment

### Deploy ke Vercel

1. Push code ke GitHub
2. Import project di Vercel
3. Add environment variables
4. Deploy!

Atau gunakan Vercel CLI:

\`\`\`bash
vercel
\`\`\`

## Kontribusi & Development

### File Structure
\`\`\`
SmartEcoApp/
├── app/                    # Next.js pages
├── components/             # React components
├── contexts/              # React context (Auth)
├── lib/                   # Utilities & config
├── scripts/               # Database seeding
└── public/                # Static assets
\`\`\`

### Key Features untuk Pengembangan Lebih Lanjut
- [ ] Real-time chat dengan bank sampah
- [ ] Marketplace tukar poin dengan voucher
- [ ] Social features: share achievements
- [ ] Push notifications untuk reminder
- [ ] Advanced analytics dashboard
- [ ] Integration dengan Google Maps API
- [ ] Multi-language support

## Credits

Dibuat dengan v0.app untuk Project-Based Test.

## License

MIT License - Free to use for educational purposes.
