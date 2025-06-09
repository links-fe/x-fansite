import React from 'react'
// import ChatItemSkeleton from './ChatItemSkeleton'
import { Loading } from '@x-vision/design/index.js'

interface Iprops {
  size?: number
}
function ChatListSpin(props: Iprops) {
  const {} = props
  return (
    <div className="flex flex-col justify-center items-center flex-1 h-full w-full">
      <Loading />
      {/* {Array.from({ length: size }).map((_, index) => (
        <ChatItemSkeleton key={index} />
      ))} */}
    </div>
  )
}

export default ChatListSpin
