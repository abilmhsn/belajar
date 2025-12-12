"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"
import * as ImagePicker from "expo-image-picker"
import { Button } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../theme"

export default function ScanScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!permission) {
    return <View style={styles.container} />
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera-off" size={64} color={colors.textSecondary} />
        <Text style={styles.permissionText}>Akses kamera diperlukan untuk scan sampah</Text>
        <Button mode="contained" onPress={requestPermission} style={styles.permissionButton}>
          Izinkan Akses Kamera
        </Button>
      </View>
    )
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      analyzeImage(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    Alert.alert("Demo Mode", "Fitur kamera akan menggunakan gambar demo", [
      { text: "OK", onPress: () => analyzeImage("demo") },
    ])
  }

  const analyzeImage = (imageUri: string) => {
    // Navigate to result with demo data
    const demoResult = {
      is_sampah: true,
      kategori_sampah: "Plastik",
      nama_item: "Botol PET",
      estimasi_harga_jual_rp_per_kg: 3500,
      saran_pengolahan: "Cuci bersih, lepas label, dan kumpulkan minimal 5kg untuk dijual ke bank sampah terdekat",
      confidence_score: 95,
      detail_analisis:
        "Botol plastik PET (kode 1) dengan kondisi bersih, mudah didaur ulang, memiliki nilai jual tinggi",
      imageUri,
    }

    navigation.navigate("Result", { result: demoResult })
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <Text style={styles.title}>Scan Sampah</Text>
            <Text style={styles.subtitle}>Arahkan kamera ke sampah</Text>
          </View>

          <View style={styles.frameContainer}>
            <View style={styles.frame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Icon name="image" size={32} color={colors.surface} />
              <Text style={styles.controlText}>Galeri</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.flashButton}>
              <Icon name="flash-off" size={32} color={colors.surface} />
              <Text style={styles.controlText}>Flash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginVertical: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.surface,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  frameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 280,
    height: 280,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  galleryButton: {
    alignItems: "center",
  },
  flashButton: {
    alignItems: "center",
  },
  controlText: {
    color: colors.surface,
    fontSize: 12,
    marginTop: 4,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.primary,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
  },
})
