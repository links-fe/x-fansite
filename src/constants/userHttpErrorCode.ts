export const CheckEmailRegisterStatusErrorMsg = {
  // 邮箱格式不正确
  100007: 'Incorrect mailbox format',
  // 该域名不可用
  100021: 'This domain is not available',
}

export const PostLoginByVerifyCodeErrorMsg = {
  // 验证码错误或者失效
  100006: 'Captcha is wrong or invalid',
  // 邮箱格式不正确
  100007: 'Incorrect mailbox format',
  // 该账户并发登录
  100013: 'Concurrent logins for this account',
}

export enum PostLoginByEmailErrorCode {
  //email和password不能为空
  emailOrPasswordEmpty = 100003,
  // 参数错误
  parameterError = 100008,
  // 该email未注册
  thisEmailIsNotRegistered = 100001,
  // email或者密码错误
  emailOrPasswordErr = 100002,
  // 同一个账号并发登录
  concurrentLoginsWithTheSameAccount = 100013,
  // v2 Google Recaptcha 不通过
  V2RecaptchaError = 100015,
  // v3 Google Recaptcha 不通过
  V3RecaptchaError = 100014,
}
export const PostLoginByEmailErrorMsg = {
  [PostLoginByEmailErrorCode.V2RecaptchaError]: 'There was a problem verifying you’re a human.',
  [PostLoginByEmailErrorCode.emailOrPasswordEmpty]: 'Email and password cannot be empty.',
  [PostLoginByEmailErrorCode.thisEmailIsNotRegistered]: 'This email is not registered.',
  [PostLoginByEmailErrorCode.emailOrPasswordErr]: 'That email and password combination is incorrect.',
  [PostLoginByEmailErrorCode.concurrentLoginsWithTheSameAccount]: 'Concurrent logins for this account.',
}

export const PostForgotPasswordEmailErrorMsg = {
  // 邮箱格式错误
  100007: 'Email format error',
  // 参数错误
  // 100008: 'Parameter error',
  // 邮件发送频繁
  100009: 'Email sending too frequent',
  // 该email未注册
  100001: 'This email is not registered',
  // 邮件服务不可用
  // 400001: 'Mail service is not available',
  // 当天邮件超过最大限制
  // 400002: 'Emails on the same day exceeded the maximum limit',
  // 单人当天邮件超过最大限制
  // 400003: 'Emails on the same day exceeded the maximum limit for a single user',
  // 邮件类型不存在
  // 400004: 'XBE_EMAIL_TYPE_NOT_EXIST',
  // 邮件类型不可用
  // 400005: 'Email type is not available',
  // 邮件类型超过最大限制
  // 400006: 'Emails of the same type on the same day exceeded the maximum limit',
  // 单人当天邮件类型超过最大限制
  // 400007: 'Emails of the same type on the same day exceeded the maximum limit for a single user',
}

export const PostSetPasswordErrorMsg = {
  // 密码过长
  100004: 'too long a password',
}

export const PostResetPasswordErrorMsg = {
  // 当前已经登陆其他账户，需要退出
  100017: 'You are currently logged in to another account, please exit first.',
  // 密码格式不正确
  100004: 'Incorrect password format',
  // 修改密码链接错误或者已失效
  100005: 'The modification password link is incorrect or has expired',
  // 该email未注册
  100001: 'This email is not registered',
  // 和旧密码相同
  100025: 'Same as the old password',
}

export const PostSendRegisterCodeEmailErrorMsg = {
  // 邮箱格式错误
  100007: 'Email format error',
  // 参数错误
  //   100008: 'Parameter error',
  // 邮件发送频繁
  100009: 'Email sending too frequent',
  // 邮件服务不可用
  //   400001: 'Mail service is not available',
  // 当天邮件超过最大限制
  // 400002: 'Emails on the same day exceeded the maximum limit',
  // 单人当天邮件超过最大限制
  // 400003: 'Emails on the same day exceeded the maximum limit for a single user',
  // 邮件类型不存在
  //   400004: 'XBE_EMAIL_TYPE_NOT_EXIST',
  // 邮件类型不可用
  //   400005: 'Email type is not available',
  // 邮件类型超过最大限制
  // 400006: 'Emails of the same type on the same day exceeded the maximum limit',
  // 单人当天邮件类型超过最大限制
  // 400007: 'Emails of the same type on the same day exceeded the maximum limit for a single user',
}

export const PostLoginByGoogleErrorMsg = {
  // 谷歌授权登录失败
  100010: 'There was a problem logging you in with Google.',
  // 该email已被其他账户注册
  100011: 'This email has been registered by other accounts',
  // 该账户并发登录
  100013: 'Concurrent logins for this account',
}
