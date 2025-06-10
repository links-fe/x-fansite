'use client'
import { Icon } from '@x-vision/icons'
import { loginGuard, useGlobalLoginModalVisible, useUserInfo } from '@/models/user'
import XButton from '@/components/XButton'
import Link from 'next/link'
import { EnumLoginMode } from '@/types'
import { postLogout } from '@/services/user'
export default function HomePage() {
  const userInfo = useUserInfo()
  const visibleGlobalLoginModal = useGlobalLoginModalVisible()
  const handleBuy = async () => {
    console.log('handleBuy: ')
    await loginGuard()
    alert('已登录')
  }
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
    <div>
      <div>
        Home
        <Icon icon="x:Message01StyleSolid" />
        <Icon icon="x:Wallet03StyleSolid" />
      </div>
      <div>
        <div>
          {userInfo?.loginMode === EnumLoginMode.Normal && (
            <div className="flex items-center justify-center h-20">
              <XButton onClick={handleLogout}>Logout</XButton>
            </div>
          )}
        </div>
        <div>
          <Link href="/--demo/login" className="flex items-center justify-center h-16">
            <XButton>去往默认登录注册demo页</XButton>
          </Link>
          <Link href="/--demo/login/creator-share" className="flex items-center justify-center h-16">
            <XButton>去往购买前检测登录demo页</XButton>
          </Link>
        </div>
        <XButton
          color="primary"
          onClick={handleBuy}
          loading={visibleGlobalLoginModal}
          disabled={visibleGlobalLoginModal}
        >
          操作前登录
        </XButton>
      </div>
    </div>
  )
}
