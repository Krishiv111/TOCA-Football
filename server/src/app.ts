import Fastify from 'fastify'
import cors from '@fastify/cors'
import { playerRoutes } from './routes/players.js'
import { sessionRoutes } from './routes/sessions.js'

export async function buildApp() {
  const fastify = Fastify({ logger: false })

  await fastify.register(cors, {
    origin: ['http://localhost:5173'],
  })

  await fastify.register(playerRoutes)
  await fastify.register(sessionRoutes)

  fastify.get('/health', async () => ({ status: 'ok' }))

  return fastify
}
