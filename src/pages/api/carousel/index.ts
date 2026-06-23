import type { APIContext } from 'astro'
import { isAuthenticated } from '../../../lib/auth'
import { addCarouselImage, deleteImage } from '../../../lib/content'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads')

export async function POST(context: APIContext): Promise<Response> {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  try {
    const formData = await context.request.formData()
    const file = formData.get('image') as File | null
    const section = formData.get('section') as string | null
    const alt = formData.get('alt') as string || ''

    if (!file || !section) {
      return new Response(JSON.stringify({ error: 'image y section requeridos' }), { status: 400 })
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
    }

    const ext = path.extname(file.name) || '.jpg'
    const filename = `${section}_carousel_${crypto.randomBytes(8).toString('hex')}${ext}`
    const filepath = path.join(UPLOADS_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filepath, buffer)

    const index = addCarouselImage(section, `/uploads/${filename}`, alt)

    return new Response(JSON.stringify({ ok: true, index, filename: `/uploads/${filename}` }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 })
  }
}

export async function DELETE(context: APIContext): Promise<Response> {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  try {
    const body = await context.request.json()
    const { id } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'id requerido' }), { status: 400 })
    }

    const { getDb } = await import('../../../lib/db')
    const db = getDb()
    const row = db.prepare('SELECT filename FROM images WHERE id = ?').get(id) as { filename: string } | undefined

    if (row) {
      const filepath = path.join(UPLOADS_DIR, path.basename(row.filename))
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
    }

    deleteImage(id)

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 })
  }
}
