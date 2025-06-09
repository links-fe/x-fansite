'use client'
import { MobileTabbarLayout, PcMenuLayout } from '@/components/Layout'
import { useLayoutStore } from '@/models/layout'
import ChatList from '@/module/ChatList'
import MessageList from '@/module/MessageList'

export default function Page() {
  const enablePcMode = useLayoutStore((state) => state.enablePcMode)
  return !enablePcMode ? (
    <ChatList />
  ) : (
    <div style={{ display: 'grid', gridTemplateColumns: '5fr 8fr' }}>
      <ChatList />
      <MessageList />
    </div>
  )
}
Page.PcLayout = PcMenuLayout
Page.MobileLayout = MobileTabbarLayout
