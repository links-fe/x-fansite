'use client'

import { AspectRatio, Button, Drawer } from '@x-vision/design'
import { useState } from 'react'
import { getCroppedImg } from './canvasUtils'
import Cropper, { Area } from 'react-easy-crop'
import { Icon } from '@x-vision/icons'
import { AVATAR_SIZE, BACKGROUND_SIZE, DEFAULT_IMG_MIME_TYPE } from './constants'

export interface CropDialogProps {
  aspect?: number
  cropShape?: 'round' | 'rect'
  src: string
  open: boolean
  onDone?: (payload: { url: string; file: Blob }) => void
  onClose?: () => void
}

/**
 * 图片裁剪对话框组件
 * @param aspect - 裁剪比例（默认1:1）
 * @param cropShape - 裁剪形状：圆形(round) 或 矩形(rect)
 * @param src - 需要裁剪的图片URL
 * @param open - 控制对话框显示状态
 * @param onDone - 裁剪完成回调（返回裁剪后的URL和Blob）
 * @param onClose - 关闭对话框回调
 */
export default function CropDialog({
  aspect = 1 / 1, // 16:9
  cropShape = 'round',
  src,
  open,
  onClose,
  onDone,
  ...props
}: CropDialogProps & React.ComponentProps<typeof Drawer>) {
  // const src = 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGdyb3VwJTIwcG9ydHJhaXQlfGVufDB8fHx8MTY5MjA1NTQyNw&ixlib=rb-4.0.3&q=80&w=1080'
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()
  const [loading, setLoading] = useState(false)
  // const [croppedImage, setCroppedImage] = useState<string>()

  const showCroppedImage = async () => {
    try {
      setLoading(true)
      const targetSize = (cropShape === 'round' ? AVATAR_SIZE : BACKGROUND_SIZE) as [number, number]
      const file = (await getCroppedImg({
        imageSrc: src,
        pixelCrop: croppedAreaPixels,
        rotation,
        targetSize,
        mimeType: DEFAULT_IMG_MIME_TYPE,
      })) as Blob
      const url = URL.createObjectURL(file)
      console.log('donee', file, url)
      // setCroppedImage(url)
      onDone?.({ url, file })
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }
  return (
    <Drawer
      handleSlot={false}
      closeSlot={false}
      dismissible={false}
      open={open}
      direction="right"
      onOpenChange={(v) => !v && onClose?.()}
      className="w-full! mx-auto size-full rounded-none! bg-black outline-none"
      {...props}
    >
      <div className="absolute z-11 inset-x-0 top-0 py-(--named-micro) px-(--named-mini) flex items-center justify-between">
        <span className="p-(--named-intermediate) cursor-pointer text-white" onClick={onClose}>
          <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} />
        </span>
        <Button
          color="toggle"
          className="bg-(--element-reverse-emphasis-00)"
          size="generous"
          loading={loading}
          onClick={showCroppedImage}
        >
          Done
        </Button>
      </div>
      <div className="absolute z-10 inset-0 max-w-lg max-h-lg m-auto flex items-center justify-center">
        <AspectRatio ratio={1}>
          <div className="relative size-full">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              objectFit="horizontal-cover"
              showGrid={false}
              cropShape={cropShape}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={(_, v) => setCroppedAreaPixels(v)}
              style={{ cropAreaStyle: { border: 'none' } }}
            />
          </div>
        </AspectRatio>
      </div>
    </Drawer>
  )
}
