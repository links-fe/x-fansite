'use client'
import React, { useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface Iprops {
  // action类型（不同场景传不同值独立区分!!!）
  actionType: string
  v3SiteKey: string
  updateV3Token: (token: string) => void
  showV2?: boolean
  v2SiteKey?: string
  updateShowV2?: (val: boolean) => void
  V2VerifyFn?: (token: string) => void
  className?: string
}
const XGoogleRecaptcha = ({
  actionType,
  v3SiteKey,
  updateV3Token,
  showV2,
  v2SiteKey,
  updateShowV2,
  V2VerifyFn,
  className,
}: Iprops) => {
  const isInit = useRef<boolean>(false)

  // 切换action
  const generateToken = (aType: string) => {
    try {
      window.grecaptcha.enterprise
        .execute(v3SiteKey, { action: aType })
        .then((token) => updateV3Token(token))
        .catch((err) => {
          console.warn('Error generating token:', err)
          updateShowV2?.(true)
        })
    } catch (error) {
      console.warn('Error generating token:', error)
      window.grecaptcha?.enterprise?.ready?.(() => {
        window.grecaptcha.enterprise
          ?.execute?.(v3SiteKey, { action: aType })
          ?.then?.((token) => updateV3Token(token))
          ?.catch?.((err) => {
            console.warn('Error generating token:', err)
            updateShowV2?.(true)
          })
      })
    }
  }

  useEffect(() => {
    if (!isInit.current) return
    generateToken(actionType)
  }, [actionType])

  // 初始化 v3 无感知验证
  const initializeV3 = () => {
    window.grecaptcha?.enterprise?.ready?.(() => {
      generateToken(actionType)
      isInit.current = true
    })
  }

  // 动态加载 reCAPTCHA v3 脚本
  useEffect(() => {
    const recaptchaV3ScriptId = 'recaptchaV3Script'
    if (document.getElementById(recaptchaV3ScriptId)) {
      generateToken(actionType)
      isInit.current = true
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${v3SiteKey}`
    script.async = true
    script.id = recaptchaV3ScriptId
    script.onload = initializeV3
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
      isInit.current = false
    }
  }, [])

  if (showV2 && v2SiteKey && V2VerifyFn) {
    return (
      <div className={className ?? ''}>
        <ReCAPTCHA sitekey={v2SiteKey} onChange={V2VerifyFn as any} />
      </div>
    )
  }
  return null
}
export default XGoogleRecaptcha
