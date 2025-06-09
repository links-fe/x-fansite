import AudioPlayer from '@/utils/audioPlayer'
import { useCallback, useEffect, useState } from 'react'

interface UseUserInteractionOptions {
  // 是否监听触摸事件
  listenTouch?: boolean
  // 是否监听点击事件
  listenClick?: boolean
  // 是否只触发一次
  once?: boolean
}

function useUserInteraction(callback?: () => void, options: UseUserInteractionOptions = {}) {
  const {
    // touch事件也不能初始化音频
    listenTouch = false,
    listenClick = true,
    once = true,
  } = options

  const [hasTriggered, setHasTriggered] = useState(false)
  const defaultCallback = useCallback(() => {
    const audioPlayer = AudioPlayer.getInstance()
    audioPlayer.initialize()
  }, [])
  const handleInteraction = useCallback(() => {
    if (once && hasTriggered) {
      return
    }

    if (callback) {
      callback()
    } else {
      defaultCallback()
    }
    setHasTriggered(true)

    // 如果是一次性的，移除所有事件监听
    if (once) {
      if (listenTouch) {
        document.removeEventListener('touchstart', handleInteraction)
      }
      if (listenClick) {
        document.removeEventListener('click', handleInteraction)
      }
    }
  }, [callback, once, hasTriggered, listenTouch, listenClick])

  useEffect(() => {
    // 添加事件监听
    if (listenTouch) {
      document.addEventListener('touchstart', handleInteraction)
    }
    if (listenClick) {
      document.addEventListener('click', handleInteraction)
    }

    // 清理函数
    return () => {
      if (listenTouch) {
        document.removeEventListener('touchstart', handleInteraction)
      }
      if (listenClick) {
        document.removeEventListener('click', handleInteraction)
      }
    }
  }, [handleInteraction, listenTouch, listenClick])

  const reset = useCallback(() => {
    setHasTriggered(false)
  }, [])

  return { hasTriggered, reset }
}

export default useUserInteraction
