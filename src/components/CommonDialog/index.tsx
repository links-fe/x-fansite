'use client'

import React from 'react'
import { CommonModalPage } from './CommonModalPage'
import { useLayoutStore } from '@/models/layout'
import { CommonDialogProps, CommonDrawerProps } from './type'
import CommonDrawerPage from './CommonDrawerPage'

// 合并两种类型的属性，使得外部调用时可以接受所有可能的属性
type Props = CommonDialogProps & Partial<Omit<CommonDrawerProps, keyof CommonDialogProps>>

export const CommonDialog: React.FC<Props> = (props) => {
  const { open, onOpenChange, children } = props
  const enablePcMode = useLayoutStore((store) => store.enablePcMode)

  if (!enablePcMode) {
    return (
      <CommonDrawerPage open={open} onOpenChange={onOpenChange} {...(props as CommonDrawerProps)}>
        {children}
      </CommonDrawerPage>
    )
  }

  return (
    <CommonModalPage open={open} onOpenChange={onOpenChange} {...(props as CommonDialogProps)}>
      {children}
    </CommonModalPage>
  )
}

// 导出所有子组件
export * from './CommonModalPage'
export * from './CommonDrawerPage'
