'use client'

import { useDomainRedirect } from '@/hooks/useDomainRedirect'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// domain-a://share-link?id=12321&cid=123&_h=of&_d=a
// http://localhost:3000/share-link?id=12321&cid=123&_h=of&_d=a
export function ShareLinkPage() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const domainLock = useDomainRedirect()
  console.log('searchParams', searchParams)
  useEffect(() => {
    if (domainLock) return
    if (!searchParams?.get('cid')) {
      // 直接跳首页
      // router.push('/')
      return
    }
    router.push(`/creator-share/${searchParams?.get('cid')}?id=${searchParams?.get('id')}`)
  }, [domainLock])

  // publish-TODO: 这里应该换成引导用户使用默认浏览器打开的教程
  return <>loading</>
}

export default ShareLinkPage
