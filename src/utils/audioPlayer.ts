/**
 * 音频播放工具类
 */
class AudioPlayer {
  private static instance: AudioPlayer
  private audio: HTMLAudioElement | null = null
  private audioContext: AudioContext | null = null
  private audioUrl: string | null = null
  private isInitialized: boolean = false
  private audioSource: MediaElementAudioSourceNode | null = null
  private isCrossOrigin: boolean = false

  private constructor() {
    // 私有构造函数，确保单例模式
  }

  /**
   * 获取 AudioPlayer 实例
   */
  public static getInstance(): AudioPlayer {
    if (!AudioPlayer.instance) {
      AudioPlayer.instance = new AudioPlayer()
    }
    return AudioPlayer.instance
  }

  /**
   * 检查是否是跨域URL
   */
  private isCrossOriginUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return urlObj.origin !== window.location.origin
    } catch {
      return false
    }
  }

  /**
   * 初始化音频系统
   * 必须在用户交互时调用此方法（如点击按钮时）
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // 初始化 AudioContext
      if (typeof window !== 'undefined' && window.AudioContext) {
        this.audioContext = new AudioContext()
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume()
        }
      }
      this.isInitialized = true
    } catch (error) {
      console.error('初始化音频系统失败:', error)
      throw error
    }
  }

  /**
   * 预加载音频文件
   * @param audioUrl 音频文件的 URL
   */
  public preloadAudio(audioUrl: string): void {
    // 检查是否是跨域URL
    this.isCrossOrigin = this.isCrossOriginUrl(audioUrl)

    // 清理之前的连接
    if (this.audioSource) {
      this.audioSource.disconnect()
      this.audioSource = null
    }

    if (this.audioUrl === audioUrl && this.audio) {
      return // 如果是同一个音频文件且已经加载，则不需要重新加载
    }

    this.audioUrl = audioUrl
    this.audio = new Audio()

    // 只有非跨域资源才设置 crossOrigin
    if (!this.isCrossOrigin) {
      this.audio.crossOrigin = 'anonymous'
    }

    this.audio.preload = 'auto' // 预加载音频
    this.audio.autoplay = false

    // 设置音频源
    this.audio.src = audioUrl
    this.audio.load()

    // 只有非跨域资源才使用 AudioContext
    if (!this.isCrossOrigin && this.audioContext && this.audio) {
      this.audioSource = this.audioContext.createMediaElementSource(this.audio)
      this.audioSource.connect(this.audioContext.destination)
    }
  }

  /**
   * 播放音频
   * @param audioUrl 音频文件的 URL（可选，如果已经预加载则不需要）
   */
  public async playAudio(audioUrl?: string): Promise<void> {
    try {
      // 检查是否已初始化
      if (!this.isInitialized) {
        console.warn('音频系统未初始化，请先调用 initialize() 方法')
        return
      }

      // 如果提供了新的 URL 或者还没有加载音频，则进行加载
      if (audioUrl && (this.audioUrl !== audioUrl || !this.audio)) {
        this.preloadAudio(audioUrl)
      }

      if (!this.audio) {
        console.warn('没有可播放的音频')
        return
      }

      // 如果当前正在播放，先重置
      if (!this.audio.paused) {
        this.audio.pause()
        this.audio.currentTime = 0
      }

      // 播放音频
      try {
        await this.audio.play()
      } catch (error) {
        if (error instanceof Error) {
          console.error('播放音频失败:', error.message)
        }
        // 如果是自动播放失败，将音频设置为静音后重试
        this.audio.muted = true
        await this.audio.play()
        this.audio.muted = false
      }
    } catch (error) {
      console.error('音频播放过程中发生错误:', error)
    }
  }

  /**
   * 停止播放音频
   */
  public stopAudio(): void {
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
    }
  }

  /**
   * 清理资源
   */
  public dispose(): void {
    if (this.audioSource) {
      this.audioSource.disconnect()
      this.audioSource = null
    }
    if (this.audio) {
      this.audio.pause()
      this.audio.src = ''
      this.audio = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.audioUrl = null
    this.isInitialized = false
  }
}

export default AudioPlayer

export const handlePlayAudio = (audioUrl: string) => {
  const audioPlayer = AudioPlayer.getInstance()
  audioPlayer.preloadAudio(audioUrl)
  audioPlayer.playAudio()
}
