import { ModifiersProps } from '@/props'

export enum AvatarSize {
	md = 'md',
	lg = 'lg'
}

export const VvAvatarProps = {
	...ModifiersProps,
	/**
	 * Image src for avatar
	 */
	imgSrc: String
}
