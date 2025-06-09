import { BRAND_DOMAIN } from '@/constants'
import { delay } from '@/utils'

export async function queryDomainPool(): Promise<string> {
  // 请求域名池B
  await delay(300)
  return BRAND_DOMAIN
}
