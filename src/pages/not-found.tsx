'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import XButton from '@/components/XButton'
import noPagePng from '@/assets/404.png'

export default function NotFound() {
  const router = useRouter()

  const handleBackToHome = () => {
    router.push('/') // 跳转到首页
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div>
        <div className="flex items-center justify-center flex-col px-(--sizing-named-small)">
          <Image src={noPagePng} width={360} height={80} alt="error.icon"></Image>
          <div className="mt-(--sizing-named-small) text-(--element-emphasis-01) typography-text-body1-base text-center">
            The URL opened a portal to the 404th dimension of X.
          </div>
        </div>
        <div className="mt-(--sizing-named-medium) flex items-center justify-center">
          <XButton color="primary" size="huge" onClick={handleBackToHome}>
            Get back to civilization
          </XButton>
        </div>
      </div>
    </div>
  )
}
