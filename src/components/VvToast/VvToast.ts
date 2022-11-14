import type { ExtractPropTypes } from 'vue'

import { ModifiersProps } from '@/props'

export const VvToastProps = {
	...ModifiersProps,
	title: String,
	message: String,
	icon: String,
	closable: Boolean,
	visible: Boolean,
	top: Boolean,
	bottom: Boolean,
	right: Boolean,
	left: Boolean,
	autoclose: Number,
	closeOnClick: Boolean,
	transition: String,
	center: Boolean,
	fixed: Boolean
}

export const VvToastEvents = ['close', 'update:visible']

type VvToastPropsType = typeof VvToastProps
export type VvToastPropsTypes = ExtractPropTypes<VvToastPropsType>
