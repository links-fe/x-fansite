import { delay } from '@/utils'

export async function GET() {
  await delay(1000)

  return Response.json({
    url: '/api',
  })
}
