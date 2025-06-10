import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ALERT_MESSAGES } from './constants/alert-messages'
import { ProfileFieldInput } from '@/components/Setting/UserProfileFieldInput'
import { ProfileNameConfirmDrawer } from '@/components/Setting/UserProfileNameConfirmDrawer'
import { useUserNameUpdate } from '@/views/more/Profile.data'
import { Button, cln } from '@x-vision/design'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { PageContent } from '@/components/Setting/PageContent'

export default function ProfileUsername({ title = PAGE_NAMES.USERNAME, ...props }: PageProps) {
  const { userinfo, open, setOpen, value, loading, error, handleValueChange, disabled, submit } = useUserNameUpdate({
    onBack: props.onBack,
  })

  return (
    <PageContent
      title={title}
      right={
        <Button size="generous" onClick={() => setOpen(true)} disabled={disabled} loading={loading}>
          Save
        </Button>
      }
      {...props}
    >
      <ProfileFieldInput
        type="input"
        className="p-0"
        value={value}
        disabled={!userinfo?.userNameEditEnabled}
        error={error}
        alert={
          userinfo?.userNameEditEnabled ? ALERT_MESSAGES.USERNAME_LIMIT : ALERT_MESSAGES.USERNAME_CANNOT_BE_CHANGED
        }
        onChange={handleValueChange}
      />
      <ProfileNameConfirmDrawer open={open} setOpen={setOpen} submit={submit} loading={loading} />
    </PageContent>
  )
}
