import { formatTime } from '@/utils/chat'
import { Loading, Text } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'
import { IItem } from './type'
import RetryImg from '@/components/RetryImg'

interface IProps {
  item: IItem
}
function MediaHistoryItem(props: IProps) {
  const { item } = props
  const isAudio = item?.vaultData?.type === 'audio'
  const isProcessing =
    ['processing', 'processing_transcoding', 'processing_drm'].includes(item?.vaultData?.status) &&
    !item?.vaultData?.avUrl

  return (
    <div
      className="pb-[100%] h-0 relative rounded-lg overflow-hidden bg-(--surface-level-02-emphasis-opaque-02)"
      data-id={item.vaultId}
    >
      {isAudio ? (
        <div className="absolute w-[100%] h-[100%] flex items-center justify-center">audio</div>
      ) : (
        <RetryImg
          src={item.vaultData?.thumbMidUrl}
          className="absolute w-[100%] h-[100%] object-cover select-none"
          alt=""
        />
      )}
      {!item.free && !item.unlock && (
        <div className="absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] text-(--grayscale-white-00)">
          <Icon icon="x:SquareLock01StyleSolid" fontSize={20} />
        </div>
      )}
      {item?.vaultData?.duration !== undefined && item?.vaultData?.duration >= 0 && item.vaultType === 'video' && (
        <div className="absolute bottom-2 left-2 p-[5px] rounded-full flex items-center gap-1 bg-(--grayscale-black-02) text-(--grayscale-white-00)">
          <Icon icon="x:PlayStyleSolid" />
          <Text size="caption1" strong className="text-(--grayscale-white-00)">
            {formatTime(item?.vaultData?.duration)}
          </Text>
        </div>
      )}
      {isProcessing && (
        <div className="absolute top-0 left-0 h-full w-full rounded-lg bg-(--always-black-emphasis-01)">
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
        </div>
      )}
    </div>
  )
}

export default MediaHistoryItem
