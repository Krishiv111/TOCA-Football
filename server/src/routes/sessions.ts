import type { FastifyInstance } from 'fastify'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '../data')

function loadJSON<T>(filename: string): T {
  return JSON.parse(readFileSync(join(dataDir, filename), 'utf-8'))
}

interface Drill {
  name: string
  reps: number
  accuracy: number
}

interface SessionStats {
  totalBallTouches: number
  avgAccuracy: number
  topSpeed: number
}

interface Session {
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

interface Appointment {
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

interface Player {
  id: string
  email: string
}

export async function sessionRoutes(fastify: FastifyInstance) {
  // GET /api/sessions/:id — single session detail
  fastify.get<{ Params: { id: string } }>(
    '/api/sessions/:id',
    async (request, reply) => {
      const sessions = loadJSON<Session[]>('sessions.json')
      const session = sessions.find((s) => s.id === request.params.id)
      if (!session) {
        return reply.status(404).send({ error: 'Session not found' })
      }
      return session
    }
  )

  // GET /api/players/:email/sessions — past sessions for a player
  fastify.get<{ Params: { email: string } }>(
    '/api/players/:email/sessions',
    async (request, reply) => {
      const players = loadJSON<Player[]>('players.json')
      const player = players.find(
        (p) => p.email.toLowerCase() === request.params.email.toLowerCase()
      )
      if (!player) {
        return reply.status(404).send({ error: 'Player not found' })
      }
      const sessions = loadJSON<Session[]>('sessions.json')
      const playerSessions = sessions
        .filter((s) => s.playerId === player.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return playerSessions
    }
  )

  // GET /api/players/:email/appointments — future appointments for a player
  fastify.get<{ Params: { email: string } }>(
    '/api/players/:email/appointments',
    async (request, reply) => {
      const players = loadJSON<Player[]>('players.json')
      const player = players.find(
        (p) => p.email.toLowerCase() === request.params.email.toLowerCase()
      )
      if (!player) {
        return reply.status(404).send({ error: 'Player not found' })
      }
      const appointments = loadJSON<Appointment[]>('appointments.json')
      const playerAppointments = appointments
        .filter((a) => a.playerId === player.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      return playerAppointments
    }
  )
}
