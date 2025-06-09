'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TwitterCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const { searchParams } = new URL(window.location.href)
      const code = searchParams.get('code')
      const state = searchParams.get('state')

      // 验证 state 防止 CSRF 攻击
      if (state !== process.env.NEXT_PUBLIC_TWITTER_STATE) {
        setError('Invalid state')
        return
      }

      const codeVerifier = localStorage.getItem('codeVerifier')
      if (!codeVerifier) {
        setError('Missing code verifier')
        return
      }

      const res = await fetch(`/--mock/userInfo/twitter?code=${code}&codeVerifier=${codeVerifier}&state=${state}`)

      if (!res.ok) {
        setError('Failed to fetch user data')
        console.error('Failed to fetch user data', res)
        return
      }

      const result = await res.json()
      console.log('result: ', result)
      const twitterUserData = result?.data
      // 如 {"id":"1893962241579552768","name":"Leonard (Web Dev)","username":"dev_leonar70197"}
      console.log('twitterUserData', twitterUserData)

      // 使用twitterUserData 生成我们项目自己的登录token 并拿到项目自己的userInfo

      // 将token以及用户数据存全局状态管理

      // 向其它页面发送登录成功的消息
      window.opener?.postMessage?.(
        {
          type: 'twitterLoginSuccess',
          data: {
            twitterUserData,
          },
        },
        window.location.origin,
      )

      // 重定向到首页或其他页面
    }

    handleCallback()
  }, [router])

  return (
    <div>
      {/* 这个页面到时定制个loading */}
      <h1>Twitter Callback</h1>
      {error ? <p>{error}</p> : <p>Loading...</p>}
    </div>
  )
}
