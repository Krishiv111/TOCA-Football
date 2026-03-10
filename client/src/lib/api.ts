const BASE = '/api'

export interface Player {
  id: string
  name: string
  email: string
  position: string
  age: number
  teamName: string
  joinedDate: string
  totalSessions: number
  avatarInitials: string
}

export interface Drill {
  name: string
  reps: number
  accuracy: number
}

export interface SessionStats {
  totalBallTouches: number
  avgAccuracy: number
  topSpeed: number
}

export interface Session {
  id: string
  playerId: string
  date: string
  duration: number
  type: string
  coach: string
  location: string
  drills: Drill[]
  stats: SessionStats
  notes: string
}

export interface Appointment {
  id: string
  playerId: string
  date: string
  time: string
  duration: number
  type: string
  coach: string
  location: string
  notes: string
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error((err as { error: string }).error ?? 'Request failed')
  }
  return res.json() as Promise<T>
}

export const getPlayer = (email: string) =>
  fetchJSON<Player>(`${BASE}/players/${encodeURIComponent(email)}`)

export const getSessions = (email: string) =>
  fetchJSON<Session[]>(`${BASE}/players/${encodeURIComponent(email)}/sessions`)

export const getAppointments = (email: string) =>
  fetchJSON<Appointment[]>(`${BASE}/players/${encodeURIComponent(email)}/appointments`)

export const getSession = (id: string) =>
  fetchJSON<Session>(`${BASE}/sessions/${id}`)
