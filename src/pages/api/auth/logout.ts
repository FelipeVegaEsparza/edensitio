import type { APIContext } from 'astro'

export async function POST(context: APIContext): Promise<Response> {
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict',
      'Location': '/login',
    },
  })
}
