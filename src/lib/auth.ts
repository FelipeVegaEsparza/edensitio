import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { APIContext } from 'astro'

function getSecret(): string {
  return import.meta.env.JWT_SECRET || process.env.JWT_SECRET || 'dev-secret-change-me'
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export function signToken(payload: { username: string }): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string): { username: string } | null {
  try {
    return jwt.verify(token, getSecret()) as { username: string }
  } catch {
    return null
  }
}

export function getToken(context: APIContext): string | null {
  const cookies = context.request.headers.get('cookie') || ''
  const match = cookies.match(/token=([^;]+)/)
  return match ? match[1] : null
}

export function isAuthenticated(context: APIContext): boolean {
  const token = getToken(context)
  if (!token) return false
  return verifyToken(token) !== null
}
