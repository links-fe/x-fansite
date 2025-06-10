import { ProfileFieldInput } from '@/components/Setting/UserProfileFieldInput'
import { useBioUpdate } from '@/views/more/Profile.data'
import { Button } from '@x-vision/design'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { PageContent } from '@/components/Setting/PageContent'

export default function ProfileBio({ title = PAGE_NAMES.BIO, ...props }: PageProps) {
  const { value, setValue, loading, error, disabled, submit } = useBioUpdate({ onBack: props.onBack })
  return (
    <PageContent
      title={title}
      right={
        <Button size="generous" onClick={submit} disabled={disabled} loading={loading}>
          Done
        </Button>
      }
      {...props}
    >
      <ProfileFieldInput
        type="textarea"
        className="p-0"
        value={value}
        error={error}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
    </PageContent>
  )
}
