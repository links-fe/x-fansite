import { isMobile } from '@/npm/x-utils'
import type { AppProps } from 'next/app'
import React from 'react'
import '@/styles/index.scss'
import { IS_SERVER_RUNTIME } from '@/constants'
import { usePathname } from 'next/navigation'
import { getRouterConfig } from '@/router'
import { MobileNoTabbarLayout, PcEmptyLayout } from '@/components/Layout/BusinessLayouts'

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname()
  const routerLayoutInfo = getRouterConfig(pathname)
  const content = <Component {...pageProps} />

  if (IS_SERVER_RUNTIME) {
    return <></>
  }
  if (isMobile()) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const MobileLayout = routerLayoutInfo.mobilePageLayout ?? MobileNoTabbarLayout
    return <MobileLayout>{content}</MobileLayout>
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const PcLayout = routerLayoutInfo.pcPageLayout ?? PcEmptyLayout
  return <PcLayout>{content}</PcLayout>
}
