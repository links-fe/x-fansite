'use client'
import MessageList from '@/module/MessageList'
import { useParams } from 'next/navigation'

export default function Page() {
  const { id } = useParams<{ id: string }>() || {}

  return <MessageList key={id} />
}
