import Fastify from 'fastify'
import cors from '@fastify/cors'
import { playerRoutes } from './routes/players.js'
import { sessionRoutes } from './routes/sessions.js'

const fastify = Fastify({ logger: true })

await fastify.register(cors, {
  origin: ['http://localhost:5173'],
})

await fastify.register(playerRoutes)
await fastify.register(sessionRoutes)

fastify.get('/health', async () => ({ status: 'ok' }))

try {
  await fastify.listen({ port: 3001, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
