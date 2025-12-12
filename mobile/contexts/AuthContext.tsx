"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error loading user:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    // Demo login - replace with Firebase auth
    const demoUser: User = {
      uid: "demo-123",
      email,
      displayName: "Demo User",
      photoURL: undefined,
      totalPoin: 2450,
      level: "Gold",
      totalScanCount: 47,
      totalBeratSampahKg: 23.5,
    }

    await AsyncStorage.setItem("user", JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const register = async (email: string, password: string, displayName: string) => {
    // Demo register - replace with Firebase auth
    const newUser: User = {
      uid: `user-${Date.now()}`,
      email,
      displayName,
      photoURL: undefined,
      totalPoin: 0,
      level: "Bronze",
      totalScanCount: 0,
      totalBeratSampahKg: 0,
    }

    await AsyncStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = async () => {
    await AsyncStorage.removeItem("user")
    setUser(null)
  }

  const updateUserData = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      AsyncStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  )
}
