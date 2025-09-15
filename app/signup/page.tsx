"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignupForm } from "@/components/signup-form"
import { useAuthStore } from "@/lib/auth-store"

export default function SignupPage() {
  const { token, checkToken } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    checkToken()
  }, [checkToken])

  useEffect(() => {
    if (token) {
      router.replace("/dashboard")
    }
  }, [token, router])

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  )
}