<template>
	<div :class="btnGroupClass" role="group">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { ButtonGroupState } from '../../composables/group/models'
import { VvButtonGroupProps, VvButtonGroupEvents } from './VvButtonGroup'

//Composables
import { useVModel } from '@vueuse/core'
import { useProvideGroupState } from '../../composables/group/useGroup'
import { useBemModifiers } from '@/composables/useModifiers'

//Emits, props, attrs, slots
const emit = defineEmits(VvButtonGroupEvents)
const props = defineProps(VvButtonGroupProps)

//Data
const modelValue = useVModel(props, 'modelValue', emit)
const { disabled, vertical, compact, block, rounded, toggle } = toRefs(props)

//Computed
const { bemCssClasses: btnGroupClass } = useBemModifiers('vv-button-group', {
	vertical,
	compact,
	block,
	rounded
})

// #region group
const groupState = new ButtonGroupState({
	modelValue,
	disabled,
	toggle
})
useProvideGroupState(groupState, emit)
// #endregion group
</script>
