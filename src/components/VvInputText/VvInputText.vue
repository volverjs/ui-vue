<template>
	<div v-bind="inputTextAttrs" :class="inputTextClass">
		<label :for="inputAttrs.id" v-if="label">{{ label }}</label>
		<div class="vv-input-text__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot name="icon-left" v-if="hasIconLeft" v-bind="iconSlotProps">
				<vv-icon class="vv-input-text__icon-left" :name="icon" />
			</slot>
			<input v-bind="inputAttrs" v-model="inputTextData" />
			<!-- @slot icon-right to replace icon left -->
			<slot name="icon-right" v-if="hasIconRight" v-bind="iconSlotProps">
				<vv-icon class="vv-input-text__icon-right" :name="icon" />
			</slot>
		</div>
		<HintSlot
			v-if="hasHint"
			:id="inputAriaAttrs['aria-describedby']"
			class="vv-input-text__hint" />
	</div>
</template>

<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { defineComponent } from 'vue'
import { useVModel } from '@vueuse/core'
import { useHintSlot } from '../../composables/hint/useHint'
import { useIcons } from '../../composables/icons/useIcons'
import { HintSlot } from '../../components/common/HintSlot.js'
import VvIcon from '../../components/VvIcon/VvIcon.vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { computed } from '@vue/reactivity'

export default defineComponent({
	inheritAttrs: false,
	emits: ['update:modelValue'],
	components: {
		HintSlot,
		VvIcon
	},
	props: {
		/**
		 * VBind
		 */
		modelValue: null,
		/**
		 * Input type
		 */
		type: {
			type: String,
			default: 'text',
			validator: (value: string) =>
				['text', 'password'].indexOf(value) > -1
		},
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
		errors: [String, Array],
		/**
		 * True - input loading
		 */
		loading: Boolean,
		/**
		 * Hint text da visualizzare quando il componente è in loading.
		 */
		loadingLabel: String,
		/**
		 * Nome dell'icona
		 * @see DsIcon
		 */
		icon: { type: String, default: '' },
		/**
		 * Posizione dell'icona
		 */
		iconPosition: {
			type: String,
			validation: (value: string) => ['left', 'right'].indexOf(value) > -1
		},
		/**
		 * True = label flottante
		 */
		floating: Boolean
	},
	setup(props, context) {
		const inputTextData = useVModel(props, 'modelValue', context.emit)
		const isDirty = computed(() =>
			ObjectUtilities.isNotEmpty(inputTextData?.value)
		)

		const { hasHint, isInvalid, isValid, isLoading } = useHintSlot(
			props,
			context
		)

		const { hasIconLeft, hasIconRight } = useIcons(props, context)

		return {
			inputTextData,
			hasHint,
			isInvalid,
			isValid,
			isDirty,
			isLoading,
			hasIconLeft,
			hasIconRight
		}
	},
	computed: {
		inputTextClass() {
			const { class: cssClass } = this.$attrs
			return {
				'vv-input-text': true,
				'vv-input-text--readonly': this.readonly,
				'vv-input-text--valid': this.isValid,
				'vv-input-text--invalid': this.isInvalid,
				'vv-input-text--loading': this.isLoading,
				'vv-input-text--icon-left': this.hasIconLeft,
				'vv-input-text--icon-right': this.hasIconRight,
				'vv-input-text--floating':
					this.floating && ObjectUtilities.isNotEmpty(this.label),
				'vv-input-text--dirty': this.isDirty,
				class: cssClass
			}
		},
		inputTextAttrs() {
			const { style } = this.$attrs
			const dataAttrs = ObjectUtilities.pickBy(this.$attrs, (k: string) =>
				k.startsWith('data-')
			)
			return {
				style,
				...dataAttrs
			}
		},
		inputAttrs() {
			const {
				id = '',
				name = '',
				placeholder = '',
				autocomplete
			} = this.$attrs as InputHTMLAttributes

			const { disabled, readonly } = this.$props

			return {
				type: this.type,
				id: id || name,
				name,
				placeholder,
				autocomplete,
				disabled,
				readonly,
				...this.inputAriaAttrs
			}
		},
		inputAriaAttrs() {
			const { name } = this.$attrs
			const dataAttrs = ObjectUtilities.pickBy(this.$attrs, (k: string) =>
				k.startsWith('aria-')
			)
			return {
				'aria-label': name,
				'aria-describedby': `${name}-hint`,
				'aria-invalid': this.isInvalid,
				...dataAttrs
			}
		},
		iconSlotProps() {
			const { isValid, isInvalid, modelValue } = this
			return {
				isValid,
				isInvalid,
				modelValue
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/scss/components/vv-input-text';
</style>
