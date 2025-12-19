"use client"

import { useState } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native"
import { TextInput, Button } from "react-native-paper"
import { useAuth } from "../../contexts/AuthContext"
import { colors } from "../theme"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Mohon isi email dan password")
      return
    }
    // Trim inputs to avoid accidental spaces
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    // Debug: log email and password length (do NOT log raw password)
    console.log("Attempting login for:", trimmedEmail, "passwordLength=", trimmedPassword.length)

    setLoading(true)
    try {
      await login(trimmedEmail, trimmedPassword)
    } catch (error: any) {
      console.error("LoginScreen caught error:", error)
      Alert.alert("Error", error.message || "Login gagal")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    // Placeholder UI action. Implement OAuth/Expo Google Sign-In in production.
    console.log("Google Sign-In pressed")
    Alert.alert(
      "Masuk dengan Google",
      "Fitur Google Sign-In belum dikonfigurasi. Untuk mengaktifkannya, ikuti petunjuk di README dan siapkan OAuth di Google Cloud Console.",
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>♻️</Text>
          </View>
          <Text style={styles.title}>SmartEcoApp</Text>
          <Text style={styles.subtitle}>Scan, Sort, Save the Earth</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Masuk
          </Button>

          <Button
            mode="outlined"
            onPress={handleGoogleSignIn}
            style={[styles.button, styles.googleButton]}
            contentStyle={styles.googleButtonContent}
            icon="google"
          >
            Masuk dengan Google
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate("Register")}
            style={styles.linkButton}
            textColor={colors.primary}
          >
            Belum punya akun? Daftar
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 16,
  },
  googleButton: {
    marginTop: 12,
    borderColor: colors.border,
  },
  googleButtonContent: {
    paddingVertical: 8,
  },
})
