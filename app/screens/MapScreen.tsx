"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { Card, Button } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../theme"

const DEMO_BANK_SAMPAH = [
  {
    id: "1",
    nama: "Bank Sampah Hijau Lestari",
    alamat: "Jl. Gatot Subroto No. 123, Jakarta Selatan",
    latitude: -6.2088,
    longitude: 106.8456,
    rating: 4.8,
    telepon: "081234567890",
    jamBuka: "08:00",
    jamTutup: "16:00",
    hargaBeli: {
      Plastik: 3500,
      Kertas: 2000,
      Logam: 10000,
    },
  },
  {
    id: "2",
    nama: "Bank Sampah Bersih Indah",
    alamat: "Jl. Sudirman No. 456, Jakarta Pusat",
    latitude: -6.1944,
    longitude: 106.8229,
    rating: 4.5,
    telepon: "081298765432",
    jamBuka: "09:00",
    jamTutup: "17:00",
    hargaBeli: {
      Plastik: 3000,
      Kertas: 1800,
      Logam: 9500,
    },
  },
]

export default function MapScreen() {
  const [selectedBank, setSelectedBank] = useState<any>(null)

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`)
  }

  const handleDirection = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    Linking.openURL(url)
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -6.2088,
          longitude: 106.8456,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {DEMO_BANK_SAMPAH.map((bank) => (
          <Marker
            key={bank.id}
            coordinate={{
              latitude: bank.latitude,
              longitude: bank.longitude,
            }}
            onPress={() => setSelectedBank(bank)}
          >
            <View style={styles.markerContainer}>
              <Icon name="recycle" size={24} color={colors.primary} />
            </View>
          </Marker>
        ))}

        {/* User location marker */}
        <Marker
          coordinate={{
            latitude: -6.2088,
            longitude: 106.8456,
          }}
        >
          <View style={styles.userMarker}>
            <Icon name="account" size={16} color={colors.surface} />
          </View>
        </Marker>
      </MapView>

      {selectedBank && (
        <View style={styles.bottomSheet}>
          <ScrollView>
            <Card style={styles.bankCard}>
              <Card.Content>
                <View style={styles.bankHeader}>
                  <View style={styles.bankTitleContainer}>
                    <Text style={styles.bankName}>{selectedBank.nama}</Text>
                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={16} color={colors.warning} />
                      <Text style={styles.rating}>{selectedBank.rating}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedBank(null)}>
                    <Icon name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="map-marker" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{selectedBank.alamat}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="clock" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    {selectedBank.jamBuka} - {selectedBank.jamTutup}
                  </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.priceTitle}>Harga Beli (per kg)</Text>
                <View style={styles.priceGrid}>
                  {Object.entries(selectedBank.hargaBeli).map(([kategori, harga]: any) => (
                    <View key={kategori} style={styles.priceItem}>
                      <Text style={styles.priceCategory}>{kategori}</Text>
                      <Text style={styles.priceValue}>Rp {harga.toLocaleString()}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actions}>
                  <Button
                    mode="contained"
                    onPress={() => handleDirection(selectedBank.latitude, selectedBank.longitude)}
                    style={styles.directionButton}
                    icon="directions"
                  >
                    Arah
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleCall(selectedBank.telepon)}
                    style={styles.callButton}
                    icon="phone"
                  >
                    Telepon
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 4,
  },
  userMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.info,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.surface,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "60%",
    backgroundColor: "transparent",
  },
  bankCard: {
    margin: 16,
    backgroundColor: colors.surface,
    elevation: 8,
  },
  bankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  bankTitleContainer: {
    flex: 1,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  priceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  priceItem: {
    flex: 1,
    minWidth: "30%",
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: "center",
  },
  priceCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  directionButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  callButton: {
    flex: 1,
    borderColor: colors.primary,
  },
})
