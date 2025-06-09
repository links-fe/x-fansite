'use client'
import { Icon } from '@x-vision/icons'
export default function IconDemo() {
  return (
    <div>
      <div className="text-xl font-bold">x-design 图标库</div>
      <div className="flex">
        <Icon icon="x:AbacusStyleSolid" fontSize={32} />
      </div>

      <div className="text-xl font-bold">iconify 远程图标库</div>
      <div className="flex">
        <Icon icon="mdi:github" fontSize={32} />
      </div>

      <div className="text-xl font-bold">颜色</div>
      <div className="flex">
        <Icon icon="eva:alert-triangle-fill" color="orange" />
        <Icon icon="eva:alert-triangle-fill" color="#f00" />
      </div>

      <div className="text-xl font-bold">旋转</div>
      <div className="flex">
        {/* 水平翻转图标 */}
        <Icon icon="mdi:github" hFlip />
        <Icon icon="mdi:github" flip="horizontal" />
        {/* 垂直翻转图标 */}
        <Icon icon="mdi:github" vFlip />
        <Icon icon="mdi:github" flip="vertical" />
        {/* 水平和垂直翻转图标（与180度旋转相同）： */}
        <Icon icon="mdi:github" hFlip vFlip />
        <Icon icon="mdi:github" flip="horizontal,vertical" />
        {/* 90度旋转的例子： */}
        <Icon icon="mdi:github" rotate={1} />
      </div>

      <div className="text-xl font-bold">大小</div>
      <div className="flex">
        <Icon icon="x:AbacusStyleSolid" className="size-[22px]" />
        <Icon icon="x:AbacusStyleSolid" fontSize={24} />
        <Icon icon="x:AbacusStyleSolid" height="26" />
        <Icon icon="x:AbacusStyleSolid" width="26" height="26" />
        <Icon icon="x:AbacusStyleSolid" height="1.714em" />
        <Icon icon="x:AbacusStyleSolid" height="auto" />
      </div>
    </div>
  )
}
