import type { ExtractPropTypes } from 'vue'

import { ModifiersProps } from '@/props'
import { POSITIONS } from './constants'

export const VvAlertProps = {
	...ModifiersProps,
	title: String,
	message: String,
	icon: String,
	closable: Boolean,
	visible: Boolean,
	fixed: Boolean,
	position: {
		type: String,
		default: POSITIONS['top-inline'],
		validator: (value: string) => Object.keys(POSITIONS).includes(value)
	},
	size: String
	// transition: { type: String, default: 'fade-block' }
}

export const VvAlertEvents = ['close', 'update:visible']

type VvAlertPropsType = typeof VvAlertProps
export type VvAlertPropsTypes = ExtractPropTypes<VvAlertPropsType>
