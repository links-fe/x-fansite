'use client'

import { GameCleanStickers, GameCleanStickersOption } from '@/npm/x-games'
import { useState } from 'react'

import photo from '@/assets/creator-share/creator-bg-default.jpeg'
import XButton from '@/components/XButton'

const DISPLAY_WIDTH = 400
const DISPLAY_HEIGHT = 400

const WIDTH = 450
const HEIGHT = 800
const gameConfig: GameCleanStickersOption = {
  width: WIDTH,
  height: HEIGHT,

  // @ts-expect-error 忽略类型错误
  photoSrc: photo,
  stickers: [
    {
      key: '1',
      x: 300,
      y: 320,
      width: 100,
      height: 100,
    },
    {
      key: '10',
      x: 200,
      y: 320,
      width: 100,
      height: 100,
    },
    {
      // 💦
      key: '4',
      x: 250,
      y: 540,
      width: 100,
      height: 100,
    },
  ],
}

export default function Page() {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <div>
        <XButton color="secondary" className="w-18" onClick={() => setVisible(true)}>
          开始游戏
        </XButton>
        <XButton color="stop" variant="outlined" onClick={() => setVisible(false)}>
          结束游戏
        </XButton>
      </div>
      {visible && (
        <div style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT, borderRadius: '12px', backgroundColor: '#fdd' }}>
          <GameCleanStickers width={DISPLAY_WIDTH} height={DISPLAY_HEIGHT} style={{}} option={gameConfig} />
        </div>
      )}
    </div>
  )
}
