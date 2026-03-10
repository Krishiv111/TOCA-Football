import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getSessions, getAppointments, type Session, type Appointment } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function Home() {
  const { email } = useAuth()
  const navigate = useNavigate()

  const [sessions, setSessions] = useState<Session[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!email) return
    setLoading(true)
    Promise.all([getSessions(email), getAppointments(email)])
      .then(([s, a]) => {
        setSessions(s)
        setAppointments(a)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [email])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading your sessions...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Upcoming Appointments */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming appointments scheduled.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {appointments.map((appt) => (
              <Card key={appt.id} className="border border-blue-100 bg-blue-50/40">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{appt.type}</CardTitle>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {appt.duration} min
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-blue-700">
                    {formatDate(appt.date)} · {appt.time}
                  </p>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 flex flex-col gap-1">
                  <span>📍 {appt.location}</span>
                  <span>👤 {appt.coach}</span>
                  {appt.notes && (
                    <p className="text-xs text-gray-500 mt-1 italic">{appt.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Past Sessions */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Training Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-sm">No past sessions found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => navigate(`/sessions/${session.id}`)}
                className="text-left w-full group"
              >
                <Card className="border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {session.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(session.date)} · {session.coach}
                      </span>
                      <span className="text-xs text-gray-400">{session.location}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {session.stats.avgAccuracy}%
                        </p>
                        <p className="text-xs text-gray-400">accuracy</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {session.duration} min
                      </Badge>
                      <span className="text-gray-400 group-hover:text-blue-500 transition-colors">→</span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
