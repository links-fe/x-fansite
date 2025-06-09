'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const handleCallback = async () => {
      const { searchParams } = new URL(window.location.href)
      const code = searchParams.get('code')
      if (!code) {
        console.error('Authorization code is missing', code)
        setError('Authorization code is missing')
        return
      }
      const res = await fetch(`/--mock/userInfo/google?code=${code}`)

      if (!res.ok) {
        setError('Failed to fetch user data')
        console.error('Failed to fetch user data', res)
        return
      }
      const result = await res.json()
      console.log('result: ', result)
      const googleUserData = result?.data
      // 数据示例如        下面的sub就是用户的唯一标识id
      //   {
      //     "iss": "https://accounts.google.com",
      //     "azp": "4963211978-uhpeb61dqut4ilcr8e6tmphc63f9v8k1.apps.googleusercontent.com",
      //     "aud": "4963211978-uhpeb61dqut4ilcr8e6tmphc63f9v8k1.apps.googleusercontent.com",
      //     "sub": "112483704182384149290",
      //     "hd": "infloww.com",
      //     "email": "leonard@infloww.com",
      //     "email_verified": true,
      //     "at_hash": "wVj2HDxvELbqgiytJGSEoA",
      //     "name": "Leonard (Web Dev)",
      //     "picture": "https://lh3.googleusercontent.com/a/ACg8ocLAaAVS6fURSTieN8cgyh0-hJ8YHzlvhVXUtA8XNs0O3vnUQw=s96-c",
      //     "given_name": "Leonard",
      //     "family_name": "(Web Dev)",
      //     "iat": 1740552972,
      //     "exp": 1740556572
      // }
      console.log('googleUserData: ', googleUserData)
      // googleUserData 生成我们项目自己的登录token 并拿到项目自己的userInfo

      // 将token以及用户数据存全局状态管理

      // 向其它页面发送登录成功的消息
      //   window.opener?.postMessage?.(
      //     {
      //       type: "googleLoginSuccess",
      //       data: {
      //         googleUserData,
      //       },
      //     },
      //     window.location.origin
      //   )

      // 重定向到首页或其他页面
    }
    handleCallback()
  }, [router])
  return <div>{error ? <p>{error}</p> : <p>Loading...</p>}</div>
}
