'use client'
import { DemoLayout } from '@/components/Layout/DemoLayout'
import React, { useCallback, useEffect, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

// action类型（不同场景传不同值独立区分!!!）
const actionType = 'auth/login'
export default function Page() {
  const [isMount, seIsMount] = useState(false)
  const [v3Token, setV3Token] = useState<string>('')
  // const [v2Token, setV2Token] = useState<string>('')
  const [showV2, setShowV2] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 切换action
  const generateToken = useCallback((aType: string) => {
    try {
      window.grecaptcha.enterprise
        .execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY!,
          { action: aType }, // 动态传入新 action[1,2](@ref)
        )
        .then((token) => setV3Token(token))
        .catch((err) => {
          console.warn('Error generating token:', err)
          setShowV2(true)
        })
    } catch (error) {
      console.warn('Error generating token:', error)
      window.grecaptcha?.enterprise?.ready?.(() => {
        window.grecaptcha.enterprise
          ?.execute?.(
            process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY!,
            { action: aType }, // 动态传入新 action[1,2](@ref)
          )
          ?.then?.((token) => setV3Token(token))
          ?.catch?.((err) => {
            console.warn('Error generating token:', err)
            setShowV2(true)
          })
      })
    }
  }, [])

  // 初始化 v3 无感知验证
  const initializeV3 = useCallback(() => {
    window.grecaptcha?.enterprise?.ready?.(() => {
      generateToken(actionType)
    })
  }, [generateToken])

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 第一步：验证 v3
      const v3Response = await fetch('/--mock/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: v3Token, type: 'v3', expectedAction: actionType }),
      })
      console.log('v3Response: ', v3Response)
      if (!v3Response.ok) {
        console.error('v3 verification failed', v3Response)
        setShowV2(true)
        return
      }
      const { success, score } = await v3Response.json()
      console.log('v3Response { success, score }: ', { success, score })

      // v3 验证失败或低分触发 v2
      if (!success || score < 0.5) {
        setShowV2(true)
        return
      }

      // 继续登录流程（示例）
      await performLogin()
    } finally {
      setIsSubmitting(false)
    }
  }

  // v2 验证通过后提交
  const handleV2Verify = async (token: string) => {
    // setV2Token(token)
    const v2Response = await fetch('/--mock/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, type: 'v2' }),
    })
    console.log('v2Response: ', v2Response)
    if (!v2Response.ok) {
      console.error('v2 verification failed', v2Response)
      return
    }
    const v2Data = await v2Response.json()
    console.log('v2Data: ', v2Data)

    // 继续登录流程（示例）
    await performLogin()
  }

  // 实际登录逻辑
  const performLogin = async () => {
    // 替换为您的登录 API 调用
    console.log('Proceeding to login...')
  }

  useEffect(() => {
    seIsMount(true)
    return () => {
      seIsMount(false)
    }
  }, [])

  // 动态加载 reCAPTCHA v3 脚本
  useEffect(() => {
    if (!isMount) return
    const recaptchaV3ScriptId = 'recaptchaV3Script'
    if (document.getElementById(recaptchaV3ScriptId)) {
      generateToken(actionType)
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY}`
    script.async = true
    script.id = recaptchaV3ScriptId
    script.onload = initializeV3
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [isMount, initializeV3, generateToken])

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label>Email</label>
        <input type="email" required className="w-full p-2 border" />
      </div>

      <div className="mb-4">
        <label>Password</label>
        <input type="password" required className="w-full p-2 border" />
      </div>

      <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white p-2 rounded disabled:opacity-50">
        {isSubmitting ? 'Submitting...' : 'Login'}
      </button>

      {/* v2 备用验证 */}
      {showV2 && (
        <div className="mt-4">
          <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY!} onChange={handleV2Verify as any} />
        </div>
      )}
    </form>
  )
}
Page.PcLayout = DemoLayout
Page.MobileLayout = DemoLayout
