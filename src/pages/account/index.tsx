'use client'
import { MobileTabbarLayout, PcMenuLayout } from '@/components/Layout'
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <div>Account</div>

      <Link href={`/account/setting`}>Setting</Link>
    </div>
  )
}

Page.PcLayout = PcMenuLayout
Page.MobileLayout = MobileTabbarLayout
