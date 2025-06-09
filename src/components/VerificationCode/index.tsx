'use client'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { InputOTP } from '@x-vision/design'
interface IProps {
  onComplete: (value: string) => void
}
const VerificationCodeInput = ({ onComplete }: IProps, ref: any) => {
  const [value, setValue] = useState<string>('')
  const handleChange = (value: string) => {
    setValue(value)
  }
  useImperativeHandle(ref, () => ({
    clear: () => {
      setValue('')
    },
  }))
  return <InputOTP placeholder="●" onComplete={onComplete} value={value} onChange={handleChange} />
}

export default forwardRef(VerificationCodeInput)
