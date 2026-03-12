import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  getPlayer,
  getSessions,
  getAppointments,
  getDurationMinutes,
  type Player,
  type TrainingSession,
  type Appointment,
} from '@/lib/api'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function scoreColor(score: number) {
  if (score >= 90) return 'text-emerald-500'
  if (score >= 75) return 'text-blue-500'
  return 'text-amber-500'
}

function scoreBg(score: number) {
  if (score >= 90) return 'bg-emerald-50 text-emerald-700'
  if (score >= 75) return 'bg-blue-50 text-blue-700'
  return 'bg-amber-50 text-amber-700'
}

export function Home() {
  const { email } = useAuth()
  const navigate = useNavigate()
  const [player, setPlayer] = useState<Player | null>(null)
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!email) return
    setLoading(true)
    Promise.all([getPlayer(email), getSessions(email), getAppointments(email)])
      .then(([p, s, a]) => {
        setPlayer(p)
        setSessions(s)
        setAppointments(a)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [email])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-xl" />
        <div className="h-36 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-gray-400 text-sm mt-1">No player found for {email}</p>
        </div>
      </div>
    )
  }

  const avgScore =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, x) => s + x.score, 0) / sessions.length * 10) / 10
      : null

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {getGreeting()}{player ? `, ${player.firstName}` : ''} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-[15px]">Here's your training overview</p>
      </div>

      {/* Quick stats */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions', value: sessions.length.toString() },
            { label: 'Avg Score', value: avgScore !== null ? `${avgScore}` : '—' },
            {
              label: 'Best Streak',
              value: Math.max(...sessions.map((s) => s.bestStreak)).toString(),
            },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Appointments */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-3">
          Upcoming Sessions
        </h2>
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-gray-400 text-sm">No upcoming sessions scheduled</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {appointments.map((appt) => {
              const duration = getDurationMinutes(appt.startTime, appt.endTime)
              return (
                <div
                  key={appt.id}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-sm shadow-blue-200 text-white"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[15px]">{appt.trainerName}</p>
                      <p className="text-blue-200 text-sm mt-0.5">{formatDate(appt.startTime)}</p>
                      <p className="text-blue-100 text-sm font-medium mt-1">
                        {formatTime(appt.startTime)} — {formatTime(appt.endTime)}
                      </p>
                    </div>
                    <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full shrink-0">
                      {duration} min
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Past Sessions */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-3">
          Training History
        </h2>
        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-gray-400 text-sm">No past sessions found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((session) => {
              const duration = getDurationMinutes(session.startTime, session.endTime)
              return (
                <button
                  key={session.id}
                  onClick={() => navigate(`/sessions/${session.id}`)}
                  className="group text-left w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Score ring mini */}
                      <div className="relative w-10 h-10 shrink-0">
                        <svg viewBox="0 0 40 40" className="-rotate-90 w-10 h-10">
                          <circle cx="20" cy="20" r="16" fill="none" stroke="#f0f0f0" strokeWidth="4" />
                          <circle
                            cx="20" cy="20" r="16" fill="none"
                            stroke={session.score >= 90 ? '#10b981' : session.score >= 75 ? '#3b82f6' : '#f59e0b'}
                            strokeWidth="4"
                            strokeDasharray={`${2 * Math.PI * 16}`}
                            strokeDashoffset={`${2 * Math.PI * 16 * (1 - session.score / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${scoreColor(session.score)}`}>
                          {Math.round(session.score)}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {session.trainerName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(session.startTime)} · {duration} min
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-400">{session.numberOfBalls} balls</p>
                        <p className="text-xs text-gray-400">{session.numberOfGoals} goals</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${scoreBg(session.score)}`}>
                        {session.score}
                      </span>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
