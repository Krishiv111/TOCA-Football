import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getPlayer, getSessions, getAge, type Player, type TrainingSession } from '@/lib/api'

function formatMemberDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function Profile() {
  const { email } = useAuth()
  const [player, setPlayer] = useState<Player | null>(null)
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!email) return
    Promise.all([getPlayer(email), getSessions(email)])
      .then(([p, s]) => {
        setPlayer(p)
        setSessions(s)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [email])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-3xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-48 bg-gray-200 rounded-3xl" />
      </div>
    )
  }

  if (error || !player) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2">
        <p className="text-red-500">{error ?? 'Player not found'}</p>
        <p className="text-gray-400 text-sm">No profile for {email}</p>
      </div>
    )
  }

  const avgScore =
    sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length * 10) / 10
      : null

  const totalBalls = sessions.reduce((sum, s) => sum + s.numberOfBalls, 0)
  const bestStreak = sessions.length > 0 ? Math.max(...sessions.map((s) => s.bestStreak)) : 0
  const age = getAge(player.dob)

  return (
    <div className="flex flex-col gap-6">
      {/* Profile hero */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
            <span className="text-white font-bold text-2xl">
              {getInitials(player.firstName, player.lastName)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {player.firstName} {player.lastName}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{player.email}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                {player.centerName} Center
              </span>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {player.gender}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Age', value: `${age}` },
          { label: 'Sessions', value: sessions.length.toString() },
          { label: 'Avg Score', value: avgScore !== null ? `${avgScore}` : '—' },
          { label: 'Best Streak', value: bestStreak.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-5">Player Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
          {[
            { label: 'Full Name', value: `${player.firstName} ${player.lastName}` },
            { label: 'Email', value: player.email },
            { label: 'Phone', value: player.phone },
            { label: 'Gender', value: player.gender },
            { label: 'Date of Birth', value: new Date(player.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
            { label: 'Training Center', value: player.centerName },
            { label: 'Member Since', value: formatMemberDate(player.createdAt) },
            { label: 'Balls Touched', value: totalBalls.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
              <span className="text-sm font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
