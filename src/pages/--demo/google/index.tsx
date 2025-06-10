'use client'

import { GOOGLE_SCOPE } from '@/constants'

export default function Page() {
  const handleSignIn = () => {
    // 重定向到Google授权URL
    const clientId = '4963211978-uhpeb61dqut4ilcr8e6tmphc63f9v8k1.apps.googleusercontent.com'
    const redirectUri = window.location.origin + '/--demo/google/auth'
    const scope = GOOGLE_SCOPE
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`

    window.location.href = authUrl
  }

  return (
    <button onClick={handleSignIn} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Sign in with Google
    </button>
  )
}
