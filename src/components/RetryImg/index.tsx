import { delay } from '@/utils'
import { cln } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'
import React, { useEffect, useRef, useState } from 'react'

interface RetryImgProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  autoRetryTimes?: number
  // errorSrc?: string
  renderLoading?: () => React.ReactElement
  // errorMessage?: string
}

export default function RetryImg(props: RetryImgProps) {
  // 默认不重试
  const { autoRetryTimes = 1, ...imgProps } = props
  const [src, setSrc] = useState('')
  const [error, setError] = useState(false)

  const timeoutRef = useRef<number>(null)

  function retryLoadImg(s: string) {
    const img = new Image()
    img.src = s

    return new Promise((resolve) => {
      img.onload = () => {
        resolve(true)
      }
      img.onerror = () => {
        resolve(false)
      }
      timeoutRef.current = window.setTimeout(() => {
        resolve(false)
      }, 1000 * 10)
    })
  }

  async function checkImage() {
    setError(false)
    try {
      if (!props.src) {
        setError(true)
        return
      }
      for (let i = 0; i < autoRetryTimes; i++) {
        const result = await retryLoadImg(props.src)
        if (result) {
          setSrc(props.src)
          return
        }
        await delay(500 + Math.random() * 1000 * 2)
      }
      setError(true)
    } catch (error) {
      console.log(error)
      setError(true)
    }
  }

  useEffect(() => {
    checkImage()
    return () => {
      if (timeoutRef.current) {
        // * 防止组件卸载后，异步操作仍然执行
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [props.src])

  if (error) {
    return (
      <div
        className={cln(
          'w-full h-full flex items-center justify-center rounded-lg text-(--grayscale-black-03) bg-(--surface-level-02-emphasis-opaque-02) border border-(--surface-level-02-emphasis-02)',
          props.className && props.className,
        )}
      >
        <Icon icon="x:Image01StyleStroke" fontSize={20} color="currentColor" />
      </div>
    )
  }

  if (!src) {
    return props.renderLoading ? props.renderLoading() : <></>
  }

  return <img {...imgProps} src={src} />
}
