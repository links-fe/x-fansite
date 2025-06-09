import { fetchMyProfile, IMyProfile, updateMyProfile, useMyProfileStore } from '@/models/user-profile/profile'
import {
  postApiAccountSettingModifyBio,
  postApiAccountSettingModifyNickName,
  postApiAccountSettingModifyUserName,
} from '@/services/setting'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { NAME_REGEX } from '../../components/Setting/constants'

export interface IProfileUpdate {
  key: keyof IMyProfile
  api: (data: any) => Promise<any>
  disabledRule?: (data: { userinfo: IMyProfile; value: string; error: string; loading: boolean }) => boolean
  onBack?: () => void
}

export const useProfileUpdate = ({ key, api, disabledRule, onBack }: IProfileUpdate) => {
  const router = useRouter()
  const userinfo = useMyProfileStore()

  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userinfo.initialized) {
      fetchMyProfile()
    }
    setValue(userinfo[key] as string)
  }, [userinfo[key]])

  const disabled = useMemo(() => {
    const notModified = value === userinfo[key]

    if (notModified || !!error || !value) return true

    return disabledRule?.({ userinfo, value, error, loading })
  }, [value, error])

  async function submit() {
    setLoading(true)
    try {
      const res = await api({ [key]: value })
      if (!res?.success) return
      updateMyProfile({ [key]: value })

      if (onBack) {
        onBack()
      } else {
        router.back()
      }
    } catch (error: any) {
      if (error?.code) setError(error?.message)
    }

    setLoading(false)
  }

  return { router, userinfo, value, setValue, loading, setLoading, error, setError, disabled, submit }
}

export const useBioUpdate = (props?: Partial<IProfileUpdate>) => {
  return useProfileUpdate({
    key: 'bio',
    api: postApiAccountSettingModifyBio,
    ...props,
  })
}

export const useNicknameUpdate = (props?: Partial<IProfileUpdate>) => {
  const { setValue, setError, ...rest } = useProfileUpdate({
    key: 'nickName',
    api: postApiAccountSettingModifyNickName,
    ...props,
  })

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setValue(v)

    // 支持字母、数字、下划线, 必须包含至少3个字符，最长为20个字符
    if (!NAME_REGEX.test(v)) {
      return setError('This name cannot be used. Try another name instead.')
    }

    setError('')
  }

  return { handleValueChange, setValue, setError, ...rest }
}

export const useUserNameUpdate = (props?: Partial<IProfileUpdate>) => {
  const [open, setOpen] = useState(false)

  const { setValue, setError, ...rest } = useProfileUpdate({
    key: 'userName',
    api: postApiAccountSettingModifyUserName,
    disabledRule: ({ userinfo, value, error, loading }) => {
      return !userinfo?.userNameEditEnabled
    },
    ...props,
  })

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setValue(v)

    // 支持字母、数字、下划线, 必须包含至少3个字符，最长为20个字符
    if (!NAME_REGEX.test(v)) {
      return setError('This username cannot be used. Try another username instead.')
    }

    setError('')
  }

  return { handleValueChange, open, setOpen, setValue, setError, ...rest }
}
