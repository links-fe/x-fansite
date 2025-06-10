import { useLayoutStore } from '@/models/layout'
import HomePage from '@/module/Home'
import React from 'react'

function Page() {
  const enablePcMode = useLayoutStore((state) => state.enablePcMode)
  return enablePcMode ? <HomePage /> : <HomePage />
}

export default Page
