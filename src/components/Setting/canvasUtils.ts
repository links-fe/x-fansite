export type Area = {
  width: number
  height: number
  x: number
  y: number
}

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

export async function getCroppedImg({
  imageSrc,
  pixelCrop,
  rotation = 0,
  mimeType = 'image/png',
  quality = 0.75,
  targetSize,
  flip = { horizontal: false, vertical: false },
}: {
  imageSrc: string
  pixelCrop?: Area
  rotation?: number
  mimeType?: string
  quality?: number
  flip?: { horizontal: boolean; vertical: boolean }
  targetSize?: [number, number]
}): Promise<string | Blob | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx || !pixelCrop) return null

  const rotRad = getRadianAngle(rotation)

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation)

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement('canvas')

  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  const width = targetSize?.[0] || pixelCrop.width
  const height = targetSize?.[1] || pixelCrop.height

  croppedCanvas.width = width
  croppedCanvas.height = height

  croppedCtx.drawImage(canvas, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, width, height)

  // Base64 string
  // return croppedCanvas.toDataURL('image/jpeg');

  return new Promise((resolve) => croppedCanvas.toBlob((file) => resolve(file), mimeType, quality))

  // // a blob
  // return new Promise((resolve, _) => {
  //   croppedCanvas.toBlob((file) => {
  //     resolve(URL.createObjectURL(file!))
  //   }, mimeType, quality)
  // })
}

export async function getRotatedImage(imageSrc: string, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const orientationChanged = rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270
  if (orientationChanged) {
    canvas.width = image.height
    canvas.height = image.width
  } else {
    canvas.width = image.width
    canvas.height = image.height
  }

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(image, -image.width / 2, -image.height / 2)

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file!))
    }, 'image/png')
  })
}
