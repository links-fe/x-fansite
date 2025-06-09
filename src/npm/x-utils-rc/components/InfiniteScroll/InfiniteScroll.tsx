import { useThrottleFn } from 'ahooks'
import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.scss'
import { InfiniteScrollProps } from './type'
import { LoadingMore } from '../Loading'

const defaultConfig = {
  threshold: 20,
  type: 'verticalBottom',
}
function InfiniteScroll(props: InfiniteScrollProps) {
  const {
    className,
    hasMore,
    threshold = defaultConfig.threshold,
    type = defaultConfig.type,
    scrollContainer,
    style,
    children,
  } = props
  const ref = useRef<HTMLDivElement>(null)
  // 防止重复请求
  const [flag, setFlag] = useState({})
  const nextFlagRef = useRef(flag)

  const { run: check } = useThrottleFn(
    async () => {
      if (nextFlagRef.current !== flag) return
      if (!props.hasMore) return
      if (getIsInViewport(ref.current) && hasMore) {
        const nextFlag = {}
        nextFlagRef.current = nextFlag
        // hasMore && props.onLoadMore && (await props.onLoadMore())
        if (hasMore && props.onLoadMore) {
          await props.onLoadMore()
        }
        setFlag(nextFlag)
      }
    },
    { wait: 200, leading: true, trailing: true },
  )

  const getIsInViewport = (e: HTMLDivElement | null) => {
    // 当前元素位置
    const eleRect = e?.getBoundingClientRect()
    // 滚动容器位置
    const eleScrollRect = scrollContainer?.getBoundingClientRect() || e?.parentElement?.getBoundingClientRect()
    if (!eleRect || !eleScrollRect) return false
    // 垂直触底滚动
    if (type === 'verticalBottom') {
      if (eleScrollRect?.bottom >= eleRect?.top - threshold) {
        return true
      } else {
        return false
      }
    }
    // 垂直触顶滚动
    if (type === 'verticalTop') {
      if (eleScrollRect?.top <= eleRect?.bottom + threshold) {
        return true
      } else {
        return false
      }
    }

    // 横向向右滚动
    if (type === 'horizontalRight') {
      if (eleScrollRect?.right >= eleRect?.left - threshold) {
        return true
      } else {
        return false
      }
    }
    // 横向向左滚动
    if (type === 'horizontalLeft') {
      if (eleScrollRect?.left <= eleRect?.right + threshold) {
        return true
      } else {
        return false
      }
    }
    return false
  }
  // 确保在可视区域内时能触发加载更多
  useEffect(() => {
    check()
  })
  // 兼容因为css高度变化，导致loading显示问题
  useEffect(() => {
    check()
  }, [ref?.current?.getBoundingClientRect?.(), scrollContainer?.getBoundingClientRect?.()])

  useEffect(() => {
    const scrollRefValue = scrollContainer || ref?.current?.parentElement

    scrollRefValue?.addEventListener('scroll', check)
    return () => {
      scrollRefValue?.removeEventListener('scroll', check)
    }
  }, [scrollContainer])

  const contentMemo = useMemo(() => {
    if (!hasMore) return <></>
    if (children) return <>{children}</>
    return props?.spin || <LoadingMore />
  }, [hasMore])

  return (
    <div className={classNames([styles['infinite-scroll'], className])} style={{ ...style }} ref={ref}>
      {contentMemo}
    </div>
  )
}

export default InfiniteScroll
