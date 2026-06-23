import type { APIContext } from 'astro'
import { getDb } from '../../../lib/db'
import { verifyPassword, signToken } from '../../../lib/auth'

export async function POST(context: APIContext): Promise<Response> {
  try {
    const body = await context.request.json()
    const { username, password } = body

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Usuario y contraseña requeridos' }), { status: 400 })
    }

    const db = getDb()
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as { id: number; username: string; password: string } | undefined

    if (!user || !verifyPassword(password, user.password)) {
      return new Response(JSON.stringify({ error: 'Credenciales incorrectas' }), { status: 401 })
    }

    const token = signToken({ username: user.username })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`,
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 })
  }
}
