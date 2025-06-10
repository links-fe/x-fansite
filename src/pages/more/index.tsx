'use client'
import { useLayoutStore } from '@/models/layout'
import MorePage from '@/views/more'

export default function Page() {
  const enablePcMode = useLayoutStore((state) => state.enablePcMode)
  return enablePcMode ? <></> : <MorePage />
}
