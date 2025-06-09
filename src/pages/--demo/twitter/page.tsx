'use client'

// 教程查看 https://jphmzyvzr43.jp.larksuite.com/docx/UrPFdWy0CogTvDx2NFNjSjQPp0e?from=from_copylink
import { generatePKCE } from '@/utils/auth'
import { useEffect } from 'react'

export default function LoginPage() {
  const handleLogin = async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE()

    // 存储 codeVerifier 以便后续使用
    localStorage.setItem('codeVerifier', codeVerifier)

    const clientId = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!
    const redirectUri = encodeURIComponent(window.location.origin + process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI)
    const scope = encodeURIComponent(process.env.NEXT_PUBLIC_TWITTER_SCOPE as any) // 请求的权限范围
    const state = process.env.NEXT_PUBLIC_TWITTER_STATE // 用于防止 CSRF 攻击

    const authUrl = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`

    window.open(authUrl)

    // 监听新窗口发送的消息 (处理 如果用户没有在该浏览器登录twitter, 前端网页登录跳转到twitter授权时，会进行twitter的登录，用户登录完会到twitter首页，而不是回调到我们指定的twitter授权登录成功后的CallBack URL)
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return
      console.log('Received message from new window:', event.data)
      const { type } = event?.data?.data ?? {}
      if (type === 'twitterLoginSuccess') {
        // 处理登录成功的逻辑 自动跳转首页逻辑
        console.log('Login successful!')
      }
    })
  }

  useEffect(() => {
    // 监听新窗口发送的消息 (处理 如果用户没有在该浏览器登录twitter, 前端网页登录跳转到twitter授权时，会进行twitter的登录，用户登录完会到twitter首页，而不是回调到我们指定的twitter授权登录成功后的CallBack URL)
    const fn = (event: any) => {
      if (event.origin !== window.location.origin) return
      console.log('Received message from new window:', event.data)
      const { type } = event?.data?.data ?? {}
      if (type === 'twitterLoginSuccess') {
        // 处理登录成功的逻辑 自动跳转首页逻辑
        console.log('Login successful!')
      }
    }
    window.addEventListener('message', fn)
    return () => {
      window.removeEventListener('message', fn)
    }
  }, [])

  return (
    <div>
      <button onClick={handleLogin}>Login with Twitter</button>
    </div>
  )
}
