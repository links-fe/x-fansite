import RetryImg from '@/components/RetryImg'
import { XImChatMessageData, XImMessageMediaType } from '@/npm/x-im'
import { formatDuration } from '@/utils'
import { cln, Loading, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons/index.js'

interface IProps {
  messageItemInfo: Partial<XImChatMessageData>
  openPreview: (v: number) => void
}

// 横向偏移量的基础值，用于计算每个图片的偏移量 %
const X_OFFSET = 6.18

function MessageContentMedia(props: IProps) {
  const { messageItemInfo, openPreview } = props
  const mediaList = messageItemInfo.mediaList?.filter((v) => v.type !== 'audio') || []

  // 图片容器的宽度，用于计算每个图片的宽度 单位px
  const MEDIA_WRAP_WIDTH = 200
  // 单张图片宽高
  const SINGLE_IMG_WIDTH = (MEDIA_WRAP_WIDTH * (100 - X_OFFSET * 3)) / 100
  // 两张图片时的偏移量 三张图片中间的偏移量 单位px
  const TWO_IMG_OFFSET = 40

  // 点击预览图片(付费跳转)
  const openPreviewPop = async (e: React.MouseEvent<HTMLElement>, i: number) => {
    // 付费判断
    if (false) {
      // TODO 付费跳转
      return
    }
    // 有转码中的就不让点
    if (hasProcessing) return
    openPreview(i)
  }

  // 根据id计算旋转角度，然后计算需要高出的距离 （24为单个素材宽度的一半）
  const reckonHeightForId = (id: number | string) => {
    // 如果id是 string类型 则转化为number类型
    if (typeof id === 'string') {
      id = parseInt(id)
    }
    const xt_rotate = Math.abs((id % 15) - 7)
    return (MEDIA_WRAP_WIDTH / 2) * Math.sin(xt_rotate * (Math.PI / 180))
  }

  // 视频时长渲染
  const videoDurationRender = (v: XImMessageMediaType) => {
    if (!v || !v?.duration || v.type !== 'video') return null
    return (
      <div className="absolute left-2 bottom-2 p-(--control-medium-padding-both) text-(--always-white-emphasis-00) typography-text-caption1-strong flex bg-(--grayscale-black-02) rounded-full">
        <Icon icon="x:PlayStyleSolid" color="var(--always-white-emphasis-00)" fontSize={12} />
        <span className="ml-(--sizing-named-nano)">{formatDuration(v?.duration || 0)}</span>
      </div>
    )
  }

  const hasProcessing = mediaList.some((v) =>
    ['processing', 'processing_transcoding', 'processing_drm'].includes(v.status),
  )

  // 叠叠图片
  if (mediaList.length > 3) {
    const xLocalize = [0, X_OFFSET, X_OFFSET * 2, X_OFFSET * 3]
    const newMediaList = mediaList
      ?.slice(0, 4)
      ?.map((v, i) => {
        const randomIndex = i % xLocalize.length
        const x = xLocalize[randomIndex]
        xLocalize.splice(randomIndex, 1)
        return {
          ...v,
          id: v.id,
          x,
        }
      })
      .reverse()

    // 根据第一张图计算顶部需要高出的距离
    const mt = reckonHeightForId(newMediaList[0]?.id)

    // 根据最后一张图计算底部需要高出的距离
    const mb = reckonHeightForId(newMediaList[3]?.id)

    const processingCount =
      mediaList?.filter((v) => ['processing', 'processing_transcoding', 'processing_drm'].includes(v.status))?.length ||
      0

    return (
      <div
        className={`relative  px-1`}
        style={{
          width: `${MEDIA_WRAP_WIDTH + X_OFFSET * 3}px`,
          height: `${MEDIA_WRAP_WIDTH}px`,
          marginBottom: `${mb}px`,
          marginTop: `${mt}px`,
          boxSizing: 'content-box',
        }}
        dom-id="message-content-media"
      >
        {newMediaList?.map((v, i) => {
          return (
            <div
              key={`${v.fileKey}-${v.id}`}
              className="absolute "
              style={{
                width: `${SINGLE_IMG_WIDTH}px`,
                height: `${SINGLE_IMG_WIDTH}px`,
                transform: `rotate(${(parseInt(v.id) % 15) - 7}deg)`,
                top: `${X_OFFSET * i}%`,
                left: `${v.x}%`,
              }}
              onClick={(e) => openPreviewPop(e, 0)}
            >
              <RetryImg src={v.thumbMidUrl} className="w-full h-full object-cover rounded-lg select-none" alt="" />
              {hasProcessing && (
                <div className="absolute top-0 left-0 h-full w-full rounded-lg bg-(--always-black-emphasis-01)">
                  {i == 3 && (
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                      <Loading color="#fff" fontSize={30} />
                    </div>
                  )}
                </div>
              )}
              {i == 3 && (
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full py-[6px] px-[9px] bg-(--grayscale-black-00) text-(--grayscale-white-00)">
                  <Icon icon="x:Album01StyleStroke" fontSize={16} />
                  <Text size="body2" strong className="text-(--grayscale-white-00)">
                    {hasProcessing ? `${processingCount}/${mediaList?.length} processing` : mediaList?.length}
                  </Text>
                </div>
              )}
              {videoDurationRender(v)}
            </div>
          )
        })}
      </div>
    )
  }

  if (mediaList.length === 3 || mediaList.length === 2) {
    // 根据第一张图计算顶部需要高出的距离
    const mt = reckonHeightForId(mediaList[1]?.id)

    // 根据最后一张图计算底部需要高出的距离
    const mb = reckonHeightForId(mediaList[2]?.id) || reckonHeightForId(mediaList[0]?.id)

    const mr = reckonHeightForId(mediaList[0]?.id)

    return (
      <div
        className="relative pr-10"
        style={{
          width: `${MEDIA_WRAP_WIDTH}px`,
          marginBottom: `${mb}px`,
          marginRight: `${mr}px`,
          paddingBottom: mediaList.length === 2 ? `${SINGLE_IMG_WIDTH - TWO_IMG_OFFSET}px` : '',
          marginTop: `${mt}px`,
          marginLeft: `${mb}px`,
          boxSizing: 'content-box',
        }}
        dom-id="message-content-media"
      >
        {mediaList?.map((v: XImMessageMediaType, i) => {
          const isProcessing = ['processing', 'processing_transcoding', 'processing_drm'].includes(v.status)
          return (
            <div
              key={v.id}
              className={cln(
                'relative ',
                i === 0 && mediaList.length !== 2 && 'absolute top-[50%] translate-y-[-50%] right-1 z-2',
                i === 0 && mediaList.length === 2 && 'absolute  bottom-0 right-1 z-2',
                i === 1 && '',
              )}
              style={{
                width: `${SINGLE_IMG_WIDTH}px`,
                height: `${SINGLE_IMG_WIDTH}px`,
                transform: `rotate(${(parseInt(v.id) % 15) - 7}deg)`,
                marginTop: i === 2 ? `${TWO_IMG_OFFSET}px` : '',
              }}
              onClick={(e) => openPreviewPop(e, i)}
            >
              <RetryImg src={v.thumbMidUrl} className="w-full h-full object-cover rounded-lg select-none" alt="" />
              {hasProcessing && (
                <div className="absolute top-0 left-0 h-full w-full rounded-lg bg-(--always-black-emphasis-01)">
                  {isProcessing && (
                    <>
                      <Text
                        size="body2"
                        strong
                        className="absolute top-2 left-2.5 px-2 py-1 bg-(--always-black-emphasis-00) rounded-full text-(--always-white-emphasis-00)"
                      >
                        Processing
                      </Text>
                      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <Loading color="#fff" fontSize={30} />
                      </div>
                    </>
                  )}
                </div>
              )}
              {videoDurationRender(v)}
            </div>
          )
        })}
      </div>
    )
  }

  // 1张图片时
  return (
    <div
      style={{
        width: `${SINGLE_IMG_WIDTH}px`,
        boxSizing: 'content-box',
      }}
      dom-id="message-content-media"
    >
      {mediaList?.map((v) => {
        const isProcessing = ['processing', 'processing_transcoding', 'processing_drm'].includes(v.status)
        return (
          <div
            key={v.id}
            className="relative overflow-hidden rounded-lg"
            style={{
              width: `${SINGLE_IMG_WIDTH}px`,
              height: `${SINGLE_IMG_WIDTH}px`,
            }}
            onClick={(e) => openPreviewPop(e, 0)}
          >
            <RetryImg src={v.thumbMidUrl} className="w-full h-full object-cover select-none" alt="" />

            {hasProcessing && (
              <div className="absolute top-0 left-0 h-full w-full rounded-lg bg-(--always-black-emphasis-01)">
                {isProcessing && (
                  <>
                    <Text
                      size="body2"
                      strong
                      className="absolute top-2 left-2.5 px-2 py-1 bg-(--always-black-emphasis-00) rounded-full text-(--always-white-emphasis-00)"
                    >
                      Processing
                    </Text>
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                      <Loading color="#fff" fontSize={30} />
                    </div>
                  </>
                )}
              </div>
            )}
            {videoDurationRender(v)}
          </div>
        )
      })}
    </div>
  )
}

export default MessageContentMedia
