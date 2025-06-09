import { Button, Text, Popover, Navbar } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'
import { useRef, useState } from 'react'
import MediaHistoryList from './MediaHistoryList'
import { FreeType, MediaType, mediaTypeListType, PpvTypeListType, SendTypeEnum } from './type'
import { setMediaHistoryDrawerVisible } from '@/models/message/model'
import Div100vh from 'react-div-100vh'

interface IProps {
  toUserId: string
  userId: string
}

export default function MediaHistoryWrap(props: IProps) {
  const { toUserId } = props
  const wrapRef = useRef<HTMLDivElement>(null)
  const [sendType, setSendType] = useState<SendTypeEnum>(SendTypeEnum.Received)
  const [mediaType, setMediaType] = useState<MediaType>(undefined)
  const [free, setFree] = useState<FreeType>(undefined)
  const [open, setOpen] = useState(false)
  const mediaTypeList: mediaTypeListType[] = [
    {
      id: 'all',
      value: undefined,
      shape: 'pill',
      render: (
        <Text size="body1" strong style={{ color: 'currentcolor' }}>
          All
        </Text>
      ),
    },
    {
      id: 'video',
      value: 'video',
      shape: 'circle',
      render: <Icon icon="x:PlayCircleStyleStroke" fontSize={20} />,
    },
    {
      id: 'photo',
      value: 'photo',
      shape: 'circle',
      render: <Icon icon="x:Image01StyleStroke" fontSize={20} />,
    },
    {
      id: 'audio',
      value: 'audio',
      shape: 'circle',
      render: <Icon icon="x:AudioWaveStyleSolid" fontSize={20} />,
    },
  ]
  const ppvTypeList: PpvTypeListType[] = [
    {
      id: undefined,
      name: 'Paid & free',
    },
    {
      id: true,
      name: 'Free only',
    },
    {
      id: false,
      name: 'Paid only',
    },
  ]

  return (
    <Div100vh className="w-screen flex flex-col overflow-hidden" ref={wrapRef}>
      <Navbar
        leftArrow
        onLeftArrowClick={() => {
          setMediaHistoryDrawerVisible(false)
        }}
      >
        <div className="flex items-center">
          <Button
            color="default"
            variant={sendType === SendTypeEnum.Received ? 'default' : 'link'}
            onClick={() => {
              setSendType(SendTypeEnum.Received)
            }}
          >
            <Text size="body1" strong emphasis={sendType === SendTypeEnum.Received ? 0 : 1}>
              Received
            </Text>
          </Button>
          <Button
            color="default"
            variant={sendType === SendTypeEnum.Sent ? 'default' : 'link'}
            onClick={() => {
              setSendType(SendTypeEnum.Sent)
            }}
          >
            <Text size="body1" strong emphasis={sendType === SendTypeEnum.Sent ? 0 : 1}>
              Sent
            </Text>
          </Button>
        </div>
      </Navbar>
      <div className="flex justify-between px-4">
        <div className="flex gap-1 items-center">
          {mediaTypeList.map((v) => {
            return (
              <Button
                shape={v.shape}
                key={v.id}
                size="generous"
                variant={v.value === mediaType ? 'default' : 'text'}
                onClick={() => {
                  setMediaType(v.value)
                }}
              >
                <Text size="body1" strong emphasis={v.value === mediaType ? 0 : 1}>
                  {v.render}
                </Text>
              </Button>
            )
          })}
        </div>
        <Popover
          align="end"
          hasArrow={false}
          rootProps={{
            open: open,
            onOpenChange: setOpen,
          }}
          container={wrapRef.current}
          content={
            <div className="p-2">
              {ppvTypeList.map((v) => {
                return (
                  <div
                    key={v.name}
                    onClick={() => {
                      setFree(v.id)
                      setOpen(false)
                    }}
                    className="flex items-center px-2 py-[5px] gap-1"
                  >
                    <div className="w-4 h-4">{v.id === free && <Icon icon="x:Tick02StyleSolid" fontSize={16} />}</div>
                    <Text size="body2">{v.name}</Text>
                  </div>
                )
              })}
            </div>
          }
        >
          <div className="flex items-center bg-(--grayscale-black-07) px-3 py-2 rounded-full">
            <Text size="body1" emphasis={1}>
              {ppvTypeList.find((v) => v.id === free)?.name}
            </Text>
            <Icon icon="x:ArrowDown01StyleStroke" fontSize={20} />
          </div>
        </Popover>
      </div>
      <MediaHistoryList toUserId={toUserId} sendType={sendType} mediaType={mediaType} free={free} />
    </Div100vh>
  )
}
