import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

function RouterLoading() {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      NProgress.start()
    }

    const handleRouteChangeComplete = () => {
      NProgress.done()
    }

    const handleRouteChangeError = () => {
      NProgress.done()
    }

    // 路由开始变化时触发
    router.events.on('routeChangeStart', handleRouteChangeStart)

    // 路由变化完成时触发
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    // 路由变化错误时触发
    router.events.on('routeChangeError', handleRouteChangeError)

    // 清理监听器
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [router])
  return <></>
}

export default RouterLoading
