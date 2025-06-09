import { Cell, CellGroup, cln, Loading } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { useRouter } from 'next/router'

export interface ICellItem {
  label: string
  /** 如果传入to, 则以为着进行路由跳转 */
  to?: string
  /** 左侧图标 */
  icon?: React.ReactNode
  /** 右侧加载中 */
  loading?: boolean
  /** 右侧额外信息 */
  extra?: React.ReactNode
}

export interface ICellItems {
  items: ICellItem[]
  cellClick?: (item: ICellItem) => void
}

export interface ICellGroupItem {
  label?: string
  group?: boolean
  children: ICellItem[]
}

export interface ICellGroupItems {
  items: ICellGroupItem | ICellGroupItem[]
  cellClick?: (item: ICellItem) => void | Promise<void>
}

export function CellItems({ items, cellClick }: ICellItems) {
  const router = useRouter()

  async function handleClick(item: ICellItem) {
    try {
      await cellClick?.(item)

      if (item.to) router.push(item.to)
    } catch (_) {}
  }

  return items.map((item) => (
    <Cell
      key={item.label}
      left={item.icon}
      right={
        <div className="flex items-center gap-(--named-mini)">
          <div className="align-right text-(--grayscale-black-01)"> {item.loading ? <Loading /> : item.extra}</div>
          <Icon icon="x:ArrowRight01StyleStroke" />
        </div>
      }
      onClick={() => handleClick(item)}
    >
      {item.label}
    </Cell>
  ))
}

/**
 * 单元格组，每个单元格之间有间距
 */
export function CellSpaceItems({
  items,
  cellClick,
  className,
  ...props
}: ICellItems & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cln('flex flex-col gap-(--named-small)', className)} {...props}>
      <CellItems items={items} cellClick={cellClick} />
    </div>
  )
}

/**
 * 单元格组合组, 可设置group名称
 */
export function CellGroupItems({
  items,
  className,
  cellClick,
  ...props
}: ICellGroupItems & React.HTMLAttributes<HTMLDivElement>) {
  if (!Array.isArray(items)) items = [items]
  return items.map((item, index) => (
    <div key={item?.label || index} className={cln('flex flex-col gap-(--named-small)', className)} {...props}>
      {item.label && <div className="text typography-text-heading4-strong">{item.label}</div>}
      {item.group ? (
        <CellGroup>
          <CellItems items={item.children} cellClick={cellClick} />
        </CellGroup>
      ) : (
        <CellItems items={item.children} cellClick={cellClick} />
      )}
    </div>
  ))
}
