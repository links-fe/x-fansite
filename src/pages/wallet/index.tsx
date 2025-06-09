'use client'

import { MobileTabbarLayout, PcMenuLayout } from '@/components/Layout'

export default function Page() {
  return (
    <div>
      <div>Wallet</div>
    </div>
  )
}

Page.PcLayout = PcMenuLayout
Page.MobileLayout = MobileTabbarLayout
