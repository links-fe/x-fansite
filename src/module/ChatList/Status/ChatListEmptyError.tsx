import Image from 'next/image'
import React from 'react'
import emptyImg from '@/assets/chat-list/empty.png'
import { Button, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'

interface Iprops {
  onReload?: () => void
  text?: string
  scene?: 'initEmpty' | 'initError' | 'loadMoreEmpty' | 'loadMoreError'
}
function ChatListEmptyError(props: Iprops) {
  const { onReload, text = 'Empty data', scene = 'initEmpty' } = props

  // 初次加载列表-- 空状态， 加载失败状态
  if (['initEmpty', 'initError'].includes(scene))
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Image src={emptyImg} alt="empty" />
        <span
          style={{ font: 'var(--typography-text-body1-base)' }}
          className="text-(--element-emphasis-01) mt-(--sizing-named-small) mb-(--sizing-named-medium)"
        >
          {text}
        </span>
        {onReload && (
          <Button color={'primary'} onClick={onReload}>
            Retry
          </Button>
        )}
      </div>
    )
  // loadMore-- 空状态
  if (['loadMoreEmpty'].includes(scene)) return <></>
  // loadMore-- 加载失败
  if (['loadMoreError'].includes(scene))
    return (
      <div className="flex items-center justify-between px-(--sizing-named-small)">
        <div className="my-(--sizing-named-mini) flex items-center text-(--element-spectrum-saffron-emphasis-00)">
          <Icon icon="x:Alert02StyleStroke" />
          <Text className="ml-(--sizing-named-mini) text-(--element-spectrum-saffron-emphasis-00)" size="body1">
            Error loading data
          </Text>
        </div>
        <Button onClick={onReload} size="medium">
          Retry
        </Button>
      </div>
    )
}

export default ChatListEmptyError
