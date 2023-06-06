export type AlertModifiers =
	| 'success'
	| 'info'
	| 'warning'
	| 'danger'
	| 'brand'
	| 'accent'

export type Alert = {
	id: string | number
	group: string
	title?: string
	icon: string | Record<string, unknown>
	content?: string
	footer?: string
	modifiers: AlertModifiers
	dismissable: boolean
	autoClose: number
	timestamp: number
}
