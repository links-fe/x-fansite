'use client'
import React from 'react'
import { useUserInfo } from '@/models/user'
import { EnumLoginMode } from '@/types'
import { postLogout } from '@/services/user'
import Link from 'next/link'
import XButton from '@/components/XButton'
import { AppLayout } from './AppLayout'
const LoginDemoLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const userInfo = useUserInfo()

  const handleLogout = async () => {
    try {
      const res = await postLogout()
      if (!res?.success) {
        throw res
      }
      if (res?.success) {
        console.log('logout success')
        alert('logout success')
      }
    } catch (error) {
      alert('logout failed')
      console.error('logout failed', error)
    }
  }

  return (
    <>
      {userInfo?.loginMode === EnumLoginMode.Normal && (
        <div className="flex items-center justify-center h-20">
          <XButton onClick={handleLogout}>Logout</XButton>
        </div>
      )}

      <div>
        <Link href="/--demo/login" className="flex items-center justify-center h-16">
          <XButton>去往默认登录注册demo页</XButton>
        </Link>
        <Link href="/--demo/login/creator-share" className="flex items-center justify-center h-16">
          <XButton>去往购买前检测登录demo页</XButton>
        </Link>
      </div>

      {children}
    </>
  )
}
export default LoginDemoLayout
