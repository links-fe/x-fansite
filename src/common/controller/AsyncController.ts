export class AsyncController {
  private currentToken: symbol | null = null
  private debugMode: boolean = false

  constructor(options: { debug?: boolean } = {}) {
    this.debugMode = options.debug || false
  }

  createToken(): symbol {
    this.currentToken = Symbol()
    if (this.debugMode) {
      console.log('Created new token:', this.currentToken.toString())
    }
    return this.currentToken
  }

  isValid(token: symbol): boolean {
    const valid = this.currentToken === token
    if (this.debugMode) {
      console.log('Token check:', {
        token: token.toString(),
        currentToken: this.currentToken?.toString(),
        isValid: valid,
      })
    }
    return valid
  }
}
