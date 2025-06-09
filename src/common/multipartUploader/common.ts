'use client'
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator'
import cloneDeep from 'lodash/cloneDeep'
import { getUserInfo } from '@/models/user'
import {
  addFileChunkUploadThread,
  addFileUploadThread,
  diminishFileChunkUploadThread,
  diminishFileUploadThread,
  isMaxFileChunkThreadsQuantity,
  isMaxFileThreadsQuantity,
} from '@/models/uploadThreadManagement'
import { queryFileIsExist, queryUploadedParts, queryUploadUrl, sendUploadComplete } from '@/services/upload'
import {
  allFileTypes,
  audioTypes,
  imageMaxSize,
  imageTypes,
  UploadBusinessType,
  UploadErrorCodeMap,
  UploadSceneValue,
  videoMaxSize,
  videoTypes,
} from '@/constants/upload'
import { EnumLoginMode } from '@/types'
import { generateUniqueId } from '@/utils'
import { hbSendLog } from '@/utils/datadog'
import {
  ChatVaultMultipartUploaderOptions,
  MultipartUploaderOptions,
  OnCompletedFunction,
  OnErrorCheckFn,
  OnErrorFunction,
  OnProgressFunction,
  UploadFileData,
  UploadRuleConfigType,
} from './upload'
interface UploadChunkItemData {
  uploadUrl: string
  partNumber: number
  // 是否开始上传
  chunkUploadStart: boolean
  // 切片是否上传完成
  chunkUploadcomplete: boolean
  // 切片是否上传失败
  chunkUploadErr: boolean
  // 切片已上传大小
  chunkUploadSize: number
}

// 抽象基类
export abstract class MultipartUploader {
  protected _scene?: UploadSceneValue | undefined
  protected _userId: string = ''
  protected _subId?: string = ''
  protected _businessType: UploadBusinessType | undefined
  protected _key: string = ''
  protected _hash: string = ''
  protected _file: File = null as unknown as File
  protected _fileType: string = ''
  protected _fileKey: string = ''
  protected _previewUrl: string = ''
  protected _uploadRuleConfig: Required<UploadRuleConfigType>
  private _chunkTotal?: number = 0
  private _fileSegmentSize: number = 0
  private _allChunkList: UploadChunkItemData[] = []
  private _requestList: XMLHttpRequest[] = []
  public _inStart?: boolean
  public _inUpload?: boolean
  public _startEnd?: boolean

  private _onProgress?: OnProgressFunction
  private _onCompleted?: OnCompletedFunction
  private _onError?: OnErrorFunction
  private _errorCheckFn?: OnErrorCheckFn

  // 子类必须实现
  protected abstract init(options?: MultipartUploaderOptions | ChatVaultMultipartUploaderOptions): boolean
  protected abstract queryCurrentUploadItemFileData(): UploadFileData
  protected abstract changeUploadItemFileData(data: any): void
  protected abstract removeUploadItemFileData(): void
  protected abstract uploadNextFile(): void

  constructor(options: MultipartUploaderOptions | ChatVaultMultipartUploaderOptions) {
    const { subId, scene, businessType, file, onProgress, onCompleted, onError, errorCheckFn } = options
    if (!businessType || !file) {
      throw new Error('MultipartUploader businessType, file are required')
    }
    if (file instanceof File) {
      console.log('是File对象')
    } else {
      console.log('不是File对象')
      throw new Error('file no File')
    }
    this._subId = subId || ''
    this._scene = scene
    this._businessType = businessType
    this._file = file
    this._fileType = this.getFileExtensionWithSplit(file)
    this._onProgress = onProgress
    this._onCompleted = onCompleted
    this._onError = onError
    this._errorCheckFn = errorCheckFn
    this._fileSegmentSize = 1024 * 1024 * 10 // 切片大小默认 10M
    this._uploadRuleConfig = Object.assign(
      {
        fileTypes: allFileTypes,
        imgTypes: imageTypes,
        imgMaxSize: imageMaxSize,
        videoTypes: videoTypes,
        videoMaxSize: videoMaxSize,
        audioTypes: audioTypes,
      },
      options?.uploadRuleConfig || {},
    )

    const { userId, loginMode } = getUserInfo() || {}
    if (!userId) {
      hbSendLog({
        message: 'x upload: MultipartUploader constructor !userId',
        status: 'error',
        data: {
          userId,
          loginMode,
          subId: this._subId,
          businessType: this._businessType,
          file: {
            name: this._file?.name,
            size: this._file?.size,
            type: this._file?.type,
          },
        },
      })
      throw new Error('MultipartUploader userId is required')
    }
    this._userId = userId
    this._key = `${this._userId}_${this._subId}_${generateUniqueId()}`

    if (this.initRule(options)) {
      this.initLocalData()
      this.start()
    }
  }

  private initRule(options?: MultipartUploaderOptions | ChatVaultMultipartUploaderOptions) {
    const { userId, loginMode } = getUserInfo() || {}
    if (loginMode !== EnumLoginMode.Normal) {
      this.handleUploadFileErr({ code: UploadErrorCodeMap.abnormalUser.code })
      hbSendLog({
        message: 'x upload: MultipartUploader loginMode !== EnumLoginMode.Normal',
        status: 'error',
        data: {
          userId,
          loginMode,
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
      return false
    }
    if (this._file?.size === 0) {
      this.handleUploadFileErr({ code: UploadErrorCodeMap.emptyFile.code })
      hbSendLog({
        message: 'x upload: MultipartUploader file.size === 0',
        status: 'error',
        data: {
          userId,
          loginMode,
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
      return false
    }

    if (options) {
      const initRes = this.init(options)
      if (!initRes) {
        return false
      }
    }
    const fileTypes = this._uploadRuleConfig.fileTypes
    if (!fileTypes.includes(this._file.type)) {
      this.handleUploadFileErr({
        code: UploadErrorCodeMap.notSupportedFileType.code,
      })
      hbSendLog({
        message: 'x upload: MultipartUploader !allFileTypes.includes(file.type)',
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
      return false
    }
    const imgTypes = this._uploadRuleConfig.imgTypes
    const imgMaxSize = this._uploadRuleConfig?.imgMaxSize
    if (imgTypes.includes(this._file.type) && this._file.size > imgMaxSize) {
      this.handleUploadFileErr({
        code: UploadErrorCodeMap.imgSizeMax.code,
      })
      hbSendLog({
        message: 'x upload: MultipartUploader imageTypes.includes(file.type) && file.size > imageMaxSize',
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
      return false
    }
    const videoT = this._uploadRuleConfig.videoTypes
    const videoMSize = this._uploadRuleConfig.videoMaxSize
    if (videoT.includes(this._file.type) && this._file.size > videoMSize) {
      this.handleUploadFileErr({ code: UploadErrorCodeMap.videoSizeMax.code })
      hbSendLog({
        message: 'x upload: MultipartUploader videoTypes.includes(file.type) && file.size > videoMaxSize',
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
      return false
    }

    return true
  }

  private getFileExtensionWithSplit(file: File): string {
    const fileName = file.name
    const lastDotIndex = fileName.lastIndexOf('.')
    if (lastDotIndex !== -1) {
      return fileName.slice(lastDotIndex + 1)
    }
    // 从 file.type 中提取后缀
    const typeParts = file.type.split('/')
    return typeParts.length > 1 ? `${typeParts[1]}` : ''
  }

  private async initLocalData() {
    const that = this
    const _URL = window.URL || window.webkitURL
    let fileUrl = that.queryCurrentUploadItemFileData()?.fileUrl
    if (!fileUrl) {
      fileUrl = _URL.createObjectURL(this._file) // 文件地址
      this.changeUploadItemFileData({
        fileUrl,
      })
    }

    if (this._uploadRuleConfig.imgTypes.includes(this._file.type)) {
      this.changeUploadItemFileData({
        thumbnailUrl: fileUrl,
      })
      return true
    }

    if (this._uploadRuleConfig.videoTypes.includes(this._file.type)) {
      return new Promise((resolve) => {
        const videoEle = document.createElement('video')
        videoEle.src = fileUrl
        videoEle.addEventListener('loadedmetadata', function () {
          const totalSeconds = this.duration
          generateVideoThumbnails(that._file, 0, 'file')
            .then((thumbnail: any) => {
              that.changeUploadItemFileData({
                thumbnailUrl: thumbnail?.[0] || thumbnail,
                duration: totalSeconds,
              })
              resolve(true)
            })
            .catch((err: any) => {
              console.error(
                `${that._file?.name}---${that._key}---${that._hash}---${that._fileKey}`,
                'generateVideoThumbnails error: ',
                err,
              )
              hbSendLog({
                message:
                  'x upload: MultipartUploader initLocalData videoTypes loadedmetadata generateVideoThumbnails error',
                status: 'error',
                data: {
                  userId: that._userId,
                  subId: that._subId,
                  businessType: that._businessType,
                  key: that._key,
                  totalSeconds,
                  file: {
                    name: that._file?.name,
                    size: that._file?.size,
                    type: that._file?.type,
                  },
                },
                error: err,
              })
              resolve(false)
            })
        })
        videoEle.addEventListener('error', function () {
          console.error(
            `${that._file?.name}---${that._key}---${that._hash}---${that._fileKey}`,
            'videoEle loading error.',
          )
          hbSendLog({
            message: 'x upload: MultipartUploader initLocalData videoTypes error',
            status: 'error',
            data: {
              userId: that._userId,
              subId: that._subId,
              businessType: that._businessType,
              key: that._key,
              file: {
                name: that._file?.name,
                size: that._file?.size,
                type: that._file?.type,
              },
            },
          })
          resolve(false)
        })
      })
    }

    if (this._uploadRuleConfig.audioTypes.includes(this._file.type)) {
      return new Promise((resolve) => {
        const audioEle = document.createElement('audio')
        audioEle.src = fileUrl
        audioEle.addEventListener('loadedmetadata', function () {
          const totalSeconds = this.duration
          that.changeUploadItemFileData({
            duration: totalSeconds,
          })
          resolve(true)
        })
        audioEle.addEventListener('error', function () {
          console.error(
            `${that._file?.name}---${that._key}---${that._hash}---${that._fileKey}`,
            'audioEle loading error.',
          )
          hbSendLog({
            message: 'x upload: MultipartUploader initLocalData audioTypes error',
            status: 'error',
            data: {
              userId: that._userId,
              subId: that._subId,
              businessType: that._businessType,
              key: that._key,
              file: {
                name: that._file?.name,
                size: that._file?.size,
                type: that._file?.type,
              },
            },
          })
          resolve(false)
        })
      })
    }
  }

  async start() {
    const { isErr, isStop, isFinish } = this.queryCurrentUploadItemFileData() || {}
    if (isErr || isStop || isFinish) {
      this.uploadNextFile?.()
      console.log(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'start isErr, isStop, isFinish',
        { isErr, isStop, isFinish },
      )
      return
    }

    if (this._startEnd && !this._inUpload) {
      this.uploadTheCurrentRemaining()
      console.log(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'start this._startEnd &&!this._inUpload',
        { isErr, isStop, isFinish },
      )
      return
    }

    if (this._inStart || this._inUpload) {
      console.log(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'start this._inStart || this._inUpload',
        { isErr, isStop, isFinish },
      )
      return
    }

    if (isMaxFileThreadsQuantity()) {
      console.log(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'isMaxFileThreadsQuantity()')
      return
    }

    this._inStart = true

    addFileUploadThread()
    try {
      const hash = await this.calculateHash()
      if (!hash) {
        this.handleUploadFileErr({
          code: UploadErrorCodeMap.hashErr.code,
        })
        console.error(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'hash is null', hash)
        this.uploadNextFile?.()
        hbSendLog({
          message: 'x upload: MultipartUploader start !hash',
          status: 'error',
          data: {
            userId: this._userId,
            subId: this._subId,
            businessType: this._businessType,
            key: this._key,
            hash,
            file: {
              name: this._file?.name,
              size: this._file?.size,
              type: this._file?.type,
            },
          },
        })
        return
      }
      this._hash = hash as string

      const isExist = await this.checkFileIsExist()
      if (isExist) {
        diminishFileUploadThread()
        this.uploadNextFile?.()
        return
      }

      await this.initAllChunkList()

      this._startEnd = true

      if (isMaxFileChunkThreadsQuantity()) {
        diminishFileUploadThread()
        this._inStart = false
        this._inUpload = false
        this.uploadNextFile?.()
        return
      }
      const result = await this.uploadTheCurrentRemaining(true)
      if (result === false) {
        console.error(
          `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
          'uploadTheCurrentRemaining is false',
        )
        throw result
      }
    } catch (error: any) {
      console.error(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'error: ', error)
      diminishFileUploadThread()
      this.uploadNextFile?.()
      hbSendLog({
        message: 'x upload: MultipartUploader start error',
        status: 'error',
        data: {
          userId: this._userId,
          subId: this._subId,
          businessType: this._businessType,
          key: this._key,
          hash: this._hash,
          fileKey: this._fileKey,
          file: {
            name: this._file?.name,
            size: this._file?.size,
            type: this._file?.type,
          },
        },
        error,
      })
    }
  }

  private async checkFileIsExist() {
    try {
      const res = await queryFileIsExist({
        businessType: this._businessType as UploadBusinessType,
        fileMd5: this._hash,
      })
      if (res?.fileMd5 !== this._hash) {
        console.error(
          `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
          'queryFileIsExist res?.fileMd5 !== this._hash',
          res?.fileMd5,
          this._hash,
        )
        return false
      }
      if (res?.isExist) {
        this._previewUrl = res?.previewUrl ?? ''
        this._fileKey = res?.fileKey ?? ''
        this.revokeObjectURL(this.queryCurrentUploadItemFileData()?.fileUrl)
        this.changeUploadItemFileData({
          fileKey: this._fileKey,
          file: null,
          fileSize: 0,
          fileType: this._fileType,
          fileUrl: this._previewUrl ?? '',
          uploadProgress: 100,
          isFinish: true,
          isStop: false,
          isErr: false,
          errorData: null,
        })
        this._onCompleted?.(cloneDeep(this.queryCurrentUploadItemFileData()), this)
        console.log(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, '文件已存在，无需上传')
        this.uploadNextFile?.()

        hbSendLog({
          message: 'x upload: MultipartUploader checkFileIsExist isExist',
          status: 'warn',
          data: {
            userId: this._userId,
            subId: this._subId,
            businessType: this._businessType,
            key: this._key,
            hash: this._hash,
            fileKey: this._fileKey,
            file: {
              name: this._file?.name,
              size: this._file?.size,
              type: this._file?.type,
            },
            response: res,
          },
        })
      }
      return !!res?.isExist
    } catch (error: any) {
      console.error(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'queryFileIsExist error:',
        error,
      )
      return false
    }
  }

  // 生成文件 hash（web-worker）
  private async calculateHash() {
    if (this._hash) {
      return this._hash
    }
    if (!this._file) {
      console.error(`---${this._hash}---${this._fileKey}`, 'this._file is null', this._file)
      return ''
    }
    let workerExample: Worker
    const initRes = await new Promise((resolve) => {
      const initSparkMD5Type = 'initSparkMD5'
      // 每次new 一个新的worker
      workerExample = new Worker(`${location.origin}/uploadHash.js?t=${generateUniqueId()}`)

      workerExample.onmessage = (e) => {
        console.log(
          `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
          'workerExample onmessage init: ',
          e,
        )
        const { type, initSuccess } = e?.data ?? {}
        if (type === initSparkMD5Type) {
          resolve(initSuccess)
        }
      }
      workerExample.postMessage({ type: initSparkMD5Type, url: location.origin })
    })

    if (!initRes) {
      console.error(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'initRes is false',
        initRes,
      )
      return ''
    }
    return new Promise((resolve) => {
      const uploadFileCreateHashType = 'uploadFileCreateHash'
      workerExample.postMessage({
        type: uploadFileCreateHashType,
        key: this._key,
        file: this._file,
        chunkSize: this._fileSegmentSize,
        chunkTotal: this._chunkTotal || Math.ceil(this._file.size / this._fileSegmentSize),
      })
      workerExample.onmessage = (e) => {
        console.log(
          `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
          'workerExample onmessage hash: ',
          e,
        )
        const { type, key, hash } = e.data
        if (type === uploadFileCreateHashType && key === this._key) {
          resolve(hash)
        }
      }
    })
  }

  private async initAllChunkList() {
    try {
      const res = await queryUploadUrl({
        businessType: this._businessType as UploadBusinessType,
        fileType: this._fileType,
        fileMd5: this._hash,
        fileSize: this._file.size,
      })
      const { uploadUrlArray, fileSegmentSize, fileKey, previewUrl } = res || {}
      if (!uploadUrlArray?.length || !fileSegmentSize || !fileKey || !previewUrl) {
        throw res
      }
      this._chunkTotal = uploadUrlArray?.length
      this._fileSegmentSize = Number(fileSegmentSize || 0)
      this._fileKey = fileKey
      this.changeUploadItemFileData({
        fileKey: this._fileKey,
      })
      this._previewUrl = previewUrl
      this._allChunkList = []
      uploadUrlArray.forEach((item) => {
        this._allChunkList.push({
          uploadUrl: item.uploadUrl,
          partNumber: item?.partNumber,
          chunkUploadStart: false,
          chunkUploadcomplete: false,
          chunkUploadErr: false,
          chunkUploadSize: 0,
        })
      })
    } catch (error: any) {
      console.error(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'queryUploadUrl error:',
        error,
      )
      this.handleUploadFileErr({ code: UploadErrorCodeMap.apiErr.code })
      throw error
    }
  }

  private async uploadChunk(chunk: UploadChunkItemData) {
    if (!this._allChunkList.length) {
      console.error(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'this._allChunkList 不存在',
        this._allChunkList,
        this,
      )
      hbSendLog({
        message: 'x upload: MultipartUploader uploadChunk !this._allChunkList.length',
        status: 'error',
        data: {
          userId: this._userId,
          subId: this._subId,
          businessType: this._businessType,
          key: this._key,
          hash: this._hash,
          fileKey: this._fileKey,
          file: {
            name: this._file?.name,
            size: this._file?.size,
            type: this._file?.type,
          },
          chunk,
        },
      })
      throw new Error('uploadChunk this._allChunkList 不存在')
    }
    if (!chunk.partNumber) {
      console.error(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'chunk.partNumber 不存在',
        chunk.partNumber,
        chunk,
      )
      hbSendLog({
        message: 'x upload: MultipartUploader uploadChunk !chunk.partNumber',
        status: 'error',
        data: {
          userId: this._userId,
          subId: this._subId,
          businessType: this._businessType,
          key: this._key,
          hash: this._hash,
          fileKey: this._fileKey,
          file: {
            name: this._file?.name,
            size: this._file?.size,
            type: this._file?.type,
          },
          chunk,
        },
      })
      throw new Error('uploadChunk chunk.partNumber 不存在')
    }
    if (!this._fileSegmentSize) {
      console.error(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'this._fileSegmentSize 不存在',
        this._fileSegmentSize,
        this,
      )
      hbSendLog({
        message: 'x upload: MultipartUploader uploadChunk !this._fileSegmentSize',
        status: 'error',
        data: {
          userId: this._userId,
          subId: this._subId,
          businessType: this._businessType,
          key: this._key,
          hash: this._hash,
          fileKey: this._fileKey,
          file: {
            name: this._file?.name,
            size: this._file?.size,
            type: this._file?.type,
          },
          chunk,
        },
      })
      throw new Error('uploadChunk this._fileSegmentSize 不存在')
    }
    if (isMaxFileChunkThreadsQuantity()) {
      this._inStart = false
      this._inUpload = false
      throw new Error('isMaxFileChunkThreadsQuantity')
    }

    if (chunk.chunkUploadErr) {
      throw new Error('chunk.chunkUploadErr')
    }
    if (chunk.chunkUploadStart || chunk.chunkUploadcomplete) {
      return
    }

    if (!this.queryCurrentUploadItemFileData()) {
      this.uploadNextFile?.()
      return
    }

    const xhr = new XMLHttpRequest()
    this._requestList.push(xhr)
    return new Promise((resolve, reject) => {
      // 计算切片的起始位置
      const start = (chunk.partNumber - 1) * this._fileSegmentSize
      // 计算切片的结束位置，取文件大小和理论结束位置的较小值
      const end = Math.min(chunk.partNumber * this._fileSegmentSize, this._file.size)
      const chunkFile = this._file.slice(start, end)
      xhr.upload.addEventListener('progress', (event) => {
        // 检查 event.total 是否为 0，避免除零错误
        if (event.total === 0) {
          console.error(
            `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
            'event.total is 0, cannot calculate progress percentage',
            event,
          )
          reject({
            type: 'error',
            event,
          })
          return
        }
        // 计算当前切片的上传进度百分比，并四舍五入取整
        const chunkPercentage = Math.round((event.loaded / event.total) * 100)
        chunk.chunkUploadSize = (chunkFile?.size || 0) * (chunkPercentage || 0)
        this.handleUploadFilePercentage()
      })
      xhr.addEventListener('error', (event) => {
        console.error(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'error event: ', event)
        reject({
          type: 'error',
          event,
        })
      })
      xhr.addEventListener('abort', (event) => {
        console.log(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'abort event: ', event)
        resolve({
          type: 'abort',
          event,
        })
      })
      xhr.open('PUT', chunk.uploadUrl)
      xhr.setRequestHeader('Content-Type', this._file.type)

      xhr.onreadystatechange = () => {
        if (xhr.status === 500) {
          console.error(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'error event: ', 500)
          reject({
            type: 'error',
            status: 500,
          })
          return
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
          chunk.chunkUploadcomplete = true
          resolve(true)
        }
      }
      xhr.send(chunkFile)
      this._inUpload = true
      chunk.chunkUploadStart = true
      addFileChunkUploadThread()
    })
      .catch((error) => {
        console.error(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'error: ', error)
        chunk.chunkUploadErr = true

        // 走个时间差 确保diminishFileUploadThread在这整个文件这次上传过程 只会在请求错误时调用一次
        const { isErr } = this.queryCurrentUploadItemFileData() || {}
        if (!isErr) {
          diminishFileUploadThread()
        }

        this.handleUploadFileErr({
          code: UploadErrorCodeMap.awsApiErr.code,
        })

        hbSendLog({
          message: 'x upload: MultipartUploader uploadChunk catch',
          status: 'error',
          data: {
            userId: this._userId,
            subId: this._subId,
            businessType: this._businessType,
            key: this._key,
            hash: this._hash,
            fileKey: this._fileKey,
            file: {
              name: this._file?.name,
              size: this._file?.size,
              type: this._file?.type,
            },
            chunk,
            error,
          },
        })
      })
      .finally(async () => {
        this._requestList = this._requestList.filter((v) => v !== xhr)
        diminishFileChunkUploadThread()

        if (this.checkAllCheckComplete()) {
          await this.handleUploadFileComplete()
        }
        // 继续下一个切片，或者下一个文件
        try {
          this.uploadTheCurrentRemaining()
        } catch (error) {
          // 这里的因为进程上限错误是正常的 忽略
          console.log(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'error: ', error)
        }
      })
  }

  private uploadTheCurrentRemaining(isInit?: boolean) {
    const { isFinish, isStop, isErr } = this.queryCurrentUploadItemFileData() || {}
    if (isFinish || isStop || isErr) {
      this.uploadNextFile?.()
      console.log(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'isFinish || isStop || isErr',
        isFinish,
        isStop,
        isErr,
      )
      return false
    }

    if (!this._allChunkList.length) {
      this.uploadNextFile?.()
      console.log(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'this._allChunkList 不存在',
        this._allChunkList,
      )
      hbSendLog({
        message: 'x upload: MultipartUploader uploadTheCurrentRemaining !this._allChunkList.length',
        status: 'error',
        data: {
          userId: this._userId,
          subId: this._subId,
          businessType: this._businessType,
          key: this._key,
          hash: this._hash,
          fileKey: this._fileKey,
          file: {
            name: this._file?.name,
            size: this._file?.size,
            type: this._file?.type,
          },
        },
      })
      return false
    }

    if (isMaxFileChunkThreadsQuantity()) {
      console.log(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'isMaxFileChunkThreadsQuantity',
        isMaxFileChunkThreadsQuantity(),
      )
      this._inStart = false
      this._inUpload = false
      return false
    }

    for (let i = 0; i < this._allChunkList.length; i++) {
      const chunk = this._allChunkList[i]
      if (chunk.chunkUploadStart || chunk.chunkUploadcomplete || chunk.chunkUploadErr) {
        continue
      }
      if (isMaxFileChunkThreadsQuantity()) {
        console.log(
          `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
          'isMaxFileChunkThreadsQuantity',
          isMaxFileChunkThreadsQuantity(),
        )
        this._inStart = false
        this._inUpload = false
        return false
      }
      try {
        this.uploadChunk(chunk)
      } catch (error) {
        if (isInit) {
          throw error
        }
      }
    }
  }

  private handleUploadFilePercentage() {
    if (!this._allChunkList.length) return
    const loaded = this._allChunkList.map((item) => item?.chunkUploadSize || 0).reduce((acc, cur) => acc + cur)
    const filePercentage = parseInt((loaded / this._file.size).toFixed(2))
    console.log(
      `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
      'filePercentage: ',
      filePercentage,
    )
    this.changeUploadItemFileData({
      uploadProgress: filePercentage,
    })
    this._onProgress?.(filePercentage, this)
  }

  protected handleUploadFileErr(errorData?: { code: string | number; msg?: string; file?: File }) {
    const obj: any = {
      isErr: true,
    }
    if (errorData) {
      obj.errorData = errorData
    }
    console.error(
      `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
      'handleUploadFileErr------------',
      this._file?.name,
      obj,
    )
    this.changeUploadItemFileData(obj)
    this.abortRequestList()
    this._onError?.(errorData, this)

    if (this._errorCheckFn && !this._errorCheckFn?.({ ...errorData, key: this._key })) {
      this.cancel()
    }
  }

  private async handleUploadFileComplete() {
    diminishFileUploadThread()
    try {
      await sendUploadComplete({
        businessType: this._businessType as UploadBusinessType,
        fileKey: this._fileKey,
      })

      this.revokeObjectURL(this.queryCurrentUploadItemFileData()?.fileUrl)
      this.changeUploadItemFileData({
        file: null,
        fileSize: 0,
        fileType: this._fileType,
        fileUrl: this._previewUrl ?? '',
        uploadProgress: 100,
        isFinish: true,
        isStop: false,
        isErr: false,
        errorData: null,
      })
      console.log(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'handleUploadFileComplete run',
        this._file?.name,
      )
      this._onCompleted?.(cloneDeep(this.queryCurrentUploadItemFileData()), this)
    } catch (error: any) {
      console.error(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'sendUploadComplete error: ',
        error,
      )
      this.handleUploadFileErr({
        code: UploadErrorCodeMap.apiErr.code,
      })

      hbSendLog({
        message: 'x upload: MultipartUploader handleUploadFileComplete catch',
        status: 'error',
        data: {
          userId: this._userId,
          subId: this._subId,
          businessType: this._businessType,
          key: this._key,
          hash: this._hash,
          fileKey: this._fileKey,
          file: {
            name: this._file?.name,
            size: this._file?.size,
            type: this._file?.type,
          },
        },
        error,
      })
    }
  }

  private checkAllCheckComplete() {
    if (!this._allChunkList.length) return
    return this._allChunkList.every((item) => item.chunkUploadcomplete)
  }

  private abortRequestList() {
    if (!this._requestList.length) return
    this._requestList.forEach((item) => {
      item.abort()
    })
    this._requestList = []
  }

  private revokeObjectURL(url: any) {
    try {
      const _URL = window.URL || window.webkitURL
      _URL.revokeObjectURL(url)
    } catch (error) {
      console.log(
        `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
        'revokeObjectURL error: ',
        error,
      )
    }
  }

  public stop() {
    diminishFileUploadThread()
    this.changeUploadItemFileData({
      isStop: true,
    })
    this.abortRequestList()
  }

  public cancel() {
    const { isErr, isStop, isFinish } = this.queryCurrentUploadItemFileData() || {}
    if (!isErr && !isStop && !isFinish) {
      diminishFileUploadThread()
    }

    // 不再使用本地文件地址时，记得释放这部分内存
    this.revokeObjectURL(this.queryCurrentUploadItemFileData()?.fileUrl)
    this.revokeObjectURL(this.queryCurrentUploadItemFileData()?.thumbnailUrl)
    this.abortRequestList()
    this.removeUploadItemFileData()
  }

  public async retry() {
    if (!this.initRule()) return
    try {
      const { isFinish } = this.queryCurrentUploadItemFileData() || {}
      if (isFinish) {
        return
      }

      this._inStart = true

      this.changeUploadItemFileData({
        isStop: false,
        isErr: false,
        errorData: null,
      })

      if (!this._hash) {
        const hash = await this.calculateHash()
        if (!hash) {
          this.handleUploadFileErr({
            code: UploadErrorCodeMap.hashErr.code,
          })
          console.error(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'hash is null', hash)
          return
        }
        this._hash = hash as string
      }

      const isExist = await this.checkFileIsExist()
      if (isExist) {
        return
      }

      await this.initAllChunkList()

      const res = await queryUploadedParts({
        businessType: this._businessType as UploadBusinessType,
        fileKey: this._fileKey,
      }).catch((error) => {
        console.error(
          `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
          'queryUploadedParts error: ',
          error,
        )
        return null
      })
      this._allChunkList = this._allChunkList.map((item) => {
        if (res?.includes?.(item.partNumber)) {
          item.chunkUploadcomplete = true
          item.chunkUploadSize = this._fileSegmentSize
        }
        item.chunkUploadStart = false
        item.chunkUploadErr = false
        return item
      })
      this._startEnd = true
      const result = await this.uploadTheCurrentRemaining()
      if (result === false) {
        console.error(
          `${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`,
          'uploadTheCurrentRemaining is false',
        )
        throw result
      }
    } catch (error: any) {
      console.error(`${this._file?.name}---${this._key}---${this._hash}---${this._fileKey}`, 'retry error: ', error)
      this.handleUploadFileErr()

      hbSendLog({
        message: 'x upload: MultipartUploader retry catch',
        status: 'error',
        data: {
          userId: this._userId,
          subId: this._subId,
          businessType: this._businessType,
          key: this._key,
          hash: this._hash,
          fileKey: this._fileKey,
          file: {
            name: this._file?.name,
            size: this._file?.size,
            type: this._file?.type,
          },
        },
        error,
      })
    }
  }
}
