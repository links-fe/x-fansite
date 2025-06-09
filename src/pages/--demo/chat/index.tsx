'use client'
import XButton from '@/components/XButton'
import { useUpdate } from '@/npm/x-utils-rc'
import { callSendMessageApi, queryMessageList } from '@/services/message'
import { Button, Input } from '@x-vision/design/index.js'
import { randomId } from '@hb-common/utils'
import { useState } from 'react'
import { MessageType } from '@/types/tables/message'
// import { AppLayout } from '@/components/Layout'

export default function Page() {
  const [state] = useState({
    userId: '',
    message: '',
    free: true,
  })
  const update = useUpdate()

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    state.message = e.target.value
    update()
  }
  async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // 如果
    if (e.key === 'Enter') {
      // 发送消息

      await callSendMessageApi({
        toUserId: state.userId,
        msgType: MessageType.TEXT,
        content: state.message,
        free: state.free,
        frontendId: randomId(),
      })
      state.message = ''

      update()
    }
  }

  return (
    <div>
      <div>
        <Input
          placeholder="userid"
          value={state.userId}
          onChange={(e) => {
            state.userId = e.target.value
            update()
          }}
        />
      </div>
      <Input
        placeholder="Type a message"
        onKeyDown={handleKeyDown}
        value={state.message}
        onChange={handleInputChange}
      />
      <div>
        <div>isFree: {state.free ? 'true' : 'false'}</div>
        <Button
          onClick={() => {
            state.free = true
            update()
          }}
        >
          change to free
        </Button>
        <Button
          onClick={() => {
            state.free = false
            update()
          }}
        >
          change to not free
        </Button>
      </div>

      <div style={{ marginTop: 30 }}>
        <XButton
          onClick={async () => {
            // * 这一步的目的是创建会话 (服务端目前的流程没打通)
            await queryMessageList({
              toUserId: state.userId,
            })
          }}
        >
          queryMessageList
        </XButton>
      </div>
    </div>
  )
}

// Page.PcLayout = AppLayout
// Page.MobileLayout = AppLayout
