import type { FastifyInstance } from 'fastify'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '../data')

function loadJSON<T>(filename: string): T {
  return JSON.parse(readFileSync(join(dataDir, filename), 'utf-8'))
}

interface Player {
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

export async function playerRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { email: string } }>(
    '/api/players/:email',
    async (request, reply) => {
      const players = loadJSON<Player[]>('profiles.json')
      const player = players.find(
        (p) => p.email.toLowerCase() === request.params.email.toLowerCase()
      )
      if (!player) {
        return reply.status(404).send({ error: 'Player not found' })
      }
      return player
    }
  )
}
