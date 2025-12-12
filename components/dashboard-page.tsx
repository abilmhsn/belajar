"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecycleIcon, LeafIcon, ScanIcon, TrophyIcon, MapPinIcon } from "@/components/icons"
import { Camera, History, Map, User, Sparkles, Award } from "lucide-react"
import Link from "next/link"

const demoUser = {
  displayName: "Demo User",
  email: "demo@smarteco.app",
  level: "Silver",
  totalScanCount: 15,
  totalPoin: 1250,
  totalBeratSampahKg: 12.5,
}

export function DashboardPage() {
  const user = demoUser

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <LeafIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SmartEcoApp</h1>
              <p className="text-xs text-muted-foreground">Halo, {user.displayName}</p>
            </div>
          </div>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <Badge className="mb-3 bg-accent text-accent-foreground">
            <Sparkles className="w-3 h-3 mr-1" />
            Level {user.level}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-balance">Selamat Datang Kembali!</h2>
          <p className="text-muted-foreground text-balance">
            Identifikasi sampah dengan AI, dapatkan poin, dan selamatkan bumi
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Total Scan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-primary">{user.totalScanCount}</p>
                <p className="text-sm text-muted-foreground">kali</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Poin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-accent">{user.totalPoin}</p>
                <TrophyIcon className="w-4 h-4 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-chart-2/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Sampah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-chart-2">{user.totalBeratSampahKg.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">kg</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-chart-4/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-chart-4" />
                <p className="text-xl font-bold text-chart-4">{user.level}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA - Scan Button */}
        <Card className="mb-8 overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <ScanIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Scan Sampah Sekarang</h3>
            <p className="text-muted-foreground mb-6">Foto sampahmu dan biarkan AI mengidentifikasi jenisnya</p>
            <Link href="/scan">
              <Button size="lg" className="w-full md:w-auto min-w-[200px] h-12 text-base">
                <Camera className="w-5 h-5 mr-2" />
                Mulai Scan
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/history">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-chart-1/10 rounded-lg">
                    <History className="w-6 h-6 text-chart-1" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Riwayat</CardTitle>
                    <CardDescription className="text-xs">Lihat scan lama</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/map">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-chart-2/10 rounded-lg">
                    <MapPinIcon className="w-6 h-6 text-chart-2" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Peta</CardTitle>
                    <CardDescription className="text-xs">Bank sampah terdekat</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <RecycleIcon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-base">Tips</CardTitle>
                  <CardDescription className="text-xs">Panduan daur ulang</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Environmental Impact */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-chart-2/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LeafIcon className="w-5 h-5 text-primary" />
              Dampak Lingkungan Anda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">CO₂ yang dikurangi</span>
              <span className="font-bold text-primary">{(user.totalBeratSampahKg * 2.5).toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pohon yang diselamatkan</span>
              <span className="font-bold text-chart-2">{Math.floor(user.totalBeratSampahKg / 10)} pohon</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Air yang dihemat</span>
              <span className="font-bold text-chart-3">{(user.totalBeratSampahKg * 15).toFixed(0)} liter</span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-around py-2">
            <Link href="/">
              <Button variant="ghost" className="flex-col h-auto py-2 gap-1 text-primary">
                <RecycleIcon className="w-5 h-5" />
                <span className="text-xs font-medium">Home</span>
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
                <History className="w-5 h-5" />
                <span className="text-xs">Riwayat</span>
              </Button>
            </Link>
            <Link href="/scan">
              <Button size="lg" className="rounded-full w-14 h-14 -mt-8 shadow-lg">
                <Camera className="w-6 h-6" />
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
                <Map className="w-5 h-5" />
                <span className="text-xs">Peta</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
                <User className="w-5 h-5" />
                <span className="text-xs">Profil</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
