class ValidationError extends Error {}
export type BlurhashWorkerType = {
	encode: (
		pixels: Uint8ClampedArray,
		width: number,
		height: number,
		componentX: number,
		componentY: number,
	) => string
	decode: (
		blurhash: string,
		width: number,
		height: number,
		punch?: number,
	) => Uint8ClampedArray
	isBlurhashValid: (blurhash: string) => {
		result: boolean
		errorReason?: string
	}
	ValidationError: ValidationError
}
