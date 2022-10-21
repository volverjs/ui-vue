import { computed, toRefs } from 'vue'

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