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
import { useSlots, computed, shallowRef } from 'vue'
import { useProvideGroupState } from '../../composables/group/useGroup'
import { useOptions } from '../../composables/options/useOptions'
import { InputGroupState } from '../../composables/group/group'
import { VV_CHECK_GROUP } from '../../constants'

import VvCheck from '../../components/VvCheck/VvCheck.vue'
import { HintSlotFactory } from '../common/HintSlot'
import type { IInputGroupOptions } from '@/composables/group/types'

//Props
const props = defineProps({
	/**
	 * VModel
	 */
	modelValue: { type: Array },
	/**
	 * Radio group label
	 */
	label: { type: String, default: '' },
	/**
	 * Nome da utilizzare per il radio group
	 */
	name: { type: String, default: '', required: true },
	/**
	 * True se disabilitato
	 */
	disabled: { type: Boolean, default: false },
	/**
	 * True se readonly
	 */
	readonly: { type: Boolean, default: false },
	/**
	 * True = show buttons vertically
	 */
	vertical: { type: Boolean, default: false },
	/**
	 * Lista delle radio options
	 */
	options: { type: Array, default: () => [] },
	/**
	 * Se options è un array di oggetti, optionLabel = nome del campo da utilizzare come label oppure una funzione per ricavare la label
	 */
	optionLabel: { type: [String, Function], default: () => 'label' },
	/**
	 * Se options è un array di oggetti, optionValue = nome del campo da utilizzare come value oppure una funzione per ricavare il value
	 */
	optionValue: { type: [String, Function], default: () => 'value' },
	/**
	 * Testo help
	 */
	hintLabel: { type: String, default: '' },
	/**
	 * True - valid state
	 */
	valid: Boolean,
	/**
	 * Messaggio custom per un valore valido
	 */
	validLabel: [String, Array],
	/**
	 * True - invalid state.
	 * @default
	 * True (invalid)| False (valid), Null/Undefined (indefinito - non impostato)
	 */
	error: Boolean,
	/**
	 * Messaggi di errore.
	 */
	errors: [String, Array]
})

//Emits
const emit = defineEmits(['update:modelValue', 'change'])

//Slots
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
// use options composable to retrieve correct label and value
const { getOptionLabel, getOptionValue } = useOptions(props, { emit })

//Computed
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

const HintSlot = shallowRef(HintSlotFactory(props, slots))
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-checkbox-group';
</style>
