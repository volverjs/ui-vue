export interface PlayAttributes {
	canvasElement: HTMLElement
	// eslint-disable-next-line
	args: Record<string, any>
	name?: string
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
