"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
import { Card, Button, TextInput } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../../contexts/AuthContext"
import { colors } from "../theme"

export default function ResultScreen({ route, navigation }: any) {
  const { result } = route.params
  const { user, updateUserData } = useAuth()
  const [berat, setBerat] = useState("")
  const [saving, setSaving] = useState(false)

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

  const handleSave = async () => {
    if (!berat || Number.parseFloat(berat) <= 0) {
      Alert.alert("Error", "Mohon masukkan berat sampah yang valid")
      return
    }

    setSaving(true)

    // Simulate saving with delay
    setTimeout(() => {
      const beratNum = Number.parseFloat(berat)
      const poinEarned = Math.round(beratNum * 10)

      // Update user data
      updateUserData({
        totalPoin: (user?.totalPoin || 0) + poinEarned,
        totalScanCount: (user?.totalScanCount || 0) + 1,
        totalBeratSampahKg: (user?.totalBeratSampahKg || 0) + beratNum,
      })

      setSaving(false)

      Alert.alert("Berhasil!", `+${poinEarned} poin! Data scan telah disimpan ke riwayat.`, [
        {
          text: "Lihat Riwayat",
          onPress: () => navigation.navigate("MainTabs", { screen: "History" }),
        },
        {
          text: "Scan Lagi",
          onPress: () => navigation.navigate("MainTabs", { screen: "Scan" }),
        },
      ])
    }, 1000)
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.imageCard}>
        <View style={styles.imageContainer}>
          <Icon name="recycle" size={100} color={colors.primary} />
        </View>
      </Card>

      <Card style={styles.resultCard}>
        <Card.Content>
          <View style={styles.statusBadge}>
            {result.is_sampah ? (
              <>
                <Icon name="check-circle" size={20} color={colors.success} />
                <Text style={styles.statusText}>Sampah Terdeteksi</Text>
              </>
            ) : (
              <>
                <Icon name="close-circle" size={20} color={colors.error} />
                <Text style={styles.statusText}>Bukan Sampah</Text>
              </>
            )}
          </View>

          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(result.kategori_sampah) }]}>
            <Text style={styles.categoryText}>{result.kategori_sampah}</Text>
          </View>

          <Text style={styles.itemName}>{result.nama_item}</Text>

          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence:</Text>
            <Text style={styles.confidenceValue}>{result.confidence_score}%</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.priceCard}>
        <Card.Content>
          <View style={styles.priceHeader}>
            <Icon name="cash" size={24} color={colors.success} />
            <Text style={styles.priceTitle}>Estimasi Harga</Text>
          </View>
          <Text style={styles.priceValue}>Rp {result.estimasi_harga_jual_rp_per_kg.toLocaleString()} /kg</Text>
        </Card.Content>
      </Card>

      <Card style={styles.suggestionCard}>
        <Card.Content>
          <View style={styles.suggestionHeader}>
            <Icon name="lightbulb" size={24} color={colors.warning} />
            <Text style={styles.suggestionTitle}>Saran Pengolahan</Text>
          </View>
          <Text style={styles.suggestionText}>{result.saran_pengolahan}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.detailCard}>
        <Card.Content>
          <Text style={styles.detailTitle}>Detail Analisis</Text>
          <Text style={styles.detailText}>{result.detail_analisis}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.inputCard}>
        <Card.Content>
          <Text style={styles.inputLabel}>Berat Sampah (kg)</Text>
          <TextInput
            value={berat}
            onChangeText={setBerat}
            mode="outlined"
            keyboardType="decimal-pad"
            placeholder="Contoh: 2.5"
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />

          {berat && Number.parseFloat(berat) > 0 && (
            <View style={styles.estimateContainer}>
              <Text style={styles.estimateLabel}>Estimasi Total Harga:</Text>
              <Text style={styles.estimateValue}>
                Rp {(Number.parseFloat(berat) * result.estimasi_harga_jual_rp_per_kg).toLocaleString()}
              </Text>
              <Text style={styles.poinEarn}>+{Math.round(Number.parseFloat(berat) * 10)} poin</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
          contentStyle={styles.buttonContent}
          icon="content-save"
        >
          Simpan ke Riwayat
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate("MainTabs", { screen: "Map" })}
          style={styles.mapButton}
          contentStyle={styles.buttonContent}
          icon="map-marker"
        >
          Cari Bank Sampah
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  imageContainer: {
    aspectRatio: 4 / 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  resultCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.success,
    marginLeft: 8,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  categoryText: {
    color: colors.surface,
    fontWeight: "bold",
    fontSize: 14,
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  confidenceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  priceCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#ecfdf5",
    elevation: 2,
  },
  priceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.success,
  },
  suggestionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#fef3c7",
    elevation: 2,
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginLeft: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "#78350f",
    lineHeight: 20,
  },
  detailCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  inputCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
  },
  estimateContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  estimateLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  estimateValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  poinEarn: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.success,
    marginTop: 8,
  },
  actions: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  mapButton: {
    borderColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
})
