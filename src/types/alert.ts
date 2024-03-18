import type { VvIconProps } from '@/components/VvIcon'
import { AlertRole } from '@/constants'

export type AlertModifier =
	| 'success'
	| 'info'
	| 'warning'
	| 'danger'
	| 'brand'
	| 'accent'
	| string

export type Alert = {
	id: string | number
	title?: string
	icon?: string | VvIconProps
	content?: string
	footer?: string
	modifiers?: AlertModifier | AlertModifier[]
	dismissable?: boolean
	autoClose?: number
	closeLabel?: string
	role?: AlertRole
}
