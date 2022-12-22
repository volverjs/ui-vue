export interface PlayAttributes {
	canvasElement: HTMLElement
	args: { [key: string]: any }
}

interface ComponentConfig {
	isClickDisabled?: boolean
	className?: string | string[] | null
	slotContent?: string | null
	customText?: string | null
	customElement?: HTMLElement | HTMLOrSVGElement | null
	isVertical?: boolean
	child?: number
	propName?: string
}
