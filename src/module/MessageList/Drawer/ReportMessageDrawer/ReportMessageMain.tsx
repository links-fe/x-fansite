import { setReportMessageDrawerVisible } from '@/models/message/model'
import { Button, Navbar, Text, Textarea } from '@x-vision/design/index.js'
import RetryImg from '@/components/RetryImg'
import { Icon } from '@x-vision/icons/index.js'
import { delay } from '@/utils'
import { getCurrentChatUploadCache, useCurrentChatReportUploadList } from '@/models/chatUploadData'
import { chatReportUploadTypes, uploadSceneEnum } from '@/constants/upload'
import { useEffect, useState } from 'react'
import { uploadChatFileUtils } from '@/common/multipartUploader'
import { UploadFileData } from '@/common/multipartUploader/upload'

const CHAT_REPORT_UPLOAD_ID = 'chatReportUploadId'

interface IProps {
  toUserId: string
  userId: string
}
export default function ReportMessageMain(props: IProps) {
  const { toUserId, userId } = props

  const [value, setValue] = useState('')
  const uploadList = useCurrentChatReportUploadList({ messageId: CHAT_REPORT_UPLOAD_ID })

  useEffect(() => {
    return () => {
      // 清空上传缓存
      const list = getCurrentChatUploadCache({ userId, subId: toUserId }).list?.filter?.(
        (item) => item?.scene === uploadSceneEnum.chatReport && item?.messageId === CHAT_REPORT_UPLOAD_ID,
      )
      uploadChatFileUtils.cancelReportFileUpload(list)
    }
  }, [])

  const onReport = async () => {
    if (!value) return
    // TODO: 掉接口
    await delay(1000)
    setValue('')
    setReportMessageDrawerVisible(false)
  }

  const onUpload = () => {
    const chatReportUploadInput = 'chatReportUploadInput'
    let chatUploadInputEle = document.getElementById(chatReportUploadInput) as HTMLInputElement | null
    if (!chatUploadInputEle) {
      chatUploadInputEle = document.createElement('input')
      chatUploadInputEle.id = chatReportUploadInput
      chatUploadInputEle.type = 'file'
      chatUploadInputEle.multiple = true
      chatUploadInputEle.accept = chatReportUploadTypes
    }
    chatUploadInputEle.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        const fileList = Array.from(files)
        // 这里可以添加处理文件列表的逻辑
        uploadChatFileUtils.uploadReportFile({
          // 会话id chat上传文件必传
          subId: toUserId,
          messageId: CHAT_REPORT_UPLOAD_ID,
          fileList,
        })
      }
    }
    chatUploadInputEle.click()
  }

  const onDelete = (v: UploadFileData) => {
    uploadChatFileUtils.cancelReportFileUpload([v])
  }

  return (
    <div className="w-screen h-full flex flex-col">
      <Navbar
        leftArrow
        onLeftArrowClick={() => {
          setReportMessageDrawerVisible(false)
        }}
      >
        Report violation
      </Navbar>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div>
            <Text size="body1" strong>
              Description of violation
            </Text>
            <div className="relative mt-2">
              <Textarea
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                }}
                rows={4}
                maxLength={300}
                showCount="default"
                className="rounded-2xl"
              />
              <span className="absolute bottom-3.5 right-4">{value.length}/300</span>
            </div>
          </div>

          <div className="mt-6">
            <Text size="body1" strong>
              Upload image (not mandatory)
            </Text>
            <div className="mt-2 flex gap-3">
              {uploadList?.map((v: UploadFileData) => (
                <div key={v.key} className="w-24 h-24 rounded-lg overflow-hidden relative">
                  <RetryImg src={v.fileUrl} alt="" className="w-full h-full object-cover" />
                  <div
                    className="absolute bottom-2 right-2 bg-(--grayscale-black-02) flex items-center justify-center rounded-full p-[5px] text-(--grayscale-white-00)"
                    onClick={() => onDelete(v)}
                  >
                    <Icon icon="x:Delete01StyleStroke" fontSize={12} color="currentColor" />
                  </div>
                </div>
              ))}
              <div
                className="w-24 h-24 bg-(--grayscale-black-06) rounded-lg overflow-hidden flex items-center justify-center"
                onClick={onUpload}
              >
                <div className="w-9 h-9 rounded-full bg-(--grayscale-black-04) flex items-center justify-center">
                  <Icon icon="x:Upload01StyleSolid" fontSize={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <Button color="primary" className="w-full" onClick={onReport}>
            Report
          </Button>
        </div>
      </div>
    </div>
  )
}
