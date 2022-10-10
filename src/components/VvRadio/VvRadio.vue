<template>
	<label :class="radioClass" v-bind="radioAttrs" @click="onClick">
		<input
			ref="input"
			:class="radioInputClass"
			v-bind="radioInputAttrs"
			v-on="radioInputListeners" />
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
	VV_RADIO_GROUP
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
		const { group } = useCurrentGroup(VV_RADIO_GROUP)

		return {
			group,
			input,
			focused
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
				'focus-visible': this.focused
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
				disabled: this.disabled,
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
		radioInputListeners() {
			return {
				focus: (event: Event) => this.$emit('focus', event),
				blur: (event: Event) => this.$emit('blur', event)
			}
		},
		isChecked() {
			return (
				ObjectUtilities.isNotEmpty(this.modelValue) &&
				ObjectUtilities.equals(this.modelValue, this.$attrs.value)
			)
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

				if (this.group) this.group.modelValue = this.$attrs.value
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-radio';
</style>
