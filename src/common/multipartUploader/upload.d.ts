export interface UploadFileData {
  userId: string
  subId?: string
  // 上传场景
  scene?: number
  // 聊天举报的消息id
  messageId?: number | string

  // 此文件唯一标识（后续所有操作基于这个key做操作）
  key: string
  // 后端接口filekey
  fileKey?: string
  // 本地文件 file对象  上传完成时 赋值为null
  file: File | null
  // 文件大小
  fileSize: number
  // 文件类型
  fileType: string
  // 缩略图url
  thumbnailUrl: string
  // 上传状态
  duration?: number
  fileUrl: string
  uploadProgress: number
  isFinish: boolean
  isStop: boolean
  isErr: boolean
  errorData?: {
    code: number
    msg?: string
    file?: File
  } | null
  multipartUploader: MultipartUploader
}

export type OnProgressFunction = (progress: number, that?: MultipartUploader) => void
export type OnCompletedFunction = (data: UploadFileData, that?: MultipartUploader) => void
export type OnErrorFunction = (err?: { code: string | number; msg?: string }, that?: MultipartUploader) => void
// true 保留这条err数据在model  false 不保留在model
export type OnErrorCheckFn = (data?: { code?: string | number; msg?: string; file?: File; key?: string }) => boolean
export interface UploadRuleConfigType {
  // 允许上传的全部文件格式
  fileTypes?: string[]
  // 允许上传的图片格式
  imgTypes?: string[]
  // 允许上传的图片最大size（b）
  imgMaxSize?: number
  // 允许上传的视频格式
  videoTypes?: string[]
  // 允许上传的视频最大size（b）
  videoMaxSize?: number
  // 允许上传的音频格式
  audioTypes?: string[]
  // 允许上传的音频最大size（b）
  // audioMaxSize?: number
}
export interface MultipartUploaderOptions {
  subId?: string
  // 上传场景
  scene?: number
  businessType?: UploadBusinessType
  file: File
  uploadRuleConfig?: UploadRuleConfigType
  onProgress?: OnProgressFunction
  onCompleted?: OnCompletedFunction
  onError?: OnErrorFunction
  errorCheckFn?: OnErrorCheckFn
}
export interface ChatVaultMultipartUploaderOptions extends MultipartUploaderOptions {
  messageId?: string | number | undefined
}
