import { getApiAccountSettingNotifications, postApiAccountSettingModifyPushNotification } from '@/services/setting'
import { error } from 'console'
import { useEffect, useState } from 'react'

export function useNotificationData() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    // 0关 1开
    pushNewMsg: 0,
    pushNewSub: 0,
    pushSystemNotify: 0,
    emailPayment: 0,
    emailSystemUpdate: 0,
  })

  async function fetchData() {
    setLoading(true)
    try {
      const res = await getApiAccountSettingNotifications()
      setData(res as any)
      console.log(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function updateData({ notify, value }: { notify: string; value: number }) {
    try {
      setLoading(true)
      const res = await postApiAccountSettingModifyPushNotification({ notify, value })
      if (res?.success) {
        setData((v) => ({ ...v, [notify]: value }))
      }
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { loading, setLoading, data, setData, updateData }
}
