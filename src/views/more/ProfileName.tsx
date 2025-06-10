import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ALERT_MESSAGES } from './constants/alert-messages'
import { ProfileFieldInput } from '@/components/Setting/UserProfileFieldInput'
import { useNicknameUpdate } from '@/views/more/Profile.data'
import { Button, cln } from '@x-vision/design'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { PageContent } from '@/components/Setting/PageContent'

export default function ProfileName({ title = PAGE_NAMES.NAME, ...props }: PageProps) {
  const { value, loading, error, handleValueChange, disabled, submit } = useNicknameUpdate({ onBack: props.onBack })

  return (
    <PageContent
      title={title}
      right={
        <Button size="generous" onClick={submit} disabled={disabled} loading={loading}>
          Save
        </Button>
      }
      {...props}
    >
      <ProfileFieldInput
        type="input"
        className="p-0"
        value={value}
        error={error}
        alert={ALERT_MESSAGES.NICKNAME_LIMIT}
        onChange={handleValueChange}
      />
    </PageContent>
  )
}
