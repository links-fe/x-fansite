'use client'
import { gzipString, ungzipString } from './utils'
import { NimClient } from './nim'

export interface ImDecryptConfig {
  msgKey: string
  msgIv: string
  msgSaltValue: string
  version: string
}

export const state = {
  /** 禁用离线消息 */
  enableOffline: false,
  msgKey: '',
  msgIv: '',
  msgSaltValue: '',
  version: '',
}

// 禁用离线消息
export function disableOfflineMessage() {
  state.enableOffline = false
}

// 开启离线消息
export function enableOfflineMessage() {
  state.enableOffline = true
}

/** 加密文本 */
export function encryptText(text: string) {
  const gzipText = gzipString(text)
  const base64 = window.btoa(gzipText)

  return `${state.msgSaltValue}${base64}${state.version}`
}

export function setImDecryptConfig(config: ImDecryptConfig) {
  Object.assign(state, config)
}

/** 解密文本 */
export function decryptText(base64: string, config?: ImDecryptConfig) {
  const _state = {
    ...state,
    ...config,
  }

  const reg1 = new RegExp(`^${_state.msgSaltValue}`)
  const reg2 = new RegExp(`${_state.version}$`)

  const base64Str = base64.replace(reg1, '').replace(reg2, '')
  const origin = window.atob(base64Str)

  const text = ungzipString(origin)

  return text
}

export const wsClient = new NimClient()
