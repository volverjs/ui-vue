import type { IVariant } from '../../types/props'

export interface IVvCardProps extends IVariant {
	title: string
}

export const VvCardProps = {
	title: String,
	modifiers: [String, Array]
}
