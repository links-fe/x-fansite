import { create } from 'zustand'

export interface IMessageListStore {
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

const createDefaultMessageListStore = (): IMessageListStore => ({
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

export const useMessageListStore = create<IMessageListStore>(() => ({
  ...createDefaultMessageListStore(),
}))

/** 设置会话列表数据 */
export const setMessageListStore = (data: Partial<IMessageListStore>) => {
  const store = useMessageListStore.getState()
  useMessageListStore.setState({
    ...store,
    ...data,
  })
}

/** 获取会话列表数据 */
export const getMessageListShowData = () => {
  return useMessageListStore.getState().data
}

/** 重置MessageListStore */
export const resetMessageListStore = () => {
  useMessageListStore.setState({
    ...createDefaultMessageListStore(),
  })
}
