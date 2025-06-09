'use client'
import { Icon } from '@x-vision/icons'
import { classMerge, formatDuration } from '@/utils'
import { uploadChatFileUtils } from '@/common/multipartUploader'
import { UploadErrorCodeMap, videoTypes } from '@/constants/upload'
import RetryImg from '@/components/RetryImg'
import { Progress, Text } from '@x-vision/design/index.js'
import { UploadFileData } from '@/common/multipartUploader/upload'
import { getCurrentChatUploadItemFileData } from '@/models/chatUploadData'

interface IProps {
  data: UploadFileData
  className?: string
  openPreviewPop: () => void
}
const ChatInputUploadCard = ({ data, className, openPreviewPop }: IProps) => {
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    uploadChatFileUtils.cancel(data)
  }
  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation()
    uploadChatFileUtils.retry(data)
    const res = getCurrentChatUploadItemFileData({ userId: data.userId, subId: data.subId || '', key: data.key })
    if (res?.errorData?.code === UploadErrorCodeMap.notSupportedFileType.code) {
      // retry的时候  类型不对
      console.log('类型不对', res)
    }
  }
  //   const handleStop = () => {
  //     if (data?.isStop) {
  //       handleRetry()
  //     } else {
  //       uploadChatFileUtils.stop(data)
  //     }
  //   }
  const renderMaskContent = () => {
    if (data?.isFinish) {
      return null
    }
    if (data?.isErr) {
      const hasRetry =
        data?.errorData?.code &&
        ![
          UploadErrorCodeMap.notSupportedFileType.code,
          UploadErrorCodeMap.imgSizeMax.code,
          UploadErrorCodeMap.videoSizeMax.code,
          UploadErrorCodeMap.emptyFile.code,
        ].includes(data?.errorData?.code)
      return (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
          <Icon icon="x:AlertCircleStyleStroke" color="#EA6357" fontSize={20} />
          <Text
            size="caption1"
            className="text-(--element-signal-stop-emphasis-00) text-center whitespace-break-spaces mb-2"
          >
            Upload failed
          </Text>
          {hasRetry && (
            <div
              className="bg-(--element-emphasis-02) rounded-(--control-pill-border-radius) w-[90%] h-[18px] typography-text-caption2-strong text-(--always-white-emphasis-00) flex items-center justify-center"
              onClick={handleRetry}
            >
              Retry
            </div>
          )}
        </div>
      )
    }
    return <Progress color="reverse" value={data?.uploadProgress ?? 0}></Progress>
  }
  return (
    <div
      className={classMerge(
        'relative rounded-[8px] w-[112px] h-[112px] ml-(--sizing-named-micro) overflow-hidden bg-(--navigation-drawer-surface)',
        className,
      )}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
      onClick={openPreviewPop}
    >
      {/*TODO： 缺失默认兜底图 */}
      <RetryImg
        key={data?.fileUrl}
        src={videoTypes.includes(`.${data.fileType}`) ? data?.thumbnailUrl : data?.fileUrl}
        width={112}
        height={112}
        alt=""
        className="w-full h-full object-cover"
      />

      {!data?.isFinish && (
        <div className="absolute top-0 left-0 w-full h-full bg-(--always-black-emphasis-01)  p-(--sizing-named-micro) flex items-end">
          {renderMaskContent()}
        </div>
      )}

      <div
        className="absolute right-(--sizing-named-micro) top-(--sizing-named-micro) z-10 rounded-[50%] bg-(--element.emphasis.00)"
        onClick={handleCancel}
      >
        <Icon icon="x:CancelCircleStyleSolid" color="var(--always-white-emphasis-00)" />
      </div>

      {videoTypes.includes(`.${data?.fileType}`) && data?.duration && data?.isFinish ? (
        <div className="absolute left-2 bottom-2 p-(--control-medium-padding-both) text-(--always-white-emphasis-00) typography-text-caption1-strong flex bg-(--grayscale-black-02) rounded-full">
          <Icon icon="x:PlayStyleSolid" color="var(--always-white-emphasis-00)" fontSize={12} />
          <span className="ml-(--sizing-named-nano)">{formatDuration(data?.duration || 0)}</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
export default ChatInputUploadCard
