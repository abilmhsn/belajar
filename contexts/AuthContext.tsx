"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc, setDoc, enableNetwork } from "firebase/firestore"
import { auth, db } from "../lib/firebase"

interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  totalPoin: number
  level: string
  totalScanCount: number
  totalBeratSampahKg: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  updateUserData: (data: Partial<User>) => void
  clearStorage: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Ensure Firestore network is enabled when we have a logged-in user
          try {
            await enableNetwork(db)
            console.log("Firestore network enabled")
          } catch (e) {
            console.warn("enableNetwork failed:", e)
          }
          // User is logged in - fetch from Firestore
          console.log("Firebase user detected:", firebaseUser.email)
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
            if (userDoc.exists()) {
              const userData = userDoc.data() as User
              setUser(userData)
              // Sync to AsyncStorage for offline access
              await AsyncStorage.setItem("user", JSON.stringify(userData))
            } else {
              // User doesn't have Firestore doc yet (shouldn't happen after registration)
              console.warn("User Firestore doc not found")
              setUser(null)
            }
          } catch (err: any) {
            console.error("Failed to fetch userDoc (possibly offline):", err)
            // Try to use cached AsyncStorage user when offline
            try {
              const raw = await AsyncStorage.getItem("user")
              if (raw) {
                const cached = JSON.parse(raw) as User
                setUser(cached)
                console.log("Loaded user from AsyncStorage (offline)")
              } else {
                setUser(null)
              }
            } catch (e) {
              console.error("Failed to read AsyncStorage fallback:", e)
              setUser(null)
            }
          }
        } else {
          // User is logged out
          console.log("No Firebase user - clearing local user")
          setUser(null)
          await AsyncStorage.removeItem("user")
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    // Trim inputs and basic validation
    const e = email?.trim()
    const p = password?.trim()
    if (!e || !p) {
      throw new Error("Mohon isi email dan password")
    }
    if (!e.includes("@")) {
      throw new Error("Alamat email tidak valid")
    }

    try {
      // Diagnostic logs: inspect auth instance and app options to diagnose invalid-credential
      try {
        console.log("Auth diagnostic - currentUser:", auth?.currentUser)
        console.log("Auth diagnostic - app projectId:", auth?.app?.options?.projectId)
        console.log("Auth diagnostic - app apiKey:", !!auth?.app?.options?.apiKey)
      } catch (e) {
        console.warn("Auth diagnostic logging failed:", e)
      }

      const userCredential = await signInWithEmailAndPassword(auth, e, p)
      console.log("Login successful:", userCredential.user.email)

      // Ensure network enabled then try to read user doc, fall back to AsyncStorage when offline
      try {
        try {
          await enableNetwork(db)
        } catch (e) {
          console.warn("enableNetwork failed during login:", e)
        }

        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as User
          setUser(userData)
          await AsyncStorage.setItem("user", JSON.stringify(userData))
        } else {
          console.warn("Login: user doc not found for uid", userCredential.user.uid)
        }
      } catch (err: any) {
        console.error("Login: failed to fetch user doc (possibly offline):", err)
        // Try cached AsyncStorage
        try {
          const raw = await AsyncStorage.getItem("user")
          if (raw) {
            const cached = JSON.parse(raw) as User
            setUser(cached)
            console.log("Login: loaded user from AsyncStorage (offline)")
          }
        } catch (e) {
          console.error("Login: AsyncStorage fallback failed:", e)
        }
      }
    } catch (error: any) {
      // Log raw error
      console.error("Login error (raw):", error)

      // Normalize/find auth code: prefer error.code, fallback to parsing error.message
      let code: string | undefined = error?.code
      if (!code && typeof error?.message === "string") {
        // try patterns like "(auth/invalid-credential)" or "auth/invalid-credential"
        const m = error.message.match(/auth\/([-_a-zA-Z0-9]+)/) || error.message.match(/\(auth\/([-_a-zA-Z0-9]+)\)/)
        if (m && m[0]) {
          // if match is like "auth/invalid-credential" use it, otherwise construct
          code = m[0].startsWith("auth/") ? m[0] : `auth/${m[1]}`
        }
      }

      console.error("Parsed auth code:", code)

      // Clear local user data on auth errors that indicate invalid session/credential
      if (code === "auth/invalid-credential" || code === "auth/internal-error") {
        await AsyncStorage.removeItem("user").catch(() => null)
        setUser(null)
      }

      // Map common Firebase auth error codes to user-friendly messages
      let friendly = "Login gagal"
      switch (code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          friendly = "Email atau password salah"
          break
        case "auth/user-not-found":
          friendly = "Akun tidak ditemukan"
          break
        case "auth/too-many-requests":
          friendly = "Terlalu banyak percobaan. Coba lagi nanti"
          break
        case "auth/invalid-email":
          friendly = "Alamat email tidak valid"
          break
        default:
          friendly = error?.message || "Login gagal"
      }

      throw new Error(friendly)
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    // Trim inputs
    const e = email?.trim()
    const p = password?.trim()
    const dn = displayName?.trim()

    if (!e || !p || !dn) {
      throw new Error("Mohon isi semua field")
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, e, p)
      console.log("Registration successful:", userCredential.user.email)

      // Create user document in Firestore
      const newUser: User = {
        uid: userCredential.user.uid,
        email: e,
        displayName: dn,
        photoURL: "",
        totalPoin: 0,
        level: "Bronze",
        totalScanCount: 0,
        totalBeratSampahKg: 0,
      }

      await setDoc(doc(db, "users", userCredential.user.uid), newUser)
      setUser(newUser)
      await AsyncStorage.setItem("user", JSON.stringify(newUser))
    } catch (error: any) {
      console.error("Register error:", error)
      throw new Error(
        error.code === "auth/email-already-in-use"
          ? "Email sudah terdaftar"
          : error.code === "auth/weak-password"
            ? "Password terlalu lemah (min 6 karakter)"
            : error.message || "Registrasi gagal"
      )
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      await AsyncStorage.removeItem("user")
      console.log("Logout successful")
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  const clearStorage = async () => {
    console.log("[DEV] Clearing all AsyncStorage")
    await AsyncStorage.clear()
    setUser(null)
  }

  const updateUserData = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      AsyncStorage.setItem("user", JSON.stringify(updatedUser)).catch(err =>
        console.error("Error saving user data:", err)
      )
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserData, clearStorage }}>
      {children}
    </AuthContext.Provider>
  )
}
