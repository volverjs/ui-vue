<template>
	<label :class="checkClass" v-bind="checkAttrs" @click="onClick">
		<input
			ref="input"
			:class="checkInputClass"
			v-bind="checkInputAttrs"
			@input="onChange" />
		<slot>
			{{ label }}
		</slot>
	</label>
</template>

<script lang="ts">
import type { InputHTMLAttributes } from 'vue'

import { defineComponent, ref } from 'vue'
import { useInputFocus } from '../../composables/focus/useInputFocus'
import {
	useWrapInGroup,
	VV_CHECK_GROUP
} from '../../composables/group/useGroup'

import ObjectUtilities from '../../utils/ObjectUtilities'

/**
 * Check
 */
export default defineComponent({
	inheritAttrs: false,
	emits: ['click', 'update:modelValue', 'change', 'focus', 'blur'],
	props: {
		/**
		 * VModel
		 */
		modelValue: { type: [Array, Boolean] },
		/**
		 * True - ritorna un valore del checkbox True/False invece di un valori multipli
		 */
		binary: { type: Boolean, default: false },
		/**
		 * Valore associato a true
		 */
		trueValue: { type: null, default: true },
		/**
		 * Valore associato a false
		 */
		falseValue: { type: null, default: false },
		/**
		 * True - visualizza il checkbox come un toggle
		 */
		switch: { type: Boolean, default: false },
		/**
		 * Label radio button
		 */
		label: { type: String, default: '' },
		/**
		 * True se disabilitato
		 */
		disabled: { type: Boolean, default: false }
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
		} = useWrapInGroup(VV_CHECK_GROUP, { props, context })

		return {
			input,
			focused,
			group,
			wrappedModelValue,
			isInGroup,
			isDisabled,
			isReadonly,
			checkIsSelected
		}
	},
	computed: {
		checkClass() {
			const { class: cssClass } = this.$attrs
			return {
				'vv-input-checkbox': true,
				'vv-input-checkbox--switch': this.switch,
				class: cssClass
			}
		},
		checkAttrs() {
			const { id, name, styles } = this.$attrs
			const dataAttrs = ObjectUtilities.pickBy(this.$attrs, (k: string) =>
				k.startsWith('data-')
			)
			return {
				for: (id || name) as string,
				styles,
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
				? this.wrappedModelValue
				: this.checkIsSelected(this.$attrs.value)
		}
	},
	methods: {
		onChange() {
			let _value = this.$attrs.value
			if (this.binary) {
				this.wrappedModelValue = this.isChecked
					? this.falseValue
					: this.trueValue
				return
			}

			this.wrappedModelValue = !this.isChecked
				? [...this.wrappedModelValue, _value]
				: ObjectUtilities.removeFromList(_value, this.wrappedModelValue)
		},
		onClick(event: Event) {
			if (!this.disabled) {
				this.$emit('click', event)
				this.$emit('change', this.isChecked ? this.$attrs.value : null)
				this.focused = true
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-checkbox';
</style>