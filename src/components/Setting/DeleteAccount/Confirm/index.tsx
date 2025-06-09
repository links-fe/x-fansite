'use client'

import { xLogger } from '@/common/logger'
import ConfitmDeleteAccount from '@/components/Setting/DeleteAccount/ConfirmDeleteAccount'
import DeleteEmailVerificationCodeDrawer from '@/components/Setting/DeleteAccount/DeleteEmailVerificationCodeDrawer'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { postSendCloseAccountCodeEmail } from '@/services/setting'
import { classMerge } from '@/utils'
import { Button } from '@x-vision/design'
import { useState } from 'react'

interface Iprops {
  visible: boolean
  close: () => void
  className?: string
  closeReason: string[]
}
const DeleteAccountConfirm = ({ visible, close, className, closeReason }: Iprops) => {
  const [openConfirmDrawer, setOpenConfirmDrawer] = useState(false)
  const showConfirmDrawer = () => {
    setOpenConfirmDrawer(true)
  }
  const closeConfirmDrawer = () => {
    setOpenConfirmDrawer(false)
  }
  const [showEmailVerificationCodeDialog, setShowEmailVerificationCodeDialog] = useState<boolean>(false)
  const openEmailVerificationCodeDialog = () => {
    setShowEmailVerificationCodeDialog(true)
  }
  const closeEmailVerificationCodeDialog = () => {
    setShowEmailVerificationCodeDialog(false)
  }
  const handleSendEmailCode = async () => {
    try {
      const res = await postSendCloseAccountCodeEmail()
      if (!res?.success) {
        throw res
      }
      return true
    } catch (error: any) {
      if (error?.code === 100009) {
        // 邮件发送频繁
        showCommonErrorDrawer({
          contentTxt: 'Frequent mailings',
        })
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem communicating with X servers.',
        })
        xLogger.error('Delete account error', {
          detail: 'DeleteAccountConfirm handleSendEmailCode postSendCloseAccountCodeEmail',
          error,
        })
      }
    }
    return false
  }
  const handleConfitmDeleteAccount = async () => {
    const result = await handleSendEmailCode()
    if (result) {
      openEmailVerificationCodeDialog()
    }
  }
  if (!visible) {
    return null
  }

  return (
    <div className={classMerge(className)}>
      <PageHeader title="Delete account" back={close} />

      <div className="flex flex-col gap-(--named-small) p-(--named-small)">
        <div className="typography-numbers-body1-base">
          <p>
            After submitting the request, you have 14 days to log back into your account to restore it before it's
            permanently deleted.
          </p>
          <br />
          <p>The following will be deleted as well:</p>
          <ul
            role="list"
            className="list-none marker:w-[1.5em] [&>li]:before:content-['•'] [&>li]:before:w-[1.5em] [&>li]:before:inline-flex [&>li]:before:justify-center"
          >
            <li>All uploaded media</li>
            <li>All messages</li>
            <li>All data related to the account</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-(--named-medium) px-(--named-small) my-(--named-medium)">
        <Button size="huge" color="stop" onClick={showConfirmDrawer}>
          Delete account
        </Button>
        <Button size="huge" onClick={close}>
          Cancel
        </Button>
      </div>

      <ConfitmDeleteAccount
        visible={openConfirmDrawer}
        close={closeConfirmDrawer}
        confirm={handleConfitmDeleteAccount}
      ></ConfitmDeleteAccount>

      <DeleteEmailVerificationCodeDrawer
        visible={showEmailVerificationCodeDialog}
        closeReason={closeReason}
        close={closeEmailVerificationCodeDialog}
        resendCode={handleSendEmailCode}
      />
    </div>
  )
}
export default DeleteAccountConfirm
