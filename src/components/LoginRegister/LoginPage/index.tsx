'use client'
import React from 'react'
import RegisterLogin from '@/components/LoginRegister/RegisterLoginCommon'
import { classMerge } from '@/utils'
import { EnumCheckSource } from '@/types'

interface IProps {
  className?: string
}
export default function LoginPage({ className }: IProps) {
  return (
    <div
      className={classMerge(
        'py-(--sizing-named-large) pb-[204px] px-(--sizing-named-small) box-border overflow-y-auto',
        className,
      )}
    >
      <h1 className="typography-text-heading1-strong text-(--element-emphasis-00) mb-(--sizing-named-medium)">
        Get started
      </h1>
      <RegisterLogin checkSource={EnumCheckSource.ActiveLogin}></RegisterLogin>
    </div>
  )
}
