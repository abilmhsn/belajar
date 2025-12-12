"use client"

import { AuthGate } from "@/components/auth-gate"
import { ResultPage } from "@/components/result-page"

export default function Result() {
  return (
    <AuthGate>
      <ResultPage />
    </AuthGate>
  )
}
