import type { FastifyInstance } from 'fastify'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '../data')

function loadJSON<T>(filename: string): T {
  return JSON.parse(readFileSync(join(dataDir, filename), 'utf-8'))
}

interface TrainingSession {
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

interface Appointment {
  id: string
  playerId: string
  trainerName: string
  startTime: string
  endTime: string
}

interface Player {
  id: string
  email: string
}

export async function sessionRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { id: string } }>(
    '/api/sessions/:id',
    async (request, reply) => {
      const sessions = loadJSON<TrainingSession[]>('trainingSessions.json')
      const session = sessions.find((s) => s.id === request.params.id)
      if (!session) {
        return reply.status(404).send({ error: 'Session not found' })
      }
      return session
    }
  )

  fastify.get<{ Params: { email: string } }>(
    '/api/players/:email/sessions',
    async (request, reply) => {
      const players = loadJSON<Player[]>('profiles.json')
      const player = players.find(
        (p) => p.email.toLowerCase() === request.params.email.toLowerCase()
      )
      if (!player) {
        return reply.status(404).send({ error: 'Player not found' })
      }
      const now = new Date().toISOString()
      const sessions = loadJSON<TrainingSession[]>('trainingSessions.json')
      const playerSessions = sessions
        .filter((s) => s.playerId === player.id && s.startTime <= now)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      return playerSessions
    }
  )

  fastify.get<{ Params: { email: string } }>(
    '/api/players/:email/appointments',
    async (request, reply) => {
      const players = loadJSON<Player[]>('profiles.json')
      const player = players.find(
        (p) => p.email.toLowerCase() === request.params.email.toLowerCase()
      )
      if (!player) {
        return reply.status(404).send({ error: 'Player not found' })
      }
      const now = new Date().toISOString()
      const appointments = loadJSON<Appointment[]>('appointments.json')
      const playerAppointments = appointments
        .filter((a) => a.playerId === player.id && a.startTime > now)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      return playerAppointments
    }
  )
}
