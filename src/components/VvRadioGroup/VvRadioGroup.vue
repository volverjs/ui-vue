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
		<HintSlot v-if="hasHint" class="vv-input-radio-group__hint" />
	</fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VV_RADIO_GROUP } from '../../constants'
import { useGroup } from '../../composables/group/useGroup'
import { useOptions } from '../../composables/options/useOptions'
import { useHintSlot } from '../../composables/hint/useHint'
import { HintSlot } from '../../components/common/HintSlot.js'
import VvRadio from '../../components/VvRadio/VvRadio.vue'

/**
 * VvInputRadioGroup
 */
export default defineComponent({
	components: {
		VvRadio,
		HintSlot
	},
	props: {
		/**
		 * VModel
		 */
		modelValue: null,
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
		 * True - invalid state
		 */
		error: Boolean,
		/**
		 * Messaggi di errore.
		 */
		errors: [String, Array]
	},
	setup(props, context) {
		const { group } = useGroup(props, context, { key: VV_RADIO_GROUP })

		const { hasHint, isInvalid, isValid } = useHintSlot(props, context)

		const { getOptionLabel, getOptionValue } = useOptions(props, context)

		return {
			group,
			getOptionLabel,
			getOptionValue,
			hasHint,
			isInvalid,
			isValid
		}
	},
	computed: {
		groupClass() {
			return {
				'vv-input-radio-group': true,
				'vv-input-radio-group--horizontal': !this.vertical,
				'vv-input-radio-group--valid': this.isValid,
				'vv-input-radio-group--invalid': this.isInvalid
			}
		}
	},
	methods: {
		getOptionProps(option: any, oIndex: Number) {
			return {
				id: `${this.name}_opt${oIndex}`,
				name: this.name,
				label: this.getOptionLabel(option),
				value: this.getOptionValue(option)
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-radio-group';
</style>
