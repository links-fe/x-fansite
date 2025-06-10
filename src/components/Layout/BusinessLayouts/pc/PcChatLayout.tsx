import React from 'react'
import { GridColumnLayout } from '../GridColumnLayout'
import ChatList from '@/module/ChatList'
import PcMenuLayout from './PcMenuLayout'

interface IProps {
  children: React.ReactNode
}

function PcChatLayout(props: IProps) {
  return (
    <PcMenuLayout>
      <GridColumnLayout contentRatio="5:11">
        <ChatList />
        <div className="overflow-x-hidden border-l border-(--grayscale-black-05) relative">{props.children}</div>
      </GridColumnLayout>
    </PcMenuLayout>
  )
}

export default PcChatLayout
