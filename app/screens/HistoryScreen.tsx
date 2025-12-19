"use client"

import { useState, useMemo } from "react"
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from "react-native"
import { Card, Chip, Searchbar } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../theme"
import { useScanHistory } from "../../hooks/useScanHistory"
import { getGeminiAnalyzeUrl } from "../config"

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { history, loading, fetchHistory, updateScanItem } = useScanHistory()
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({})

  const toggleExpanded = (id: string) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  const setItemLoading = (id: string, isLoading: boolean) => {
    setLoadingMap((prev) => ({ ...prev, [id]: isLoading }))
  }

  const generateExpandedSuggestion = async (item: any) => {
    if (!item.id) return
    setItemLoading(item.id, true)
    try {
      const customPrompt = `Anda adalah ahli pengolahan sampah. Berdasarkan data berikut sebagai konteks:\n${JSON.stringify({
        nama_item: item.nama_item,
        kategori_sampah: item.kategori_sampah,
        detail_analisis: item.detail_analisis,
        saran_pengolahan: item.saran_pengolahan,
        confidence_score: item.confidence_score,
      })}\nBuat 4-6 langkah pengolahan yang terperinci, tindakan jelas, dan tips keselamatan. Kembalikan hanya teks narasi.`

      const payload: any = { prompt: customPrompt }
      if (item.imageUrl) payload.image = item.imageUrl

      const res = await fetch(getGeminiAnalyzeUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Gemini request failed")

      const data = await res.json()
      const expanded = data.saran_pengolahan || data.detail_analisis || data.__text || JSON.stringify(data)

      await updateScanItem(item.id, { expandedSuggestion: expanded })
      setExpandedMap((prev) => ({ ...prev, [item.id]: true }))
    } catch (err) {
      console.error("Generate expanded suggestion failed:", err)
    } finally {
      setItemLoading(item.id, false)
    }
  }

  const categories = ["Semua", "Plastik", "Kertas", "Logam", "Organik", "B3", "Residu"]

  const getCategoryColor = (category: string) => {
    const colorMap: any = {
      Organik: "#f59e0b",
      Plastik: "#3b82f6",
      Kertas: "#8b5cf6",
      Logam: "#6b7280",
      B3: "#ef4444",
      Residu: "#78716c",
    }
    return colorMap[category] || colors.primary
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: any = {
      Plastik: "bottle-soda",
      Kertas: "file-document",
      Logam: "gold",
      Organik: "leaf",
      B3: "alert",
      Residu: "delete",
    }
    return iconMap[category] || "recycle"
  }

  // Filter history based on search dan category
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.nama_item.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        !selectedCategory || selectedCategory === "Semua" || item.kategori_sampah === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [history, searchQuery, selectedCategory])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalWeight = filteredHistory.reduce((sum, item) => sum + item.beratEstimasiKg, 0)
    const totalValue = filteredHistory.reduce((sum, item) => sum + item.estimasi_harga, 0)
    return {
      count: filteredHistory.length,
      totalWeight: totalWeight.toFixed(1),
      totalValue,
    }
  }, [filteredHistory])

  const renderItem = ({ item }: any) => (
    <Card style={styles.historyCard}>
      <Card.Content>
        <View style={styles.historyHeader}>
          <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.kategori_sampah) }]}>
            <Icon name={getCategoryIcon(item.kategori_sampah)} size={28} color={colors.surface} />
          </View>
          <View style={styles.historyInfo}>
            <Text style={styles.itemName}>{item.nama_item}</Text>
            <Text style={styles.category}>{item.kategori_sampah}</Text>
          </View>
          <View style={styles.historyStats}>
            <Text style={styles.weight}>{item.beratEstimasiKg.toFixed(1)} kg</Text>
            <Text style={styles.price}>Rp {item.estimasi_harga.toLocaleString("id-ID")}</Text>
          </View>
        </View>

        {item.detail_analisis && (
          <View style={styles.analysisSection}>
            <Text style={styles.analysisLabel}>Analisis</Text>
            <Text style={styles.analysisText}>{item.detail_analisis}</Text>
          </View>
        )}

        <View style={styles.historyFooter}>
          <View style={styles.locationInfo}>
            <Icon name="map-marker" size={14} color={colors.textSecondary} />
            <Text style={styles.location}>{item.lokasi || "Lokasi tidak tersedia"}</Text>
          </View>
          <Text style={styles.date}>
            {item.timestamp.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>

        {item.expandedSuggestion ? (
          <>
            <TouchableOpacity style={styles.suggestButton} onPress={() => toggleExpanded(item.id)}>
              <Icon name="lightbulb-outline" size={16} color={colors.primary} />
              <Text style={styles.suggestText}>{expandedMap[item.id] ? "Tutup saran terperinci" : "Lihat saran pengolahan"}</Text>
            </TouchableOpacity>

            {expandedMap[item.id] && (
              <View style={styles.expandedSuggestionBox}>
                <Text style={styles.expandedSuggestionText}>{item.expandedSuggestion}</Text>
              </View>
            )}
          </>
        ) : (
          item.saran_pengolahan && (
            <>
              <TouchableOpacity style={styles.suggestButton}>
                <Icon name="lightbulb-outline" size={16} color={colors.primary} />
                <Text style={styles.suggestText}>Lihat saran pengolahan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.suggestButton, { marginTop: 8, backgroundColor: colors.primary }]}
                onPress={() => generateExpandedSuggestion(item)}
                disabled={loadingMap[item.id]}
              >
                <Icon name="robot" size={16} color={colors.surface} />
                <Text style={[styles.suggestText, { color: colors.surface, marginLeft: 8 }]}>Generate saran terperinci</Text>
              </TouchableOpacity>
              {loadingMap[item.id] && (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ color: colors.textSecondary }}>Menghasilkan saran...</Text>
                </View>
              )}
            </>
          )
        )}
      </Card.Content>
    </Card>
  )

  return (
    <View style={styles.container}>
      {/* Header dengan statistik */}
      <View style={styles.statsHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Riwayat Scan</Text>
            <Text style={styles.headerSubtitle}>{stats.count} item ditemukan</Text>
          </View>
          <View style={styles.refreshButton}>
            <Icon name="refresh" size={24} color={colors.primary} />
          </View>
        </View>

        {stats.count > 0 && (
          <View style={styles.statsSummary}>
            <View style={styles.statBox}>
              <Icon name="scale-bathroom" size={20} color={colors.primary} />
              <Text style={styles.statValue}>{stats.totalWeight} kg</Text>
              <Text style={styles.statLabel}>Total Berat</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="cash" size={20} color={colors.success} />
              <Text style={styles.statValue}>Rp {(stats.totalValue / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>Total Nilai</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="recycle" size={20} color={colors.info} />
              <Text style={styles.statValue}>{stats.count}</Text>
              <Text style={styles.statLabel}>Total Item</Text>
            </View>
          </View>
        )}
      </View>

      {/* Search */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Cari riwayat scan..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={colors.primary}
        />
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item || (item === "Semua" && !selectedCategory)}
              onPress={() => setSelectedCategory(item === "Semua" ? null : item)}
              style={[
                styles.filterChip,
                (selectedCategory === item || (item === "Semua" && !selectedCategory)) && styles.filterChipSelected,
              ]}
              textStyle={[
                styles.filterChipText,
                (selectedCategory === item || (item === "Semua" && !selectedCategory)) && styles.filterChipTextSelected,
              ]}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      {/* History List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHistory} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="history" size={80} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Belum ada riwayat scan</Text>
            <Text style={styles.emptySubtext}>Mulai scan sampah untuk melihat riwayat di sini</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsHeader: {
    backgroundColor: colors.primary,
    padding: 16,
    paddingTop: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.surface,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.surface,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  searchbar: {
    backgroundColor: colors.background,
    elevation: 0,
  },
  filterContainer: {
    backgroundColor: colors.surface,
    paddingBottom: 16,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: colors.background,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: colors.text,
  },
  filterChipTextSelected: {
    color: colors.surface,
  },
  list: {
    padding: 12,
  },
  historyCard: {
    marginBottom: 12,
    backgroundColor: colors.surface,
    elevation: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
  historyStats: {
    alignItems: "flex-end",
  },
  weight: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  price: {
    fontSize: 13,
    color: colors.success,
    marginTop: 4,
    fontWeight: "600",
  },
  analysisSection: {
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  analysisLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  analysisText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  suggestButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  suggestText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
    marginLeft: 6,
  },
  expandedSuggestionBox: {
    marginTop: 10,
    backgroundColor: "rgba(0,0,0,0.04)",
    padding: 10,
    borderRadius: 8,
  },
  expandedSuggestionText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
})
