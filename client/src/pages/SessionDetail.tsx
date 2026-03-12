import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSession, getDurationMinutes, type TrainingSession } from '@/lib/api'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function ScoreRing({ score }: { score: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 90 ? '#10b981' : score >= 75 ? '#3b82f6' : '#f59e0b'
  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Keep Going'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="-rotate-90 w-36 h-36">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f0f0f0" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={r} fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 tracking-tight">{score}</span>
          <span className="text-xs text-gray-400 font-medium">score</span>
        </div>
      </div>
      <span
        className="text-xs font-semibold px-3 py-1 rounded-full"
        style={{
          background: score >= 90 ? '#d1fae5' : score >= 75 ? '#dbeafe' : '#fef3c7',
          color,
        }}
      >
        {label}
      </span>
    </div>
  )
}

export function SessionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<TrainingSession | null>(null)
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
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 w-24 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <p className="text-red-500">{error ?? 'Session not found'}</p>
        <button
          onClick={() => navigate('/home')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Home
        </button>
      </div>
    )
  }

  const duration = getDurationMinutes(session.startTime, session.endTime)

  const metrics = [
    { label: 'Balls Touched', value: session.numberOfBalls.toString(), icon: '⚽' },
    { label: 'Goals Scored', value: session.numberOfGoals.toString(), icon: '🥅' },
    { label: 'Best Streak', value: session.bestStreak.toString(), icon: '🔥' },
    { label: 'Avg Speed', value: `${session.avgSpeedOfPlay}s`, icon: '⚡' },
    { label: 'Exercises', value: session.numberOfExercises.toString(), icon: '🏋️' },
    { label: 'Duration', value: `${duration} min`, icon: '⏱️' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <button
        onClick={() => navigate('/home')}
        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors w-fit"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Training History
      </button>

      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Training Session</p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{session.trainerName}</h1>
            <p className="text-gray-500 text-[15px] mt-1">{formatDate(session.startTime)}</p>
            <p className="text-gray-400 text-sm mt-0.5">
              {formatTime(session.startTime)} – {formatTime(session.endTime)}
            </p>
          </div>
          <ScoreRing score={session.score} />
        </div>
      </div>

      {/* Metrics grid */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-gray-900 mb-3">Session Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {metrics.map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
              <span className="text-xl">{icon}</span>
              <p className="text-2xl font-bold text-gray-900 tracking-tight mt-2">{value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
