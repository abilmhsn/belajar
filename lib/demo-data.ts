// Demo data untuk mode development tanpa Firebase
import type { User, RiwayatScan, BankSampah } from "@/lib/types"

export const demoUser: User = {
  uid: "demo-user-123",
  email: "demo@smarteco.app",
  displayName: "Demo User",
  photoURL: "",
  totalPoin: 450,
  level: "Silver",
  joinDate: new Date("2024-01-15"),
  lastActive: new Date(),
  totalScanCount: 12,
  totalBeratSampahKg: 8.5,
}

export const demoScans: RiwayatScan[] = [
  {
    scanId: "scan-1",
    userId: "demo-user-123",
    timestamp: new Date("2024-12-10T10:30:00"),
    hasilAnalisis: {
      is_sampah: true,
      kategori_sampah: "Plastik",
      nama_item: "Botol PET",
      estimasi_harga_jual_rp_per_kg: 3500,
      saran_pengolahan: "Cuci bersih, lepas label, dan kumpulkan minimal 5kg untuk dijual ke bank sampah",
      confidence_score: 95,
      detail_analisis: "Botol plastik PET (kode 1) dengan kondisi bersih, mudah didaur ulang",
    },
    lokasi: {
      latitude: -6.2088,
      longitude: 106.8456,
      alamat: "Jl. Sudirman No. 123",
      kota: "Jakarta Selatan",
      provinsi: "DKI Jakarta",
    },
    imageUrl: "/plastic-bottle.png",
    beratEstimasiKg: 0.5,
    statusPengolahan: "Selesai",
    catatan: "Sudah dijual ke bank sampah",
  },
  {
    scanId: "scan-2",
    userId: "demo-user-123",
    timestamp: new Date("2024-12-08T14:20:00"),
    hasilAnalisis: {
      is_sampah: true,
      kategori_sampah: "Kertas",
      nama_item: "Kardus Bekas",
      estimasi_harga_jual_rp_per_kg: 2000,
      saran_pengolahan: "Ratakan kardus, ikat dengan tali, minimal 10kg untuk harga terbaik",
      confidence_score: 92,
      detail_analisis: "Kardus corrugated dalam kondisi kering dan bersih",
    },
    lokasi: {
      latitude: -6.2088,
      longitude: 106.8456,
      alamat: "Jl. Gatot Subroto No. 45",
      kota: "Jakarta Selatan",
      provinsi: "DKI Jakarta",
    },
    imageUrl: "/simple-cardboard-box.png",
    beratEstimasiKg: 3.2,
    statusPengolahan: "Sedang",
    catatan: "Masih dikumpulkan",
  },
]

export const demoBankSampah: BankSampah[] = [
  {
    bankSampahId: "bank-1",
    nama: "Bank Sampah Hijau Lestari",
    alamatLengkap: "Jl. Kebayoran Lama No. 88, Jakarta Selatan",
    lokasi: {
      latitude: -6.2434,
      longitude: 106.7809,
    },
    kontak: {
      telepon: "021-1234567",
      whatsapp: "081234567890",
      email: "hijaulestari@banksampah.com",
    },
    jamOperasional: {
      buka: "08:00",
      tutup: "16:00",
      hariLibur: ["Minggu"],
    },
    jenisLayanan: ["Plastik", "Kertas", "Logam", "Kaca"],
    rating: 4.8,
    totalTransaksi: 1250,
    hargaBeli: {
      Plastik: 3500,
      Kertas: 2000,
      Logam: 8000,
      Kaca: 1500,
    },
    verified: true,
  },
  {
    bankSampahId: "bank-2",
    nama: "Bank Sampah Sejahtera",
    alamatLengkap: "Jl. Fatmawati Raya No. 15, Jakarta Selatan",
    lokasi: {
      latitude: -6.2615,
      longitude: 106.7942,
    },
    kontak: {
      telepon: "021-7654321",
      whatsapp: "081298765432",
      email: "sejahtera@banksampah.com",
    },
    jamOperasional: {
      buka: "07:00",
      tutup: "17:00",
      hariLibur: ["Minggu", "Tanggal Merah"],
    },
    jenisLayanan: ["Plastik", "Kertas", "Logam"],
    rating: 4.5,
    totalTransaksi: 890,
    hargaBeli: {
      Plastik: 3000,
      Kertas: 1800,
      Logam: 7500,
    },
    verified: true,
  },
  {
    bankSampahId: "bank-3",
    nama: "Bank Sampah Eco Green",
    alamatLengkap: "Jl. Radio Dalam No. 25A, Jakarta Selatan",
    lokasi: {
      latitude: -6.2467,
      longitude: 106.7944,
    },
    kontak: {
      telepon: "021-9876543",
      whatsapp: "081223344556",
      email: "ecogreen@banksampah.com",
    },
    jamOperasional: {
      buka: "09:00",
      tutup: "15:00",
      hariLibur: ["Sabtu", "Minggu"],
    },
    jenisLayanan: ["Plastik", "Kertas", "Logam", "Kaca", "Organik"],
    rating: 4.9,
    totalTransaksi: 1580,
    hargaBeli: {
      Plastik: 4000,
      Kertas: 2200,
      Logam: 9000,
      Kaca: 2000,
      Organik: 500,
    },
    verified: true,
  },
]

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
