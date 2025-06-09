import { PageProps } from '@/types/page'
import { cln, Navbar } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { useRouter } from 'next/router'
import { OverlayLoading } from './OverlayLoading'
import Div100vh from 'react-div-100vh'
import React from 'react'

/**
 * 页面基础布局容器组件
 * @param screen - 是否启用全屏模式（使用100vh容器）
 * @param title - 页面标题，显示在导航栏
 * @param loading - 控制全局加载状态显示
 * @param className - 内容区域自定义样式
 * @param rootClassName - 根容器自定义样式
 * @param onBack - 自定义返回事件处理器
 */
export function PageContent({
  screen,
  title,
  loading,
  className,
  rootClassName,
  onBack,
  children,
  ...props
}: PageProps) {
  const router = useRouter()

  const back = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const Slot = screen ? Div100vh : 'div'
  return (
    <Slot
      className={cln(
        'relative size-full overflow-hidden flex flex-col bg-(--surface-level-01-emphasis-opaque-00)',
        rootClassName,
      )}
    >
      {title && <Navbar title={title} left={<Icon icon="x:ArrowLeft02StyleSolid" onClick={back} />} {...props} />}
      <div className={cln('flex-1 overflow-x-hidden overflow-y-auto p-(--named-small)', className)}>
        <OverlayLoading loading={loading} />
        {children}
      </div>
    </Slot>
  )
}
