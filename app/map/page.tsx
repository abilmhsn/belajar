"use client"

import { AuthGate } from "@/components/auth-gate"
import { MapPage } from "@/components/map-page"

export default function Map() {
  return (
    <AuthGate>
      <MapPage />
    </AuthGate>
  )
}
