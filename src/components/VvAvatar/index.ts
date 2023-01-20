import { ModifiersProps } from '@/props'
import type { PropType } from 'vue'

export enum AvatarSize {
	md = 'md',
	lg = 'lg'
}

export const VvAvatarProps = {
	...ModifiersProps,
	/**
	 * Round the avatar
	 */
	rounded: Boolean,
	/**
	 * Image src for avatar
	 */
	imgSrc: String,
	/**
	 * CSS class applied on avatar
	 */
	cssClass: String,
	/**
	 * Color applied on background-color property
	 */
	color: String,
	/**
	 * Define the avatar size
	 */
	size: String as PropType<AvatarSize>
}
