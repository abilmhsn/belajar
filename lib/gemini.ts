// Gemini AI Service for waste identification

export interface GeminiResponse {
  is_sampah: boolean
  kategori_sampah: string
  nama_item: string
  estimasi_harga_jual_rp_per_kg: number
  saran_pengolahan: string
  confidence_score: number
  detail_analisis: string
}

const GEMINI_PROMPT = `Anda adalah sistem AI ahli dalam identifikasi sampah dan manajemen limbah di Indonesia. Analisis gambar ini dan berikan respons HANYA dalam format JSON yang valid, tanpa teks tambahan apapun.

Tugas Anda:
1. Tentukan apakah objek dalam gambar adalah sampah (true/false)
2. Klasifikasikan kategori sampah: Organik, Plastik, Kertas, Logam, B3, atau Residu
3. Estimasi harga jual per kilogram dalam Rupiah (gunakan harga pasar Indonesia)
4. Berikan satu saran pengolahan yang spesifik dan actionable

Format respons wajib:
{
  "is_sampah": boolean,
  "kategori_sampah": "Organik" | "Plastik" | "Kertas" | "Logam" | "B3" | "Residu",
  "nama_item": "string (nama spesifik item)",
  "estimasi_harga_jual_rp_per_kg": number,
  "saran_pengolahan": "string (satu kalimat spesifik)",
  "confidence_score": number (0-100),
  "detail_analisis": "string (penjelasan singkat)"
}

PENTING: Respons harus berupa JSON yang valid dan dapat di-parse. Jangan tambahkan teks diluar JSON.`

export async function analyzeWasteImage(imageBase64: string): Promise<GeminiResponse> {
  try {
    const response = await fetch("/api/gemini-analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageBase64,
        prompt: GEMINI_PROMPT,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to analyze image")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw error
  }
}
