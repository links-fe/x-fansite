'use client'

import React, { useRef } from 'react'
// import ChatItem from './ChatItem'
import { InfiniteList } from '@/npm/x-utils-rc'
import ChatListSpin from './Status/ChatListSpin'
import ChatListEmptyError from './Status/ChatListEmptyError'
import { useChatListStore } from '@/models/chat/chatPaging.model'
import { useChatListScroll, useChatListViewhooks } from './hooks'
import ChatItem from './ChatItem'

function ChatListView(props: { userId: string }) {
  const { userId } = props
  const { data, hasMore, reloading, isError, isEmpty, isLoadMoreError, isConfinedLoadMore, hadInitData } =
    useChatListStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { chatListLoadMore, chatListReload, chatListLoadMoreRetry } = useChatListViewhooks({ userId })
  useChatListScroll({ userId, scrollRef })

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      <div className="flex my-(--sizing-named-micro) px-(--sizing-named-mini)">
        <span style={{ font: 'var(--typography-text-heading4-strong)' }} className="text-(--element-emphasis-00)">
          Messages
        </span>
        {/* <Button onClick={newMessageOutListTest}>来新消息---不在列表中</Button>
        <Button onClick={newMessageInListTest}>来新消息---在列表中</Button>
        <Button onClick={newMessageInSpecialListTest}>特殊情况</Button> */}
      </div>
      <div className="flex-1 overflow-y-auto">
        <InfiniteList<string>
          ref={scrollRef}
          hasMore={hasMore}
          onLoadMore={chatListLoadMore}
          onReload={chatListReload}
          hadInitData={hadInitData}
          renderItem={(v) => {
            return <ChatItem key={v} toUserId={v} userId={userId} />
          }}
          data={data}
          reloading={reloading}
          isError={isError}
          isEmpty={isEmpty}
          isLoadMoreError={isLoadMoreError}
          isConfinedLoadMore={isConfinedLoadMore}
          spin={<ChatListSpin />}
          renderAbnormalEmpty={() => <ChatListEmptyError scene="initEmpty" text="Nothing loaded" />}
          renderAbnormalRequestError={() => (
            <ChatListEmptyError scene="initError" onReload={chatListReload} text="Error loading data" />
          )}
          renderAbnormalLoadMoreError={() => (
            <ChatListEmptyError scene="loadMoreError" onReload={chatListLoadMoreRetry} />
          )}
        />
      </div>
    </div>
  )
}

export default ChatListView
