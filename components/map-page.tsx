"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Phone, Clock, Star, Navigation } from "lucide-react"
import { LeafIcon } from "@/components/icons"
import Link from "next/link"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { BankSampah } from "@/lib/types"

export function MapPage() {
  const [bankSampah, setBankSampah] = useState<(BankSampah & { bankSampahId: string })[]>([])
  const [selectedBank, setSelectedBank] = useState<(BankSampah & { bankSampahId: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to Jakarta
          setUserLocation({ lat: -6.2, lng: 106.816666 })
        },
      )
    }

    // Fetch bank sampah data
    const fetchBankSampah = async () => {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "bankSampah"))
        const data = querySnapshot.docs.map((doc) => ({
          bankSampahId: doc.id,
          ...doc.data(),
        })) as (BankSampah & { bankSampahId: string })[]
        setBankSampah(data)

        // Select first bank by default
        if (data.length > 0) {
          setSelectedBank(data[0])
        }
      } catch (error) {
        console.error("Error fetching bank sampah:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBankSampah()
  }, [])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d.toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background pb-24">
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
                <h1 className="text-xl font-bold text-foreground">Bank Sampah</h1>
                <p className="text-xs text-muted-foreground">{bankSampah.length} lokasi tersedia</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Map Placeholder */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-64 bg-gradient-to-br from-primary/10 to-chart-2/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Peta Interaktif
                  <br />
                  <span className="text-xs">(Fitur peta akan aktif dengan Google Maps API)</span>
                </p>
              </div>
              {/* Mock markers */}
              {bankSampah.slice(0, 3).map((bank, idx) => (
                <div
                  key={bank.bankSampahId}
                  className="absolute bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: `${30 + idx * 20}%`,
                    top: `${40 + idx * 10}%`,
                  }}
                  onClick={() => setSelectedBank(bank)}
                >
                  <MapPin className="w-5 h-5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bank Sampah List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data bank sampah...</p>
          </div>
        ) : bankSampah.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Belum Ada Data Bank Sampah</p>
              <p className="text-sm text-muted-foreground">Data bank sampah akan segera tersedia</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bankSampah.map((bank) => {
              const distance = userLocation
                ? calculateDistance(userLocation.lat, userLocation.lng, bank.lokasi.latitude, bank.lokasi.longitude)
                : null

              return (
                <Card
                  key={bank.bankSampahId}
                  className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                    selectedBank?.bankSampahId === bank.bankSampahId ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => setSelectedBank(bank)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          {bank.nama}
                          {bank.verified && (
                            <Badge variant="secondary" className="bg-primary text-primary-foreground">
                              Terverifikasi
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4" />
                          {bank.alamatLengkap}
                          {distance && <span className="text-primary font-semibold">• {distance} km</span>}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            {bank.rating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">{bank.totalTransaksi} transaksi</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">Jam Operasional</p>
                        <p className="text-muted-foreground">
                          {bank.jamOperasional.buka} - {bank.jamOperasional.tutup}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">Kontak</p>
                        <p className="text-muted-foreground">{bank.kontak.telepon}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Jenis Layanan</p>
                      <div className="flex flex-wrap gap-2">
                        {bank.jenisLayanan.map((jenis) => (
                          <Badge key={jenis} variant="outline">
                            {jenis}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Harga Beli</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(bank.hargaBeli).map(([kategori, harga]) => (
                          <div key={kategori} className="flex justify-between">
                            <span className="text-muted-foreground">{kategori}:</span>
                            <span className="font-semibold text-primary">Rp {harga.toLocaleString()}/kg</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 flex gap-2">
                      <Button className="flex-1" size="sm">
                        <Navigation className="w-4 h-4 mr-2" />
                        Petunjuk Arah
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://wa.me/${bank.kontak.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
