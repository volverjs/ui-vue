import type { Ref } from 'vue'
import type { VvIconProps } from '../components/VvIcon'
import { Position, Side } from '../constants'

export function useComponentIcon(
	icon?: Ref<string | VvIconProps | undefined>,
	iconPosition?: Ref<string | undefined>,
) {
	const hasIcon = computed(() => {
		if (typeof icon?.value === 'string') {
			return { name: icon?.value }
		}
		return icon?.value
	})
	const hasIconBefore = computed(() =>
		iconPosition?.value === Position.before ? hasIcon.value : undefined,
	)
	const hasIconAfter = computed(() =>
		iconPosition?.value === Position.after ? hasIcon.value : undefined,
	)
	const hasIconLeft = computed(() =>
		iconPosition?.value === Side.left ? hasIcon.value : undefined,
	)
	const hasIconRight = computed(() =>
		iconPosition?.value === Side.right ? hasIcon.value : undefined,
	)
	const hasIconTop = computed(() =>
		iconPosition?.value === Side.top ? hasIcon.value : undefined,
	)
	const hasIconBottom = computed(() =>
		iconPosition?.value === Side.bottom ? hasIcon.value : undefined,
	)
	return {
		hasIcon,
		hasIconLeft,
		hasIconRight,
		hasIconTop,
		hasIconBottom,
		hasIconBefore,
		hasIconAfter,
	}
}
