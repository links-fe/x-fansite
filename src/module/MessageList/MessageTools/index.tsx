import { Icon } from '@x-vision/icons'
import React from 'react'
import TipsDrawer from '../Drawer/TipsDrawer'
import { updateChatInputSendData, useChatInputSendDataStore } from '@/models/chat-input-send'
import { chatInputTypes, UploadErrorCodeMap } from '@/constants/upload'
import { uploadChatFileUtils } from '@/common/multipartUploader'
import { useCurrentChatVoiceUploadList } from '@/models/chatUploadData'
import { isUserCreator } from '@/models/user'
import { Text } from '@x-vision/design/index.js'
import { toast } from 'sonner'

interface IProps {
  toUserId: string
  userId: string
}

function MessageTools(props: IProps) {
  const { toUserId } = props
  const isCreator = isUserCreator()
  const showGIF = useChatInputSendDataStore((state) => state.showGIF)
  const free = useChatInputSendDataStore((state) => state.free)
  const showAudio = useChatInputSendDataStore((state) => state.showAudio)
  const audioData = useCurrentChatVoiceUploadList()

  const onUpload = () => {
    const chatUploadInputId = 'chatUploadInput'
    let chatUploadInputEle = document.getElementById(chatUploadInputId) as HTMLInputElement | null
    if (!chatUploadInputEle) {
      chatUploadInputEle = document.createElement('input')
      chatUploadInputEle.id = chatUploadInputId
      chatUploadInputEle.type = 'file'
      chatUploadInputEle.multiple = true
      chatUploadInputEle.accept = chatInputTypes
    }
    chatUploadInputEle.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        const fileList = Array.from(files)
        // 这里可以添加处理文件列表的逻辑
        console.log('Selected files:', fileList)
        uploadChatFileUtils.upload({
          // 会话id chat上传文件必传
          subId: toUserId,
          fileList,
          errorCheckFn: (data?: { code?: string | number; msg?: string; file?: File; key?: string }) => {
            if (data?.code === UploadErrorCodeMap.notSupportedFileType.code) {
              // 上传的时候 类型不对
              console.log('类型不对')
              toast(
                <div className="flex items-center gap-3">
                  <span className="w-(--controls-huge-min-width) h-(--controls-huge-min-height) bg-(--navigation-drawer-surface) flex items-center justify-center rounded-xl">
                    <Icon icon="x:Alert02StyleStroke" fontSize={24} color="rgba(234, 99, 87, 1)" />
                  </span>
                  <div>
                    <Text size="caption1" strong>
                      Upload failed
                    </Text>
                    <Text size="body2" emphasis={1}>
                      File type not supported
                    </Text>
                  </div>
                </div>,
                {
                  id: 'upload-type-failed',
                },
              )
              return false
            }
            if (data?.code === UploadErrorCodeMap.imgSizeMax.code) {
              // 图片尺寸不对
              toast(
                <div className="flex items-center gap-3">
                  <span className="w-(--controls-huge-min-width) h-(--controls-huge-min-height) bg-(--navigation-drawer-surface) flex items-center justify-center rounded-xl">
                    <Icon icon="x:Alert02StyleStroke" fontSize={24} color="rgba(234, 99, 87, 1)" />
                  </span>
                  <div>
                    <Text size="caption1" strong>
                      Upload failed
                    </Text>
                    <Text size="body2" emphasis={1}>
                      Photo exceeds 50MB limit
                    </Text>
                  </div>
                </div>,
                {
                  id: 'upload-exceeds-failed',
                },
              )
              return false
            }
            if (data?.code === UploadErrorCodeMap.videoSizeMax.code) {
              // 视频尺寸不对
              toast(
                <div className="flex items-center gap-3">
                  <span className="w-(--controls-huge-min-width) h-(--controls-huge-min-height) bg-(--navigation-drawer-surface) flex items-center justify-center rounded-xl">
                    <Icon icon="x:Alert02StyleStroke" fontSize={24} color="rgba(234, 99, 87, 1)" />
                  </span>
                  <div>
                    <Text size="caption1" strong>
                      Upload failed
                    </Text>
                    <Text size="body2" emphasis={1}>
                      Video exceeds 500MB limit
                    </Text>
                  </div>
                </div>,
                {
                  id: 'upload-exceeds-failed-2',
                },
              )
              return false
            }
            return true
          },
        })
      }
    }
    chatUploadInputEle.click()
  }
  const showGIFList = () => {
    updateChatInputSendData(toUserId, {
      showGIF: !showGIF,
    })
  }
  const showAudioRecorder = () => {
    updateChatInputSendData(toUserId, {
      showAudio: !showAudio,
    })
    if (showAudio && audioData[0]) {
      uploadChatFileUtils.cancel(audioData[0])
    }
  }
  const showVault = () => {}
  const showPPV = () => {
    updateChatInputSendData(toUserId, {
      free: !free,
      price: undefined,
    })
  }

  return (
    <div className="flex px-2 pb-2 justify-between" dom-id="message-tools">
      <div className="flex gap-2">
        <span className="w-9 h-9 flex justify-center items-center" onClick={onUpload}>
          <Icon icon="x:AttachmentStyleSolid" fontSize={20} />
        </span>
        <span className="w-9 h-9 flex justify-center items-center" onClick={showGIFList}>
          <Icon icon="x:GifCustomStyleStroke" fontSize={20} />
        </span>
        <span className="w-9 h-9 flex justify-center items-center" onClick={showAudioRecorder}>
          <Icon icon="x:AudioWaveStyleSolid" fontSize={20} />
        </span>
        <TipsDrawer toUserId={toUserId} />
        {isCreator && (
          <span className="w-9 h-9 flex justify-center items-center" onClick={showVault}>
            <Icon icon="x:Album01StyleStroke" fontSize={20} />
          </span>
        )}
        {isCreator && (
          <span className="w-9 h-9 flex justify-center items-center" onClick={showPPV}>
            <Icon icon="x:SaleTag02StyleStroke" fontSize={20} />
          </span>
        )}
      </div>
    </div>
  )
}

export default MessageTools
