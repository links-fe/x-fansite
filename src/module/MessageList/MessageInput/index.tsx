import { Button, Textarea } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import React, { useEffect, useMemo, useRef } from 'react'
import { useMessageInputViewHooks } from './hooks'
import ChatInputGIFList from './ChatInputGIFList'
import ChatInputPPV from './ChatInputPPV'
import {
  initChatInputSendDataStore,
  resetChatInputSendDataStore,
  useChatInputSendDataStore,
} from '@/models/chat-input-send'
import ChatInputReply from './ChatInputReply'
import ChatInputAudio from './ChatInputAudio'
import { useContactMeta } from '@/models/chat/cache/meta'
import ChatInputUploadList from './ChatInputUploadList'

interface IProps {
  toUserId: string
  userId: string
  chatListRef: React.RefObject<HTMLDivElement | null>
}
function MessageInput(props: IProps) {
  const { toUserId, userId, chatListRef } = props
  const { inputText, handleKeyDown, handleInputChange, sendDisabled } = useMessageInputViewHooks({
    userId,
    toUserId,
    chatListRef,
  })
  const contactMeta = useContactMeta(toUserId)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // 初始化发送数据
    initChatInputSendDataStore(userId, toUserId)
    return () => {
      console.log('clear')
      // 清空发送数据
      resetChatInputSendDataStore()
    }
  }, [])

  const onSend = () => {
    if (inputRef.current) {
      // 通过keydown来实现发送  解决输入框高度不变化问题
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      })
      // 调用input回车事件
      inputRef.current?.dispatchEvent(event)
    }
  }

  return (
    <>
      <ChatInputPPV toUserId={toUserId} />
      <ChatInputReply toUserId={toUserId} userId={userId} />
      <ChatInputUploadList toUserId={toUserId} userId={userId} />
      <ChatInputGIFList toUserId={toUserId} />
      <ChatInputAudio toUserId={toUserId} />
      <div className="flex px-3 pb-2 gap-2 items-center bg-(--grayscale-white-00)" dom-id="message-input">
        <div className="flex-1">
          <Textarea
            placeholder="Type a message"
            onKeyDown={handleKeyDown}
            value={inputText}
            onChange={handleInputChange}
            rows={1}
            maxRows={5}
            maxLength={1000}
            showCount="stop"
            className="rounded-2xl"
            disabled={contactMeta?.reject}
            ref={inputRef}
          />
        </div>
        <Button
          disabled={sendDisabled() || contactMeta?.reject}
          shape="circle"
          color="primary"
          size="moderate"
          onClick={onSend}
        >
          <Icon icon="x:SendStyleSolid" fontSize={16} color="currentColor" />
        </Button>
      </div>
    </>
  )
}

export default MessageInput
