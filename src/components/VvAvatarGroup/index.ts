import { ModifiersProps } from '@/props'

export type AvatarItem = {
	key?: string
	text?: string
	imgSrc?: string
	modifiers?: string | string[]
}

export const VvAvatarGroupProps = {
	...ModifiersProps,
	/**
	 * avatar items
	 */
	items: {
		type: Array as PropType<AvatarItem[]>,
		default: () => [],
		required: true,
	},
	toShow: {
		type: Number,
		default: 3,
	},
	totalItems: {
		type: Number,
	},
	avatarModifiers: [String, Array] as PropType<string | string[]>,
}
