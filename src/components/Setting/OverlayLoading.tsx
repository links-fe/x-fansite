import { cln, Loading } from '@x-vision/design'

/**
 * 全屏遮罩加载组件
 * @param loading - 控制加载状态显示/隐藏
 * @param className - 自定义样式类名
 * @param props - 透传div元素属性
 */
export function OverlayLoading({ loading, className, ...props }: { loading?: boolean } & React.ComponentProps<'div'>) {
  if (!loading) return null
  return (
    <div
      data-aria-hidden="true"
      aria-hidden="true"
      className={cln(
        'touch-none pointer-events-none absolute inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-white/10',
        className,
      )}
      {...props}
    >
      <Loading fontSize="38px" />
    </div>
  )
}
