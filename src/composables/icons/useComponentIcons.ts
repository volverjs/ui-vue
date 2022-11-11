import type { Slot, Ref } from 'vue'
import { computed } from 'vue'

interface ComponentIconProps {
	icon: Ref<string>
	iconPosition: Ref<string>
}

interface ComponentIconSlots {
	iconLeft?: Slot | undefined
	iconRight?: Slot | undefined
	iconTop?: Slot | undefined
	iconBottom?: Slot | undefined
}

export function useComponentIcons(
	props: ComponentIconProps,
	slots: ComponentIconSlots
) {
	const { icon, iconPosition } = props

	const hasIconLeft = computed(
		() =>
			!!((icon.value && iconPosition.value === 'left') || slots.iconLeft)
	)
	const hasIconRight = computed(
		() =>
			!!(
				(icon.value && iconPosition.value === 'right') ||
				slots.iconRight
			)
	)
	const hasIconTop = computed(
		() => !!((icon.value && iconPosition.value === 'top') || slots.iconTop)
	)
	const hasIconBottom = computed(
		() =>
			!!(
				(icon.value && iconPosition.value === 'bottom') ||
				slots.iconBottom
			)
	)

	return {
		icon,
		iconPosition,
		hasIconLeft,
		hasIconRight,
		hasIconTop,
		hasIconBottom
	}
}

export function useComponentIcon(
	icon: Ref<string>,
	iconPosition: Ref<string>,
	slots: ComponentIconSlots
) {
	const hasIconLeft = computed(
		() =>
			!!((icon.value && iconPosition.value === 'left') || slots.iconLeft)
	)
	const hasIconRight = computed(
		() =>
			!!(
				(icon.value && iconPosition.value === 'right') ||
				slots.iconRight
			)
	)
	const hasIconTop = computed(
		() => !!((icon.value && iconPosition.value === 'top') || slots.iconTop)
	)
	const hasIconBottom = computed(
		() =>
			!!(
				(icon.value && iconPosition.value === 'bottom') ||
				slots.iconBottom
			)
	)

	return {
		hasIconLeft,
		hasIconRight,
		hasIconTop,
		hasIconBottom
	}
}
