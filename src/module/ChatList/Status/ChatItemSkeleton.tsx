import { Skeleton } from '@x-vision/design'
import React from 'react'

function ChatItemSkeleton() {
  return (
    <div className="flex items-center gap-2 p-2">
      {/* 头像， 文本布局 */}
      <Skeleton className="h-[40px] w-[40px] mr-2 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-[10px] w-[50vw] rounded-md" />
        <Skeleton className="h-[10px] w-[50vw] rounded-md" />
      </div>
    </div>
  )
}

export default ChatItemSkeleton
