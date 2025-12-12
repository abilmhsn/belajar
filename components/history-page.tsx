"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, Calendar, Trash2 } from "lucide-react"
import { LeafIcon } from "@/components/icons"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { RiwayatScan } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export function HistoryPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState<(RiwayatScan & { scanId: string })[]>([])
  const [filteredHistory, setFilteredHistory] = useState<(RiwayatScan & { scanId: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    if (!user) return

    const fetchHistory = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, "riwayatScan"), where("userId", "==", user.uid), orderBy("timestamp", "desc"))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map((doc) => ({
          scanId: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        })) as (RiwayatScan & { scanId: string })[]
        setHistory(data)
        setFilteredHistory(data)
      } catch (error) {
        console.error("Error fetching history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user])

  useEffect(() => {
    let filtered = history

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.hasilAnalisis.nama_item.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.hasilAnalisis.kategori_sampah === categoryFilter)
    }

    setFilteredHistory(filtered)
  }, [searchQuery, categoryFilter, history])

  const handleDelete = async (scanId: string) => {
    if (!confirm("Hapus riwayat scan ini?")) return

    try {
      await deleteDoc(doc(db, "riwayatScan", scanId))
      setHistory(history.filter((item) => item.scanId !== scanId))
    } catch (error) {
      console.error("Error deleting scan:", error)
      alert("Gagal menghapus riwayat")
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
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
                <h1 className="text-xl font-bold text-foreground">Riwayat Scan</h1>
                <p className="text-xs text-muted-foreground">{history.length} total scan</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Search & Filter */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari nama sampah..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Plastik">Plastik</SelectItem>
                <SelectItem value="Kertas">Kertas</SelectItem>
                <SelectItem value="Organik">Organik</SelectItem>
                <SelectItem value="Logam">Logam</SelectItem>
                <SelectItem value="B3">B3</SelectItem>
                <SelectItem value="Residu">Residu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{history.length}</p>
              <p className="text-xs text-muted-foreground">Total Scan</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-chart-2">
                {history.reduce((sum, item) => sum + item.beratEstimasiKg, 0).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">kg Terkumpul</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-accent">
                {new Set(history.map((item) => item.hasilAnalisis.kategori_sampah)).size}
              </p>
              <p className="text-xs text-muted-foreground">Jenis Sampah</p>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat riwayat...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Belum Ada Riwayat</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || categoryFilter !== "all"
                  ? "Tidak ada hasil yang sesuai dengan filter"
                  : "Mulai scan sampah untuk melihat riwayat"}
              </p>
              <Link href="/scan">
                <Button>Scan Sekarang</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <Card key={item.scanId} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="w-24 h-24 bg-muted flex-shrink-0">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.hasilAnalisis.nama_item}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{item.hasilAnalisis.nama_item}</h3>
                          <Badge className={getCategoryColor(item.hasilAnalisis.kategori_sampah)} variant="secondary">
                            {item.hasilAnalisis.kategori_sampah}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{formatDate(item.timestamp)}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{item.beratEstimasiKg}</span> kg
                          </span>
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-primary">
                              Rp {item.hasilAnalisis.estimasi_harga_jual_rp_per_kg.toLocaleString()}
                            </span>
                            /kg
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.scanId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
