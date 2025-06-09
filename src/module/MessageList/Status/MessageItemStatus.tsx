import XButton from '@/components/XButton'
import { resendMessage } from '@/models/message'
import { MessageStatus } from '@/types/tables/message'
import React from 'react'

interface Iprops {
  status?: MessageStatus
  id: string
}

function MessageItemStatus(props: Iprops) {
  const { status, id } = props

  if (status === MessageStatus.PENDING) {
    return <div>pending...</div>
  }

  if (status === MessageStatus.SENT) {
    return <div>success</div>
  }

  if (status === MessageStatus.FAILED) {
    return (
      <div>
        failed <XButton onClick={() => resendMessage(id)}>retry</XButton>
      </div>
    )
  }
  return <></>
}

export default MessageItemStatus
