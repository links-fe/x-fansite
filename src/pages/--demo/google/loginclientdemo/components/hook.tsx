'use client'
import { importScript } from '@/utils'
import { useCallback, useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'

// ts类型包
// yarn add @types/google.accounts --dev

// tsconfig.json
// {
//   "compilerOptions": {
//     "types": [
//       "google.accounts"
//     ]
//   }
// }
interface GoogleLoginType {
  loginButtonRef: (node: HTMLDivElement) => void
  reset: () => void
  testLogin?: () => void
}

interface GoogleLoginOptions {
  type?: 'login' | 'bind'
  onSuccess: (data: any) => void
  onFailure: (message?: string) => void
}

const CLIENT_ID = '4963211978-uhpeb61dqut4ilcr8e6tmphc63f9v8k1.apps.googleusercontent.com' as string

export default function useGoogleLogin(options: GoogleLoginOptions): GoogleLoginType {
  const isMounted = useRef(false)
  const buttonWrapperRef = useRef<HTMLDivElement | null>(null)
  const clientRef = useRef<any>(null)

  const handleCredentialResponse = useCallback(
    async (response: google.accounts.id.CredentialResponse) => {
      console.log('response: ', response)
      try {
        const idToken = response.credential
        const userInfo = jwtDecode(idToken)
        console.log('idToken, response.credential: ', idToken, response.credential)
        options.onSuccess(userInfo)
        //   {
        //     "iss": "https://accounts.google.com",
        //     "azp": "4963211978-uhpeb61dqut4ilcr8e6tmphc63f9v8k1.apps.googleusercontent.com",
        //     "aud": "4963211978-uhpeb61dqut4ilcr8e6tmphc63f9v8k1.apps.googleusercontent.com",
        //     "sub": "112483704182384149290",
        //     "hd": "infloww.com",
        //     "email": "leonard@infloww.com",
        //     "email_verified": true,
        //     "nbf": 1740985926,
        //     "name": "Leonard (Web Dev)",
        //     "picture": "https://lh3.googleusercontent.com/a/ACg8ocLAaAVS6fURSTieN8cgyh0-hJ8YHzlvhVXUtA8XNs0O3vnUQw=s96-c",
        //     "given_name": "Leonard",
        //     "family_name": "(Web Dev)",
        //     "iat": 1740986226,
        //     "exp": 1740989826,
        //     "jti": "79cbfd8513715dcb2d28d85411f7ff4c25f1beb4"
        // }
        console.log('userInfo: ', userInfo)
      } catch (error) {
        console.error('Google login failed:', error)
        options.onFailure('Failed to process Google login')
      }
    },
    [options],
  )

  const initializeGoogleAuth = useCallback(async () => {
    if (!window.google?.accounts?.id) {
      await importScript('https://accounts.google.com/gsi/client')
    }

    if (!clientRef.current) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        ux_mode: 'popup',
        itp_support: true,
      })

      clientRef.current = window.google.accounts.id
    }
  }, [handleCredentialResponse])

  const renderButton = useCallback(() => {
    if (!buttonWrapperRef.current || !clientRef.current) return

    clientRef.current.renderButton(buttonWrapperRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: 400,
      text: 'continue_with',
      shape: 'rectangular',
    })
  }, [])

  const loginButtonRef = useCallback(
    (node: HTMLDivElement) => {
      buttonWrapperRef.current = node
      if (node) {
        initializeGoogleAuth().then(renderButton)
      }
    },
    [initializeGoogleAuth, renderButton],
  )

  const reset = useCallback(() => {
    if (clientRef.current && buttonWrapperRef.current) {
      clientRef.current.cancel()
      buttonWrapperRef.current.innerHTML = ''
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      reset()
    }
  }, [reset])

  return {
    loginButtonRef,
    reset,
    testLogin: () => {
      if (clientRef.current) {
        clientRef.current
          .prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              options.onFailure('Failed to display Google login')
            }
          })
          .catch((error: any) => {
            console.error('Google login failed:', error)
            options.onFailure('Failed to process Google login')
          })
      }
    },
  }
}
