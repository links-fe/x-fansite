import { NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const codeVerifier: any = searchParams.get('codeVerifier')
  console.log('code, state, codeVerifier', code, state, codeVerifier)
  // 验证 state 防止 CSRF 攻击
  if (state !== process.env.NEXT_PUBLIC_TWITTER_STATE) {
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 })
  }

  try {
    // 使用授权码和 codeVerifier 换取访问令牌
    const tokenResponse = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}:${process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET}`,
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        code: code!,
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
        redirect_uri: 'http://localhost:3000/auth/twitter',
        code_verifier: codeVerifier,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to fetch access token')
    }

    const { access_token } = await tokenResponse.json()

    // 使用访问令牌获取用户信息
    const userResponse = await fetch('https://api.x.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await userResponse.json()

    console.log('userData', userData)

    return NextResponse.json({ ...userData, accessToken: access_token, code: 0 }, { status: 200 })
  } catch (error) {
    console.error('Error during Twitter OAuth:', error)
    return NextResponse.json({ error: 'Failed to authenticate with Twitter' }, { status: 500 })
  }
}

// 退登
export async function POST(request: NextRequest) {
  try {
    // 从请求体中获取访问令牌和访问令牌密钥
    const { accessToken, accessTokenSecret } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is missing' }, { status: 400 })
    }

    // 构建请求的 URL 和参数
    const revokeUrl = 'https://api.twitter.com/oauth2/invalidate_token'
    const authHeader = `Bearer ${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}:${process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET}`

    const requestBody: any = {
      access_token: accessToken,
    }

    if (accessTokenSecret) {
      // 如果需要访问令牌密钥，也添加到请求体中
      requestBody['access_token_secret'] = accessTokenSecret
    }

    // 发送请求到 Twitter 的撤销令牌端点
    const response = await fetch(revokeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(requestBody),
    })

    if (response.ok) {
      // 撤销成功，返回成功信息
      return NextResponse.json({ message: 'Successfully logged out from Twitter' }, { status: 200 })
    } else {
      // 撤销失败，返回错误信息
      const errorData = await response.json()
      return NextResponse.json({ error: `Failed to log out: ${errorData.error || 'Unknown error'}` }, { status: 500 })
    }
  } catch (error) {
    console.error('Error during Twitter logout:', error)
    return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 })
  }
}
