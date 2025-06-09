import { audioTypes, UploadBusinessTypeMap, UploadErrorCodeMap, uploadSceneEnum } from '@/constants/upload'
import { MultipartUploader } from './common'
import {
  addCurrentChatUploadData,
  getCurrentChatUploadItemFileData,
  getCurrentChatUploadList,
  removeCurrentChatUploadData,
  setCurrentChatUploadItemFileData,
} from '@/models/chatUploadData'
import { hbSendLog } from '@/utils/datadog'
import { ChatVaultMultipartUploaderOptions, UploadFileData } from './upload'
const imgAndVideoMaxLimit = 12
export class ChatVaultMultipartUploader extends MultipartUploader {
  // 外部传入的更新当前视图方法
  constructor(options: ChatVaultMultipartUploaderOptions) {
    super({
      ...options,
      businessType: UploadBusinessTypeMap.CHATVAULT,
    })
  }
  protected init(options?: ChatVaultMultipartUploaderOptions) {
    if (!this._subId) {
      hbSendLog({
        message: 'x upload: ChatVaultMultipartUploader !this._subId',
        status: 'error',
        data: {
          userId: this._userId,
          subId: this._subId,
          businessType: this._businessType,
          key: this._key,
          file: {
            name: this._file?.name,
            size: this._file?.size,
            type: this._file?.type,
          },
        },
      })
      new Error('subId is required when businessType is CHATVAULT')
    }

    // 聊天工具限制
    if (this._scene === uploadSceneEnum.chatTool) {
      const currentChatToolList =
        getCurrentChatUploadList({
          userId: this._userId,
          subId: this._subId as string,
        }).filter?.((item) => item?.scene === uploadSceneEnum.chatTool) ?? []
      if (currentChatToolList?.length >= imgAndVideoMaxLimit) {
        this.handleUploadFileErr({
          code: UploadErrorCodeMap.exceedingNumLimit.code,
          file: this._file,
        })
        return false
      }
    }
    // 一个聊天会话只能有一个上传相关的音频
    const audioArr =
      getCurrentChatUploadList({
        userId: this._userId,
        subId: this._subId as string,
      }).filter?.((item) => audioTypes?.includes?.(`.${item?.fileType}`)) ?? []
    if (audioArr?.length > 1) {
      this.handleUploadFileErr({
        code: UploadErrorCodeMap.exceedingNumLimit.code,
        file: this._file,
      })
      return false
    }

    if (!this.queryCurrentUploadItemFileData()) {
      addCurrentChatUploadData({
        userId: this._userId,
        subId: this._subId as string,
        data: {
          userId: this._userId,
          subId: this._subId as string,
          scene: this._scene,
          messageId: options?.messageId,
          key: this._key,
          file: this._file,
          fileSize: this._file.size,
          fileType: this._fileType,
          thumbnailUrl: '',
          duration: 0,
          fileUrl: '',
          uploadProgress: 0,
          isFinish: false,
          isStop: false,
          isErr: false,
          errorData: null,
          multipartUploader: this,
        },
      })
    }
    return true
  }
  protected changeUploadItemFileData(data: any) {
    setCurrentChatUploadItemFileData({
      userId: this._userId,
      subId: this._subId as string,
      key: this._key,
      data,
    })
    console.log(
      `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
      'ChatVaultMultipartUploader changeUploadItemFileData',
      data,
    )
  }

  protected queryCurrentUploadItemFileData(): UploadFileData {
    return getCurrentChatUploadItemFileData({
      userId: this._userId,
      subId: this._subId as string,
      key: this._key,
    }) as UploadFileData
  }

  protected uploadNextFile() {
    const list = getCurrentChatUploadList({
      userId: this._userId,
      subId: this._subId as string,
    })
    list
      ?.filter?.(
        (item) =>
          item.key !== this._key &&
          !item?.isFinish &&
          !item?.isErr &&
          !item?.isStop &&
          !item?.multipartUploader?._inStart,
      )?.[0]
      ?.multipartUploader?.start?.()
  }

  protected removeUploadItemFileData() {
    removeCurrentChatUploadData({
      userId: this._userId,
      subId: this._subId as string,
      key: this._key,
    })
  }
}
