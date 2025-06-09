import { request } from '@/common/request'
import { UploadBusinessType } from '@/constants/upload'
interface IQueryUploadUrlParams {
  businessType: string
  fileType: string
  fileMd5: string
  fileSize: number
}
interface IQueryUploadUrlRes {
  uploadUrlArray: { uploadUrl: string; partNumber: number }[]
  fileKey: string
  previewUrl: string
  fileSegmentSize: number
}
export async function queryUploadUrl(params: IQueryUploadUrlParams): Promise<IQueryUploadUrlRes> {
  const res: IQueryUploadUrlRes = await request.get('/api/fc/uploadUrl', {
    params,
  })
  console.log('queryUploadUrl', res)
  return res
}

interface ISendUploadCompleteParams {
  businessType: UploadBusinessType
  fileKey: string
}
export async function sendUploadComplete(params: ISendUploadCompleteParams) {
  const res: IQueryUploadUrlRes = await request.get('/api/fc/complete', {
    params,
  })
  console.log('sendUploadComplete', res)
  return res
}

interface IQueryFileIsExistParams {
  businessType: UploadBusinessType
  fileMd5: string
}
interface IQueryUploadUrlRes {
  userId: number
  businessType: string
  fileKey: string
  fileType: number
  fileMd5: string
  fileSize: number
  isExist: boolean
  duration: number
  previewUrl: string
}
export const queryFileIsExist = async (params: IQueryFileIsExistParams): Promise<IQueryUploadUrlRes> => {
  const res: IQueryUploadUrlRes = await request.get('/api/fc/checkFile', {
    params,
  })
  console.log('queryFileIsExist', res)
  return res
}

interface IQueryUploadedPartsParams {
  businessType: UploadBusinessType
  fileKey: string
}
export const queryUploadedParts = async (params: IQueryUploadedPartsParams): Promise<number[]> => {
  const res: number[] = await request.get('/api/fc/uploadedParts', {
    params,
  })
  console.log('queryUploadedParts', res)
  return res
}
