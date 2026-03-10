import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { email } = useAuth()
  if (!email) return <Navigate to="/" replace />
  return <>{children}</>
}
