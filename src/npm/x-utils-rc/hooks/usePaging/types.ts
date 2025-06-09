interface IUsePagingServiceOption<T, P> {
  setParams: (params: Partial<P>) => void
  pushData: (data: T[]) => void
  setData: (data: T[]) => void
  getData: () => T[]
  // setHasMore: (hasMore: boolean)=>void
  /** 结束了 */
  end: () => void
}

export interface IUsePagingProps<T, P> {
  data?: T[]
  queryParams?: P

  /** 连续loadMore次数限制，当连续加载的次数大于次数时，将  */
  serialLoadMoreLimit?: number

  service: (params: P, option: IUsePagingServiceOption<T, P>) => Promise<void>
}

export interface IUsePaging<T, P> {
  hasMore: boolean
  data: T[]
  loading: boolean
  reloading: boolean
  isError: boolean
  isEmpty: boolean
  isLoadMoreError: boolean
  /** loadMore 受限 */
  isConfinedLoadMore: boolean

  loadMore: () => Promise<void>
  clear: () => void
  reload: (params: P) => Promise<void>

  getQueryParams: () => P
}
