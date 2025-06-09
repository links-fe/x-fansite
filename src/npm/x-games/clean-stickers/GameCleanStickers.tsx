/**
 * 清理贴纸游戏
 * */

import Image from 'next/image'
import React, { CSSProperties, useEffect, useMemo } from 'react'
import { useState } from 'react'
import { STICKER_MAP } from './config'
import { useUpdate } from '@/npm/x-utils-rc'
import { useLongPress } from './utils'

export interface GameCleanStickersSticker {
  x: number
  y: number
  width: number
  height: number
  key: string
}

export interface GameCleanStickersOption {
  /** 游戏宽度 */
  width: number
  /** 游戏高度 */
  height: number
  /** 图片源 */
  photoSrc: string
  /** 贴纸 */
  stickers: GameCleanStickersSticker[]
}

interface GameCleanStickersProps {
  width: number
  height: number
  style?: CSSProperties
  option: GameCleanStickersOption
}

interface StickerProps {
  ratio: number
  sticker: GameCleanStickersSticker
}
function Sticker(props: StickerProps) {
  const _displayWidth = props.ratio * props.sticker.width
  const _displayHeight = props.ratio * props.sticker.height
  // 宽高比
  const _aspectRatio = _displayWidth / _displayHeight

  const [state] = useState({
    displayWidth: _displayWidth,
    displayHeight: _displayHeight,
    displayX: props.sticker.x * props.ratio - _displayWidth / 2,
    displayY: props.sticker.y * props.ratio - _displayHeight / 2,
    unlock: false,
  })

  const longPressEvents = useLongPress({
    disabled: state.unlock,
    enableInterval: true,
    intervalTime: 70,
    onLongPressInterval: (count) => {
      console.log(count)

      if (state.unlock) return
      state.displayWidth = state.displayWidth - 6
      state.displayHeight = state.displayWidth / _aspectRatio
      if (state.displayWidth < 20) {
        state.unlock = true
      }
      state.displayX = props.sticker.x * props.ratio - state.displayWidth / 2
      state.displayY = props.sticker.y * props.ratio - state.displayHeight / 2
      update()
    },
  })
  const update = useUpdate()

  if (state.unlock) return <></>

  console.log('displayWidth', state.displayWidth)

  return (
    <Image
      width={state.displayWidth}
      height={state.displayHeight}
      style={{
        position: 'absolute',
        left: state.displayX,
        top: state.displayY,
      }}
      // @ts-expect-error 忽略类型错误
      src={`/img/game-clean-stickers/stickers/${STICKER_MAP[props.sticker.key]}`}
      alt={props.sticker.key}
      {...longPressEvents}
    />
  )
}

export function GameCleanStickers(props: GameCleanStickersProps) {
  const [lock, setLock] = useState(true)
  const [state] = useState({
    // 缩放比
    ratio: 0,
    wrapWidth: 0,
    wrapHeight: 0,
    /** 虚拟宽度 */
    vWidth: 0,
    vHeight: 0,
    drawingWidth: 0,
    drawingHeight: 0,
    drawingMarginTop: 0,
  })

  function initDrawingDisplay() {
    state.wrapWidth = props.width
    state.wrapHeight = props.height

    state.vWidth = props.option.width
    state.vHeight = props.option.height

    state.ratio = props.width / state.vWidth

    state.drawingWidth = props.width
    state.drawingHeight = state.vHeight * state.ratio
    state.drawingMarginTop = (state.wrapHeight - state.drawingHeight) / 2

    setLock(false)
  }
  useEffect(() => {
    initDrawingDisplay()
  }, [])

  const stickerElements = useMemo(() => {
    if (lock) {
      return <></>
    }
    return props.option.stickers.map((sticker, index) => {
      return <Sticker key={index} ratio={state.ratio} sticker={sticker} />
    })
  }, [state.ratio, props.option.stickers, lock])

  // console.log(state)

  if (lock) {
    return <></>
  }

  return (
    <div
      style={{
        ...props.style,
        width: state.wrapWidth,
        height: state.wrapHeight,
        overflow: 'hidden',
        userSelect: 'none',
      }}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
    >
      <div
        style={{
          width: state.drawingWidth,
          height: state.drawingHeight,
          marginTop: state.drawingMarginTop,
          position: 'relative',
        }}
      >
        <Image src={props.option.photoSrc} alt="game" width={state.drawingWidth} height={state.drawingHeight} />
        {stickerElements}
      </div>
    </div>
  )
}
