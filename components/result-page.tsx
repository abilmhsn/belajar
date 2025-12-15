"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, MapPin, Save, Sparkles } from "lucide-react"
import { LeafIcon } from "@/components/icons"
import Link from "next/link"
import type { GeminiResponse } from "@/lib/gemini"
import { useAuth } from "@/contexts/auth-context"
import { collection, addDoc } from "firebase/firestore"
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { RiwayatScan, TransaksiPoin } from "@/lib/types"

interface ScanResult {
  image: string
  analysis: GeminiResponse
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Plastik: "bg-blue-500 text-white",
    Kertas: "bg-amber-500 text-white",
    Organik: "bg-green-600 text-white",
    Logam: "bg-gray-500 text-white",
    B3: "bg-red-600 text-white",
    Residu: "bg-purple-500 text-white",
  }
  return colors[category] || "bg-muted text-foreground"
}

export function ResultPage() {
  const router = useRouter()
  const { user, updateUserData } = useAuth()
  const [result, setResult] = useState<ScanResult | null>(null)
  const [beratKg, setBeratKg] = useState("")
  const [catatan, setCatatan] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem("scanResult")
    if (data) {
      setResult(JSON.parse(data))
    } else {
      router.push("/scan")
    }
  }, [router])

  const handleSave = async () => {
    if (!result || !user) return

    const berat = Number.parseFloat(beratKg) || 0
    if (berat <= 0) {
      alert("Masukkan berat sampah yang valid")
      return
    }

    setSaving(true)

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `scans/${user.uid}/${Date.now()}.jpg`)
      await uploadString(imageRef, result.image, "data_url")
      const imageUrl = await getDownloadURL(imageRef)

      // Get user location (mock for now)
      const lokasi = {
        latitude: -6.2,
        longitude: 106.816666,
        alamat: "Jakarta, Indonesia",
        kota: "Jakarta",
        provinsi: "DKI Jakarta",
      }

      // Normalize kategori_sampah to valid type
      const validKategori = ["Organik", "Plastik", "Kertas", "Logam", "B3", "Residu"] as const
      const kategoriNormalized = validKategori.includes(result.analysis.kategori_sampah as any)
        ? (result.analysis.kategori_sampah as "Organik" | "Plastik" | "Kertas" | "Logam" | "B3" | "Residu")
        : "Residu"

      // Save scan to Firestore
      const scanData: Omit<RiwayatScan, "scanId"> = {
        userId: user.uid,
        timestamp: new Date(),
        hasilAnalisis: {
          ...result.analysis,
          kategori_sampah: kategoriNormalized,
        },
        lokasi: lokasi,
        imageUrl: imageUrl,
        beratEstimasiKg: berat,
        statusPengolahan: "Belum",
        catatan: catatan,
      }

      const scanDoc = await addDoc(collection(db, "riwayatScan"), scanData)

      // Calculate points (10 points per scan + bonus based on weight)
      const poinEarned = 10 + Math.floor(berat * 5)

      // Create points transaction
      const transaksiData: Omit<TransaksiPoin, "transaksiId"> = {
        userId: user.uid,
        scanId: scanDoc.id,
        timestamp: new Date(),
        tipeTransaksi: "Scan",
        poinBefore: user.totalPoin,
        poinChange: poinEarned,
        poinAfter: user.totalPoin + poinEarned,
        keterangan: `Scan ${result.analysis.nama_item} - ${berat} kg`,
      }

      await addDoc(collection(db, "transaksiPoin"), transaksiData)

      // Update user stats
      const newTotalPoin = user.totalPoin + poinEarned
      const newScanCount = user.totalScanCount + 1
      const newTotalBerat = user.totalBeratSampahKg + berat

      // Determine new level
      let newLevel: "Bronze" | "Silver" | "Gold" | "Platinum" = "Bronze"
      if (newTotalPoin >= 1000) newLevel = "Platinum"
      else if (newTotalPoin >= 500) newLevel = "Gold"
      else if (newTotalPoin >= 200) newLevel = "Silver"

      await updateUserData({
        totalPoin: newTotalPoin,
        totalScanCount: newScanCount,
        totalBeratSampahKg: newTotalBerat,
        level: newLevel,
        lastActive: new Date(),
      })

      setSaved(true)

      // Clear session storage
      sessionStorage.removeItem("scanResult")

      // Show success message
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error saving scan:", error)
      alert("Gagal menyimpan hasil scan")
    } finally {
      setSaving(false)
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat hasil...</p>
        </div>
      </div>
    )
  }

  const { image, analysis } = result

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background pb-8">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/scan">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <LeafIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Hasil Analisis</h1>
                <p className="text-xs text-muted-foreground">AI telah mengidentifikasi</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {saved && (
          <Card className="mb-6 bg-primary/10 border-primary">
            <CardContent className="p-4 flex items-center gap-3">
              <Check className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-primary">Berhasil Disimpan!</p>
                <p className="text-sm text-muted-foreground">Mengalihkan ke dashboard...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-muted">
              <img src={image || "/placeholder.svg"} alt="Scanned waste" className="w-full h-full object-cover" />
            </div>
          </CardContent>
        </Card>

        {/* Analysis Result */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{analysis.nama_item}</CardTitle>
                <CardDescription>Confidence: {analysis.confidence_score}%</CardDescription>
              </div>
              <Badge className={getCategoryColor(analysis.kategori_sampah)}>{analysis.kategori_sampah}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Detail Analisis
              </h4>
              <p className="text-sm text-muted-foreground">{analysis.detail_analisis}</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Estimasi Harga Jual</span>
                <span className="text-xl font-bold text-primary">
                  Rp {analysis.estimasi_harga_jual_rp_per_kg.toLocaleString()}/kg
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Saran Pengolahan</h4>
              <p className="text-sm text-muted-foreground">{analysis.saran_pengolahan}</p>
            </div>
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detail Sampah</CardTitle>
            <CardDescription>Lengkapi informasi untuk menyimpan ke riwayat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="berat">Berat Sampah (kg) *</Label>
              <Input
                id="berat"
                type="number"
                step="0.1"
                placeholder="0.5"
                value={beratKg}
                onChange={(e) => setBeratKg(e.target.value)}
                disabled={saving || saved}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan (Opsional)</Label>
              <Textarea
                id="catatan"
                placeholder="Tambahkan catatan..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                disabled={saving || saved}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full h-12 text-base" size="lg" onClick={handleSave} disabled={saving || saved}>
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Menyimpan...
              </>
            ) : saved ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Tersimpan
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Simpan ke Riwayat
              </>
            )}
          </Button>

          <Link href="/map">
            <Button variant="outline" className="w-full h-12 text-base bg-transparent" disabled={saving}>
              <MapPin className="w-5 h-5 mr-2" />
              Cari Bank Sampah Terdekat
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
