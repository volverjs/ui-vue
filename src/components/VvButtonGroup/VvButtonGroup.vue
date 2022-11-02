<template>
	<div :class="btnGroupClass" role="group">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { toRefs, ref } from 'vue'
import { ButtonGroupState } from '../../composables/group/models'
import { VvButtonGroupProps, VvButtonGroupEvents } from './VvButtonGroup'

//Composables
import { useProvideGroupState } from '../../composables/group/useGroup'
import { useBemModifiers } from '@/composables/useModifiers'

//Emits, props, attrs, slots
const emit = defineEmits(VvButtonGroupEvents)
const props = defineProps(VvButtonGroupProps)

//Data
const { modelValue, disabled, vertical, compact, block, rounded, toggle } =
	toRefs(props)

//Computed
const { bemCssClasses: btnGroupClass } = useBemModifiers('vv-button-group', {
	vertical,
	compact,
	block,
	rounded
})

// #region group
const groupState = new ButtonGroupState({
	modelValue: ref(modelValue?.value),
	disabled,
	toggle
})
// Use group composable to provide the group state to children
useProvideGroupState(groupState, emit)
// #endregion group
</script>
