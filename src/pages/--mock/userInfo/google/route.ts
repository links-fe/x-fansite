import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    console.error('Authorization code is missing', code)
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 })
  }

  try {
    // 使用授权码换取访问令牌
    const tokenData: any = {
      code,
      client_id: '4963211978-uhpeb61dqut4ilcr8e6tmphc63f9v8k1.apps.googleusercontent.com',
      client_secret: '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',
      redirect_uri: `http://localhost:3000/--demo/google/auth`,
      grant_type: 'authorization_code',
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenData),
    })

    const tokenJson = await tokenResponse.json()
    if (!tokenJson.access_token) {
      console.error('Failed to get access token', tokenJson)

      return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 })
    }

    const accessToken = tokenJson.access_token

    // 使用访问令牌获取用户信息
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const userInfoJson = await userInfoResponse.json()

    return NextResponse.json({ data: { ...userInfoJson, accessToken }, code: 0 }, { status: 200 })
  } catch (error) {
    console.error('Error during Google OAuth callback:', error)
    return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 500 })
  }
}

// 退登
export async function POST(request: NextRequest) {
  try {
    // 从请求体中获取访问令牌
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is missing' }, { status: 400 })
    }

    // 发送注销请求到 Google 的注销端点
    const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${accessToken}`
    const revokeResponse = await fetch(revokeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (revokeResponse.ok) {
      // 注销成功，返回成功响应
      return NextResponse.json({ message: 'User logged out successfully' }, { status: 200 })
    } else {
      // 注销失败，返回错误响应
      const errorMessage = await revokeResponse.text()
      return NextResponse.json({ error: `Failed to log out: ${errorMessage}` }, { status: 500 })
    }
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 })
  }
}
