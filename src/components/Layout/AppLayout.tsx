'use client'

/**
 * App Root Layout
 * 这是应用内的根布局, 可以在这里加载公共的组件和逻辑
 */

import { ON_APP_EVENT_INIT, useAppStore, useVisibleGlobalError } from '@/models/app'
import { Suspense, useEffect } from 'react'
import GlobalLoginDrawer from '@/components/LoginRegister/GlobalLoginDrawer'
import { PageLoading } from '@/components/PageLoading'
import { RootLayout } from '@/components/Layout'
import SettingPasswordDrawer from '@/components/SettingPasswordDrawer'
import LoginPage from '@/components/LoginRegister/LoginPage'
import {
  hideGlobalLoginModal,
  hideRegisterLoginPageDialog,
  showRegisterLoginPageDialog,
  useRegisterLoginPageDialogVisible,
  useResetYourPasswordDrawerVisible,
  useUserInfo,
} from '@/models/user'
import ResetYourPasswordDrawer from '@/components/LoginRegister/ForgotPassword/ResetYourPasswordDrawer'
import { EnumLoginMode } from '@/types'
import useOpenResetPassword from '@/hooks/useOpenResetPassword'
import NoUserAbnormalDrawer from '@/components/LoginRegister/ForgotPassword/ResetYourPasswordDrawer/NoUserAbnormalDrawer'
import { useNoUserAbnormalVisible } from '@/models/abnormalDrawer'
import ErrorBoundary from '@/pages/error'
import RestoreAccount from '@/components/RestoreAccount'
import AudioInitialize from '../AudioInitialize'
import RouterLoading from './components/RouterLoading'
export function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const appStore = useAppStore()
  const userInfo = useUserInfo()
  const visibleResetYourPasswordDrawer = useResetYourPasswordDrawerVisible()
  const visibleRegisterLoginPageDialog = useRegisterLoginPageDialogVisible()
  const visibleGlobalError = useVisibleGlobalError()
  const noUserAbnormalVisible = useNoUserAbnormalVisible()
  useEffect(() => {
    // console.log('appStore.hadInit', appStore.hadInit)
    if (appStore.hadInit || appStore.isAppIniting) {
      return
    }
    ON_APP_EVENT_INIT()
  }, [appStore.hadInit, appStore.isAppIniting])

  useEffect(() => {
    // 初始化完成后，检测是否需要打开登录页面级别弹窗
    if (!appStore.hadInit) return
    if (userInfo?.loginMode === EnumLoginMode.Normal) {
      hideRegisterLoginPageDialog()
      hideGlobalLoginModal()
      return
    }
    if (/* process.env.NODE_ENV !== 'development' &&  */ !location.pathname.includes('/creator')) {
      showRegisterLoginPageDialog()
    }
  }, [appStore.hadInit, userInfo?.loginMode])

  useOpenResetPassword()

  function render() {
    if (!appStore.hadInit) {
      return <PageLoading />
    }

    if (visibleGlobalError) {
      return <ErrorBoundary />
    }

    // 重置密码邮件链接跳转过来的，打开重置密码抽屉
    if (visibleResetYourPasswordDrawer) {
      return <ResetYourPasswordDrawer />
    }
    if (noUserAbnormalVisible) {
      return <NoUserAbnormalDrawer />
    }

    // 访问非creator相关的需要登录的页面，直接换起login page页组件 （creator等后置点击触发登录态检测等，走GlobalLoginDrawer逻辑）
    if (visibleRegisterLoginPageDialog) {
      return <LoginPage className="fixed w-screen h-screen top-0 bottom-0 left-0 z-10 bg-white" />
    }

    if (userInfo?.closePending) {
      // 删除冷静期
      return <RestoreAccount></RestoreAccount>
    }

    function renderChildren() {
      return <Suspense fallback={<div>Loading ... -- children</div>}>{children}</Suspense>
    }

    return (
      <>
        <AudioInitialize />
        <GlobalLoginDrawer />
        <SettingPasswordDrawer />
        <RouterLoading />
        {renderChildren()}
      </>
    )
  }

  return <RootLayout>{render()}</RootLayout>
}
