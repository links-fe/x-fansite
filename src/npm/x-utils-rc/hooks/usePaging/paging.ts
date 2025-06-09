import { Event } from '@hb-common/utils'
import { IUsePagingProps } from './types'

export interface IPagingState<T, P> {
  data: T[]
  loading: boolean
  reloading: boolean
  hasMore: boolean
  isError: boolean
  queryParams: P

  /** loadMore 受限 */
  isConfinedLoadMore: boolean

  isLoadMoreError: boolean

  /** 用来标记当前的请求，保证此时只有一个请求有效，先发出的请求如果在后发出的请求之后到达，将被丢弃 */
  currentQueryId: symbol

  /** 连续加载更多的次数，用于识别异常的连续加载 */
  serialLoadMoreTimes: number
  lastLoadMoreTime: number

  loadMoreTimes: number

  // 只读属性
  isEmpty: boolean
}

export class Paging<T, P> {
  private _option: IUsePagingProps<T, P>
  constructor(option: IUsePagingProps<T, P>) {
    this._state.data = [...(option.data || [])]
    this._state.queryParams = {
      ...((option.queryParams || {}) as P),
    }

    this._option = option
  }
  public event: Event<'updateState'> = new Event()
  private _state: IPagingState<T, P> = {
    data: [],
    loading: false,
    reloading: false,
    hasMore: true,
    isError: false,
    queryParams: {} as P,
    isConfinedLoadMore: false,
    isLoadMoreError: false,
    currentQueryId: Symbol('currentQueryId'),
    serialLoadMoreTimes: 0,
    lastLoadMoreTime: 0,
    loadMoreTimes: 0,
    isEmpty: false,
  }
  public getState(): IPagingState<T, P> {
    const state = this._state
    return {
      ...this._state,
      isEmpty:
        state.data.length === 0 &&
        !state.loading &&
        !state.reloading &&
        !state.isError &&
        !state.hasMore &&
        state.loadMoreTimes !== 0,
    }
  }
  public getIsEmpty(data: T[]): boolean {
    const state = this._state
    return (
      data.length === 0 &&
      !state.loading &&
      !state.reloading &&
      !state.isError &&
      !state.hasMore &&
      state.loadMoreTimes !== 0
    )
  }
  public setState(state: Partial<IPagingState<T, P>>, isSilence = false) {
    Object.assign(this._state, state)
    if (!isSilence) {
      this.update()
    }
  }

  public async loadMore() {
    this.setState(
      {
        isLoadMoreError: false,
      },
      true,
    )

    const state = this._state
    // 正在loadMore，reload，没有更多数据，或者发生了错误，都不应该再次发起请求
    if (state.loading || !state.hasMore || state.isError) {
      return
    }

    // 如果距离上次加载时间小于100ms，说明此次加载是连续的
    if (Date.now() - state.lastLoadMoreTime < 500) {
      // state.serialLoadMoreTimes++
      this.setState(
        {
          serialLoadMoreTimes: state.serialLoadMoreTimes + 1,
        },
        true,
      )
      if (state.serialLoadMoreTimes >= (this._option.serialLoadMoreLimit || 3)) {
        this.setState({
          isConfinedLoadMore: true,
        })
        return
      }
    } else {
      this.setState(
        {
          serialLoadMoreTimes: 0,
          isConfinedLoadMore: false,
        },
        true,
      )
    }

    // 利用闭包暂存当前的queryId，如果在请求结束之前，queryId发生了变化，说明此次请求已经过期，应该丢弃
    const currentQueryId = Symbol('currentQueryId')
    this.setState({
      loading: true,
      currentQueryId,
    })

    try {
      await this._option.service(state.queryParams, {
        setParams: (params: Partial<P>) => {
          // 如果queryId发生了变化，说明此次请求已经过期，应该丢弃
          if (currentQueryId !== state.currentQueryId) return

          // @ts-expect-error 忽略类型错误
          Object.assign(state.queryParams, params)
        },
        pushData: (data) => {
          if (currentQueryId !== state.currentQueryId) return
          // ? 为什么不使用push? 如果使用push会使useEffect监听data的变化无效
          this.setState({
            data: [...state.data, ...data],
          })
        },
        setData: (data) => {
          if (currentQueryId !== state.currentQueryId) return
          this.setState({
            data,
          })
        },
        getData: () => {
          return state.data
        },
        end: () => {
          this.setState({
            hasMore: false,
          })
        },
      })

      this.setState(
        {
          lastLoadMoreTime: Date.now(),
          loadMoreTimes: state.loadMoreTimes + 1,
        },
        true,
      )
    } catch (e) {
      console.log(e)

      if (currentQueryId !== state.currentQueryId) return
      this.setState(
        {
          isLoadMoreError: true,
        },
        true,
      )
      // 如果一次都没有加载成功，则判定为异常
      if (state.loadMoreTimes === 0) {
        this.setState(
          {
            isError: true,
          },
          true,
        )
      }
      this.update()
    } finally {
      if (currentQueryId === state.currentQueryId) {
        this.setState({
          loading: false,
          reloading: false,
        })
      }
    }
  }

  public update() {
    this.event.emit('updateState')
  }
  public onStateChange(key: string, callback: () => void) {
    this.event.on(key, 'updateState', callback)
  }
  public offStateChange(key: string) {
    this.event.off(key, 'updateState')
  }

  public async reload(params: P) {
    this.setState({
      reloading: true,
      hasMore: true,
      data: [],
      queryParams: { ...params },
      loading: false,
      isError: false,
      isLoadMoreError: false,
      serialLoadMoreTimes: 0,
      isConfinedLoadMore: false,
      loadMoreTimes: 0,
    })
    await this.loadMore()

    // 已经在loadMore里面设置了reloading为false，这里也需要防止用户收到快速reload，所以注释掉
    // this.setState({
    //   reloading: false,
    // })
  }

  public clear() {
    this.setState({
      reloading: true,
      hasMore: true,
      data: [],
      loading: false,
      isError: false,
      isLoadMoreError: false,
      serialLoadMoreTimes: 0,
      isConfinedLoadMore: false,
      loadMoreTimes: 0,
      queryParams: {} as P,
    })
  }
}
