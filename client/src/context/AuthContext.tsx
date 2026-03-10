import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  email: string | null
  signIn: (email: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(
    () => localStorage.getItem('toca_email')
  )

  function signIn(e: string) {
    localStorage.setItem('toca_email', e)
    setEmail(e)
  }

  function signOut() {
    localStorage.removeItem('toca_email')
    setEmail(null)
  }

  return (
    <AuthContext.Provider value={{ email, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
