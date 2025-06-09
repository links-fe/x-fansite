import { cln } from '@x-vision/design/index.js'

interface IProps {
  children: React.ReactNode
  className?: string
  // 移动类型 默认用bottom实现向上出现效果
  transitionType?: 'bottom' | 'top' | 'left' | 'right'
  show: boolean
}
export default function AnimationBox(props: IProps) {
  const { children, className, transitionType = 'bottom', show = false } = props

  const classType = () => {
    switch (transitionType) {
      case 'bottom':
        return 'marginBottom'
      case 'top':
        return 'marginTop'
      case 'left':
        return 'marginLeft'
      case 'right':
        return 'marginRight'
      default:
        return 'marginBottom'
    }
  }

  return (
    <div className={cln('overflow-hidden', className)}>
      <div
        style={{
          transition: `margin-${transitionType} 0.2s linear`,
          [classType()]: show ? '0%' : '-100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}
