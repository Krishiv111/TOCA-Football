import { describe, it, expect } from 'vitest'
import { getDurationMinutes, getAge } from './utils.js'

describe('getDurationMinutes', () => {
  it('returns correct minutes for a 60-minute window', () => {
    const start = '2025-01-01T10:00:00Z'
    const end = '2025-01-01T11:00:00Z'
    expect(getDurationMinutes(start, end)).toBe(60)
  })

  it('returns correct minutes for a 90-minute window', () => {
    const start = '2025-03-15T09:00:00Z'
    const end = '2025-03-15T10:30:00Z'
    expect(getDurationMinutes(start, end)).toBe(90)
  })

  it('rounds fractional minutes', () => {
    const start = '2025-01-01T10:00:00Z'
    const end = '2025-01-01T10:00:40Z' // 40 seconds → rounds to 1
    expect(getDurationMinutes(start, end)).toBe(1)
  })

  it('returns 0 for same start and end', () => {
    const t = '2025-01-01T10:00:00Z'
    expect(getDurationMinutes(t, t)).toBe(0)
  })
})

describe('getAge', () => {
  it('calculates correct age for a past birthday this year', () => {
    // Born exactly 20 years ago yesterday — definitely had birthday
    const today = new Date()
    const birth = new Date(today)
    birth.setFullYear(birth.getFullYear() - 20)
    birth.setDate(birth.getDate() - 1) // yesterday's birthday = already had it
    expect(getAge(birth.toISOString().slice(0, 10))).toBe(20)
  })

  it('calculates correct age for a future birthday this year', () => {
    const today = new Date()
    const birth = new Date(today)
    birth.setFullYear(birth.getFullYear() - 20)
    birth.setDate(birth.getDate() + 1) // tomorrow's birthday = not yet
    expect(getAge(birth.toISOString().slice(0, 10))).toBe(19)
  })

  it('returns 0 for someone born today', () => {
    const today = new Date().toISOString().slice(0, 10)
    expect(getAge(today)).toBe(0)
  })

  it('calculates age for a known DOB (born 2010-06-25)', () => {
    // Alex Jones: dob 2010-06-25, today is 2026-03-11 → age 15 (birthday not yet reached)
    const age = getAge('2010-06-25')
    expect(age).toBeGreaterThanOrEqual(15)
    expect(age).toBeLessThanOrEqual(17)
  })
})
