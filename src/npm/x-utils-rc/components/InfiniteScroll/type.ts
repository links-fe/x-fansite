export interface InfiniteScrollProps {
  className?: string
  style?: React.CSSProperties

  /**
   * 滚动的容器
   */
  scrollContainer?: HTMLElement

  /**
   * 自定义loading内容
   */
  children?: React.ReactNode
  /**
   * 类型
   * @default 'verticalBottom'
   */
  type?: 'verticalTop' | 'verticalBottom' | 'horizontalRight' | 'horizontalLeft'

  /**
   * 加载更多
   */
  onLoadMore: () => Promise<void>

  /**
   * 是否有更多
   */
  hasMore: boolean

  /**
   启动距离
   * @default 20
   */
  threshold?: number

  spin?: React.ReactNode
}
