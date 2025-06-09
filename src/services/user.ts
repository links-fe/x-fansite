import { request } from '@/common/request'
import { initMeInfo } from '@/models'
import { EnumCheckSource, EnumRegisterStatus, IUserInfo } from '@/types'

interface IpostLogoutOtherSessionRes {
  success: boolean
}
export async function postLogoutOtherSession(): Promise<IpostLogoutOtherSessionRes> {
  const res: IpostLogoutOtherSessionRes = await request.post('/api/account/logoutOtherSession')
  console.log('postLogoutOtherSession res: ', res)
  return res
}

export async function queryMe(): Promise<IUserInfo> {
  const res: IUserInfo = await request.post('/api/account/me')
  console.log('queryMe res: ', res)
  return res
}

interface ICheckEmailRegisterStatusParams {
  // 邮箱
  email: string
  // 1，购买素材时登录， 2主动登录
  // checkSource: EnumCheckSource
}
interface ICheckEmailRegisterStatusRes {
  // 0未注册，1已注册未设置密码 2已注册已设置密码
  registerStatus: EnumRegisterStatus
}
export async function checkEmailRegisterStatus(
  data: ICheckEmailRegisterStatusParams,
): Promise<ICheckEmailRegisterStatusRes> {
  const res: ICheckEmailRegisterStatusRes = await request.post('/api/account/checkEmailRegister', data)
  console.log('checkEmailRegisterStatus res: ', res)
  return res
}

interface ILoginByVerifyCodeData {
  // 邮箱
  email: string
  // 验证码
  verifyCode: string
}

export async function postLoginByVerifyCode(data: ILoginByVerifyCodeData): Promise<IUserInfo> {
  const res: IUserInfo = await request.post('/api/account/loginByVerifyCode', data)
  console.log('postLoginByVerifyCode res: ', res)
  return res
}

export interface IRegisterByVerifyCodeData {
  recaptchaV3Token?: string
  recaptchaV2Token?: string
  email?: string
  password?: string
}

export async function postLoginByEmail(data: IRegisterByVerifyCodeData): Promise<IUserInfo> {
  const res: IUserInfo = await request.post('/api/account/loginByEmail', data)
  console.log('postLoginByEmail res: ', res)
  return res
}

interface IForgotPasswordEmail {
  toEmail: string
  forgotPasswordUrl: string
}
interface IForgotPasswordEmailRes {
  success: boolean
}
export const postForgotPasswordEmail = async (data: IForgotPasswordEmail): Promise<IForgotPasswordEmailRes> => {
  const res: IForgotPasswordEmailRes = await request.post('/api/account/forgotPasswordEmail', data)
  console.log('postForgotPasswordEmail res:', res)
  return res
}

interface ISetPasswordData {
  password: string
}
interface ISetPasswordRes {
  success: boolean
}
export const postSetPassword = async (data: ISetPasswordData): Promise<ISetPasswordRes> => {
  const res: ISetPasswordRes = await request.post('/api/account/setPassword', data)
  console.log('postResetPassword res:', res)
  return res
}

interface IResetPasswordData {
  ticket: string
  password: string
  email: string
}
interface IResetPasswordRes {
  success: boolean
}
export const postResetPassword = async (data: IResetPasswordData): Promise<IResetPasswordRes> => {
  const res: IResetPasswordRes = await request.post('/api/account/resetPassword', data)
  console.log('postResetPassword res:', res)
  return res
}

interface ISendRegisterCodeEmailData {
  toEmail: string
  // 1，购买素材时登录， 2主动登录
  checkSource: EnumCheckSource
}
export const postSendRegisterCodeEmail = async (data: ISendRegisterCodeEmailData) => {
  const res: { success: boolean } = await request.post('/api/account/sendRegisterCodeEmail', data)
  console.log('postSendRegisterCodeEmail res:', res)
  return res
}

interface ILoginByGoogleData {
  googleCode: string
  registerSource: EnumCheckSource
  redirectUrl: string
}
export const postLoginByGoogle = async (data: ILoginByGoogleData): Promise<IUserInfo> => {
  const res: IUserInfo = await request.post('/api/account/loginByGoogle', data)
  console.log('postLoginByGoogle res:', res)
  return res
}

interface ILogoutRes {
  success: boolean
}
export const postLogout = async (): Promise<ILogoutRes> => {
  const res: ILogoutRes = await request.post('/api/account/logout')
  console.log('postLogout res:', res)
  if (res?.success) {
    // await initMeInfo()
    location.reload()
  }
  return res
}
