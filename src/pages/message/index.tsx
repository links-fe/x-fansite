'use client'
import { useLayoutStore } from '@/models/layout'
import ChatList from '@/module/ChatList'

function MobilePage() {
  return <ChatList />
}
function PcPage() {
  return (
    <>
      <div>please select creator</div>
    </>
  )
}

// 添加默认导出
export default function Page() {
  const enablePcMode = useLayoutStore((state) => state.enablePcMode)
  return enablePcMode ? <PcPage /> : <MobilePage />
}
