"use client"

import { AuthGate } from "@/components/auth-gate"
import { HistoryPage } from "@/components/history-page"

export default function History() {
  return (
    <AuthGate>
      <HistoryPage />
    </AuthGate>
  )
}
