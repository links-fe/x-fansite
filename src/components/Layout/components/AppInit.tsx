import React from 'react'
import RouterLoading from './RouterLoading'
import AudioInitialize from '@/components/AudioInitialize'

function AppInit() {
  return (
    <>
      {/* 初始化音频 */}
      <AudioInitialize />
      {/* 路由loading */}
      <RouterLoading />
    </>
  )
}

export default AppInit
