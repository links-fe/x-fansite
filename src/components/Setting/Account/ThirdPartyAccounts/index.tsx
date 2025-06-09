'use client'
import { useEffect, useState } from 'react'
import { Loading, Text } from '@x-vision/design'
import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import ThirdPartyAccountsCard from './Card'
import DeleteThirdPartyAccountSetPasswordDrawer from './DeleteThirdPartyAccountSetPasswordDrawer'
import { IqueryThirdAccountsRes, postUnlinkThirdAccounts, queryThirdAccounts } from '@/services/setting'
import { showCommonErrorDrawer } from '@/models/abnormalDrawer'
import { xLogger } from '@/common/logger'
import { classMerge } from '@/utils'

interface IProps {
  className?: string
  visible?: boolean
  back?: () => void
}
const ThirdPartyAccounts = (props: IProps) => {
  const [loading, setLoading] = useState(false)
  const [thirdAccounts, setThirdAccounts] = useState<any>([])
  const [showSetPasswordDrawer, setShowSetPasswordDrawer] = useState<boolean>(false)
  const [deleteThirdAccountId, setDeleteThirdAccountId] = useState<number>()
  const initThirdAccounts = async () => {
    try {
      setLoading(true)
      const res = await queryThirdAccounts()
      if (res?.length) {
        setThirdAccounts(res)
      }
    } catch (error) {
      showCommonErrorDrawer({
        contentTxt: 'There was a problem communicating with X servers.',
      })
      xLogger.error('third party accounts error', {
        detail: 'initThirdAccounts queryThirdAccounts',
        error,
      })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    initThirdAccounts()
  }, [])
  const openSetPasswordDrawer = ({ id }: { id: number }) => {
    setDeleteThirdAccountId(id)
    setShowSetPasswordDrawer(true)
  }
  const closeSetPasswordDrawer = () => {
    setShowSetPasswordDrawer(false)
  }
  const unlinkThirdAccounts = async (id?: number) => {
    const thirdAccountId = id || deleteThirdAccountId
    if (!thirdAccountId) {
      return
    }
    try {
      const res = await postUnlinkThirdAccounts({
        thirdAccountId,
      })
      if (!res?.success) {
        throw res
      }
      setThirdAccounts((list: IqueryThirdAccountsRes[]) =>
        list?.filter?.((item: any) => item.thirdAccountId !== thirdAccountId),
      )
    } catch (error: any) {
      if (error?.code === 100019) {
        // 密码为空
        showCommonErrorDrawer({
          contentTxt: 'Password is empty',
        })
      } else {
        showCommonErrorDrawer({
          contentTxt: 'There was a problem communicating with X servers.',
        })
        xLogger.error('third party accounts error', {
          detail: 'unlinkThirdAccounts postUnlinkThirdAccounts',
          thirdAccountId,
          error,
        })
      }
    }
  }
  const handleSetPasswordSuccess = async () => {
    closeSetPasswordDrawer()
    await unlinkThirdAccounts()
  }

  if (props?.hasOwnProperty('visible') && !props?.visible) {
    return null
  }

  return (
    <div
      className={classMerge(
        'w-screen h-screen overflow-y-auto bg-(--surface-level-01-emphasis-opaque-00)',
        props?.className,
      )}
    >
      <PageHeader title="Third party accounts" back={props?.back}></PageHeader>
      <div className="p-(--sizing-named-small)">
        <Text size="body1" className="text-(--element-emphasis-00)">
          X lets you connect different third party providers to your account.
        </Text>

        {loading ? (
          <div className="flex items-center justify-center h-[100px]">
            <Loading fontSize={28} />
          </div>
        ) : (
          <ThirdPartyAccountsCard
            data={thirdAccounts?.[0]}
            openSetPasswordDrawer={openSetPasswordDrawer}
            unlinkThirdAccounts={unlinkThirdAccounts}
            updateList={initThirdAccounts}
          ></ThirdPartyAccountsCard>
        )}
      </div>

      <DeleteThirdPartyAccountSetPasswordDrawer
        visible={showSetPasswordDrawer}
        close={closeSetPasswordDrawer}
        onSuccess={handleSetPasswordSuccess}
      ></DeleteThirdPartyAccountSetPasswordDrawer>
    </div>
  )
}

ThirdPartyAccounts.PcLayout = PcMenuLayout
ThirdPartyAccounts.MobileLayout = MobileNoTabbarLayout

export default ThirdPartyAccounts
