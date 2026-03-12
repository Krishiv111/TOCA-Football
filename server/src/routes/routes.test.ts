import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../app.js'
import type { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => {
  app = await buildApp()
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

// ──────────────────────────────────────────────
// Health
// ──────────────────────────────────────────────
describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ status: 'ok' })
  })
})

// ──────────────────────────────────────────────
// GET /api/players/:email
// ──────────────────────────────────────────────
describe('GET /api/players/:email', () => {
  it('returns player for a valid email', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/sabrina.williams@example.com',
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.email).toBe('sabrina.williams@example.com')
    expect(body.firstName).toBe('Sabrina')
    expect(body.lastName).toBe('Williams')
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('dob')
    expect(body).toHaveProperty('centerName')
  })

  it('is case-insensitive for email lookup', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/ALEX.JONES@EXAMPLE.COM',
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().firstName).toBe('Alex')
  })

  it('returns 404 for unknown email', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/nobody@nowhere.com',
    })
    expect(res.statusCode).toBe(404)
    expect(res.json()).toHaveProperty('error')
  })
})

// ──────────────────────────────────────────────
// GET /api/players/:email/sessions
// ──────────────────────────────────────────────
describe('GET /api/players/:email/sessions', () => {
  it('returns an array of past sessions for a valid player', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/morgan.johnson@example.com/sessions',
    })
    expect(res.statusCode).toBe(200)
    const sessions = res.json()
    expect(Array.isArray(sessions)).toBe(true)
    if (sessions.length > 0) {
      const s = sessions[0]
      expect(s).toHaveProperty('id')
      expect(s).toHaveProperty('trainerName')
      expect(s).toHaveProperty('startTime')
      expect(s).toHaveProperty('endTime')
      expect(s).toHaveProperty('score')
      expect(s).toHaveProperty('numberOfBalls')
      expect(s).toHaveProperty('numberOfGoals')
      expect(s).toHaveProperty('bestStreak')
      expect(s).toHaveProperty('avgSpeedOfPlay')
      expect(s).toHaveProperty('numberOfExercises')
    }
  })

  it('returns sessions sorted newest-first', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/sabrina.williams@example.com/sessions',
    })
    expect(res.statusCode).toBe(200)
    const sessions = res.json() as Array<{ startTime: string }>
    for (let i = 1; i < sessions.length; i++) {
      expect(new Date(sessions[i - 1].startTime).getTime()).toBeGreaterThanOrEqual(
        new Date(sessions[i].startTime).getTime()
      )
    }
  })

  it('only returns sessions in the past', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/alex.jones@example.com/sessions',
    })
    expect(res.statusCode).toBe(200)
    const now = new Date().toISOString()
    const sessions = res.json() as Array<{ startTime: string }>
    sessions.forEach((s) => {
      expect(s.startTime <= now).toBe(true)
    })
  })

  it('returns 404 for unknown email', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/ghost@example.com/sessions',
    })
    expect(res.statusCode).toBe(404)
  })
})

// ──────────────────────────────────────────────
// GET /api/players/:email/appointments
// ──────────────────────────────────────────────
describe('GET /api/players/:email/appointments', () => {
  it('returns an array for a valid player', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/sabrina.williams@example.com/appointments',
    })
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.json())).toBe(true)
  })

  it('only returns future appointments', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/morgan.johnson@example.com/appointments',
    })
    expect(res.statusCode).toBe(200)
    const now = new Date().toISOString()
    const appts = res.json() as Array<{ startTime: string }>
    appts.forEach((a) => {
      expect(a.startTime > now).toBe(true)
    })
  })

  it('returns appointments sorted soonest-first', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/sabrina.williams@example.com/appointments',
    })
    const appts = res.json() as Array<{ startTime: string }>
    for (let i = 1; i < appts.length; i++) {
      expect(new Date(appts[i - 1].startTime).getTime()).toBeLessThanOrEqual(
        new Date(appts[i].startTime).getTime()
      )
    }
  })

  it('each appointment has required fields', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/alex.jones@example.com/appointments',
    })
    const appts = res.json() as Array<Record<string, unknown>>
    appts.forEach((a) => {
      expect(a).toHaveProperty('id')
      expect(a).toHaveProperty('trainerName')
      expect(a).toHaveProperty('startTime')
      expect(a).toHaveProperty('endTime')
    })
  })

  it('returns 404 for unknown email', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/players/ghost@example.com/appointments',
    })
    expect(res.statusCode).toBe(404)
  })
})

// ──────────────────────────────────────────────
// GET /api/sessions/:id
// ──────────────────────────────────────────────
describe('GET /api/sessions/:id', () => {
  it('returns a session for a valid id', async () => {
    // First get a real session id from the sessions list
    const listRes = await app.inject({
      method: 'GET',
      url: '/api/players/sabrina.williams@example.com/sessions',
    })
    const sessions = listRes.json() as Array<{ id: string }>

    if (sessions.length === 0) {
      // Skip if no sessions available
      return
    }

    const sessionId = sessions[0].id
    const res = await app.inject({
      method: 'GET',
      url: `/api/sessions/${sessionId}`,
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBe(sessionId)
    expect(body).toHaveProperty('trainerName')
    expect(body).toHaveProperty('score')
    expect(body).toHaveProperty('numberOfBalls')
    expect(body).toHaveProperty('numberOfGoals')
    expect(body).toHaveProperty('bestStreak')
    expect(body).toHaveProperty('avgSpeedOfPlay')
    expect(body).toHaveProperty('numberOfExercises')
    expect(body).toHaveProperty('startTime')
    expect(body).toHaveProperty('endTime')
  })

  it('returns 404 for a nonexistent session id', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/sessions/00000000-0000-0000-0000-000000000000',
    })
    expect(res.statusCode).toBe(404)
    expect(res.json()).toHaveProperty('error')
  })
})
