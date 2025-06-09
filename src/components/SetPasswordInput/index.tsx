'use client'
import React, { useState, forwardRef, useImperativeHandle, useCallback, useMemo } from 'react'
import { Password } from '@x-vision/design'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { classMerge } from '@/utils'
import { throttle } from 'lodash'

zxcvbnOptions.setOptions({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
})
const passwordErrMsg = {
  // 密码为空提示
  passwordEmpty: 'Password is required',
  // 密码格式错误提示
  passwordFormatErr:
    'The password must be at least 8 digits long and contain upper and lower case letters and numbers.',
  // 密码极弱提示
  passwordVeryWeak:
    'This password is extremely weak and easily guessable. Avoid common words, patterns, or repeated characters.',
  // 密码太弱提示
  passwordTooWeak: 'This password is too weak. Try adding more length, uppercase letters, numbers, and symbols.',
  // 密码一般提示
  passwordFair: 'This password is fair but could be stronger. Consider making it longer and less predictable.',
  // 密码强提示
  passwordStrong: 'Your password is strong. For even better security, use a longer phrase with random characters.',
  // 密码非常强提示
  passwordVeryStrong: 'Your password is very strong. It’s unique and hard to guess. Well done!',
  // 密码已使用提示
  passwordUsed: 'This password has already been used before. Choose a new one.',
}
const scoreMapTxt = [
  // ​0	极端弱密码
  passwordErrMsg.passwordVeryWeak,
  // 1	弱密码
  passwordErrMsg.passwordTooWeak,
  // 2	一般密码
  passwordErrMsg.passwordFair,
  // 3	强密码
  passwordErrMsg.passwordStrong,
  // 4	非常强密码
  passwordErrMsg.passwordVeryStrong,
]
// 基本格式验证（正则表达式）
// const validateFormat = (pwd: string): boolean => {
//   const formatRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[!@#$%^&*()_\-a-zA-Z\d]{8,}$/
//   return formatRegex.test(pwd)
// }
interface Iprops {
  className?: string
  changeDisabledNext?: (val: boolean) => void
  password: string
  changePassword: (val: string) => void
}
const changePasswordInput = forwardRef(function Com(
  { className, changeDisabledNext, password, changePassword }: Iprops,
  ref,
) {
  const [inputVariant, setInputVariant] = useState<'stop' | null>(null)
  const [errText, setErrText] = useState<string>('')
  const [zxcvbnScore, setZxcvbnScore] = useState<number | null>(null)

  const handleZxcvbn = useCallback(
    throttle((pwd: string) => {
      const result = zxcvbn(pwd)
      const score = result.score
      setZxcvbnScore(score)
      const scoreTxt = scoreMapTxt[score] || ''
      setErrText(scoreTxt)
      if (!score || score < 2) {
        changeDisabledNext?.(true)
        setInputVariant('stop')
        return false
      }
      changeDisabledNext?.(false)
      setInputVariant(null)
      return true
    }, 500),
    [],
  )

  // 实时处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value
    changePassword(pwd)

    // 进行格式验证 至少8位，需包含大小写字母、数字    支持英文键盘特殊字符：! @ # $ % ^ & * ( ) _ -
    // if (!validateFormat(pwd)) {
    //   setErrText(passwordErrMsg.passwordFormatErr)
    //   changeDisabledNext?.(true)
    //   setInputVariant('stop')
    //   return
    // } else {
    //   changeDisabledNext?.(false)
    // }

    // 进行密码强度检测 (2/中等密码强度才可以通过)
    handleZxcvbn(pwd)
  }

  // 处理输入框失焦事件
  const handleInputBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const pwd = e.target.value
    console.log('handleInputBlur', pwd)
    if (!pwd) {
      setErrText(passwordErrMsg.passwordEmpty)
      changeDisabledNext?.(true)
      setInputVariant('stop')
      return
    }

    // 进行格式验证 至少8位，需包含大小写字母、数字    支持英文键盘特殊字符：! @ # $ % ^ & * ( ) _ -
    // if (!validateFormat(pwd)) {
    //   setErrText(passwordErrMsg.passwordFormatErr)
    //   changeDisabledNext?.(true)
    //   setInputVariant('stop')
    //   return
    // }

    // 进行密码强度检测 (2/中等密码强度才可以通过)
    handleZxcvbn(pwd)
  }

  useImperativeHandle(ref, () => ({
    changeInputErrText: (txt: string) => {
      setZxcvbnScore(0)
      setErrText(txt)
      if (txt) {
        setInputVariant('stop')
      }
    },
    handleZxcvbn,
  }))

  const updateProcessBoxSty = useMemo(() => {
    const w = `${(zxcvbnScore || 0) * 25}%`
    const scoreBgColorMap: any = {
      0: '',
      // Token插件测的 `var(--surface-level-01-emphasis-02)` 有问题
      1: `rgba(234, 99, 87, 0.62)`,
      2: `rgba(178, 135, 0, 0.62)`,
      3: `rgba(80, 158, 66, 0.62)`,
      4: `rgba(80, 158, 66, 0.62)`,
    }
    const bgColor = scoreBgColorMap[zxcvbnScore || 0]
    return {
      width: w,
      backgroundColor: bgColor,
    }
  }, [zxcvbnScore])

  const updateErrorTextColor = useMemo(() => {
    const scoreColorMap: any = {
      0: 'var(--element-signal-stop-emphasis-00)',
      1: `var(--element-signal-stop-emphasis-00)`,
      2: `var(--element-signal-caution-emphasis-00)`,
      3: `var(--element-signal-go-emphasis-00)`,
      4: `var(--element-signal-go-emphasis-00)`,
    }
    return {
      color: scoreColorMap[zxcvbnScore || 0],
    }
  }, [zxcvbnScore])

  return (
    <div className={classMerge('changePasswordInput-component-container', className || '')}>
      <Password
        placeholder="Password"
        value={password}
        variant={inputVariant}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
      />
      {errText && (
        <div className="mt-(--sizing-named-micro)">
          <div
            className="w-[100px] h-(--sizing-named-micro) rounded-(--control-medium-border-radius) mb-(--sizing-named-micro)"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.09)' }}
          >
            <div className="h-full rounded-(--control-medium-border-radius)" style={updateProcessBoxSty}></div>
          </div>
          <div className="typography-text-body2-base" style={updateErrorTextColor}>
            {errText}
          </div>
        </div>
      )}
    </div>
  )
})
export default changePasswordInput
