import { GoogleGenAI, Type } from "@google/genai"

export interface GeminiWasteResult {
  nama_item: string
  kategori_sampah: "Plastik" | "Kertas" | "Organik" | "Logam" | "Kaca" | "Elektronik" | "B3" | "Residu"
  estimasi_harga_jual_rp_per_kg: number
  saran_pengolahan: string
  confidence_score: number
  detail_analisis: string
}

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
})

export async function analyzeTrashImage(
  base64Image: string
): Promise<GeminiWasteResult> {
  const systemInstruction = `
Anda adalah ahli lingkungan profesional di Indonesia.

TUGAS:
- Identifikasi objek pada gambar
- Tentukan apakah itu sampah
- Klasifikasikan kategori sampah Indonesia
- Estimasikan harga jual per kg dalam Rupiah
- Berikan saran pengolahan
- Berikan confidence score (0-100)
- Jelaskan analisis singkat

RESPONS WAJIB JSON VALID.
`

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
contents: [
    {
      parts: [
        { text: "Analisis sampah pada gambar berikut:" },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.includes(",")
              ? base64Image.split(",")[1]
              : base64Image,
          },
        },
      ],
    },
  ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nama_item: { type: Type.STRING },
          kategori_sampah: { type: Type.STRING },
          estimasi_harga_jual_rp_per_kg: { type: Type.NUMBER },
          saran_pengolahan: { type: Type.STRING },
          confidence_score: { type: Type.NUMBER },
          detail_analisis: { type: Type.STRING },
        },
        required: [
          "nama_item",
          "kategori_sampah",
          "estimasi_harga_jual_rp_per_kg",
          "saran_pengolahan",
          "confidence_score",
          "detail_analisis",
        ],
      },
    },
  })

  if (!response.text) {
    throw new Error("AI tidak memberikan respon")
  }

  return JSON.parse(response.text) as GeminiWasteResult
}

