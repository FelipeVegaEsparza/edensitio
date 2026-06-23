import type { APIContext } from 'astro'
import { isAuthenticated } from '../../../lib/auth'
import { upsertImage } from '../../../lib/content'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads')

export async function GET(context: APIContext): Promise<Response> {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  const { getAllImages } = await import('../../../lib/content')
  return new Response(JSON.stringify(getAllImages()), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(context: APIContext): Promise<Response> {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  try {
    const formData = await context.request.formData()
    const file = formData.get('image') as File | null
    const section = formData.get('section') as string | null
    const field = formData.get('field') as string | null
    const alt = formData.get('alt') as string || ''

    if (!file || !section || !field) {
      return new Response(JSON.stringify({ error: 'image, section y field requeridos' }), { status: 400 })
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
    }

    const ext = path.extname(file.name) || '.jpg'
    const filename = `${section}_${field}_${crypto.randomBytes(8).toString('hex')}${ext}`
    const filepath = path.join(UPLOADS_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filepath, buffer)

    upsertImage(section, field, `/uploads/${filename}`, alt)

    return new Response(JSON.stringify({ ok: true, filename: `/uploads/${filename}` }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 })
  }
}
