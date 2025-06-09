import { AppLayout } from '@/components/Layout'
import { isMobile } from '@/npm/x-utils'
import type { AppProps } from 'next/app'
import React from 'react'
import '@/styles/index.scss'
import { IS_SERVER_RUNTIME } from '@/constants'

export default function App({ Component, pageProps }: AppProps) {
  const content = <Component {...pageProps} />
  const DefaultLayout = AppLayout

  if (IS_SERVER_RUNTIME) {
    return <></>
  }

  if (isMobile()) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const MobileLayout = Component.MobileLayout ?? DefaultLayout
    return <MobileLayout>{content}</MobileLayout>
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const PcLayout = Component.PcLayout ?? DefaultLayout
  return <PcLayout>{content}</PcLayout>
}
