import type { LocalImage } from '../types'
import { createId, nowIso } from './id'

export interface CompressImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  thumbnailSize?: number
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('浏览器无法编码这张图片'))),
      type,
      quality,
    )
  })
}

async function decodeImage(file: Blob): Promise<{ source: CanvasImageSource; width: number; height: number; close: () => void }> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file)
    return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() }
  }

  const url = URL.createObjectURL(file)
  const image = new Image()
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('无法读取图片'))
      image.src = url
    })
    return { source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => URL.revokeObjectURL(url) }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

function renderCanvas(
  source: CanvasImageSource,
  width: number,
  height: number,
  maximumWidth: number,
  maximumHeight: number,
): HTMLCanvasElement {
  const scale = Math.min(1, maximumWidth / width, maximumHeight / height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('当前浏览器不支持图片画布')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<LocalImage> {
  if (!file.type.startsWith('image/')) throw new Error('仅支持图片文件')
  const maxWidth = Math.max(64, options.maxWidth ?? 1920)
  const maxHeight = Math.max(64, options.maxHeight ?? 1920)
  const quality = Math.min(1, Math.max(0.1, options.quality ?? 0.82))
  const thumbnailSize = Math.max(32, options.thumbnailSize ?? 480)
  const decoded = await decodeImage(file)
  try {
    const mainCanvas = renderCanvas(decoded.source, decoded.width, decoded.height, maxWidth, maxHeight)
    const thumbnailCanvas = renderCanvas(
      decoded.source,
      decoded.width,
      decoded.height,
      thumbnailSize,
      thumbnailSize,
    )
    const [data, thumbnail] = await Promise.all([
      canvasToBlob(mainCanvas, 'image/webp', quality),
      canvasToBlob(thumbnailCanvas, 'image/webp', Math.min(quality, 0.76)),
    ])
    return {
      id: createId('image'),
      name: file.name.replace(/\.[^.]+$/, '') + '.webp',
      type: 'image/webp',
      data,
      thumbnail,
      createdAt: nowIso(),
    }
  } finally {
    decoded.close()
  }
}

export function localImageUrl(image: LocalImage, thumbnail = false): string {
  return URL.createObjectURL(thumbnail && image.thumbnail ? image.thumbnail : image.data)
}
