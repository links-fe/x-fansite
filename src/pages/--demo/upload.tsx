import { uploadChatFileUtils, uploadMyProfileFileUtils } from '@/common/multipartUploader'
import { chatInputTypes, myProfileUploadTypes } from '@/constants/upload'
const Upload = () => {
  const handleChatFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.files: ', e.target.files)
    const fileList = Array.from(e.target.files || [])
    if (fileList.length === 0) {
      return
    }

    uploadChatFileUtils.upload({
      // 会话id chat上传文件必传
      subId: '123',
      fileList,
    })
  }

  const handleMyProfileFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.files: ', e.target.files)
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    uploadMyProfileFileUtils.upload({
      file,
      onProgress: (progress) => {
        console.log('progress', progress)
      },
      onCompleted: (data) => {
        console.log('onCompleted', data)
      },
      onError: (err) => {
        console.log('onError', err)
      },
    })
  }
  return (
    <div>
      <h1>Upload</h1>
      <div className="mt-6">
        <h2 className="text-2xl">chat 文件上传</h2>
        <input type="file" multiple accept={chatInputTypes} onChange={handleChatFileUploadChange} />
      </div>

      <div className="mt-6">
        <h2 className="text-2xl">myProfile 文件上传</h2>
        <input type="file" accept={myProfileUploadTypes} onChange={handleMyProfileFileUploadChange} />
      </div>
    </div>
  )
}
export default Upload
