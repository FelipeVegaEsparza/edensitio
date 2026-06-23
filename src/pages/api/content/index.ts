import type { APIContext } from 'astro'
import { isAuthenticated } from '../../../lib/auth'
import { getAllContent, getSection, updateSection } from '../../../lib/content'

export async function GET(context: APIContext): Promise<Response> {
  const url = new URL(context.request.url)
  const section = url.searchParams.get('section')

  if (section) {
    return new Response(JSON.stringify(getSection(section)), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(getAllContent()), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function PUT(context: APIContext): Promise<Response> {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  try {
    const body = await context.request.json()
    const { section, fields } = body

    if (!section || !fields) {
      return new Response(JSON.stringify({ error: 'section y fields requeridos' }), { status: 400 })
    }

    updateSection(section, fields)
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 })
  }
}
