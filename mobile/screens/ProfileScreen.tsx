"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Card, Button, Avatar, ProgressBar } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../contexts/AuthContext"
import { colors } from "../theme"

export default function ProfileScreen() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", onPress: logout, style: "destructive" },
    ])
  }

  const getLevelProgress = () => {
    const levels = { Bronze: 0, Silver: 1000, Gold: 2500, Platinum: 5000 }
    const currentLevel = user?.level || "Bronze"
    const currentPoin = user?.totalPoin || 0

    if (currentLevel === "Platinum") return 1

    const nextLevelPoin = levels[currentLevel as keyof typeof levels]
    return currentPoin / nextLevelPoin
  }

  const achievements = [
    { icon: "trophy", title: "First Scan", subtitle: "Selesaikan scan pertama", unlocked: true },
    { icon: "star", title: "10 Scans", subtitle: "Scan 10 sampah", unlocked: true },
    { icon: "fire", title: "Streak 7 Days", subtitle: "Scan 7 hari berturut-turut", unlocked: false },
    { icon: "crown", title: "Gold Member", subtitle: "Capai level Gold", unlocked: true },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="account" style={styles.avatar} color={colors.surface} />
        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <Card style={styles.levelCard}>
        <Card.Content>
          <View style={styles.levelHeader}>
            <View style={styles.levelBadge}>
              <Icon name="medal" size={32} color={colors.warning} />
              <Text style={styles.levelText}>{user?.level}</Text>
            </View>
            <View style={styles.poinContainer}>
              <Icon name="star" size={24} color={colors.warning} />
              <Text style={styles.poinText}>{user?.totalPoin}</Text>
            </View>
          </View>
          <ProgressBar progress={getLevelProgress()} color={colors.primary} style={styles.progressBar} />
          <Text style={styles.progressText}>
            {user?.level === "Platinum"
              ? "Level Maksimal Tercapai!"
              : `${Math.round(getLevelProgress() * 100)}% menuju level berikutnya`}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Statistik</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Icon name="qrcode-scan" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{user?.totalScanCount}</Text>
              <Text style={styles.statLabel}>Total Scan</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="weight-kilogram" size={24} color={colors.success} />
              <Text style={styles.statValue}>{user?.totalBeratSampahKg}</Text>
              <Text style={styles.statLabel}>Kg Sampah</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="leaf" size={24} color={colors.info} />
              <Text style={styles.statValue}>{((user?.totalBeratSampahKg || 0) * 2.5).toFixed(1)}</Text>
              <Text style={styles.statLabel}>Kg CO₂</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.achievementsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Pencapaian</Text>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.unlocked ? colors.primary : colors.border },
                ]}
              >
                <Icon
                  name={achievement.icon}
                  size={24}
                  color={achievement.unlocked ? colors.surface : colors.textSecondary}
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, !achievement.unlocked && styles.achievementLocked]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementSubtitle}>{achievement.subtitle}</Text>
              </View>
              {achievement.unlocked && <Icon name="check-circle" size={24} color={colors.success} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="cog" size={24} color={colors.text} />
          <Text style={styles.actionText}>Pengaturan</Text>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="help-circle" size={24} color={colors.text} />
          <Text style={styles.actionText}>Bantuan</Text>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="information" size={24} color={colors.text} />
          <Text style={styles.actionText}>Tentang</Text>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton} textColor={colors.error} icon="logout">
        Keluar
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: colors.primary,
  },
  avatar: {
    backgroundColor: colors.primaryDark,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.surface,
  },
  email: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
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
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginLeft: 12,
  },
  poinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  poinText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    marginLeft: 8,
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
    textAlign: "center",
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  achievementsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  achievementLocked: {
    color: colors.textSecondary,
  },
  achievementSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderColor: colors.error,
  },
})
