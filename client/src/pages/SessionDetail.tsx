import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSession, type Session } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SessionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getSession(id)
      .then(setSession)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading session...
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <p className="text-red-500">{error ?? 'Session not found'}</p>
        <Button variant="outline" onClick={() => navigate('/home')}>Back to Home</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="text-gray-500">
          ← Back
        </Button>
      </div>

      {/* Header card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <CardTitle className="text-2xl">{session.type}</CardTitle>
              <p className="text-gray-500 mt-1">{formatDate(session.date)}</p>
            </div>
            <Badge className="text-sm bg-blue-100 text-blue-700 border-blue-200">
              {session.duration} min
            </Badge>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
            <span>📍 {session.location}</span>
            <span>👤 {session.coach}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ball Touches', value: session.stats.totalBallTouches.toString() },
          { label: 'Avg Accuracy', value: `${session.stats.avgAccuracy}%` },
          { label: 'Top Speed', value: `${session.stats.topSpeed} km/h` },
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

      {/* Drills */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Drill Breakdown</h3>
        <div className="flex flex-col gap-3">
          {session.drills.map((drill) => (
            <Card key={drill.name} className="border border-gray-200">
              <CardContent className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-800">{drill.name}</p>
                  <p className="text-sm text-gray-500">{drill.reps} reps</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{drill.accuracy}%</p>
                    <p className="text-xs text-gray-400">accuracy</p>
                  </div>
                  {/* Accuracy bar */}
                  <div className="w-20 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${drill.accuracy}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Coach notes */}
      {session.notes && (
        <>
          <Separator />
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coach Notes</h3>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="py-4 text-sm text-gray-700 italic">
                "{session.notes}"
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
