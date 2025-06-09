const xExceptionSymbol = Symbol('xException')

export class XException {
  [xExceptionSymbol]: boolean = true

  code: string

  constructor(code: string) {
    this.code = code
  }

  // TODO: 重试
  retry() {}

  /** 验证是否是XException */
  static isXException(e: unknown) {
    return (e as XException)?.[xExceptionSymbol] === true
  }
}
