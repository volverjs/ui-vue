<script lang="ts">
	export default {
		name: 'VvButtonGroup',
	}
</script>

<script setup lang="ts">
	import type { ButtonGroupState } from '@/types/group'
	import { INJECTION_KEY_BUTTON_GROUP } from '@/constants'
	import {
		VvButtonGroupProps,
		VvButtonGroupEvents,
	} from '@/components/VvButtonGroup'

	// emit and props
	const emit = defineEmits(VvButtonGroupEvents)
	const props = defineProps(VvButtonGroupProps)

	// data
	const {
		disabled,
		toggle,
		modifiers,
		multiple,
		unselectable,
		itemModifiers,
	} = toRefs(props)
	watchEffect(() => {
		if (typeof props.modelValue === 'string' && multiple.value) {
			// eslint-disable-next-line
			console.warn(
				`[VvButtonGroup]: modelValue is a string but multiple is true.`,
			)
		}
	})
	const modelValue = computed({
		get: () => {
			if (!multiple.value) {
				return Array.isArray(props.modelValue)
					? props.modelValue[0]
					: props.modelValue
			}
			return props.modelValue
		},
		set: (newValue) => {
			if (
				newValue !== undefined &&
				(Array.isArray(props.modelValue) || multiple.value) &&
				!Array.isArray(newValue)
			) {
				newValue = [newValue]
			}
			return emit('update:modelValue', newValue)
		},
	})

	// provide
	useProvideGroupState<ButtonGroupState>({
		key: INJECTION_KEY_BUTTON_GROUP,
		modelValue,
		disabled,
		toggle,
		multiple,
		unselectable,
		itemModifiers,
	})

	// style
	const bemCssClasses = useModifiers('vv-button-group', modifiers)
</script>

<template>
	<div :class="bemCssClasses" role="group">
		<!-- @slot Default slot -->
		<slot />
	</div>
</template>
