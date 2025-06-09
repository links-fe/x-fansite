'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { hideResetYourPasswordDrawer, showResetYourPasswordDrawer, useUserInfo } from '@/models/user'
import { useAppStore } from '@/models'
import { showNoUserAbnormalDrawer } from '@/models/abnormalDrawer'

const useOpenResetPassword = () => {
  const appStore = useAppStore()
  const userInfo = useUserInfo()
  const searchParams = useSearchParams()
  const ticket = searchParams?.get?.('ticket') as string
  const email = searchParams?.get?.('email') as string
  useEffect(() => {
    if (!appStore.hadInit) return
    if (!ticket || !email) {
      hideResetYourPasswordDrawer()
      return
    }
    if (userInfo?.email && userInfo?.email !== email) {
      hideResetYourPasswordDrawer()
      console.warn('email not match')
      showNoUserAbnormalDrawer()
      return
    }
    showResetYourPasswordDrawer()
  }, [appStore.hadInit, userInfo?.email, ticket, email])
}
export default useOpenResetPassword
