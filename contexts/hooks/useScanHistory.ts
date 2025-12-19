import { useState, useEffect } from "react"
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { useAuth } from "../../contexts/AuthContext"

export interface ScanItem {
  id: string
  uid: string
  nama_item: string
  kategori_sampah: string
  beratEstimasiKg: number
  estimasi_harga: number
  timestamp: Date
  lokasi?: string
  imageUrl?: string
  saran_pengolahan?: string
  expandedSuggestion?: string | null
  confidence_score?: number
  detail_analisis?: string
}

/**
 * Hook untuk manage scan history dari Firestore
 */
export const useScanHistory = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState<ScanItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch scan history untuk user yang logged in
   */
  const fetchHistory = async () => {
    if (!user?.uid) {
      setHistory([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // Query hanya dengan uid - tidak perlu composite index
      // Sorting akan dilakukan client-side
      const q = query(collection(db, "scanHistory"), where("uid", "==", user.uid))

      const querySnapshot = await getDocs(q)
      const items: ScanItem[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        items.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || new Date(),
        } as ScanItem)
      })

      // Sort by timestamp descending (client-side)
      items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      setHistory(items)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching history:", err)
      setError(err.message || "Gagal memuat riwayat")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Tambah scan item baru ke Firestore
   */
  const addScanItem = async (scanData: Omit<ScanItem, "id" | "uid" | "timestamp">) => {
    if (!user?.uid) {
      throw new Error("User tidak terautentikasi")
    }

    try {
      const docRef = await addDoc(collection(db, "scanHistory"), {
        ...scanData,
        uid: user.uid,
        timestamp: serverTimestamp(),
      })

      console.log("Scan item added:", docRef.id)

      // Refresh history
      await fetchHistory()

      return docRef.id
    } catch (err: any) {
      console.error("Error adding scan item:", err)
      throw err
    }
  }

  /**
   * Update fields of a scan item (e.g., save expandedSuggestion)
   */
  const updateScanItem = async (id: string, data: Partial<Omit<ScanItem, "id" | "uid" | "timestamp">>) => {
    if (!user?.uid) {
      throw new Error("User tidak terautentikasi")
    }

    try {
      const ref = doc(db, "scanHistory", id)
      await updateDoc(ref, data)
      // refresh local list
      await fetchHistory()
    } catch (err: any) {
      console.error("Error updating scan item:", err)
      throw err
    }
  }

  /**
   * Load history saat component mount
   */
  useEffect(() => {
    fetchHistory()
  }, [user?.uid])

  return {
    history,
    loading,
    error,
    fetchHistory,
    addScanItem,
    updateScanItem,
  }
}
