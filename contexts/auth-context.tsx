"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/lib/types"
import { demoUser, isDemoMode } from "@/lib/demo-data"

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserData: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      console.log("[v0] Running in demo mode")
      setUser(demoUser)
      setLoading(false)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setFirebaseUser(firebaseUser)
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
            if (userDoc.exists()) {
              setUser(userDoc.data() as User)
            }
          } catch (error) {
            console.error("[v0] Error fetching user data:", error)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error("[v0] Error setting up auth listener:", error)
      setLoading(false)
    }
  }, [])

  const signUp = async (email: string, password: string, displayName: string) => {
    if (isDemoMode) {
      console.log("[v0] Demo signup - auto login as demo user")
      setUser(demoUser)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const newUser: User = {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        photoURL: "",
        totalPoin: 0,
        level: "Bronze",
        joinDate: new Date(),
        lastActive: new Date(),
        totalScanCount: 0,
        totalBeratSampahKg: 0,
      }
      await setDoc(doc(db, "users", userCredential.user.uid), newUser)
      setUser(newUser)
    } catch (error: any) {
      console.error("[v0] Signup error:", error)
      throw new Error(error.message || "Gagal membuat akun. Pastikan koneksi Firebase sudah dikonfigurasi.")
    }
  }

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      console.log("[v0] Demo login - auto login as demo user")
      setUser(demoUser)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error("[v0] Signin error:", error)
      throw new Error(error.message || "Gagal login. Periksa email dan password Anda.")
    }
  }

  const logout = async () => {
    if (isDemoMode) {
      setUser(null)
      return
    }

    try {
      await signOut(auth)
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const updateUserData = async (data: Partial<User>) => {
    if (!user) return

    if (isDemoMode) {
      setUser({ ...user, ...data })
      return
    }

    try {
      await updateDoc(doc(db, "users", user.uid), data)
      setUser({ ...user, ...data })
    } catch (error) {
      console.error("[v0] Error updating user data:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signUp, signIn, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
