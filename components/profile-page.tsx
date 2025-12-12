"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, LogOut, Award, TrendingUp } from "lucide-react"
import { LeafIcon, TrophyIcon } from "@/components/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      await logout()
      router.push("/")
    }
  }

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      Bronze: "bg-amber-700 text-white",
      Silver: "bg-gray-400 text-gray-900",
      Gold: "bg-amber-500 text-white",
      Platinum: "bg-blue-500 text-white",
    }
    return colors[level] || "bg-muted text-foreground"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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
                <h1 className="text-xl font-bold text-foreground">Profil</h1>
                <p className="text-xs text-muted-foreground">Kelola akun Anda</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* User Info Card */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(user?.displayName || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user?.displayName}</h2>
                <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
                <Badge className={getLevelColor(user?.level || "Bronze")}>
                  <Award className="w-3 h-3 mr-1" />
                  Level {user?.level}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{user?.totalScanCount || 0}</p>
                <p className="text-xs text-muted-foreground">Total Scan</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{user?.totalPoin || 0}</p>
                <p className="text-xs text-muted-foreground">Total Poin</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-2">{user?.totalBeratSampahKg.toFixed(1) || 0}</p>
                <p className="text-xs text-muted-foreground">kg Sampah</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Statistik
            </CardTitle>
            <CardDescription>Pencapaian Anda di SmartEcoApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bergabung sejak</span>
              <span className="font-semibold">
                {user?.joinDate
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(user.joinDate)
                  : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">CO₂ yang dikurangi</span>
              <span className="font-semibold text-primary">
                {((user?.totalBeratSampahKg || 0) * 2.5).toFixed(1)} kg
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pohon yang diselamatkan</span>
              <span className="font-semibold text-chart-2">
                {Math.floor((user?.totalBeratSampahKg || 0) / 10)} pohon
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Air yang dihemat</span>
              <span className="font-semibold text-chart-3">
                {((user?.totalBeratSampahKg || 0) * 15).toFixed(0)} liter
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Level Progress */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 via-accent/10 to-chart-2/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-primary" />
              Progress Level
            </CardTitle>
            <CardDescription>Kumpulkan poin untuk naik level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { level: "Bronze", poin: 0, current: user?.level === "Bronze" },
                { level: "Silver", poin: 200, current: user?.level === "Silver" },
                { level: "Gold", poin: 500, current: user?.level === "Gold" },
                { level: "Platinum", poin: 1000, current: user?.level === "Platinum" },
              ].map((item) => (
                <div key={item.level} className="flex items-center gap-3">
                  <Badge className={item.current ? getLevelColor(item.level) : "bg-muted text-muted-foreground"}>
                    {item.level}
                  </Badge>
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: item.current ? "100%" : (user?.totalPoin || 0) >= item.poin ? "100%" : "0%",
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium">{item.poin} poin</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button variant="destructive" className="w-full" size="lg" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-2" />
          Keluar
        </Button>
      </main>
    </div>
  )
}
