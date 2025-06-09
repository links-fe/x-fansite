import { UploadBusinessTypeMap } from '@/constants/upload'
import { MultipartUploader } from './common'
import { MultipartUploaderOptions, UploadFileData } from './upload'

interface AllMyProfileUploadDataType {
  [userId: string]: {
    list: UploadFileData[]
  }
}
const allMyProfileUploadData: AllMyProfileUploadDataType = {}

const getCurrenMyProfileUploadList = ({ userId }: { userId: string }) => {
  return allMyProfileUploadData?.[userId]?.list || []
}

const getCurrentMyProfileUploadItemFileData = ({ userId, key }: { userId: string; key: string }) => {
  return getCurrenMyProfileUploadList({ userId })?.find?.((item) => item.key === key) ?? null
}

const addCurrentMyProfileUploadData = ({ userId, data }: { userId: string; data: UploadFileData }) => {
  const list = getCurrenMyProfileUploadList({ userId })
  if (list?.length > 0) {
    list.push(data)
  } else {
    allMyProfileUploadData[userId] = allMyProfileUploadData[userId] || { list: [] }
    allMyProfileUploadData[userId].list.push(data)
  }
}

const setCurrentMyProfileUploadItemFileData = ({ userId, key, data }: { userId: string; key: string; data: any }) => {
  const result = getCurrentMyProfileUploadItemFileData({ userId, key })
  if (result) {
    Object.assign(result, data)
  }
}

const removeCurrentMyProfileUploadData = ({ userId, key }: { userId: string; key: string }) => {
  const list = getCurrenMyProfileUploadList({ userId })
  const index = list?.findIndex?.((item) => item.key === key)
  if (index !== -1) {
    list.splice(index, 1)
  }
}

export class MyProfileUploader extends MultipartUploader {
  constructor(options: MultipartUploaderOptions) {
    super({
      ...options,
      businessType: UploadBusinessTypeMap.USERSETTING,
    })
  }

  protected init() {
    addCurrentMyProfileUploadData({
      userId: this._userId,
      data: {
        userId: this._userId,
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
    return true
  }

  protected changeUploadItemFileData(data: any) {
    setCurrentMyProfileUploadItemFileData({
      userId: this._userId,
      key: this._key,
      data,
    })
    console.log('MyProfileUploader changeUploadItemFileData', data)
  }

  protected queryCurrentUploadItemFileData(): UploadFileData {
    return getCurrentMyProfileUploadItemFileData({
      userId: this._userId,
      key: this._key,
    }) as UploadFileData
  }

  protected removeUploadItemFileData() {
    removeCurrentMyProfileUploadData({
      userId: this._userId,
      key: this._key,
    })
  }

  protected uploadNextFile() {}
}
