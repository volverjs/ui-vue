<template>
	<label :class="checkClass" v-bind="checkAttrs" @click="onClick">
		<input
			ref="input"
			:class="checkInputClass"
			v-bind="checkInputAttrs"
			@input="onChange" />
		<!-- @slot Use this slot for check label -->
		<slot :value="modelValue">
			{{ label }}
		</slot>
		<slot name="hint" :value="modelValue">
			<small
				class="vv-input-checkbox__hint"
				style="white-space: pre"
				v-if="hasHintLabel">
				{{ currentHintLabel }}
			</small>
		</slot>
	</label>
</template>

<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { defineComponent } from 'vue'
import { VV_CHECK_GROUP } from '../../constants'
import { useInputFocus } from '../../composables/focus/useInputFocus'
import { useSharedGroupState } from '../../composables/group/useSharedGroupState'
import { useHint } from '../../composables/hint/useHint'

import ObjectUtilities from '../../utils/ObjectUtilities'

/**
 * Check
 */
export default defineComponent({
	inheritAttrs: false,
	emits: ['click', 'update:modelValue', 'change', 'focus', 'blur'],
	props: {
		/**
		 * Valore della check
		 */
		value: null,
		/**
		 * VModel
		 * @description
		 * Se Binary = true, modelValue puo essere Object,Boolean,Number
		 * Altrimenti modelValue sarà un Array
		 */
		modelValue: [Array, Boolean, Number, String],
		/**
		 * True - ritorna un valore del checkbox binario (es True/False) invece di un valori multipli
		 */
		binary: Boolean,
		/**
		 * Se binary=true, valore associato allo stato checked (ritornato al posto di TRUE)
		 */
		trueValue: { type: null, default: true },
		/**
		 * Se binary=true, valore associato allo stato unchecked (ritornato al posto di FALSE)
		 */
		falseValue: { type: null, default: false },
		/**
		 * True - visualizza il VvCheck come un pulsante Switch/Toggle
		 */
		switch: Boolean,
		/**
		 * Label componente
		 */
		label: String,
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
		} = useSharedGroupState<any>(props, context, { key: VV_CHECK_GROUP })

		const { hasHintLabel, currentHintLabel } = useHint(props, context)

		return {
			input,
			focused,
			group,
			wrappedModelValue,
			isInGroup,
			isDisabled,
			isReadonly,
			checkIsSelected,
			hasHintLabel,
			currentHintLabel
		}
	},
	computed: {
		checkClass() {
			const { class: cssClass } = this.$attrs
			return {
				'vv-input-checkbox': true,
				'vv-input-checkbox--switch': this.switch,
				'vv-input-checkbox--valid': this.error === false,
				'vv-input-checkbox--invalid': this.error === true,
				class: cssClass
			}
		},
		checkAttrs() {
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
		checkInputClass() {
			return {
				'focus-visible': this.focused,
				'vv-input-check__input--checked': this.isChecked,
				'vv-input-check__input--disabled': this.isDisabled,
				'vv-input-check__input--readonly': this.isReadonly
			}
		},
		checkInputAttrs() {
			const {
				id = '',
				name = '',
				value = ''
			} = this.$attrs as InputHTMLAttributes
			return {
				type: 'checkbox',
				id: id || name,
				name,
				value,
				disabled: this.isDisabled,
				readonly: this.isReadonly,
				checked: this.isChecked,
				...this.checkInputAriaAttrs
			}
		},
		checkInputAriaAttrs() {
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
			return this.binary
				? ObjectUtilities.equals(this.wrappedModelValue, this.trueValue)
				: this.checkIsSelected(this.value)
		}
	},
	methods: {
		onChange() {
			if (this.binary) {
				this.wrappedModelValue = this.isChecked
					? this.falseValue
					: this.trueValue
				return
			}

			if (Array.isArray(this.wrappedModelValue)) {
				this.wrappedModelValue = !this.isChecked
					? [...this.wrappedModelValue, this.value]
					: ObjectUtilities.removeFromList(
							this.value,
							this.wrappedModelValue
					  )
				return
			}

			console.warn(
				'Cannot change value - VvCheck modelValue is not an array'
			)
		},
		onClick(event: MouseEvent | undefined) {
			if (!this.disabled) {
				this.$emit('click', event)
				this.$emit('change', this.isChecked ? this.value : null)
				this.focused = true
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-checkbox';
</style>
