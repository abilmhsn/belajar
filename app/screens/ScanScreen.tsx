"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { CameraView, useCameraPermissions, FlashMode } from "expo-camera"
import * as ImagePicker from "expo-image-picker"
import { Button } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../theme"
import { useScanHistory } from "../../hooks/useScanHistory"

// PERBAIKAN 1: Gunakan import legacy sesuai instruksi error
import * as FileSystem from "expo-file-system/legacy"; 

import { analyzeTrashImage } from "../../lib/gemini"

export default function ScanScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [flash, setFlash] = useState<FlashMode>("off")
  const cameraRef = useRef<CameraView>(null)
  const { addScanItem } = useScanHistory()

  if (!permission) return <View style={styles.container} />

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

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"))
  }

  const uriToBase64 = async (uri: string): Promise<string> => {
    try {
      // Sekarang menggunakan FileSystem dari /legacy
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      return base64;
    } catch (error) {
      console.error("Error reading file:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      })
      if (!result.canceled) await analyzeImage(result.assets[0].uri)
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil gambar")
    }
  }

  const takePhoto = async () => {
    if (!cameraRef.current || isAnalyzing) return
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
      })
      if (photo?.uri) await analyzeImage(photo.uri)
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil foto")
    }
  }

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true)
    try {
      const base64Image = await uriToBase64(imageUri)
      const aiResult = await analyzeTrashImage(base64Image)

      await addScanItem({
        nama_item: aiResult.nama_item,
        kategori_sampah: aiResult.kategori_sampah,
        beratEstimasiKg: 1,
        estimasi_harga: aiResult.estimasi_harga_jual_rp_per_kg,
        lokasi: "Cirebon",
        saran_pengolahan: aiResult.saran_pengolahan,
        confidence_score: aiResult.confidence_score,
        detail_analisis: aiResult.detail_analisis,
      })

      navigation.navigate("Result", {
        result: { ...aiResult, imageUri },
      })
    } catch (error: any) {
      console.error("AI Scan failed:", error)
      Alert.alert("Scan Gagal", "Pastikan koneksi internet stabil.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* PERBAIKAN 2: CameraView diletakkan sejajar (Sibling), bukan sebagai pembungkus */}
      <CameraView 
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject} 
        facing="back"
        flash={flash}
      />

      {/* Overlay UI menggunakan absolute positioning */}
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
            
            {isAnalyzing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Menganalisis...</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage} disabled={isAnalyzing}>
            <Icon name="image" size={32} color="#FFF" />
            <Text style={styles.controlText}>Galeri</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.captureButton, isAnalyzing && { opacity: 0.5 }]} 
            onPress={takePhoto} 
            disabled={isAnalyzing}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash} disabled={isAnalyzing}>
            <Icon 
              name={flash === "on" ? "flash" : "flash-off"} 
              size={32} 
              color={flash === "on" ? "#FFD700" : "#FFF"} 
            />
            <Text style={styles.controlText}>Flash</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 24,
    color: "#666"
  },
  permissionButton: {
    backgroundColor: colors.primary,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)", // Transparansi sedikit agar kamera terlihat
    justifyContent: "space-between",
  },
  topBar: {
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  frameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: colors.primary,
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  loadingContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    marginTop: 10,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 40,
  },
  galleryButton: { alignItems: "center" },
  flashButton: { alignItems: "center" },
  controlText: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 4,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
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