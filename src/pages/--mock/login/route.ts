import { delay } from '@/utils'

export async function POST() {
  await delay(1000)

  return Response.json({
    url: '/api',
  })
}
