export type UserIdType = string

export enum EnumLoginMode {
  /** 游客 */
  Guest = 1,
  /** 正常登录 */
  Normal = 2,
}
export enum EnumUserType {
  /** 粉丝 */
  Fan = 1,
  /** 创建者 */
  Creator = 2,
}

export interface IUserInfo {
  // 邮箱
  email: string
  // 登录类型 1游客 2正常登录
  loginMode: EnumLoginMode
  // 昵称
  nickName: string
  sessionId?: string
  // suerid
  userId: UserIdType
  // 用户名
  userName: string
  // 用户类型 1 fans   2 creator
  userType: EnumUserType
  // 是否设置了密码
  hasPassword?: boolean
  // 是否在删除冷静期
  closePending?: boolean
  // 删除冷静期 超时时间
  closeDate?: string
}

// 用户类型枚举 （前端自己合并 枚举维护）
export enum EnumClientUseType {
  /** 游客 */
  Guest = 0,
  /** 粉丝 */
  Fan = EnumUserType.Fan,
  /** 创建者 */
  Creator = EnumUserType.Creator,
}

export enum EnumCheckSource {
  /** 购买素材时登录 */
  BuyMaterial = 1,
  /** 主动登录 */
  ActiveLogin = 2,
  /** 购买素材时用google登录 */
  BuyMaterialGoogleLogin = 3,
  /** 主动登录时用google登录 */
  ActiveLoginGoogleLogin = 4,
}

export enum EnumRegisterStatus {
  /** 未注册 */
  Unregistered = 0,
  /** 已注册未设置密码 */
  RegisteredUnsetPassword = 1,
  /** 已注册已设置密码 */
  RegisteredSetPassword = 2,
}
