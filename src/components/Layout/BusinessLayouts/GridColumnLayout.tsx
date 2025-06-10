'use client'
import { usePcCollapseMenu } from '@/models/layout'

interface Iprops {
  contentRatio: string
  children: React.ReactNode
}
// 总col 为16
// 内容布局, 占满剩下屏幕
export const GridColumnLayout = (props: Iprops) => {
  const pcMenu = usePcCollapseMenu()
  const { contentRatio = '1', children } = props
  // 处理比例配置
  const getGridTemplateColumns = (ratio: string) => {
    if (!ratio.includes(':')) return '1fr' // 如果是单个数字，则占满
    const [left, right] = ratio.split(':')
    return `${left}fr ${pcMenu.isCollapseMenu ? right : Number(right) - 2}fr`
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: getGridTemplateColumns(contentRatio),
        height: '100%',
      }}
    >
      {children}
    </div>
  )
}
