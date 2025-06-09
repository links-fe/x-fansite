import { create } from 'zustand'

export interface IChatListStore {
  /** 会话列表 data */
  data: string[]
  /** 是否有更多 */
  hasMore: boolean
  /** 重新加载会话列表 */
  reloading: boolean
  /** 加载状态 */
  loading: boolean
  /** 第一页加载失败 或 未知异常 */
  isError: boolean
  /** 加载更多异常 (第1+n页加载失败) */
  isLoadMoreError: boolean
  /** 接口数据返回为空或很少 且 hasMore 为true时会出现 */
  isConfinedLoadMore: boolean
  /** 空数据 */
  isEmpty: boolean
  // ------------------------------------------------
  /** 是否已经初始化数据 */
  hadInitData: boolean
}

const createDefaultChatListStore = (): IChatListStore => ({
  data: [],
  isError: false,
  hasMore: true,
  reloading: false,
  loading: false,
  isLoadMoreError: false,
  isConfinedLoadMore: false,
  isEmpty: false,
  hadInitData: false,
})

export const useChatListStore = create<IChatListStore>(() => ({
  ...createDefaultChatListStore(),
}))

/** 设置会话列表数据 */
export const setChatListStore = (data: Partial<IChatListStore>) => {
  const store = useChatListStore.getState()
  useChatListStore.setState({
    ...store,
    ...data,
  })
}
/** 重置chatListStore */
export const resetChatListStore = () => {
  useChatListStore.setState({
    ...createDefaultChatListStore(),
  })
}
