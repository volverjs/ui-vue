import { ModifiersProps } from '@/props'
import type { PropType } from 'vue'

export enum AvatarSize {
	md = 'md',
	lg = 'lg'
}

export const VvAvatarProps = {
	...ModifiersProps,
	rounded: Boolean,
	imgSrc: String,
	cssClass: String,
	color: String,
	size: String as PropType<AvatarSize>
}
