'use client'
import { useEffect, useRef, useState } from 'react'
import { useUpdate } from 'ahooks'
import { useUserInfo } from '@/models/user'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import SetNewEmail from '@/components/Setting/Account/ChangeEmail/SetNewEmail'
import VerificationEmail from '@/components/Setting/Account/ChangeEmail/VerificationEmail'
import { classMerge } from '@/utils'
interface IProps {
  className?: string
  visible?: boolean
  back?: () => void
}
const ChangeEmail = (props: IProps) => {
  const update = useUpdate()
  const userInfo = useUserInfo()
  const [email, setEmail] = useState<string>(userInfo?.email || '')
  const setNewEmailComRef = useRef<any>(null)
  const isOldEmail = email === userInfo?.email
  const step = useRef({
    showOldEmailVerification: true,
    showEnterNewEmailSuccess: false,
    showChangeNewEmail: false,
  })
  const oldCode = useRef<string>('')
  const handleCodeVerificationEnd = (code: string) => {
    if (isOldEmail) {
      step.current = {
        showOldEmailVerification: false,
        showEnterNewEmailSuccess: true,
        showChangeNewEmail: false,
      }
      oldCode.current = code
    } else {
      step.current = {
        showOldEmailVerification: false,
        showEnterNewEmailSuccess: false,
        showChangeNewEmail: true,
      }
      props?.back?.()
    }
    update()
  }
  const handleUpdateNewEmail = (newEmail: string) => {
    step.current = {
      showOldEmailVerification: false,
      showEnterNewEmailSuccess: false,
      showChangeNewEmail: true,
    }
    update()
    setEmail(newEmail)
  }
  useEffect(() => {
    setEmail(email)
  }, [userInfo?.email])
  useEffect(() => {
    return () => {
      step.current = {
        showOldEmailVerification: true,
        showEnterNewEmailSuccess: false,
        showChangeNewEmail: false,
      }
      update()
    }
  }, [])
  const renderContent = () => {
    const { showOldEmailVerification, showEnterNewEmailSuccess, showChangeNewEmail } = step.current
    if (showOldEmailVerification || showChangeNewEmail) {
      return (
        <VerificationEmail
          email={email}
          isOldEmail={isOldEmail}
          oldCode={oldCode.current}
          codeVerificationEnd={handleCodeVerificationEnd}
        ></VerificationEmail>
      )
    }
    if (showEnterNewEmailSuccess) {
      return <SetNewEmail updateNewEmail={handleUpdateNewEmail} ref={setNewEmailComRef}></SetNewEmail>
    }
    return null
  }

  if (props?.hasOwnProperty('visible') && !props?.visible) {
    return null
  }

  return (
    <div className={classMerge('w-screen h-screen bg-(--surface-level-01-emphasis-opaque-00)', props?.className)}>
      <PageHeader title="Change email" back={props?.back}></PageHeader>
      <div className="px-(--sizing-named-small)">
        <div className="py-(--sizing-named-small)">{renderContent()}</div>
      </div>
    </div>
  )
}

export default ChangeEmail
