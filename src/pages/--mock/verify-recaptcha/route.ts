import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token, type, expectedAction } = await request.json()

  // 选择验证类型
  const secret = type === 'v3' ? process.env.RECAPTCHA_V3_SECRET! : process.env.RECAPTCHA_V2_SECRET!

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`

  try {
    const response = await fetch(url, { method: 'POST' })
    if (!response.ok) {
      console.error('Failed to verify reCAPTCHA', response)
      throw new Error('Failed to verify reCAPTCHA')
    }
    const data = await response.json()
    console.log('siteverify', data)

    // v3 需返回评分
    if (type === 'v3') {
      // v3 成功 需要验证 action
      if (data.success && expectedAction !== data.action) {
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
        })
      }
      return NextResponse.json({
        success: data.success,
        score: data.score,
      })
    }

    // v2 只需验证成功状态
    return NextResponse.json({
      success: data.success,
    })
  } catch (error) {
    console.error('Verification failed:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
