import {
  allFileTypes,
  audioTypes,
  imageMaxSize,
  imageTypes,
  uploadSceneEnum,
  videoMaxSize,
  videoTypes,
} from '@/constants/upload'
import { ChatVaultMultipartUploader } from './ChatVaultMultipartUploader'
import { MultipartUploader } from './common'
import { MyProfileUploader } from './myProfile'
import { OnCompletedFunction, OnErrorCheckFn, OnErrorFunction, OnProgressFunction, UploadFileData } from './upload'

export const uploadChatFileUtils = {
  // 聊天会话工具上传
  upload({ subId, fileList, errorCheckFn }: { subId: string; fileList: File[]; errorCheckFn: OnErrorCheckFn }) {
    fileList.forEach((file: File) => {
      new ChatVaultMultipartUploader({
        scene: uploadSceneEnum.chatTool,
        subId,
        file,
        uploadRuleConfig: {
          fileTypes: allFileTypes,
          imgTypes: imageTypes,
          imgMaxSize: imageMaxSize,
          videoTypes: videoTypes,
          videoMaxSize: videoMaxSize,
        },
        errorCheckFn,
      })
    })
  },
  // 上传录制音频
  uploadSingle({
    subId,
    file,
    onProgress,
    onCompleted,
    onError,
  }: {
    subId: string
    file: File
    onProgress?: OnProgressFunction
    onCompleted?: OnCompletedFunction
    onError?: OnErrorFunction
  }) {
    new ChatVaultMultipartUploader({
      scene: uploadSceneEnum.chatVoice,
      subId,
      file,
      uploadRuleConfig: {
        fileTypes: audioTypes,
        audioTypes: audioTypes,
      },
      onProgress: (progress) => {
        console.log('progress', progress)
        onProgress?.(progress)
      },
      onCompleted: (data) => {
        console.log('onCompleted', data)
        onCompleted?.(data)
      },
      onError: (err) => {
        console.log('onError', err)
        onError?.(err)
      },
    })
  },
  // 上传举报文件
  uploadReportFile({ subId, messageId, fileList }: { subId: string; messageId: number | string; fileList: File[] }) {
    fileList?.forEach?.((file) => {
      new ChatVaultMultipartUploader({
        scene: uploadSceneEnum.chatReport,
        messageId,
        subId,
        file,
        uploadRuleConfig: {
          fileTypes: [...imageTypes, ...videoTypes],
          imgTypes: imageTypes,
          imgMaxSize: imageMaxSize,
          videoTypes: videoTypes,
          videoMaxSize: videoMaxSize,
        },
        onProgress: (progress) => {
          console.log('progress', progress)
        },
        onCompleted: (data, that) => {
          console.log('onCompleted', data)
        },
        onError: (err, that) => {
          console.log('onError', err)
        },
      })
    })
  },
  // 批量取消举报文件上传
  cancelReportFileUpload(data: UploadFileData[]) {
    data?.forEach?.((item) => {
      item?.multipartUploader?.cancel?.()
    })
  },
  stop(data: UploadFileData) {
    data?.multipartUploader?.stop?.()
  },
  cancel(data: UploadFileData) {
    data?.multipartUploader?.cancel?.()
  },
  retry(data: UploadFileData) {
    data?.multipartUploader?.retry?.()
  },
}

export const uploadMyProfileFileUtils = {
  upload({
    file,
    onProgress,
    onCompleted,
    onError,
  }: {
    file: File
    onProgress?: OnProgressFunction
    onCompleted?: OnCompletedFunction
    onError?: OnErrorFunction
  }) {
    new MyProfileUploader({
      file,
      uploadRuleConfig: {
        fileTypes: imageTypes,
        imgTypes: imageTypes,
        imgMaxSize: 5 * 1024 * 1024,
      },
      onProgress: (progress) => {
        console.log('progress', progress)
        onProgress?.(progress)
      },
      onCompleted: (data, that?: MultipartUploader) => {
        console.log('onCompleted', data)
        onCompleted?.(data)
        that?.cancel?.()
      },
      onError: (err, that?: MultipartUploader) => {
        console.log('onError', err)
        onError?.(err)
        that?.cancel?.()
      },
    })
  },
  stop(data: UploadFileData) {
    data?.multipartUploader?.stop?.()
  },
  cancel(data: UploadFileData) {
    data?.multipartUploader?.cancel?.()
  },
  retry(data: UploadFileData) {
    data?.multipartUploader?.retry?.()
  },
}
