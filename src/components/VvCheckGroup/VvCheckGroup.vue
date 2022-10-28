<template>
	<fieldset :class="groupClass">
		<legend v-if="label" v-text="label" />
		<div class="vv-input-checkbox-group__wrapper">
			<!-- #region options set up -->
			<template v-if="options.length > 0">
				<vv-check
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
		<HintSlot class="vv-input-checkbox-group__hint" />
	</fieldset>
</template>

<script setup lang="ts">
import type { IInputGroupOptions } from '@/composables/group/types'

import { useSlots, computed } from 'vue'
import { InputGroupState } from '../../composables/group/models'
import { VvCheckGroupProps, VvCheckGroupEvents } from './VvCheckGroup'

//Costanti
import { VV_CHECK_GROUP } from '../../constants'

//Composables
import { useProvideGroupState } from '../../composables/group/useGroup'
import { useOptions } from '../../composables/options/useOptions'

//Components
import VvCheck from '../../components/VvCheck/VvCheck.vue'
import { HintSlotFactory } from '../common/HintSlot'

//Props, Emits, Slots e Attrs
const props = defineProps(VvCheckGroupProps)
const emit = defineEmits(VvCheckGroupEvents)
const slots = useSlots()

// #region group
// Define reactive props
const inputGroupOptions: IInputGroupOptions = {
	disabled: props.disabled,
	modelValue: props.modelValue,
	readonly: props.readonly
}
// Create groupState instance
const groupState = new InputGroupState(VV_CHECK_GROUP, inputGroupOptions)
// Use group composable to provide the group state to children
useProvideGroupState(groupState, emit)
// #endregion group

// OPTIONS
const { getOptionLabel, getOptionValue } = useOptions(props)

//Styles & Bindings
const groupClass = computed(() => {
	return {
		'vv-input-checkbox-group': true,
		'vv-input-checkbox-group--horizontal': !props.vertical,
		'vv-input-checkbox-group--valid': props.valid,
		'vv-input-checkbox-group--invalid': props.error
	}
})

//Methods
const getOptionProps = (option: any, oIndex: number) => {
	return {
		id: `${props.name}_opt${oIndex}`,
		name: props.name,
		label: getOptionLabel(option),
		value: getOptionValue(option)
	}
}

const HintSlot = HintSlotFactory(props, slots)
</script>
