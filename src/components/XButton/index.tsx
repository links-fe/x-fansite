'use client'
import React, { useEffect, useMemo, useRef } from 'react'
import { Button } from '@x-vision/design'
import type { ButtonProps } from '@x-vision/design'
import { useUpdate } from 'ahooks'
interface XButtonProps extends ButtonProps {
  children?: React.ReactNode

  // 优先使用该值完全控制，其次使用组件内部
  loading?: boolean
  // 优先使用该值完全控制，其次使用组件内部
  disabled?: boolean
}
const XButton = (props: XButtonProps) => {
  const update = useUpdate()
  const loading = useRef<boolean>(false)
  const updateLoading = (v: boolean) => {
    loading.current = v
    update()
  }
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (loadingVal) return
    try {
      updateLoading(true)
      if (props?.onClick) {
        await props.onClick(e)
      }
    } catch (error) {
      console.error('XButton handleClick error: ', error)
    } finally {
      updateLoading(false)
    }
  }
  useEffect(() => {
    return () => {
      updateLoading(false)
    }
  }, [])

  const loadingVal = useMemo(() => {
    if (props?.hasOwnProperty?.('loading')) {
      return props?.loading
    }
    return loading.current
  }, [props, loading.current])

  const disabledVal = useMemo(() => {
    if (props?.hasOwnProperty?.('disabled')) {
      return props?.disabled
    }
    return loadingVal
  }, [props, loadingVal])

  return (
    <Button {...props} loading={loadingVal} disabled={disabledVal} onClick={handleClick}>
      {props?.children}
    </Button>
  )
}
export default XButton
