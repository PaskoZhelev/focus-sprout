import { describe, expect, it } from 'vitest'
import { formatClock } from './format'

describe('formatClock', () => {
  it('shows minutes and seconds under an hour, and adds hours after', () => {
    expect(formatClock(25 * 60_000)).toBe('25:00')
    expect(formatClock(59 * 60_000 + 59_500)).toBe('1:00:00')
    expect(formatClock(90 * 60_000 + 5_000)).toBe('1:30:05')
  })
})
