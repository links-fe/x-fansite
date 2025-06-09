import { uploadChatFileUtils } from '@/common/multipartUploader'
import AnimationBox from '@/components/AnimationBox'
import { updateChatInputSendData, useChatInputSendDataStore } from '@/models/chat-input-send'
import { useCurrentChatVoiceUploadList } from '@/models/chatUploadData'
import type { ErrAudioRecord } from '@x-vision/design'

import { AudioRecord, ErrMicrophoneNotAllowed, ErrMicrophoneNotFound } from '@x-vision/design'

interface IProps {
  toUserId: string
}
function ChatInputAudio(props: IProps) {
  const { toUserId } = props
  const showAudio = useChatInputSendDataStore((state) => state.showAudio)
  const audioData = useCurrentChatVoiceUploadList()

  const handleError = async (error: ErrAudioRecord) => {
    // const handleError = async (error: ErrAudioRecord, payload: any) => {
    // 自行处理错误逻辑
    if (error === ErrMicrophoneNotAllowed) {
      // TODO 等提供文案后再处理
      alert('请检查您的麦克风权限')
    }
    if (error === ErrMicrophoneNotFound) {
      // TODO 等提供文案后再处理
      alert('请检查您的麦克风是否可用')
    }
  }

  const uploadFile = async (f: { blob: Blob; size: number; url: string }) => {
    console.log('自行处理上传逻辑', f)
    const file = new File([f.blob], 'audio', { type: f.blob.type })
    await new Promise(async (resolve, reject) => {
      console.log('uploadFile', new Date().getTime(), file)
      uploadChatFileUtils.uploadSingle({
        subId: toUserId,
        file,
        onCompleted: (data) => {
          console.log('data', data)
          console.log(new Date().getTime())
          resolve(data)
        },
        onError: (error) => {
          console.log('error', error)
          console.log('uploadFile-error', new Date().getTime())
          reject(error)
        },
      })
    })
  }

  const handleClose = () => {
    // 自行处理关闭逻辑
    updateChatInputSendData(toUserId, {
      showAudio: false,
    })
    if (audioData[0]) {
      uploadChatFileUtils.cancel(audioData[0])
    }
  }

  return (
    <AnimationBox show={showAudio || false}>
      <div className="pl-3 pr-12 pb-2" dom-id="chat-input-audio">
        {showAudio && (
          <AudioRecord
            defaultAudio={audioData[0]?.fileUrl}
            defaultDuration={audioData[0]?.duration}
            mimeType="audio/mp3"
            onError={handleError}
            onClose={handleClose}
            upload={uploadFile}
            minDuration={1} // TODO 上线前改为5秒
            maxDuration={120}
          />
        )}
      </div>
    </AnimationBox>
  )
}

export default ChatInputAudio
