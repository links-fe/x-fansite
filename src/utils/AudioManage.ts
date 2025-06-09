// 全局的音频管理类

class AudioManager {
  private static instance: AudioManager
  private currentAudio: HTMLAudioElement | null = null

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  public play(audio: HTMLAudioElement) {
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause()
    }
    this.currentAudio = audio
    // audio.play()
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio = null
    }
  }
}

export const audioManager = AudioManager.getInstance()
