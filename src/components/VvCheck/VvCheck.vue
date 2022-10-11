<template>
	<label :class="checkClass" v-bind="checkAttrs" @click.prevent="onClick">
		<input
			ref="input"
			:class="checkInputClass"
			v-bind="checkInputAttrs"
			v-model="currentModelValue"
			v-on="checkInputListeners" />
		<slot>
			{{ label }}
		</slot>
	</label>
</template>

<script lang="ts">
import type { InputHTMLAttributes } from 'vue'

import { defineComponent, ref } from 'vue'
import { useFocus } from '@vueuse/core'
import {
	useCurrentGroup,
	VV_CHECK_GROUP
} from '../../composables/group/useGroup'

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
		modelValue: null,
		/**
		 * Label radio button
		 */
		label: { type: String, default: '' },
		/**
		 * True se disabilitato
		 */
		disabled: { type: Boolean, default: false }
	},
	setup() {
		const input = ref()
		const { focused } = useFocus(input)
		const group = useCurrentGroup(VV_CHECK_GROUP)

		return {
			group,
			input,
			focused
		}
	},
	computed: {
		currentModelValue() {
			return this.isInGroup ? this.group?.modelValue : this.modelValue
		},
		checkClass() {
			const { class: cssClass } = this.$attrs
			return {
				'vv-input-check': true,
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
				'focus-visible': this.focused
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
		checkInputListeners() {
			return {
				focus: (event: Event) => this.$emit('focus', event),
				blur: (event: Event) => this.$emit('blur', event)
			}
		},
		isChecked() {
			return (
				ObjectUtilities.isNotEmpty(this.currentModelValue) &&
				ObjectUtilities.equals(
					this.currentModelValue,
					this.$attrs.value
				)
			)
		},
		isDisabled() {
			return this.disabled || (this.group && this.group.disabled)
		},
		isInGroup() {
			return !ObjectUtilities.isNotEmpty(this.group)
		}
	},
	methods: {
		onClick(event: Event) {
			if (!this.disabled) {
				this.$emit('click', event)
				this.$emit('update:modelValue', this.$attrs.value)
				if (!this.isChecked) {
					this.$emit('change', this.$attrs.value)
				}
				this.focused = true

				if (this.group) this.group.add(this.$attrs.value)
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-radio';
</style>
