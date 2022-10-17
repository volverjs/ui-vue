<template>
	<label :class="radioClass" v-bind="radioAttrs" @click="onClick">
		<input
			ref="input"
			:class="radioInputClass"
			v-bind="radioInputAttrs"
			@input="onChange" />
		<slot :value="modelValue">
			{{ label }}
		</slot>
		<HintSlot v-if="hasHint" class="vv-input-radio__hint" />
	</label>
</template>

<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { defineComponent } from 'vue'
import { VV_RADIO_GROUP } from '../../constants'
import { useInputFocus } from '../../composables/focus/useInputFocus'
import { useSharedGroupState } from '../../composables/group/useSharedGroupState'
import { useHintSlot } from '../../composables/hint/useHint'
import { HintSlot } from '../../components/common/HintSlot.js'

import ObjectUtilities from '../../utils/ObjectUtilities'

/**
 * Radio Button
 */
export default defineComponent({
	inheritAttrs: false,
	emits: ['click', 'update:modelValue', 'change', 'focus', 'blur'],
	components: {
		HintSlot
	},
	props: {
		/**
		 * Valore del radio
		 */
		value: null,
		/**
		 * VModel
		 */
		modelValue: { type: [Object, Number, Boolean, String] },
		/**
		 * Label radio button
		 */
		label: { type: String, default: '' },
		/**
		 * True se disabilitato
		 */
		disabled: Boolean,
		/**
		 * True se readonly
		 */
		readonly: Boolean,
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
		const { input, focused } = useInputFocus(context)

		const {
			wrappedModelValue,
			group,
			isInGroup,
			isDisabled,
			isReadonly,
			checkIsSelected
		} = useSharedGroupState(props, context, { key: VV_RADIO_GROUP })

		const { hasHint, isInvalid, isValid } = useHintSlot(props, context)

		return {
			input,
			focused,
			group,
			wrappedModelValue,
			isInGroup,
			isDisabled,
			isReadonly,
			checkIsSelected,
			hasHint,
			isInvalid,
			isValid
		}
	},
	computed: {
		radioClass() {
			const { class: cssClass } = this.$attrs
			return {
				'vv-input-radio': true,
				'vv-input-radio--valid': this.isValid,
				'vv-input-radio--invalid': this.isInvalid,
				class: cssClass
			}
		},
		radioAttrs() {
			const { id, name, style } = this.$attrs
			const dataAttrs = ObjectUtilities.pickBy(this.$attrs, (k: string) =>
				k.startsWith('data-')
			)
			return {
				for: (id || name) as string,
				style,
				...dataAttrs
			}
		},
		radioInputClass() {
			return {
				'focus-visible': this.focused,
				'vv-input-radio__input--checked': this.isChecked,
				'vv-input-radio__input--disabled': this.isDisabled,
				'vv-input-radio__input--readonly': this.isReadonly
			}
		},
		radioInputAttrs() {
			const {
				id = '',
				name = '',
				value = ''
			} = this.$attrs as InputHTMLAttributes
			return {
				type: 'radio',
				id: id || name,
				name,
				value,
				disabled: this.isDisabled,
				readonly: this.isReadonly,
				checked: this.isChecked,
				...this.radioInputAriaAttrs
			}
		},
		radioInputAriaAttrs() {
			const { name } = this.$attrs
			const dataAttrs = ObjectUtilities.pickBy(this.$attrs, (k: string) =>
				k.startsWith('aria-')
			)
			return {
				'aria-label': name,
				'aria-checked': this.isChecked,
				...dataAttrs
			}
		},
		isChecked() {
			return this.checkIsSelected(this.$attrs.value)
		}
	},
	methods: {
		onChange() {
			if (!this.isChecked) this.$emit('change', this.$attrs.value)
			this.wrappedModelValue = this.$attrs.value
		},
		onClick(event: Event) {
			if (!this.disabled) {
				this.$emit('click', event)
				// this.$emit('update:modelValue', this.$attrs.value)
				// if (this.group) this.group.add(this.$attrs.value)
				this.focused = true
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-radio';
</style>
