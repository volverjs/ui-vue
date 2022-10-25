import type { Slot } from 'vue'
import { computed, toRefs } from 'vue'

interface ComponentIconProps {
	icon: string
	iconPosition: string
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
	const { icon, iconPosition } = toRefs(props)

	const hasIconLeft = computed(
		() => (icon.value && iconPosition.value === 'left') || slots.iconLeft
	)
	const hasIconRight = computed(
		() => (icon.value && iconPosition.value === 'right') || slots.iconRight
	)
	const hasIconTop = computed(
		() => (icon.value && iconPosition.value === 'top') || slots.iconTop
	)
	const hasIconBottom = computed(
		() =>
			(icon.value && iconPosition.value === 'bottom') || slots.iconBottom
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

export function useIcons(props: any, context: any) {
	const { slots } = context
	const { icon, iconPosition } = toRefs(props)
	const {
		'icon-left': iconLeft,
		'icon-right': iconRight,
		'icon-top': iconTop,
		'icon-bottom': iconBottom
	} = slots

	const hasIconLeft = computed(
		() => (icon.value && iconPosition.value === 'left') || iconLeft
	)
	const hasIconRight = computed(
		() => (icon.value && iconPosition.value === 'right') || iconRight
	)
	const hasIconTop = computed(
		() => (icon.value && iconPosition.value === 'top') || iconTop
	)
	const hasIconBottom = computed(
		() => (icon.value && iconPosition.value === 'bottom') || iconBottom
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
