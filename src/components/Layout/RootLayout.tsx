'use client'
import React from 'react'
// import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
import '@x-vision/design/style.css'
import { useEffect } from 'react'
import { INIT_LAYOUT_MODEL } from '@/models/layout'
import { IS_DEV_MODE, IS_SERVER_RUNTIME } from '@/constants'
import { useMount } from '@/hooks/useMount'
import CommonErrorDrawer from '@/components/CommonErrorDrawer'
import '@/utils/debugUtil'
import '@/utils/datadog'

export function RootLayout({ children }: { children: React.ReactNode }) {
  const isMounted = useMount()

  useEffect(() => {
    if (!isMounted) return
    console.log('INIT_LAYOUT_MODEL')
    INIT_LAYOUT_MODEL()
  }, [isMounted])

  function render() {
    if (!isMounted) {
      return <></>
    }
    if (!IS_DEV_MODE) {
      // ? 为什么加这个判断
      // * 解决打包时报错 ReferenceError: window is not defined
      if (typeof window === 'undefined') {
        return <></>
      }
    }

    return children
  }

  if (IS_SERVER_RUNTIME) {
    return <></>
  }

  return (
    <>
      <CommonErrorDrawer />
      {render()}
    </>
  )
}
