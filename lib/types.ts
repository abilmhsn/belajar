// TypeScript interfaces for Firestore models

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  totalPoin: number
  level: "Bronze" | "Silver" | "Gold" | "Platinum"
  joinDate: Date
  lastActive: Date
  totalScanCount: number
  totalBeratSampahKg: number
}

export interface HasilAnalisis {
  is_sampah: boolean
  kategori_sampah: "Organik" | "Plastik" | "Kertas" | "Logam" | "B3" | "Residu"
  nama_item: string
  estimasi_harga_jual_rp_per_kg: number
  saran_pengolahan: string
  confidence_score: number
  detail_analisis: string
}

export interface Lokasi {
  latitude: number
  longitude: number
  alamat: string
  kota: string
  provinsi: string
}

export interface RiwayatScan {
  scanId: string
  userId: string
  timestamp: Date
  hasilAnalisis: HasilAnalisis
  lokasi: Lokasi
  imageUrl: string
  beratEstimasiKg: number
  statusPengolahan: "Belum" | "Sedang" | "Selesai"
  catatan?: string
}

export interface BankSampah {
  bankSampahId: string
  nama: string
  alamatLengkap: string
  lokasi: {
    latitude: number
    longitude: number
  }
  kontak: {
    telepon: string
    whatsapp: string
    email: string
  }
  jamOperasional: {
    buka: string
    tutup: string
    hariLibur: string[]
  }
  jenisLayanan: string[]
  rating: number
  totalTransaksi: number
  hargaBeli: Record<string, number>
  verified: boolean
}

export interface TransaksiPoin {
  transaksiId: string
  userId: string
  scanId?: string
  timestamp: Date
  tipeTransaksi: "Scan" | "Tukar" | "Bonus" | "Referral"
  poinBefore: number
  poinChange: number
  poinAfter: number
  keterangan: string
  metadata?: Record<string, any>
}
