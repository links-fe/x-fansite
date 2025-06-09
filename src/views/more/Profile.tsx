'use client'

import { PcMenuLayout, MobileNoTabbarLayout } from '@/components/Layout'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { Cell, cln, Text } from '@x-vision/design'
import { useRouter } from 'next/router'
import { uploadMyProfileFileUtils } from '@/common/multipartUploader'
import { DEFAULT_IMG_ACCEPT, DEFAULT_IMG_MIME_TYPE } from '@/components/Setting/constants'
import CropDialog from '@/components/Setting/CropDialog'
import { PageContent } from '@/components/Setting/PageContent'
import { ProfileImgUploader } from '@/components/Setting/UserProfileImgUploader'
import { useMyProfileStore, fetchMyProfile, updateMyProfile } from '@/models/user-profile/profile'
import { postApiAccountSettingModifyImg } from '@/services/setting'
import { Icon } from '@x-vision/icons/index.js'
import { useState, useEffect, useMemo } from 'react'
import ProfileName from './ProfileName'
import ProfileUsername from './ProfileUsername'
import ProfileBio from './ProfileBio'
import ProfileLocation from './ProfileLocation'

function ProfileItem({
  rows = 1,
  style,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { rows?: number }) {
  return (
    <div
      className={cln(
        'typography-numbers-body1-base py-(--control-huge-padding-vertical) px-(--control-huge-padding-horizontal) rounded-(--control-huge-border-radius) bg-(--grayscale-black-06) border border-(--grayscale-black-06) cursor-pointer break-all',
        className,
      )}
      {...props}
    >
      <div className="min-h-(--min-h)" style={{ ...{ '--min-h': `${rows}em` }, ...style }}>
        {children}
      </div>
    </div>
  )
}

function useUploaderDialog() {
  const [uploader, setUploader] = useState({
    aspect: 1 / 1, // 16:9
    cropShape: 'round' as 'round' | 'rect',
    type: 0, //  1 头像  2背景图
    open: false,
    loading: false,
    url: '',
  })

  const resetDialogState = () => {
    setUploader({ type: 0, open: false, loading: false, url: '', cropShape: 'round', aspect: 1 / 1 })
  }

  function handleImageInput({ type, ...e }: Omit<React.ChangeEvent<HTMLInputElement>, 'type'> & { type: 1 | 2 }) {
    const [file] = e?.target?.files ?? []

    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      throw alert('File size must be less than 5MB')
    }
    if (!DEFAULT_IMG_ACCEPT.includes(file.type)) {
      throw alert('Please upload a jpeg, png, or gif file')
    }

    const url = URL.createObjectURL(file)
    setUploader({
      type,
      open: true,
      url,
      cropShape: type === 1 ? 'round' : 'rect',
      loading: false,
      aspect: type === 1 ? 1 / 1 : 16 / 9,
    })

    e.target.value = ''
  }

  function handleImageSubmit({ url, file }: { url: string; file: Blob }) {
    const { type } = uploader

    setUploader((v) => ({ ...v, open: false, loading: true }))
    uploadMyProfileFileUtils.upload({
      file: new File([file], 'user-setting.png', { type: DEFAULT_IMG_MIME_TYPE }),
      onCompleted: async (data) => {
        const { fileKey, fileUrl } = data || {}
        if (!fileKey || !fileUrl) return
        await postApiAccountSettingModifyImg({ fileKey: fileKey, imageType: type })

        const img = type === 1 ? { headImgUrl: fileUrl } : { backgroundImgUrl: fileUrl }
        updateMyProfile(img)
        resetDialogState()
      },
      onError: (err) => {
        console.log(err)
        resetDialogState()
      },
    })
  }

  return { uploader, setUploader, resetDialogState, handleImageInput, handleImageSubmit }
}

export default function Profile({ title = PAGE_NAMES.PROFILE, className, onBack, ...props }: PageProps) {
  const router = useRouter()
  const userinfo = useMyProfileStore()
  const { uploader, resetDialogState, handleImageInput, handleImageSubmit } = useUploaderDialog()
  const [page, setPage] = useState<string | null>(null)

  useEffect(() => {
    fetchMyProfile()
  }, [])

  return (
    <PageContent
      className={cln('flex flex-col gap-(--named-medium) p-(--named-small)', className)}
      loading={userinfo.loading}
      screen
      title={title}
      onBack={onBack}
    >
      <div className="flex justify-center">
        <ProfileImgUploader
          shape="round"
          src={userinfo.headImgUrl}
          loading={uploader.type === 1 && uploader.loading}
          onChange={(e) => handleImageInput({ ...e, type: 1 })}
        />
      </div>
      <div className="flex flex-col gap-(--named-micro)">
        <Text size="body1" strong>
          Name
        </Text>
        {/* <ProfileItem onClick={() => router.push('/more/profile/name')}>{userinfo.nickName}</ProfileItem> */}
        <ProfileItem onClick={() => setPage(PAGE_NAMES.NAME)}>{userinfo.nickName}</ProfileItem>
      </div>
      <div className="flex flex-col gap-(--named-micro)">
        <Text size="body1" strong>
          Username
        </Text>
        {/* <ProfileItem onClick={() => router.push('/more/profile/username')}>{userinfo.userName}</ProfileItem> */}
        <ProfileItem onClick={() => setPage(PAGE_NAMES.USERNAME)}>{userinfo.userName}</ProfileItem>
      </div>
      <div className="flex flex-col gap-(--named-micro)">
        <Text size="body1" strong>
          Cover photo
        </Text>
        <ProfileImgUploader
          shape="square"
          src={userinfo.backgroundImgUrl}
          loading={uploader.type === 2 && uploader.loading}
          onChange={(e) => handleImageInput({ ...e, type: 2 })}
        />
      </div>
      <div className="flex flex-col gap-(--named-micro)">
        <Text size="body1" strong>
          Bio
        </Text>
        {/* <ProfileItem rows={2} onClick={() => router.push('/more/profile/bio')}>{userinfo.bio}</ProfileItem> */}
        <ProfileItem rows={2} onClick={() => setPage(PAGE_NAMES.BIO)}>
          {userinfo.bio}
        </ProfileItem>
      </div>
      <div className="flex flex-col gap-(--named-micro)">
        <Text size="body1" strong>
          Location
        </Text>
        <Cell
          right={<Icon icon="x:ArrowRight01StyleStroke" />}
          title={<span className="typography-numbers-body1-base">{userinfo.location || 'Undetected'}</span>}
          // onClick={() => router.push('/more/profile/location')}
          onClick={() => setPage(PAGE_NAMES.LOCATION)}
        />
      </div>

      {/* 裁剪图片弹窗 */}
      <CropDialog
        aspect={uploader.aspect}
        cropShape={uploader.cropShape}
        src={uploader.url}
        open={uploader.open}
        onClose={resetDialogState}
        onDone={handleImageSubmit}
      />

      {page === PAGE_NAMES.NAME && <ProfileName rootClassName="absolute inset-0" onBack={() => setPage(null)} />}
      {page === PAGE_NAMES.USERNAME && (
        <ProfileUsername rootClassName="absolute inset-0" onBack={() => setPage(null)} />
      )}
      {page === PAGE_NAMES.BIO && <ProfileBio rootClassName="absolute inset-0" onBack={() => setPage(null)} />}
      {page === PAGE_NAMES.LOCATION && (
        <ProfileLocation rootClassName="absolute inset-0" onBack={() => setPage(null)} />
      )}
    </PageContent>
  )
}

Profile.PcLayout = PcMenuLayout
Profile.MobileLayout = MobileNoTabbarLayout
