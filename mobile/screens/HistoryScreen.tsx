"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { Card, Chip, Searchbar } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../theme"

const DEMO_HISTORY = [
  {
    id: "1",
    kategori_sampah: "Plastik",
    nama_item: "Botol PET",
    beratEstimasiKg: 2.5,
    estimasi_harga: 8750,
    timestamp: new Date("2024-01-10"),
    lokasi: "Jakarta Selatan",
  },
  {
    id: "2",
    kategori_sampah: "Kertas",
    nama_item: "Kardus",
    beratEstimasiKg: 5.0,
    estimasi_harga: 10000,
    timestamp: new Date("2024-01-09"),
    lokasi: "Jakarta Pusat",
  },
  {
    id: "3",
    kategori_sampah: "Logam",
    nama_item: "Kaleng Aluminium",
    beratEstimasiKg: 1.2,
    estimasi_harga: 12000,
    timestamp: new Date("2024-01-08"),
    lokasi: "Jakarta Barat",
  },
]

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ["Semua", "Plastik", "Kertas", "Logam", "Organik", "B3", "Residu"]

  const getCategoryColor = (category: string) => {
    const colorMap: any = {
      Organik: colors.warning,
      Plastik: colors.info,
      Kertas: "#8b5cf6",
      Logam: "#6b7280",
      B3: colors.error,
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

  const filteredHistory = DEMO_HISTORY.filter((item) => {
    const matchesSearch = item.nama_item.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      !selectedCategory || selectedCategory === "Semua" || item.kategori_sampah === selectedCategory
    return matchesSearch && matchesCategory
  })

  const renderItem = ({ item }: any) => (
    <Card style={styles.historyCard}>
      <Card.Content>
        <View style={styles.historyHeader}>
          <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.kategori_sampah) }]}>
            <Icon name={getCategoryIcon(item.kategori_sampah)} size={24} color={colors.surface} />
          </View>
          <View style={styles.historyInfo}>
            <Text style={styles.itemName}>{item.nama_item}</Text>
            <Text style={styles.category}>{item.kategori_sampah}</Text>
          </View>
          <View style={styles.historyStats}>
            <Text style={styles.weight}>{item.beratEstimasiKg} kg</Text>
            <Text style={styles.price}>Rp {item.estimasi_harga.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.historyFooter}>
          <View style={styles.locationInfo}>
            <Icon name="map-marker" size={14} color={colors.textSecondary} />
            <Text style={styles.location}>{item.lokasi}</Text>
          </View>
          <Text style={styles.date}>
            {item.timestamp.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Cari riwayat scan..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={colors.primary}
        />
      </View>

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
              textStyle={styles.filterChipText}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="history" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Belum ada riwayat scan</Text>
            <Text style={styles.emptySubtext}>Mulai scan sampah untuk melihat riwayat</Text>
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
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  historyCard: {
    marginBottom: 12,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyStats: {
    alignItems: "flex-end",
  },
  weight: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  price: {
    fontSize: 14,
    color: colors.success,
    marginTop: 2,
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
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
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
