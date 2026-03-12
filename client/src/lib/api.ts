const BASE = '/api'

export interface Player {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  gender: string
  dob: string
  centerName: string
  createdAt: string
}

export interface TrainingSession {
  id: string
  playerId: string
  trainerName: string
  startTime: string
  endTime: string
  numberOfBalls: number
  bestStreak: number
  numberOfGoals: number
  score: number
  avgSpeedOfPlay: number
  numberOfExercises: number
}

export interface Appointment {
  id: string
  playerId: string
  trainerName: string
  startTime: string
  endTime: string
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
  fetchJSON<TrainingSession[]>(`${BASE}/players/${encodeURIComponent(email)}/sessions`)

export const getAppointments = (email: string) =>
  fetchJSON<Appointment[]>(`${BASE}/players/${encodeURIComponent(email)}/appointments`)

export const getSession = (id: string) =>
  fetchJSON<TrainingSession>(`${BASE}/sessions/${id}`)

export function getDurationMinutes(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
}

export function getAge(dob: string) {
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}
