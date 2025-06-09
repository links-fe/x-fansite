import { XImChatMessageData } from '@/npm/x-im'
import { MessageStatus } from '@/types/tables/message'
import { Text } from '@x-vision/design/index.js'
import React from 'react'

interface IProps {
  messageItemInfo: Partial<XImChatMessageData>
}

function MessageBottomTip(props: IProps) {
  const { messageItemInfo } = props
  if (messageItemInfo.sendStatus === MessageStatus.CONTAINS_PROHIBITED_WORDS)
    return (
      <div className="flex flex-col justify-center w-full text-center gap-1 my-(--sizing-named-medium)">
        <Text size="body1" style={{ color: 'var(--element-emphasis-01)' }}>
          The message was removed as it doesn’t follow our community guidelines
        </Text>
        {/* <div className="flex items-center justify-center gap-1 text-center">
          <Text size="body1" style={{ color: 'var(--element-emphasis-01)' }}>
            Re-edit this message
          </Text>
          <Button size="intermediate">Edit</Button>
        </div> */}
      </div>
    )
  return <></>
}

export default MessageBottomTip
