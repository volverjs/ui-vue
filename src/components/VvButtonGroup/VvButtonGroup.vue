<template>
	<div :class="btnGroupClass" role="group">
		<slot />
	</div>
</template>

<script setup lang="ts">
import type IButtonGroupState from '@/composables/group/types/IButtonGroupState'

import { toRefs } from 'vue'
import { VvButtonGroupProps, VvButtonGroupEvents } from './VvButtonGroup'
import { VV_BUTTON_GROUP } from '../../constants'

//Composables
import { useVModel } from '@vueuse/core'
import { useProvideGroupState } from '../../composables/group/useProvideGroupState'
import { useBemModifiers } from '@/composables/useModifiers'

//Emits, props, attrs, slots
const emit = defineEmits(VvButtonGroupEvents)
const props = defineProps(VvButtonGroupProps)

//Data
const modelValue = useVModel(props, 'modelValue', emit)
const {
	disabled,
	vertical,
	compact,
	block,
	rounded,
	toggle,
	action,
	actionQuiet
} = toRefs(props)

//Computed
const { bemCssClasses: btnGroupClass } = useBemModifiers('vv-button-group', {
	vertical,
	compact,
	block
})

// #region group
const groupState: IButtonGroupState = {
	key: VV_BUTTON_GROUP,
	modelValue,
	disabled,
	toggle,
	rounded,
	action,
	actionQuiet
}
useProvideGroupState(groupState)
// #endregion group
</script>
