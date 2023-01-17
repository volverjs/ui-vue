<script lang="ts">
	export default {
		name: 'VvButtonGroup',
	}
</script>

<script setup lang="ts">
	import type IButtonGroupState from '@/composables/group/types/IButtonGroupState'
	import { toRefs, watchEffect, computed } from 'vue'
	import { VV_BUTTON_GROUP } from '@/constants'
	import { useProvideGroupState } from '@/composables/group/useProvideGroupState'
	import { useBemModifiers } from '@/composables/useModifiers'
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
	const groupState: IButtonGroupState = {
		key: VV_BUTTON_GROUP,
		modelValue,
		disabled,
		toggle,
		multiple,
		unselectable,
		modifiers: itemModifiers,
	}
	useProvideGroupState(groupState)

	// style
	const { bemCssClasses } = useBemModifiers('vv-button-group', {
		modifiers,
	})
</script>

<template>
	<div :class="bemCssClasses" role="group">
		<!-- @slot Buttons slot -->
		<slot />
	</div>
</template>
