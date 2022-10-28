<template>
	<div :class="btnGroupClass" role="group">
		<slot />
	</div>
</template>

<script setup lang="ts">
import type { IButtonGroupOptions } from '../../composables/group/types'

import { computed } from 'vue'
import { ButtonGroupState } from '../../composables/group/models'
import { VvButtonGroupProps, VvButtonGroupEvents } from './VvButtonGroup'

//Composables
import { useProvideGroupState } from '../../composables/group/useGroup'

//Emits, props, attrs, slots
const emit = defineEmits(VvButtonGroupEvents)
const props = defineProps(VvButtonGroupProps)

//Computed
const btnGroupClass = computed(() => {
	return {
		'vv-button-group': true,
		'vv-button-group--vertical': props.vertical,
		'vv-button-group--compact': props.compact,
		'vv-button-group--block': props.block,
		'vv-button-group--rounded': props.rounded
	}
})

// #region group
// Define reactive props
const buttonGroupOptions: IButtonGroupOptions = {
	disabled: props.disabled,
	modelValue: props.modelValue,
	toggle: props.toggle
}
// Create groupState instance
const groupState = new ButtonGroupState(buttonGroupOptions)
// Use group composable to provide the group state to children
useProvideGroupState(groupState, emit)
// #endregion group
</script>
