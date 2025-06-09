import { updateContactMeta, useContactMeta } from '@/models/chat/cache/meta'
import { setDisplayNameDrawerVisible } from '@/models/message/model'
import { updataFansRemarkName } from '@/services/chatInput'
import { Button, Input, Navbar, Text } from '@x-vision/design'
import { useState } from 'react'
import { toast } from 'sonner'

interface IProps {
  userId: string
  toUserId: string
}
function DisplayNameSettingDrawerPage(props: IProps) {
  const { userId, toUserId } = props
  const { user } = useContactMeta(toUserId)
  const [displayName, setDisplayName] = useState(user?.remarkName || '')
  const [isLoading, setIsLoading] = useState(false)

  const onSaveDisplayName = async () => {
    setIsLoading(true)
    try {
      await updataFansRemarkName({
        remarkName: displayName,
        remarkUserId: toUserId,
      })
      // TODO 缺少toast提示
      toast.success('Display name updated')
      updateContactMeta(userId, toUserId, {
        user: {
          remarkName: displayName,
        },
      })
      setIsLoading(false)
      setDisplayNameDrawerVisible(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Navbar
        leftArrow
        onLeftArrowClick={() => {
          setDisplayNameDrawerVisible(false)
        }}
        right={
          <Button
            size="generous"
            color="primary"
            disabled={displayName === user?.remarkName || displayName.length < 1}
            onClick={onSaveDisplayName}
            loading={isLoading}
          >
            Save
          </Button>
        }
      >
        Display name
      </Navbar>
      <div className="p-4 flex flex-col gap-2">
        <div>
          <Input
            placeholder=""
            maxLength={20}
            size="huge"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Text size="body2">Name must be between 1 and 20 characters.</Text>
        </div>
      </div>
    </div>
  )
}

export default DisplayNameSettingDrawerPage
