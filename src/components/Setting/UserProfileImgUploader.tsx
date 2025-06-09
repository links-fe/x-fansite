import { Avatar, Loading, cln, Button } from '@x-vision/design'
import { Icon } from '@x-vision/icons/index.js'
import { DEFAULT_IMG_ACCEPT } from './constants'

/**
 * 上传头像
 * @param shape 形状
 * @param src 头像地址
 * @param loading 是否正在上传
 * @param onChange 上传回调
 * @returns
 */
export function ProfileImgUploader({
  shape,
  src,
  loading,
  onChange,
  ...props
}: {
  shape?: 'round' | 'square'
  src: string
  loading: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const isRound = shape === 'round'
  return (
    <span className="flex relative w-fit overflow-hidden">
      <Avatar
        size="massive"
        shape={shape}
        icon={<Icon icon="x:UserCircleStyleStroke" fontSize={28} />}
        src={src}
        loading={loading}
        {...props}
      />
      {loading && (
        <div
          className={cln(
            'absolute inset-0 flex items-center justify-center z-50 backdrop-blur-[1px] bg-white/5',
            isRound && 'rounded-full',
          )}
        >
          <Loading />
        </div>
      )}
      {!src && (
        <div
          className={cln('absolute z-51', `${isRound ? 'top-(--named-nano) right-(--named-nano)' : 'top-0 right-0'}`)}
        >
          <Button shape="circle" color="primary" size={isRound ? 'moderate' : 'generous'}>
            <Icon icon="x:Upload01StyleSolid" fontSize={isRound ? 16 : 20} />
          </Button>
        </div>
      )}
      <input
        type="file"
        accept={DEFAULT_IMG_ACCEPT}
        className="absolute size-full inset-0 opacity-0"
        onChange={onChange}
      />
    </span>
  )
}
