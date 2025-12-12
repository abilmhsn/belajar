"use client"

import { useState } from "react"
import { DashboardPage } from "@/components/dashboard-page"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />
  }

  return <DashboardPage />
}
