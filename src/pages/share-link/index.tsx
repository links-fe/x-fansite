'use client'

import { MobileTabbarLayout, PcMenuLayout } from '@/components/Layout'
import { ShareLinkPage } from './components/ShareLinkPage'
import { Suspense } from 'react'

// domain-a://share-link?id=12321&cid=123&_h=of&_d=a
// http://localhost:3000/share-link?id=12321&cid=123&_h=of&_d=a
export default function Page() {
  return (
    <Suspense fallback={<div>Loading ... -- share-link</div>}>
      <ShareLinkPage />
    </Suspense>
  )
}
Page.PcLayout = PcMenuLayout
Page.MobileLayout = MobileTabbarLayout
