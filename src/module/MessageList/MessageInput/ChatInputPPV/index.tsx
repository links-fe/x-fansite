import AnimationBox from '@/components/AnimationBox'
import { updateChatInputSendData, useChatInputSendDataStore } from '@/models/chat-input-send'
import { Button, Input, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import React from 'react'

interface IProps {
  toUserId: string
}
function ChatInputPPV(props: IProps) {
  const { toUserId } = props
  const free = useChatInputSendDataStore((state) => state.free)
  const price = useChatInputSendDataStore((state) => state.price)

  const onClosePPV = () => {
    updateChatInputSendData(toUserId, {
      free: !free,
      price: undefined,
    })
  }

  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateChatInputSendData(toUserId, {
      price: Number(e.target.value) || undefined,
    })
  }

  return (
    <AnimationBox show={!free || false}>
      {!free && (
        <div dom-id="chat-input-ppv" className="pl-3 pr-12 gap-2 pb-2">
          <div className="flex justify-between pr-10 pb-2">
            <Text size="body2" strong>
              Price
            </Text>
            <Text size="caption2" emphasis={1}>
              Minimum $5 or free
            </Text>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              prefix="$"
              className="leading-4"
              size="moderate"
              type="number"
              min={5}
              value={price}
              onChange={onChangePrice}
            />
            <Button shape="circle" size="medium" onClick={onClosePPV}>
              <Icon icon="x:Cancel01StyleSolid" />
            </Button>
          </div>
        </div>
      )}
    </AnimationBox>
  )
}

export default ChatInputPPV
