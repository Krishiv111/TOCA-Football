import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function AppLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* Sticky frosted glass header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs tracking-tight">T</span>
            </div>
            <span className="font-semibold text-[15px] text-gray-900 tracking-tight">
              TOCA Football
            </span>
          </div>

          {/* Nav pills */}
          <nav className="hidden sm:flex items-center gap-1 bg-black/[0.04] rounded-xl p-1">
            {[
              { to: '/home', label: 'Home' },
              { to: '/about', label: 'About' },
              { to: '/profile', label: 'Profile' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden flex border-t border-black/[0.04]">
          {[
            { to: '/home', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/profile', label: 'Profile' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 text-center py-2.5 text-xs font-medium transition-colors ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
