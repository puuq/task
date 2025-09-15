"use client"
import DashboardAuthGuard from "@/components/dashboard-auth-guard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardAuthGuard>{children}</DashboardAuthGuard>
}
