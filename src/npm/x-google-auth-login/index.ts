'use client'
import { useUpdate } from 'ahooks'
import { useEffect, useRef } from 'react'
const postMessageDefaultType = 'googleAuthRedirectUri'
const googleAuthDefaultScope = 'profile email'
interface GoogleAuthLoginProps {
  googleClientId: string
  googleRedirectPath: string
  googleAuthScope?: string
  postMessageType?: string
  newWinWidth?: number
  newWinHeight?: number
  onSuccess?: (data: { code: string }) => void
  onError?: (error: any) => void
}

export const useGoogleAuthLogin = ({
  googleClientId,
  googleRedirectPath,
  googleAuthScope = googleAuthDefaultScope,
  postMessageType = postMessageDefaultType,
  newWinWidth,
  newWinHeight,
  onSuccess,
  onError,
}: GoogleAuthLoginProps) => {
  const update = useUpdate()
  const googleLoginBtnLoading = useRef<boolean>(false)
  const intervalId = useRef<any>(null)
  const hasGoogleAuthCallback = useRef<boolean>(false)
  useEffect(() => {
    // 监听新窗口发送的消息 (处理 如果用户没有在该浏览器登录twitter, 前端网页登录跳转到twitter授权时，会进行twitter的登录，用户登录完会到twitter首页，而不是回调到我们指定的twitter授权登录成功后的CallBack URL)
    const fn = async (event: any) => {
      if (event.origin !== window.location.origin) return
      const { type, data } = event?.data ?? {}
      if (type === postMessageType) {
        console.log('useGoogleAuthLogin Received message from new window:', event.data)
        hasGoogleAuthCallback.current = true
        if (data?.code) {
          await onSuccess?.(data)
        } else {
          await onError?.(data)
        }
        googleLoginBtnLoading.current = false
        update()
        hasGoogleAuthCallback.current = false
      }
    }
    window.addEventListener('message', fn)
    return () => {
      window.removeEventListener('message', fn)
      if (intervalId.current) {
        clearInterval(intervalId.current)
      }
      hasGoogleAuthCallback.current = false
    }
  }, [])
  const googleLogin = () => {
    if (googleLoginBtnLoading.current) return
    googleLoginBtnLoading.current = true
    update()
    // 重定向到Google授权URL
    const clientId = googleClientId
    const redirectUri = window.location.origin + googleRedirectPath
    const scope = googleAuthScope
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account`

    const newWindow = window.open(
      authUrl,
      'GoogleAuth',
      `width=${newWinWidth || window.innerWidth},height=${newWinHeight || window.innerHeight}`,
    )
    if (newWindow) {
      intervalId.current = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(intervalId.current)
          console.log('新窗口已关闭')
          if (!hasGoogleAuthCallback.current) {
            googleLoginBtnLoading.current = false
            update()
          }
          update()
        }
      }, 500) // 每500毫秒检查一次
    }
  }
  return {
    googleLogin,
    googleLoginBtnLoading: googleLoginBtnLoading.current,
  }
}

interface GoogleAuthCallbackProps {
  postMessageType?: string
  onSuccess?: (data: { code: string }) => void
  onError?: (error: any) => void
  noClose?: boolean
}
/**
 * Google授权回调code页需要调用的hook
 * 该hook需要在Google授权回调code页调用
 * 该hook会在页面加载完成后，获取code，并将code发送给父窗口
 * @example
 * useGoogleAuthCallback()
 */
export const useGoogleAuthCallback = (props?: GoogleAuthCallbackProps) => {
  const currentCode = useRef<string>('')
  useEffect(() => {
    if (!window?.opener?.postMessage) {
      console.error('This page is not opened by another window')
      props?.onError?.({
        message: 'This page is not opened by another window',
      })
      return
    }
    const { searchParams } = new URL(window.location.href)
    const code = searchParams.get('code')
    console.log('useGoogleAuthCallback code:', code)
    if (code !== currentCode.current) {
      currentCode.current = code ?? ''
      window.opener?.postMessage?.(
        {
          type: props?.postMessageType ?? postMessageDefaultType,
          data: {
            code: decodeURIComponent(code ?? ''),
          },
        },
        window.location.origin,
      )
      props?.onSuccess?.({ code: decodeURIComponent(code ?? '') })
    } else {
      props?.onError?.({
        code: decodeURIComponent(code ?? ''),
        message: 'code is sent repeatedly',
      })
    }
    if (!props?.noClose) {
      // 关闭当前窗口
      window.close()
    }
  }, [])
}
