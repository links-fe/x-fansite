'use client'
import React from 'react'
import { loginGuard, useGlobalLoginModalVisible } from '@/models/user'
import XButton from '@/components/XButton'
const Page = () => {
  const visibleGlobalLoginModal = useGlobalLoginModalVisible()
  const handleBuy = async () => {
    console.log('handleBuy: ')
    await loginGuard()
    console.log('buy after login end')
  }
  return (
    <div>
      <h2>login demo creator share page</h2>
      <XButton onClick={handleBuy} loading={visibleGlobalLoginModal} disabled={visibleGlobalLoginModal}>
        BuyMaterial
      </XButton>
    </div>
  )
}
export default Page
