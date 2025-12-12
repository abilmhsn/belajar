// Script to seed initial bank sampah data
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const bankSampahData = [
  {
    nama: "Bank Sampah Melati Bersih",
    alamatLengkap: "Jl. Melati No. 45, Kebayoran Baru, Jakarta Selatan",
    lokasi: {
      latitude: -6.2424,
      longitude: 106.7991,
    },
    kontak: {
      telepon: "021-7234567",
      whatsapp: "628123456789",
      email: "melati@banksampah.id",
    },
    jamOperasional: {
      buka: "08:00",
      tutup: "16:00",
      hariLibur: ["Minggu"],
    },
    jenisLayanan: ["Plastik", "Kertas", "Logam", "Kaca"],
    rating: 4.5,
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
    nama: "Bank Sampah Hijau Lestari",
    alamatLengkap: "Jl. Raya Bogor KM 21, Cimanggis, Depok",
    lokasi: {
      latitude: -6.3612,
      longitude: 106.8456,
    },
    kontak: {
      telepon: "021-8765432",
      whatsapp: "628234567890",
      email: "hijau@banksampah.id",
    },
    jamOperasional: {
      buka: "09:00",
      tutup: "17:00",
      hariLibur: ["Minggu", "Senin"],
    },
    jenisLayanan: ["Plastik", "Kertas", "Organik"],
    rating: 4.8,
    totalTransaksi: 2100,
    hargaBeli: {
      Plastik: 3000,
      Kertas: 1800,
      Organik: 500,
    },
    verified: true,
  },
  {
    nama: "Bank Sampah Mandiri Sejahtera",
    alamatLengkap: "Jl. Veteran No. 12, Tangerang Selatan",
    lokasi: {
      latitude: -6.3026,
      longitude: 106.6539,
    },
    kontak: {
      telepon: "021-5567890",
      whatsapp: "628345678901",
      email: "mandiri@banksampah.id",
    },
    jamOperasional: {
      buka: "07:30",
      tutup: "15:30",
      hariLibur: ["Minggu"],
    },
    jenisLayanan: ["Plastik", "Kertas", "Logam", "Kaca", "B3"],
    rating: 4.3,
    totalTransaksi: 890,
    hargaBeli: {
      Plastik: 3200,
      Kertas: 2100,
      Logam: 7500,
      Kaca: 1200,
    },
    verified: true,
  },
  {
    nama: "Bank Sampah Bersama Kita",
    alamatLengkap: "Jl. Sudirman No. 88, Bekasi Timur",
    lokasi: {
      latitude: -6.2382,
      longitude: 107.0094,
    },
    kontak: {
      telepon: "021-8889999",
      whatsapp: "628456789012",
      email: "bersama@banksampah.id",
    },
    jamOperasional: {
      buka: "08:00",
      tutup: "16:00",
      hariLibur: ["Minggu"],
    },
    jenisLayanan: ["Plastik", "Kertas", "Logam"],
    rating: 4.6,
    totalTransaksi: 1560,
    hargaBeli: {
      Plastik: 3800,
      Kertas: 2200,
      Logam: 8500,
    },
    verified: true,
  },
  {
    nama: "Bank Sampah Eco Village",
    alamatLengkap: "Jl. Raya Serpong, BSD City, Tangerang Selatan",
    lokasi: {
      latitude: -6.2978,
      longitude: 106.6638,
    },
    kontak: {
      telepon: "021-5378901",
      whatsapp: "628567890123",
      email: "eco@banksampah.id",
    },
    jamOperasional: {
      buka: "09:00",
      tutup: "18:00",
      hariLibur: [],
    },
    jenisLayanan: ["Plastik", "Kertas", "Organik", "Kaca", "Logam"],
    rating: 4.9,
    totalTransaksi: 3200,
    hargaBeli: {
      Plastik: 4000,
      Kertas: 2500,
      Organik: 800,
      Kaca: 1800,
      Logam: 9000,
    },
    verified: true,
  },
]

async function seedBankSampah() {
  console.log("[v0] Starting bank sampah seeding...")

  try {
    for (const bank of bankSampahData) {
      const docRef = await addDoc(collection(db, "bankSampah"), bank)
      console.log("[v0] Added bank sampah:", bank.nama, "with ID:", docRef.id)
    }

    console.log("[v0] ✓ Successfully seeded", bankSampahData.length, "bank sampah locations")
  } catch (error) {
    console.error("[v0] Error seeding data:", error)
  }
}

seedBankSampah()
