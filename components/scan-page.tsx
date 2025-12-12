"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, ArrowLeft, Loader2 } from "lucide-react"
import { LeafIcon } from "@/components/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { analyzeWasteImage } from "@/lib/gemini"

export function ScanPage() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setAnalyzing(true)

    try {
      const result = await analyzeWasteImage(selectedImage)

      // Store result in sessionStorage and navigate to result page
      sessionStorage.setItem("scanResult", JSON.stringify({ image: selectedImage, analysis: result }))
      router.push("/result")
    } catch (error) {
      console.error("Error analyzing image:", error)
      alert("Gagal menganalisis gambar. Silakan coba lagi.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <LeafIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Scan Sampah</h1>
                <p className="text-xs text-muted-foreground">AI akan mengidentifikasi</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Instructions */}
        {!selectedImage && (
          <Card className="mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Tips untuk hasil terbaik:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Pastikan pencahayaan cukup terang</li>
                <li>• Fokuskan kamera pada sampah</li>
                <li>• Foto dari jarak dekat (20-30 cm)</li>
                <li>• Hindari bayangan yang menutupi objek</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Image Preview or Upload Options */}
        {selectedImage ? (
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-muted">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected waste"
                  className="w-full h-full object-cover"
                />
                {analyzing && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-lg font-semibold">Menganalisis gambar...</p>
                      <p className="text-sm text-muted-foreground">AI sedang bekerja</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mb-6">
            {/* Camera Input */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center" onClick={() => cameraInputRef.current?.click()}>
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ambil Foto</h3>
                <p className="text-sm text-muted-foreground">Gunakan kamera untuk mengambil foto sampah</p>
              </CardContent>
            </Card>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Gallery Input */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center" onClick={() => fileInputRef.current?.click()}>
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                  <Upload className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Gambar</h3>
                <p className="text-sm text-muted-foreground">Pilih foto dari galeri Anda</p>
              </CardContent>
            </Card>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </div>
        )}

        {/* Action Buttons */}
        {selectedImage && (
          <div className="space-y-3">
            <Button className="w-full h-12 text-base" size="lg" onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Analisis Sampah
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-base bg-transparent"
              onClick={() => setSelectedImage(null)}
              disabled={analyzing}
            >
              Pilih Gambar Lain
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
