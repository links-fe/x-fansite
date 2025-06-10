'use client'
import { useLayoutStore } from '@/models/layout'
import ChatList from '@/module/ChatList'
import MessageList from '@/module/MessageList'
import { useParams } from 'next/navigation'

export default function Page() {
  const enablePcMode = useLayoutStore((state) => state.enablePcMode)

  const { id } = useParams<{ id: string }>() || {}

  return !enablePcMode ? (
    <MessageList />
  ) : (
    <div style={{ display: 'grid', gridTemplateColumns: '5fr 8fr' }}>
      <ChatList />
      <MessageList key={id} />
    </div>
  )
}
