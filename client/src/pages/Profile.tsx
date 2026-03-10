import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getPlayer, getSessions, type Player, type Session } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function Profile() {
  const { email } = useAuth()
  const [player, setPlayer] = useState<Player | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
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
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading profile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2">
        <p className="text-red-500">{error}</p>
        <p className="text-gray-400 text-sm">
          No player found for <strong>{email}</strong>
        </p>
      </div>
    )
  }

  if (!player) return null

  const avgAccuracy =
    sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.stats.avgAccuracy, 0) / sessions.length)
      : null

  const totalTouches = sessions.reduce((sum, s) => sum + s.stats.totalBallTouches, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + name */}
      <Card>
        <CardContent className="py-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-2xl">{player.avatarInitials}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{player.name}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{player.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{player.position}</Badge>
              <Badge variant="outline">{player.teamName}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Age', value: player.age.toString() },
          { label: 'Total Sessions', value: player.totalSessions.toString() },
          { label: 'Avg Accuracy', value: avgAccuracy != null ? `${avgAccuracy}%` : '—' },
          { label: 'Total Touches', value: totalTouches.toLocaleString() },
        ].map(({ label, value }) => (
          <Card key={label} className="text-center">
            <CardContent className="py-4">
              <p className="text-2xl font-bold text-blue-600">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Player Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Email', value: player.email },
            { label: 'Position', value: player.position },
            { label: 'Team', value: player.teamName },
            { label: 'Age', value: `${player.age} years old` },
            {
              label: 'Member Since',
              value: new Date(player.joinedDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              }),
            },
            { label: 'Sessions Logged', value: player.totalSessions.toString() },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
              <span className="font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
