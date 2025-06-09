'use client'
import LoginDemoLayout from '@/components/Layout/LoginDemoLayout'
import { useAppStore } from '@/models'
import { hideRegisterLoginPageDialog, showRegisterLoginPageDialog, useUserInfo } from '@/models/user'
import { EnumLoginMode } from '@/types'
import React, { useEffect } from 'react'
const LoginDemoPage = () => {
  const appStore = useAppStore()
  const userInfo = useUserInfo()
  useEffect(() => {
    if (!appStore.hadInit) return
    console.log('userInfo?.loginMode', userInfo?.loginMode, userInfo)
    if (userInfo?.loginMode === EnumLoginMode.Normal) {
      hideRegisterLoginPageDialog()
      return
    }
    showRegisterLoginPageDialog()
  }, [appStore.hadInit, userInfo?.loginMode])
  return (
    <div>
      <h1>login demo page</h1>
    </div>
  )
}
LoginDemoPage.PcLayout = LoginDemoLayout
LoginDemoPage.MobileLayout = LoginDemoLayout
export default LoginDemoPage
