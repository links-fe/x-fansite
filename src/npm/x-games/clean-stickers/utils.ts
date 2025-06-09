'use client'
import { useEffect, useRef, useState } from 'react'

interface UseLongPressProps {
  disabled?: boolean

  onLongPress?: () => void
  longPressTime?: number

  // 用于控制是否开启定时器 - 开启后 长按时定时触发
  enableInterval?: boolean
  onLongPressInterval?: (count: number) => void
  intervalTime?: number
}

export function useLongPress(props: UseLongPressProps) {
  const config = {
    longPressTime: props.longPressTime ?? 400,
    enableInterval: props.enableInterval ?? false,
    intervalTime: props.intervalTime ?? 100,
  }
  // 用于存储定时器的引用
  const timerRef = useRef<number>(0)
  const [state] = useState({
    /** 长按中 */
    isLongPress: false,
    intervalTimer: 0,
    intervalCount: 0,
  })

  function startIntervalClock() {
    if (!config.enableInterval) return
    props.onLongPressInterval?.(state.intervalCount)

    state.intervalTimer = window.setTimeout(() => {
      if (!state.isLongPress) return
      state.intervalCount++
      startIntervalClock()
    }, config.intervalTime)
  }
  function endIntervalClock() {
    clearTimeout(state.intervalTimer)
    state.intervalCount = 0
  }

  // 开始计时，当达到长按时间后触发 onLongPress
  const handlePressStart = () => {
    // e.preventDefault()
    console.log('handlePressStart')

    timerRef.current = window.setTimeout(() => {
      props.onLongPress?.()
      state.isLongPress = true
      startIntervalClock()
    }, config.longPressTime)
  }

  // 结束计时，清除定时器
  const handlePressEnd = () => {
    // e.preventDefault()
    console.log('handlePressEnd')

    state.isLongPress = false
    endIntervalClock()
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = 0
    }
  }

  // @ts-expect-error 忽略类型错误
  const onTouchMove = (e) => {
    // e.preventDefault()

    const touch = e.touches[0] // 获取第一个触摸点
    const rect = e.target.getBoundingClientRect() // 获取元素的边界
    if (
      touch.clientX < rect.left ||
      touch.clientX > rect.right ||
      touch.clientY < rect.top ||
      touch.clientY > rect.bottom
    ) {
      // console.log('触摸点已移出元素范围')
      handlePressEnd()
      // 此处可根据需求触发自定义的“离开”逻辑
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
      clearTimeout(state.intervalTimer)
    }
  }, [])

  useEffect(() => {
    if (!props.disabled) return
    clearTimeout(timerRef.current)
    clearTimeout(state.intervalTimer)
    endIntervalClock()
  }, [props.disabled])
  // const handleClick = () => {
  //   // 确保点击事件不会在长按之后再次触发
  //   if (!timerRef.current) return;
  //   onClick && onClick();
  // };

  return {
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onMouseOut: handlePressEnd,
    onMouseLeave: handlePressEnd,
    onTouchStart: handlePressStart,
    onTouchEnd: handlePressEnd,
    onTouchMove,

    // onClick: handleClick,
  }
}
