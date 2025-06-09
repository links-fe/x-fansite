export const UploadBusinessTypeMap = {
  USERSETTING: 'userSetting',
  CHATVAULT: 'chatVault',
}
export type UploadBusinessType = (typeof UploadBusinessTypeMap)[keyof typeof UploadBusinessTypeMap]

export const UploadErrorCodeMap = {
  parameterError: {
    // 参数错误
    code: 1001,
  },
  notSupportedFileType: {
    // 不支持的文件类型
    code: 1002,
  },
  imgSizeMax: {
    // 图片大小超出限制 50M
    code: 1003,
  },
  videoSizeMax: {
    // 视频大小超出限制 500M
    code: 1004,
  },
  noUserId: {
    // 无userid
    code: 1005,
  },
  abnormalUser: {
    // 无权限的用户 - 游客
    code: 1006,
  },

  apiErr: {
    // 接口错误
    code: 1007,
  },
  hashErr: {
    // 生成上传文件hash值错误
    code: 1008,
  },
  awsApiErr: {
    // aws接口错误
    code: 1009,
  },
  exceedingNumLimit: {
    // 超出数量限制 (图片视频12个 音频1个)
    code: 1010,
  },
  emptyFile: {
    // 空文件 file.size为0
    code: 1011,
  },
}

export const gifTypes = ['.gif', 'image/gif']
// 图片类型数组
export const imageTypes = [...gifTypes, '.jpeg', '.jpg', '.png', 'image/jpeg', 'image/jpg', 'image/png']

// 视频类型数组
export const videoTypes = ['.mp4', 'video/mp4', 'application/mp4', 'audio/mp4']

// 音频类型数组 (目前只有聊天录音文件)
export const audioTypes = [
  '.wav',
  '.WAV',
  'audio/wav',
  'audio/WAV',
  'audio/x-wav',
  'audio/x-WAV',
  'audio/webm',
  '.webm',
  'audio/mp3',
  '.mp3',
]

export const allFileTypes = [...imageTypes, ...videoTypes, ...audioTypes]

export const imageMaxSize = 50 * 1024 * 1024 // 50M
export const videoMaxSize = 500 * 1024 * 1024 // 500M

export const chatInputTypes = [...imageTypes, ...videoTypes].join(',')
export const myProfileUploadTypes = [...imageTypes].join(',')
export const chatReportUploadTypes = [...imageTypes].join(',')
export enum uploadSceneEnum {
  // 聊天框工具
  chatTool = 1,
  // 聊天语音
  chatVoice = 2,
  // 聊天举报
  chatReport = 3,
  // 聊天头像
  userSettingAvatar = 4,
  // 聊天封面
  userSettingCover = 5,
}
export type UploadSceneValue = (typeof uploadSceneEnum)[keyof typeof uploadSceneEnum]
