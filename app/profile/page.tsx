"use client"

import { AuthGate } from "@/components/auth-gate"
import { ProfilePage } from "@/components/profile-page"

export default function Profile() {
  return (
    <AuthGate>
      <ProfilePage />
    </AuthGate>
  )
}
