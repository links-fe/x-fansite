import { useMessageListStore } from '@/models/message/messagePaging.model'
import { InfiniteList } from '@/npm/x-utils-rc'
import React from 'react'
import { useMessageListViewhooks } from './hooks'
import MessageItem from './MessageItem'
import MessageListSpin from './Status/MessageListSpin'
import ChatListEmptyError from '../ChatList/Status/ChatListEmptyError'
import BackBottom from './BackBottom'
import { setMessageListBackBottomVisible } from '@/models/message/model'

interface IProps {
  userId: string
  toUserId: string
  chatListRef: React.RefObject<HTMLDivElement | null>
}

function MessageListView(props: IProps) {
  const { userId, toUserId, chatListRef } = props
  const { data, hasMore, reloading, isError, isEmpty, isLoadMoreError, isConfinedLoadMore } = useMessageListStore()
  const { messageListLoadMore, messageListReload, messageListLoadMoreRetry } = useMessageListViewhooks({
    userId,
    toUserId,
  })

  const onScroll = () => {
    if (!chatListRef.current) {
      return
    }
    if (chatListRef.current.scrollTop < -100) {
      setMessageListBackBottomVisible(true)
    } else {
      setMessageListBackBottomVisible(false)
    }
  }

  // 判断是否需要反转排列好方式  实现消息少的时候上面为顶部   消息多的时候下面为顶部
  const isReverse =
    chatListRef.current && chatListRef.current && chatListRef.current?.scrollHeight > chatListRef.current?.clientHeight

  return (
    <div
      className="flex-1 overflow-y-auto flex flex-col-reverse relative"
      style={isReverse ? { flexDirection: 'column-reverse' } : { flexDirection: 'column' }}
    >
      <InfiniteList<string>
        type="verticalTop"
        hasMore={hasMore}
        ref={chatListRef}
        onScroll={onScroll}
        onLoadMore={messageListLoadMore}
        onReload={messageListReload}
        renderItem={(v, i) => {
          // 这里的id可能为frontendId, 也可能为服务端id
          return (
            <MessageItem
              key={v}
              id={v}
              nexItemId={data[i - 1] || ''}
              preId={data[i + 1] || ''}
              toUserId={toUserId}
              userId={userId}
              listRef={chatListRef}
            />
          )
        }}
        data={data}
        reloading={reloading}
        isError={isError}
        isEmpty={isEmpty}
        isLoadMoreError={isLoadMoreError}
        isConfinedLoadMore={isConfinedLoadMore}
        spin={<MessageListSpin size={10} />}
        renderAbnormalEmpty={() => <></>}
        renderAbnormalRequestError={() => <ChatListEmptyError scene="initError" onReload={messageListReload} />}
        renderAbnormalLoadMoreError={() => (
          <ChatListEmptyError scene="loadMoreError" onReload={messageListLoadMoreRetry} />
        )}
        className="flex flex-col-reverse"
        style={{ height: 'auto' }}
      />
      <BackBottom chatListRef={chatListRef.current} />
    </div>
  )
}

export default MessageListView
