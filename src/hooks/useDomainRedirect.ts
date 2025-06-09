'use client'

import { BRAND_DOMAIN } from '@/constants'
import { queryDomainPool } from '@/services/domain'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type SearchParamsType = Record<string, string>
/**
 * 唤起默认浏览器
 */
function openDefaultBrowser(url: string) {
  // console.log('openDefaultBrowser', url)

  // TODO
  window.location.href = url
}
function replaceCurrentWindowDomain(domain: string, searchParams: SearchParamsType = {}) {
  const url = new URL(window.location.href)
  url.hostname = domain

  for (const key in searchParams) {
    url.searchParams.set(key, searchParams[key])
  }

  return url.toString()
}
function openDefaultBrowserWithDomain(domain: string, searchParams: SearchParamsType = {}) {
  const newUrl = replaceCurrentWindowDomain(domain, searchParams)
  openDefaultBrowser(newUrl)
}
function redirectWithDomain(domain: string, searchParams: SearchParamsType = {}) {
  const newUrl = replaceCurrentWindowDomain(domain, searchParams)
  window.location.href = newUrl
  // window.history.replaceState(null, '', newUrl)
}

/**
 * 域名重定向 - 处理域名防封自动跳转的逻辑
 *
 */
export function useDomainRedirect() {
  // 域名重定向阶段不执行页面逻辑
  const [lock, setLock] = useState(true)

  // const router = useRouter()
  /**
   * query
   * _d: a -> 域名池A b -> 域名池B 其他 -> 品牌域名
   */
  const searchParams = useSearchParams()

  const brandDomain = BRAND_DOMAIN

  async function redirect() {
    // 当前域名属于域名池A
    if (searchParams?.get('_d') === 'a') {
      // TODO: 判断当前是否在默认浏览器内, 如果在, 则直接跳转品牌域名
      // 请求域名池B
      const domain = await queryDomainPool().catch(() => brandDomain)
      // 跳转 - 将当前路径重定向到 domain 加上当前路径
      openDefaultBrowserWithDomain(domain, {
        _d: 'b',
      })
      return
    }
    // 当前域名属于域名池B - 此时应该已经在默认浏览器内了
    if (searchParams?.get('_d') === 'b') {
      // TODO: 不用这么生硬的跳转直接重写history即可
      // 跳转品牌域名
      redirectWithDomain('https://google.com', {
        _d: '0',
      })
      return
    }
    setLock(false)
  }

  useEffect(() => {
    redirect()
  }, [])

  return lock
}
