<template>
	<label :class="radioClass" v-bind="radioAttrs" @click="onClick">
		<input
			ref="input"
			:class="radioInputClass"
			v-bind="radioInputAttrs"
			@input="onChange" />
		<slot>
			{{ label }}
		</slot>
	</label>
</template>

<script lang="ts">
import type { UseGroupComponentProps } from '@/composables/group/types'
import type { InputHTMLAttributes } from 'vue'

import { defineComponent, toRefs } from 'vue'
import { useInputFocus } from '../../composables/focus/useInputFocus'
import { useSharedGroupState } from '../../composables/group/useSharedGroupState'
import { VV_RADIO_GROUP } from '../../constants'

import ObjectUtilities from '../../utils/ObjectUtilities'

/**
 * Radio Button
 */
export default defineComponent({
	inheritAttrs: false,
	emits: ['click', 'update:modelValue', 'change', 'focus', 'blur'],
	props: {
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
		disabled: { type: Boolean, default: false }
	},
	setup(props, { emit }) {
		const { disabled, modelValue } = toRefs(props)

		const { input, focused } = useInputFocus({ emit })

		const sharedProps: UseGroupComponentProps = { disabled, modelValue }
		const {
			wrappedModelValue,
			group,
			isInGroup,
			isDisabled,
			isReadonly,
			checkIsSelected
		} = useSharedGroupState(VV_RADIO_GROUP, { props: sharedProps, emit })

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
		radioClass() {
			const { class: cssClass } = this.$attrs
			return {
				'vv-input-radio': true,
				class: cssClass
			}
		},
		radioAttrs() {
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
