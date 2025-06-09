import React from 'react'
// import { Abnormal, InfiniteScroll } from '../../components'
import { Abnormal } from '../Abnormal'
import { InfiniteScroll } from '../InfiniteScroll'
import { LoadingMore } from '../Loading'

// import styles from './index.less'

interface PropsType<T> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
  style?: React.CSSProperties

  children?: React.ReactNode
  onScroll?: React.UIEventHandler<HTMLDivElement>

  data?: T[]
  hasMore: boolean
  reloading?: boolean
  isError?: boolean
  isEmpty?: boolean
  isLoadMoreError?: boolean
  isConfinedLoadMore?: boolean
  hadInitData?: boolean

  renderItem?: (item: T, index: number) => React.ReactNode
  spin?: React.ReactNode
  onLoadMore?: () => Promise<void>
  onReload?: () => Promise<void>

  renderInitSpin?: () => React.ReactNode
  renderAbnormalEmpty?: () => React.ReactNode
  renderAbnormalRequestError?: () => React.ReactNode
  renderAbnormalLoadMoreError?: () => React.ReactNode
  renderAbnormalConfinedLoadMore?: () => React.ReactNode
  renderAbnormalEmptyConfinedLoadMore?: () => React.ReactNode

  type?: 'verticalTop' | 'verticalBottom' | 'horizontalRight' | 'horizontalLeft'
}

export function InfiniteList<T>(props: PropsType<T>) {
  const { className = '', style = {}, ref, type = 'verticalBottom', onScroll } = props
  // const TC = useTC()

  function renderContent() {
    if (props.children) return props.children
    if (props.reloading) return props?.renderInitSpin?.() || props?.spin || <LoadingMore />
    if (props.isEmpty) return props?.renderAbnormalEmpty?.() || <Abnormal.Empty onRetry={props.onReload} />
    if (props.isError)
      return props?.renderAbnormalRequestError?.() || <Abnormal.RequestError onRetry={props.onReload} />

    return props.data?.map((item, index) => {
      return props.renderItem?.(item, index)
    })
  }

  function renderInfiniteScroll() {
    if (props.reloading || props.isEmpty || props.isError || !props.hasMore) return <></>

    if (props.isLoadMoreError) {
      return (
        props?.renderAbnormalLoadMoreError?.() || (
          <Abnormal.LoadMoreError
            onRetry={() => {
              props.onLoadMore?.()
            }}
          />
        )
      )
    }

    if (props.isConfinedLoadMore) {
      // 数据为空 且 需要手动触发加载更多
      if (props.data?.length === 0) {
        return (
          props?.renderAbnormalEmptyConfinedLoadMore?.() || (
            <Abnormal.EmptyConfinedLoadMore
              onRetry={() => {
                props.onLoadMore?.()
              }}
            />
          )
        )
      }

      return (
        props?.renderAbnormalConfinedLoadMore?.() || (
          <Abnormal.ConfinedLoadMore
            onLoadMore={() => {
              props.onLoadMore?.()
            }}
          />
        )
      )
    }
    return (
      <InfiniteScroll
        hasMore={props.hasMore}
        onLoadMore={async () => {
          await props?.onLoadMore?.()
        }}
        spin={props?.spin}
        type={type}
        className={props?.hadInitData ? 'h-auto' : 'h-full'}
      />
    )
  }

  return (
    <div
      className={className}
      ref={ref}
      style={{ width: '100%', height: '100%', overflow: 'auto', ...style }}
      onScroll={onScroll}
    >
      {renderContent()}
      {renderInfiniteScroll()}
    </div>
  )
}
