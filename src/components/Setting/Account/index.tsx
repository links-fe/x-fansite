'use client'
import { Cell, CellGroup } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import { useRouter } from 'next/router'
import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import ChangePassword from '@/components/Setting/Account/ChangePassword'
import ChangeEmail from '@/components/Setting/Account/ChangeEmail'
import ThirdPartyAccounts from '@/components/Setting/Account/ThirdPartyAccounts'
import { useState } from 'react'
import { classMerge } from '@/utils'

interface IProps {
  className?: string
  visible?: boolean
  back?: () => void
}
export default function Account(props: IProps) {
  const [showChangePasswordPage, setShowOpenChangePasswordPage] = useState(false)
  const closeChangePasswordPage = () => {
    setShowOpenChangePasswordPage(false)
  }

  const [showChangeEmailPage, setShowOpenChangeEmailPage] = useState(false)
  const closeChangeEmailPage = () => {
    setShowOpenChangeEmailPage(false)
  }

  const [showThirdPartyAccounts, setShowThirdPartyAccounts] = useState(false)
  const closeThirdPartyAccounts = () => {
    setShowThirdPartyAccounts(false)
  }

  const router = useRouter()

  const ITEMS = [
    {
      label: 'Change password',
      to: () => {
        // router.push('/more/setting/account/change-password')
        setShowOpenChangePasswordPage(true)
      },
    },
    {
      label: 'Change email',
      to: () => {
        // router.push('/more/setting/account/change-email')
        setShowOpenChangeEmailPage(true)
      },
    },
    {
      label: 'Third party accounts',
      to: () => {
        // router.push('/more/setting/account/third-party-accounts')
        setShowThirdPartyAccounts(true)
      },
    },
  ]

  if (props?.hasOwnProperty('visible') && !props?.visible) {
    return null
  }

  return (
    <div
      className={classMerge(
        'relative w-screen h-screen overflow-y-auto bg-(--surface-level-01-emphasis-opaque-00)',
        props?.className,
      )}
    >
      <PageHeader title="Account" back={props?.back}></PageHeader>
      <div className="flex flex-col gap-(--named-large) p-(--named-small)">
        <CellGroup>
          {ITEMS.map((item) => (
            <Cell key={item.label} right={<Icon icon="x:ArrowRight01StyleStroke" />} onClick={item.to}>
              {item.label}
            </Cell>
          ))}
        </CellGroup>
      </div>

      {showChangePasswordPage && (
        <ChangePassword
          className="absolute top-0 left-0"
          visible={showChangePasswordPage}
          back={closeChangePasswordPage}
        ></ChangePassword>
      )}
      {showChangeEmailPage && (
        <ChangeEmail
          className="absolute top-0 left-0"
          visible={showChangeEmailPage}
          back={closeChangeEmailPage}
        ></ChangeEmail>
      )}

      {showThirdPartyAccounts && (
        <ThirdPartyAccounts
          className="absolute top-0 left-0"
          visible={showThirdPartyAccounts}
          back={closeThirdPartyAccounts}
        ></ThirdPartyAccounts>
      )}
    </div>
  )
}

Account.PcLayout = PcMenuLayout
Account.MobileLayout = MobileNoTabbarLayout
