<template>
	<fieldset :class="groupClass">
		<legend v-if="label" v-text="label" />
		<div class="vv-input-radio-group__wrapper">
			<!-- #region options set up -->
			<template v-if="options.length > 0">
				<vv-radio
					v-for="(o, oIndex) in options"
					:key="oIndex"
					v-bind="getOptionProps(o, oIndex)" />
			</template>
			<!-- #endregion options set up -->
			<!-- #region default -->
			<slot v-else />
			<!-- #endregion default -->
		</div>
		<!-- @slot error,valid,hint,loading vanno vanno qua -->
		<HintSlot class="vv-input-radio-group__hint" />
	</fieldset>
</template>

<script setup lang="ts">
import type { IInputGroupOptions } from '../../composables/group/types'

import { useSlots, computed } from 'vue'
import { InputGroupState } from '../../composables/group/models'
import { VvRadioGroupProps, VvRadioGroupEvents } from './VvRadioGroup'

//Composables
import { useProvideGroupState } from '../../composables/group/useGroup'
import { useOptions } from '../../composables/options/useOptions'

//Constants
import { VV_RADIO_GROUP } from '../../constants'

//Components
import VvRadio from '../../components/VvRadio/VvRadio.vue'
import { HintSlotFactory } from '../common/HintSlot'

//Props, Emits, Slots e Attrs
const emit = defineEmits(VvRadioGroupEvents)
const props = defineProps(VvRadioGroupProps)
const slots = useSlots()

// #region group
// Define reactive props
const inputGroupOptions: IInputGroupOptions = {
	disabled: props.disabled,
	modelValue: props.modelValue,
	readonly: props.readonly
}
// Create groupState instance
const groupState = new InputGroupState(VV_RADIO_GROUP, inputGroupOptions)
// Use group composable to provide the group state to children
useProvideGroupState(groupState, emit)
// #endregion group

//OPTIONS
const { getOptionLabel, getOptionValue } = useOptions(props)

//Styles & Bindings
const groupClass = computed(() => {
	return {
		'vv-input-radio-group': true,
		'vv-input-radio-group--horizontal': !props.vertical,
		'vv-input-radio-group--valid': props.valid,
		'vv-input-radio-group--invalid': props.error
	}
})

//Methods
function getOptionProps(option: any, oIndex: number) {
	return {
		id: `${props.name}_opt${oIndex}`,
		name: props.name,
		label: getOptionLabel(option),
		value: getOptionValue(option)
	}
}

const HintSlot = HintSlotFactory(props, slots)
</script>
