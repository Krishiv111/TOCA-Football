import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    signIn(trimmed)
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-[#1d1d1f] flex flex-col items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 mb-5">
            <span className="text-white font-bold text-2xl tracking-tight">T</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TOCA Football</h1>
          <p className="text-[#86868b] mt-2 text-[15px]">Player Training Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.08] backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1.5">Welcome back</h2>
          <p className="text-[#86868b] text-sm mb-6">Enter your email to access your sessions</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-[#86868b] uppercase tracking-wider">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required
                autoFocus
                className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-[#555] text-sm outline-none transition-all duration-200 ${
                  focused
                    ? 'border-blue-500 bg-white/[0.12] ring-2 ring-blue-500/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 mt-2 shadow-lg shadow-blue-600/30"
            >
              Enter Portal
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <p className="text-xs text-[#555] text-center mb-2 uppercase tracking-wider">Demo accounts</p>
            <div className="flex flex-col gap-1.5">
              {[
                'sabrina.williams@example.com',
                'morgan.johnson@example.com',
                'alex.jones@example.com',
              ].map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmail(e)}
                  className="text-xs text-[#86868b] hover:text-blue-400 transition-colors text-left px-1"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
