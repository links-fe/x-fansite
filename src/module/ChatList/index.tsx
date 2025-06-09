'use client'

import React from 'react'
import { getActiveAccountId } from '@/models/user'
import ChatListView from './ChatListView'

function ChatList() {
  const userId = getActiveAccountId()!
  if (!userId) return null

  return <ChatListView userId={userId} />
}

export default ChatList
