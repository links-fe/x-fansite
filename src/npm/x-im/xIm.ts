import { EnumRTMClientEvent, INimMessage, NimClient } from './nim'
import { Event, randomId } from '@hb-common/utils'
import { XImMessage, XImMessageType } from './types'
import { decryptText } from './common'
export interface XImClientOption {
  services: XImClientServices
}

interface NimTokenConfig {
  appKey: string
  accid: string
  token: string
  iv: string
  key: string
  msgSaltValue: string
  version: string
}
interface XImClientServices {
  queryNimToken: () => Promise<NimTokenConfig>
}

type XImClientEvent = 'new-message' | 'disconnected' | 'error' | 'connected'

export class XImClient {
  private _id: string = randomId()
  private _event: Event<XImClientEvent> = new Event()
  private _option: XImClientOption
  constructor(option: XImClientOption) {
    this._option = option
  }

  private _nimTokenConfig?: NimTokenConfig
  private _nimClient?: NimClient

  private async _queryNimToken(): Promise<NimTokenConfig> {
    const tokenConfig = await this._option.services.queryNimToken().catch((e) => {
      console.error(e)
      if (this._nimTokenConfig) {
        return this._nimTokenConfig
      }
      return Promise.reject(e)
    })
    this._nimTokenConfig = tokenConfig
    return tokenConfig
  }

  async connect() {
    await this._queryNimToken()
    // 连接
    if (this._nimClient) {
      await this._nimClient.destroy().catch(() => {
        console.log('[nim] destroy fail')
      })
    }
    this._nimClient = new NimClient()
    this._listenNimClient()

    const { appKey, accid, token } = this._nimTokenConfig || {}
    if (!appKey || !accid || !token) {
      this._event.emit('error', '[xim] token invalid')
      return
    }
    await this._nimClient.init(appKey, accid, token)
  }

  async disconnect() {
    if (this._nimClient) {
      await this._nimClient.logout().catch(() => {
        console.log('[nim] logout fail')
      })
    }
  }

  throwError(message: string, detail: unknown) {
    console.log(message, detail)
  }

  onMessage(callback: (message: XImMessage) => void) {
    this._event.on(this._id, 'new-message', callback)
  }

  onError(callback: (error: unknown) => void) {
    this._event.on(this._id, 'error', callback)
  }

  private _emitNewMessage(message: XImMessage) {
    this._event.emit('new-message', message)
  }

  private _parseNimMessage(data: INimMessage) {
    // * 为了缓解消息太频繁，解密解json太耗性能的问题，要求后端在外层加两个字段
    try {
      if (data.custom && typeof data.custom === 'string') {
        const custom = JSON.parse(data.custom)

        if (custom?.creatorId && custom?.type) {
          const shouldDeal = [XImMessageType.Chat].includes(custom.type)

          if (!shouldDeal) {
            console.log('[丢弃消息]', data)
            return
          }
        }
      }
    } catch (error) {
      this.throwError('parse custom failed', { data, error })
    }

    if (!data.text) {
      // * 非正常消息 如新用户进群
      return
    }

    // // 只接收 team 场景的消息
    // if (data.scene !== 'team') {
    //   // * printInfo('08281536')
    //   return
    // }

    let json: any

    try {
      // * 解压缩
      const message = decryptText(data.text, {
        msgKey: this._nimTokenConfig?.key || '',
        msgIv: this._nimTokenConfig?.iv || '',
        msgSaltValue: this._nimTokenConfig?.msgSaltValue || '',
        version: this._nimTokenConfig?.version || '',
      })
      json = JSON.parse(message)
      if (json?.data) {
        try {
          json.data = JSON.parse(json.data)
        } catch (error) {
          this.throwError('parse json.data failed', { json, error })
        }
      }
      if (json?.unreadCount) {
        try {
          json.unreadCount = JSON.parse(json.unreadCount)
        } catch (error) {
          this.throwError('parse json.unreadCount failed', { json, error })
        }
      }
    } catch (error) {
      // * 解密失败
      this.throwError('decrypt text failed', { data, error })
      return
    }

    try {
      if (!json.data) {
        this.throwError('im message empty', { json })
        return
      }

      // console.log('json', json)
      this._emitNewMessage(json)
    } catch (error) {
      this.throwError('parse json failed', { json, error })
    }
  }

  private _listenNimClient() {
    const wsClient = this._nimClient
    if (!wsClient) {
      return
    }

    wsClient.on('app', EnumRTMClientEvent.NewChannelMessage, async (data) => {
      this._parseNimMessage(data)
    })

    /** 当前准备重连中 */
    wsClient.on('app', EnumRTMClientEvent.WillReconnect, async (obj) => {
      this.throwError('WillReconnect', obj)
    })

    wsClient.on('app', EnumRTMClientEvent.Disconnected, async (errCode) => {
      this.throwError('[nim] Disconnected', {
        provide: 'nim',
        instanceId: wsClient.getInstanceId(),
        type: '[nim] Disconnected',
        errCode,
      })
    })

    wsClient.on('app', EnumRTMClientEvent.Error, async (err) => {
      this.throwError('[nim] Error', {
        provide: 'nim',
        instanceId: wsClient.getInstanceId(),
        type: '[nim] Error',
        detail: err,
      })
    })

    wsClient.on('app', EnumRTMClientEvent.Connected, async () => {
      this._event.emit('connected')
    })
  }
}
