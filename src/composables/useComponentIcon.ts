import type { Ref } from 'vue'
import { Position, Side } from '../constants'

export function useComponentIcon(
	icon: Ref<string | object | undefined> | undefined,
	iconPosition: Ref<string>,
) {
	const hasIconBefore = computed(() =>
		Boolean(icon?.value && iconPosition.value === Position.before),
	)
	const hasIconAfter = computed(() =>
		Boolean(icon?.value && iconPosition.value === Position.after),
	)
	const hasIconLeft = computed(() =>
		Boolean(icon?.value && iconPosition.value === Side.left),
	)
	const hasIconRight = computed(() =>
		Boolean(icon?.value && iconPosition.value === Side.right),
	)
	const hasIconTop = computed(() =>
		Boolean(icon?.value && iconPosition.value === Side.top),
	)
	const hasIconBottom = computed(() =>
		Boolean(icon?.value && iconPosition.value === Side.bottom),
	)
	const hasIcon = computed(() => {
		if (typeof icon?.value === 'string') {
			return { name: icon?.value }
		}
		return icon?.value
	})
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
