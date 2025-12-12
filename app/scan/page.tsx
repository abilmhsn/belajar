"use client"

import { AuthGate } from "@/components/auth-gate"
import { ScanPage } from "@/components/scan-page"

export default function Scan() {
  return (
    <AuthGate>
      <ScanPage />
    </AuthGate>
  )
}
