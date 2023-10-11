import { wrap } from 'comlink'
import pica from 'pica'
import type { BlurhashWorkerType } from '@/types/blurhash'
import BlurhashWorker from '@/workers/blurhash?worker'

const remoteFunction = wrap<BlurhashWorkerType>(new BlurhashWorker())

function loadImage(src: string): Promise<CanvasImageSource> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = (...args) => reject(args)
		img.src = src
	})
}

const getWidthHeightFromMaxSize = (
	width: number,
	height: number,
	maxSize: number,
) => {
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

const resizeImage = async (
	image: ImageBitmap | HTMLImageElement | HTMLCanvasElement | File | Blob,
	width: number,
	height: number,
) => {
	const resizer = new pica()
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const result = await resizer.resize(image, canvas)
	return result.getContext('2d')?.getImageData(0, 0, width, height).data
}

export const useBlurhash = () => {
	async function encode(file: File) {
		const imageUrl = URL.createObjectURL(file)
		const image = await loadImage(imageUrl)
		if ('width' in image && 'height' in image) {
			const { width: newWidth, height: newHeight } =
				getWidthHeightFromMaxSize(
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
				return remoteFunction.encode(
					imageData,
					newWidth,
					newHeight,
					4,
					4,
				)
			}
		}
	}

	return { encode, decode: remoteFunction.decode, loadImage }
}
