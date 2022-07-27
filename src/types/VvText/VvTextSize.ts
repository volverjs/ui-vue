export const TEXT_SIZE_DYNAMIC = [
	'xs',
	'sm',
	'base',
	'lg',
	'xl',
	'2xl',
	'3xl'
] as const

export const TEXT_SIZE_STATIC = [
	'12',
	'14',
	'16',
	'18',
	'20',
	'24',
	'30',
	'36',
	'48',
	'60',
	'72',
	'96',
	'128'
] as const

// export types { VvTextSizeDynamic, VvTextSizeStatic }
export type VvTextSizeDynamic = typeof TEXT_SIZE_DYNAMIC[number]
export type VvTextSizeStatic = typeof TEXT_SIZE_STATIC[number]

export const isTextSizeDynamic = (x: VvTextSizeDynamic) =>
	TEXT_SIZE_DYNAMIC.includes(x)

export const isTextSizeStatic = (x: VvTextSizeStatic) =>
	TEXT_SIZE_STATIC.includes(x)
