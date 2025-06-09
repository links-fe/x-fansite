import { gzip, ungzip } from 'pako'

export function Uint8ArrayToString(fileData: Uint8Array) {
  let dataString = ''
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i])
  }

  return dataString
}

export function stringToUint8Array(str: string) {
  const arr = []
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i))
  }

  const tmpUint8Array = new Uint8Array(arr)
  return tmpUint8Array
}

/**
 * 解压string
 * @param origin
 * @returns
 */
// export function unzipString(origin: string) {
//   if (!origin) return Promise.reject('[unzipString()] should a param')
//   if (typeof origin !== 'string') return Promise.reject('[unzipString()] param should be a string')

//   // TODO: 验证
//   return unzipSync(strToU8(origin))
// }

export function ungzipBase64(base64: string) {
  const origin = window.atob(base64)
  const uint8Array = stringToUint8Array(origin)
  return ungzip(uint8Array, { to: 'string' })
}

export function ungzipString(origin: string) {
  const uint8Array = stringToUint8Array(origin)
  return ungzip(uint8Array, { to: 'string' })
}

export function gzipString(origin: string) {
  const uint8Array = stringToUint8Array(origin)
  const content = gzip(uint8Array)
  return Uint8ArrayToString(content)
}
