import { refreshChatListStoreState } from '@/models/chat'
import { getOrCreateChatCacheManager } from '@/models/chat/cache'
import { setChatListStore } from '@/models/chat/chatPaging.model'
import { silencePullChatList } from '@/models/chat/utils/silencePullChatList'
import { RefObject, useEffect } from 'react'

export const useChatListViewhooks = (p: { userId: string }) => {
  const { userId } = p
  const chatCacheManager = getOrCreateChatCacheManager(userId)

  useEffect(() => {
    onChatPageEnter()
  }, [])

  const onChatPageEnter = () => {
    // 接口补偿
    silencePullChatList(userId)
  }

  const refreshStoreState = () => {
    refreshChatListStoreState(userId)
  }

  const chatListLoadMore = async () => {
    const paging = chatCacheManager.getPagingInstance()
    const chatList = chatCacheManager.getChatListIds()
    const lastChatItem = chatList?.[chatList?.length - 1] ?? undefined
    paging.setState({
      queryParams: {
        cursor: lastChatItem,
        limit: 10,
      },
    })

    await paging.loadMore()
    refreshStoreState()
  }
  const chatListReload = async () => {
    const paging = chatCacheManager.getPagingInstance()

    setChatListStore({
      reloading: true,
    })
    await paging.reload({
      limit: 10,
    })
    refreshStoreState()
  }

  const chatListLoadMoreRetry = () => {
    setChatListStore({
      isLoadMoreError: false,
    })
    chatListLoadMore()
  }

  return {
    chatListLoadMore,
    chatListReload,
    chatListLoadMoreRetry,
  }
}

export const useChatListScroll = (p: { userId: string; scrollRef: RefObject<HTMLDivElement | null> }) => {
  const { userId, scrollRef } = p
  const chatCacheManager = getOrCreateChatCacheManager(userId)

  useEffect(() => {
    initScroll()
    scrollRef.current?.addEventListener('scroll', handleScroll)
    return () => {
      scrollRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [scrollRef])

  const initScroll = () => {
    const scrollTop = chatCacheManager.getScrollTop()
    if (scrollTop) {
      scrollRef.current?.scrollTo(0, scrollTop)
    }
  }

  const handleScroll = () => {
    chatCacheManager.setScrollTop(scrollRef.current?.scrollTop || 0)
  }
}
