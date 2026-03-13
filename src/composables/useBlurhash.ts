import type { BlurhashWorkerType } from '@/types/blurhash'
import { wrap } from 'comlink'
import Pica from 'pica'
import BlurhashWorker from '@/workers/blurhash?worker&inline'

let remoteFunction: ReturnType<typeof wrap<BlurhashWorkerType>>

function getRemoteFunction() {
    if (!remoteFunction) {
        remoteFunction = wrap<BlurhashWorkerType>(new BlurhashWorker())
    }
    return remoteFunction
}

function loadImage(src: string): Promise<CanvasImageSource> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (...args) => reject(args)
        img.src = src
    })
}

function getWidthHeightFromMaxSize(width: number,	height: number,	maxSize: number) {
    if (width > height) {
        return {
            width: maxSize,
            height: Math.round(maxSize * (height / width)),
        }
    }
    return {
        width: Math.round(maxSize * (width / height)),
        height: maxSize,
    }
}

async function resizeImage(image: ImageBitmap | HTMLImageElement | HTMLCanvasElement, width: number, height: number) {
    const resizer = new Pica()
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const result = await resizer.resize(image, canvas)
    return result.getContext('2d')?.getImageData(0, 0, width, height).data
}

export function useBlurhash() {
    async function encode(file: File) {
        const imageUrl = URL.createObjectURL(file)
        const image = await loadImage(imageUrl)
        if ('width' in image && 'height' in image) {
            const { width: newWidth, height: newHeight }
                = getWidthHeightFromMaxSize(
                    image.width as number,
                    image.height as number,
                    32,
                )
            const imageData = await resizeImage(
                image as ImageBitmap,
                newWidth,
                newHeight,
            )
            if (imageData) {
                return getRemoteFunction().encode(
                    imageData,
                    newWidth,
                    newHeight,
                    4,
                    4,
                )
            }
        }
    }

    return { encode, decode: (...args: Parameters<BlurhashWorkerType['decode']>) => getRemoteFunction().decode(...args), loadImage }
}
