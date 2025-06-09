'use client'
import React, { useMemo, useRef, useState } from 'react'
import { Input, Password, Switch } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import TermsAndConditionsDrawer from '@/components/LoginRegister/RegisterLoginCommon/TermsAndConditionsDrawer'
import PrivacyPolicyDrawer from '@/components/LoginRegister/RegisterLoginCommon/PrivacyPolicyDrawer'
import EmailVerificationCodeDrawer from '@/components/EmailVerificationCodeDrawer'
import ForgotPassword from '@/components/LoginRegister/ForgotPassword'

import {
  checkEmailRegisterStatus,
  IRegisterByVerifyCodeData,
  postLoginByEmail,
  postLoginByGoogle,
  postSendRegisterCodeEmail,
} from '@/services/user'
import { ON_APP_EVENT_LOGIN_SUCCESS } from '@/models/user'
import { classMerge, delay, runValidEmail } from '@/utils'
import { EnumCheckSource, EnumRegisterStatus } from '@/types'

import XGoogleRecaptcha from '@/npm/x-google-recaptcha/XGoogleRecaptcha'
import { useGoogleAuthLogin } from '@/npm/x-google-auth-login'
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_SCOPE } from '@/constants'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { useUpdate } from 'ahooks'
import XButton from '@/components/XButton'
import {
  CheckEmailRegisterStatusErrorMsg,
  PostLoginByEmailErrorCode,
  PostLoginByEmailErrorMsg,
  PostLoginByGoogleErrorMsg,
  PostSendRegisterCodeEmailErrorMsg,
} from '@/constants/userHttpErrorCode'
import { hbSendLog } from '@/utils/datadog'

const actionType = 'auth/login'
interface Iprops {
  checkSource: EnumCheckSource
  renderTopText?: (showPassWord: boolean) => React.ReactNode
  onSucess?: (res?: any) => void
  onFail?: (error?: any) => void
}
const RegisterLogin = ({ checkSource, renderTopText, onSucess, onFail }: Iprops) => {
  const update = useUpdate()
  const { googleLoginBtnLoading, googleLogin } = useGoogleAuthLogin({
    googleClientId: GOOGLE_CLIENT_ID,
    googleRedirectPath: GOOGLE_REDIRECT_URI,
    googleAuthScope: GOOGLE_SCOPE,
    onSuccess: async (data) => {
      console.log('googleAuthLogin data: ', data)
      let registerSource = EnumCheckSource.ActiveLoginGoogleLogin
      if (checkSource === EnumCheckSource.BuyMaterial) {
        registerSource = EnumCheckSource.BuyMaterialGoogleLogin
      } else if (checkSource === EnumCheckSource.ActiveLogin) {
        registerSource = EnumCheckSource.ActiveLoginGoogleLogin
      }
      try {
        const res = await postLoginByGoogle({
          googleCode: data?.code,
          registerSource,
          redirectUrl: window.location.origin + GOOGLE_REDIRECT_URI,
        })
        if (!res?.userId) {
          throw res
        }
        // 登录成功
        ON_APP_EVENT_LOGIN_SUCCESS()
        onSucess?.(res)
      } catch (error: any) {
        console.error('postLoginByGoogle error: ', error)
        onFail?.(error)
        //@ts-expect-error 忽略类型错误
        const msg = PostLoginByGoogleErrorMsg[error?.code]
        showCommonErrorDrawer({
          contentTxt: msg || 'There was a problem logging you in with Google.',
        })
        hbSendLog({
          message: 'Login Registration google-login postLoginByGoogle error',
          status: 'error',
          data: {
            googleCode: data?.code,
            registerSource,
            redirectUrl: window.location.origin + GOOGLE_REDIRECT_URI,
            googleClientId: GOOGLE_CLIENT_ID,
            googleRedirectPath: GOOGLE_REDIRECT_URI,
            googleAuthScope: GOOGLE_SCOPE,
          },
          error,
        })
      }
    },
    onError: (error) => {
      console.error('googleAuthLogin error: ', error)
      onFail?.(error)
      showCommonErrorDrawer({
        contentTxt: 'There was a problem logging you in with Google.',
      })
      hbSendLog({
        message: 'Login Registration google-login onError error',
        status: 'error',
        data: {
          googleClientId: GOOGLE_CLIENT_ID,
          googleRedirectPath: GOOGLE_REDIRECT_URI,
          googleAuthScope: GOOGLE_SCOPE,
        },
        error,
      })
    },
  })

  // 定义邮箱和密码的状态
  const [email, setEmail] = useState('')
  const [emailErrMsg, setEmailErrMsg] = useState<string>('')
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setEmail(inputValue)
  }
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const curVal = e.target?.value
    console.log('handleEmailBlur curVal: ', curVal)
    if (curVal?.length < 1) {
      // empty
      setEmailErrMsg('Email is required')
    } else if (!runValidEmail(curVal)) {
      setEmailErrMsg('Please enter a valid email address')
    }
  }
  const handleEmailFocus = () => {
    setEmailErrMsg('')
  }

  const [showPassWord, setShowPassWord] = useState<boolean>(false)
  const [password, setPassword] = useState('')
  const [passwordErrMsg, setPasswordErrMsg] = useState<string>('')
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const curVal = e.target?.value
    setPassword(curVal)
  }
  const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const curVal = e.target?.value
    console.log('handlePasswordBlur curVal: ', curVal)
    if (runValidEmail(email) && curVal?.length < 1) {
      // empty
      setPasswordErrMsg('Password is required')
    }
  }
  const handlePasswordFocus = () => {
    setPasswordErrMsg('')
  }

  const [showTermsAndConditionsDrawer, setShowTermsAndConditionsDialog] = useState<boolean>(false)
  const changeShowTermsAndConditionsDrawer = () => {
    setShowTermsAndConditionsDialog((v) => !v)
  }

  const [showPrivacyPolicyDrawer, setShowPrivacyPolicyDialog] = useState<boolean>(false)
  const changeShowPrivacyPolicyDrawer = () => {
    setShowPrivacyPolicyDialog((v) => !v)
  }

  const [dealSwitchChecked, setDealSwitchChecked] = useState<boolean>(true)
  const handleSwitchChange = () => {
    setDealSwitchChecked((prev) => {
      const newVal = !prev
      return newVal
    })
  }

  const submitLoading = useRef<boolean>(false)
  const updateSumitLoading = (val: boolean) => {
    submitLoading.current = val
    update()
  }

  const submitDisable = useMemo(() => {
    const isEmailErr = !runValidEmail(email)
    const isDealSwitchCheckedErr = !dealSwitchChecked
    const isPasswordEmpty = showPassWord && password?.length < 1
    return isEmailErr || isDealSwitchCheckedErr || isPasswordEmpty || googleLoginBtnLoading
  }, [email, dealSwitchChecked, showPassWord, password, googleLoginBtnLoading])

  const [showGoogleRecaptcha, setShowGoogleRecaptcha] = useState<boolean>(true)
  const reloadGoogleRecaptcha = async () => {
    setShowGoogleRecaptcha(false)
    await delay(100)
    setShowGoogleRecaptcha(true)
  }
  const [v3RecaptchaToken, setV3RecaptchaToken] = useState<string>('')
  const changeV3RecaptchaToken = (token: string) => {
    setV3RecaptchaToken(token)
  }
  const [showV2Recaptcha, setShowV2Recaptcha] = useState<boolean>(false)
  const changeShowV2Recaptcha = (v: boolean) => {
    setShowV2Recaptcha(v)
  }

  const handleLoginByEmail = async (recaptchaV2Token?: string) => {
    // 邮箱密码登录流程
    console.log('Email password:', email?.trim?.(), 'Password:', password)
    if (submitDisable) {
      updateSumitLoading(false)
      return
    }
    const data: IRegisterByVerifyCodeData = {
      email: email?.trim?.(),
      password,
    }
    if (recaptchaV2Token) {
      data.recaptchaV2Token = recaptchaV2Token
    } else {
      data.recaptchaV3Token = v3RecaptchaToken
    }
    try {
      const res = await postLoginByEmail(data)
      if (!res?.userId) {
        throw res
      }
      // 登录成功
      ON_APP_EVENT_LOGIN_SUCCESS()
      onSucess?.(res)
      updateSumitLoading(false)
    } catch (error: any) {
      console.error('postLoginByEmail error: ', error)
      hbSendLog({
        message: 'Login Registration postLoginByEmail error',
        status: 'error',
        data: {
          ...data,
          // 密码敏感 不真实上报
          password: '***',
        },
        error,
      })
      //@ts-expect-error 忽略类型错误
      const msg = PostLoginByEmailErrorMsg[error?.code]
      if (error?.code === PostLoginByEmailErrorCode.V3RecaptchaError) {
        // v3不通过
        changeShowV2Recaptcha(true)
        onFail?.(error)
        return
      }
      if (msg) {
        setEmailErrMsg(msg)
        setPasswordErrMsg(msg)
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem communicating with X servers.',
        })
      }
      updateSumitLoading(false)
      onFail?.(error)
    } finally {
      reloadGoogleRecaptcha()
    }
  }

  const handleSendEmailCode = async () => {
    try {
      const res = await postSendRegisterCodeEmail({
        toEmail: email?.trim?.(),
        checkSource,
      })
      if (!res?.success) {
        throw res
      }
      if (!showEmailVerificationCodeDialog) {
        changeShowEmailVerificationCodeDialog()
      }
    } catch (error: any) {
      console.error('postSendRegisterCodeEmail error: ', error)
      //@ts-expect-error 忽略类型错误
      const msg = PostSendRegisterCodeEmailErrorMsg[error?.code]
      showCommonErrorDrawer({
        contentTxt: msg || 'There was a problem communicating with X servers.',
      })
      hbSendLog({
        message: 'Login Registration postSendRegisterCodeEmail error',
        status: 'error',
        data: {
          toEmail: email?.trim?.(),
          checkSource,
        },
        error,
      })
    }
  }

  // 处理表单提交的函数
  const handleSubmit = async () => {
    if (submitDisable) {
      updateSumitLoading(false)
      return
    }
    if (submitLoading.current) return
    updateSumitLoading(true)
    if (!showPassWord) {
      try {
        // 检查邮箱是否注册过
        const res = await checkEmailRegisterStatus({
          email: email?.trim?.(),
          // checkSource,
        })
        if (!res?.hasOwnProperty?.('registerStatus')) {
          throw res
        }
        if (
          [EnumRegisterStatus.Unregistered, EnumRegisterStatus.RegisteredUnsetPassword].includes(res?.registerStatus)
        ) {
          // 未注册过 or 已注册未设置密码 打开邮箱验证流程
          await handleSendEmailCode()
        } else {
          // 已注册已设置密码
          setShowPassWord(true)
        }
      } catch (error: any) {
        console.error('checkEmailRegisterStatus error: ', error)
        //@ts-expect-error 忽略类型错误
        const msg = CheckEmailRegisterStatusErrorMsg[error?.code]
        if (msg) {
          setEmailErrMsg(msg)
        } else {
          showCommonErrorDrawer({
            contentTxt: 'There was a problem communicating with X servers.',
          })
        }
        hbSendLog({
          message: 'Login Registration checkEmailRegisterStatus error',
          status: 'error',
          data: {
            email: email?.trim?.(),
          },
          error,
        })
      } finally {
        await delay(500)
        updateSumitLoading(false)
      }

      return
    }
    handleLoginByEmail()
  }

  const [showEmailVerificationCodeDialog, setShowEmailVerificationCodeDialog] = useState<boolean>(false)
  const changeShowEmailVerificationCodeDialog = () => {
    setShowEmailVerificationCodeDialog((v) => !v)
  }

  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false)
  const changeShowForgotPassword = () => {
    setShowForgotPassword((v) => !v)
  }
  return (
    <div>
      {renderTopText?.(showPassWord)}
      <XButton
        size="huge"
        className={classMerge(
          'w-full flex  bg-(--surface-level-02-emphasis-00) px-[30px]!',
          !googleLoginBtnLoading && 'justify-start!',
        )}
        onClick={googleLogin}
        // disabled={googleLoginBtnLoading}
        loading={googleLoginBtnLoading}
      >
        <Icon icon="x:LogosGoogleColor" fontSize={20} />
        <span className="text-(--element-emphasis-00) typography-text-body1-strong ml-10">Continue with Google</span>
      </XButton>
      <div className="text-(--element-emphasis-00) typography-text-body1-base my-(--sizing-named-medium) text-center">
        or
      </div>
      <div>
        <div className="text-(--element-emphasis-00) typography-text-body1-strong mb-(--sizing-named-micro)">
          Email address
        </div>
        <Input
          size="huge"
          type="email"
          placeholder="me@example.com"
          value={email}
          variant={emailErrMsg?.length > 0 ? 'stop' : null}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          onFocus={handleEmailFocus}
        />
        {emailErrMsg?.length > 0 && !passwordErrMsg?.length && (
          <div className="mt-(--sizing-named-micro) text-(--element-signal-stop-emphasis-00) flex items-center">
            <Icon icon="x:AlertCircleStyleStroke" fontSize={16} />
            <span className="ml-(--sizing-named-micro)">{emailErrMsg}</span>
          </div>
        )}
      </div>

      {showPassWord && (
        <div className="mt-(--sizing-named-medium)">
          <div className="text-(--element-emphasis-00) typography-text-body1-strong mb-(--sizing-named-micro)">
            Password
          </div>
          <Password
            size="huge"
            placeholder="Password"
            value={password}
            variant={passwordErrMsg?.length > 0 ? 'stop' : null}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            onFocus={handlePasswordFocus}
          />
          {passwordErrMsg?.length > 0 && (
            <div className="mt-(--sizing-named-micro) text-(--element-signal-stop-emphasis-00) flex items-center">
              <Icon icon="x:AlertCircleStyleStroke" fontSize={16} />
              <span className="ml-(--sizing-named-micro)">{passwordErrMsg}</span>
            </div>
          )}
        </div>
      )}

      {showGoogleRecaptcha && (
        <XGoogleRecaptcha
          className="mt-4 flex items-center justify-center"
          actionType={actionType}
          v3SiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY as string}
          updateV3Token={changeV3RecaptchaToken}
          v2SiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY as string}
          showV2={showV2Recaptcha}
          updateShowV2={changeShowV2Recaptcha}
          V2VerifyFn={handleLoginByEmail}
        ></XGoogleRecaptcha>
      )}

      <div className="flex items-center my-(--sizing-named-medium)">
        <Switch
          className="w-[44px] h-(--sizing-named-moderate)"
          checked={dealSwitchChecked}
          onCheckedChange={handleSwitchChange}
        />

        <div className="typography-text-body1-base text-(--element-emphasis-00) ml-(--sizing-named-small)">
          I agree with the %project x%{' '}
          <span className="underline" onClick={changeShowTermsAndConditionsDrawer}>
            Terms and Conditions
          </span>{' '}
          and{' '}
          <span className="underline" onClick={changeShowPrivacyPolicyDrawer}>
            Privacy Policy
          </span>
        </div>
      </div>

      {!dealSwitchChecked && (
        <div className="flex typography-text-body2-base text-(--element-signal-stop-emphasis-00) mb-(--sizing-named-medium)">
          <Icon
            icon="x:AlertCircleStyleStroke"
            color="currentColor"
            className="w-(--sizing-named-small) h-(--sizing-named-small) text-(--sizing-named-small)"
            fontSize={32}
          />
          <div className="ml-(--sizing-named-micro)">
            You need to agree to the Terms and Conditions and Privacy Policy before you can continue.
          </div>
        </div>
      )}

      {showPassWord && (
        <div className="flex justify-center mb-(--sizing-named-small)">
          <XButton type="button" onClick={changeShowForgotPassword}>
            Forgot password?
          </XButton>
        </div>
      )}

      <XButton
        type="submit"
        disabled={submitDisable}
        loading={submitLoading.current}
        className="w-full h-(--controls-huge-min-height) typography-text-body1-strong text-(--element-reverse-emphasis-00)"
        color="primary"
        onClick={handleSubmit}
      >
        {showPassWord ? 'Login' : 'Continue'}
      </XButton>

      <TermsAndConditionsDrawer visible={showTermsAndConditionsDrawer} close={changeShowTermsAndConditionsDrawer} />
      <PrivacyPolicyDrawer visible={showPrivacyPolicyDrawer} close={changeShowPrivacyPolicyDrawer} />
      <EmailVerificationCodeDrawer
        visible={showEmailVerificationCodeDialog}
        email={email}
        close={changeShowEmailVerificationCodeDialog}
        resendCode={handleSendEmailCode}
      ></EmailVerificationCodeDrawer>
      <ForgotPassword
        className="fixed w-screen h-screen top-0 left-0 z-100"
        visible={showForgotPassword}
        close={changeShowForgotPassword}
      ></ForgotPassword>
    </div>
  )
}
export default RegisterLogin
