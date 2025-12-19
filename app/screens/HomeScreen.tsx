"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { Card, ProgressBar } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../../contexts/AuthContext"
import { colors } from "../theme"

const { width } = Dimensions.get("window")

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth()

  const getLevelProgress = () => {
    const levels = { Bronze: 0, Silver: 1000, Gold: 2500, Platinum: 5000 }
    const currentLevel = user?.level || "Bronze"
    const currentPoin = user?.totalPoin || 0

    if (currentLevel === "Platinum") return 1

    const nextLevelPoin = levels[currentLevel as keyof typeof levels]
    return currentPoin / nextLevelPoin
  }

  const quickActions = [
    { icon: "camera", label: "Scan", color: colors.primary, screen: "Scan" },
    { icon: "history", label: "Riwayat", color: colors.info, screen: "History" },
    { icon: "map-marker", label: "Bank Sampah", color: colors.warning, screen: "Map" },
    { icon: "trophy", label: "Leaderboard", color: colors.success, screen: "Profile" },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, {user?.displayName}!</Text>
          <Text style={styles.subGreeting}>Mari selamatkan bumi hari ini</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <View style={styles.avatar}>
            <Icon name="account" size={32} color={colors.surface} />
          </View>
        </TouchableOpacity>
      </View>

      <Card style={styles.levelCard}>
        <Card.Content>
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelLabel}>Level Saat Ini</Text>
              <Text style={styles.levelText}>{user?.level}</Text>
            </View>
            <View style={styles.poinBadge}>
              <Icon name="star" size={20} color={colors.warning} />
              <Text style={styles.poinText}>{user?.totalPoin} Poin</Text>
            </View>
          </View>
          <ProgressBar progress={getLevelProgress()} color={colors.primary} style={styles.progressBar} />
          <Text style={styles.progressText}>
            {user?.level === "Platinum"
              ? "Level Maksimal!"
              : `${Math.round(getLevelProgress() * 100)}% menuju ${user?.level === "Bronze" ? "Silver" : user?.level === "Silver" ? "Gold" : "Platinum"}`}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="qrcode-scan" size={32} color={colors.primary} />
            <Text style={styles.statNumber}>{user?.totalScanCount}</Text>
            <Text style={styles.statLabel}>Total Scan</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="weight-kilogram" size={32} color={colors.success} />
            <Text style={styles.statNumber}>{user?.totalBeratSampahKg}</Text>
            <Text style={styles.statLabel}>Kg Sampah</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="leaf" size={32} color={colors.info} />
            <Text style={styles.statNumber}>{((user?.totalBeratSampahKg || 0) * 2.5).toFixed(1)}</Text>
            <Text style={styles.statLabel}>Kg CO₂</Text>
          </Card.Content>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionButton, { backgroundColor: action.color }]}
            onPress={() => navigation.navigate(action.screen)}
          >
            <Icon name={action.icon} size={32} color={colors.surface} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.tipCard}>
        <Card.Content>
          <View style={styles.tipHeader}>
            <Icon name="lightbulb" size={24} color={colors.warning} />
            <Text style={styles.tipTitle}>Tips Hari Ini</Text>
          </View>
          <Text style={styles.tipText}>
            Botol plastik yang bersih memiliki nilai jual 3-4x lebih tinggi! Bilas botol sebelum menyimpan untuk hasil
            maksimal.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.primary,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.surface,
  },
  subGreeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
  },
  levelCard: {
    margin: 16,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  levelLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  levelText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  poinBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  poinText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    width: (width - 48) / 2,
    aspectRatio: 1.5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    padding: 12,
  },
  actionLabel: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
    flex: 1,
    width: "100%",
  },
  tipCard: {
    margin: 16,
    backgroundColor: "#fef3c7",
    elevation: 2,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#78350f",
    lineHeight: 20,
  },
})
