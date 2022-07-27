<template>
	<input
		class="vv-input"
		v-bind="{
			ariaDescribedby: $slots.default ? `${id}_description` : null,
			ariaDisabled: disabled,
			ariaLabelledby: `${id}_label`,
			autocomplete,
			disabled,
			enterkeyhint,
			id,
			inputmode,
			max: maxValue,
			maxlength: maxLength,
			min: minValue,
			minlength: minLength,
			multiple,
			name,
			pattern,
			placeholder,
			readonly,
			step: type === 'number' ? step : null,
			tabindex: disabled ? -1 : tabindex,
			type,
			modelValue,
			accept,
			autocapitalize,
			autoFocus,
			required,
			spellcheck,
			onanimationstart: onAnimationStart,
			onanimationend: onAnimationEnd,
			onfocus: onFocus,
			onblur: onBlur,
			oninput: onInput,
			onchange: onChange,
			onkeydown: onKeyDown
		}" />
	<!-- <button
		v-if="clearInput && !readonly && !disabled"
		aria-label="reset"
		type="button"
		class="input-clear-icon"
		onTouchStart="{this.clearTextInput}"
		onMouseDown="{this.clearTextInput}"
		onKeyDown="{this.clearTextOnEnter}" /> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'VvInput',
	props: {
		/**
		 *
		 */
		id: {
			type: String,
			default: undefined
		},
		/**
		 * Input value.
		 */
		modelValue: { type: String, required: true },
		/**
		 * Input text name.
		 */
		name: { type: String, default: '' },
		/**
		 * Input is required.
		 */
		required: Boolean,
		/**
		 * Input text readonly state.
		 */
		readonly: Boolean,
		/**
		 * Input text disabled state.
		 */
		disabled: Boolean,
		/**
		 * Input text order on tab navigation.
		 */
		tabindex: {
			type: [String, Number],
			default: -1
		},
		/**
		 * Input placeholder.
		 */
		placeholder: { type: String, default: '' },
		/**
		 * Autocomplete input attribute.
		 */
		autocomplete: { type: String, default: 'off' },
		/**
		 * Input type, if "password" shows visibility toggle, can be: text, password, email, number, search, tel, url.
		 * @values text, password, email, number, search, tel, url
		 * @defaultvalue text
		 */
		type: {
			type: String,
			default: 'text',
			validator: function (value: string) {
				return [
					'text',
					'password',
					'email',
					'number',
					'search',
					'tel',
					'url',
					'date'
				].includes(value)
			}
		},
		/**
		 * Type of keyboard.
		 * The inputmode global attribute is an enumerated attribute that hints at the type
		 * of data that might be entered by the user while editing the element or its contents.
		 * @values none, text, decimal, numeric, tel, search, email, url
		 */
		inputmode: {
			type: String,
			default: 'text',
			validator: function (value: string) {
				return [
					'none',
					'text',
					'decimal',
					'numeric',
					'tel',
					'search',
					'email',
					'url',
					'date'
				].includes(value)
			}
		},
		/**
		 * Indicating how the enter key should do next.
		 * enter: New line;
		 * done: Close keyboard;
		 * go: Take the user to the target of the text they typed.
		 * next: Next field;
		 * previous: Previous field;
		 * search: Searching for the text they have typed;
		 * send: Delivering the text.
		 */
		enterkeyhint: {
			type: String,
			default: 'done',
			validator: function (value: string) {
				return [
					'enter',
					'done',
					'go',
					'next',
					'previous',
					'search',
					'send'
				].includes(value)
			}
		},
		/**
		 * The pattern attribute specifies a regular expression that the <input>
		 * element's value is checked against on form submission.
		 */
		pattern: {
			type: String,
			default: ''
		},
		/**
		 * When present, it specifies that the user is allowed to enter more than one value in the <input> element.
		 * For type email separate each email with a comma.
		 */
		multiple: {
			type: Boolean
		},
		/**
		 * Input type number step.
		 * @defaultvalue 1
		 */
		step: {
			type: [String, Number],
			default: 'any'
		},
		/**
		 * Input min length.
		 */
		minLength: {
			type: [String, Number],
			default: null
		},
		/**
		 * Input max length.
		 */
		maxLength: {
			type: [String, Number],
			default: null
		},
		/**
		 * Input min value.
		 */
		minValue: {
			type: [String, Number],
			default: null
		},
		/**
		 * Input max value.
		 */
		maxValue: {
			type: [String, Number],
			default: null
		},
		/**
		 * Valid for the file input type only, the accept attribute defines which file types are selectable in a file upload control. See the file input type.
		 */
		accept: {
			type: String,
			default: null
		},
		/**
		 * It specifies how the text will be automatically capitalized
		 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize
		 */
		autocapitalize: {
			type: String,
			default: null,
			validator: function (value: string) {
				return [
					'off',
					'none',
					'on',
					'sentences',
					'words',
					'characters'
				].includes(value)
			}
		},
		/**
		 * Indicates that the input should automatically have focus when the page has finished loading
		 */
		autoFocus: Boolean,
		/**
		 * Indicates that the input field should be checked for spelling errors
		 */
		spellcheck: Boolean
	},
	emits: [
		'input',
		'update:modelValue',
		'change',
		'blur',
		'focus',
		'animationstart',
		'animationend',
		'keydown'
	],
	methods: {
		/**
		 * @private
		 * @description Trigger event focus.
		 * @param {string} event
		 * @event focus
		 */
		onFocus(event: Event) {
			if (!this.readonly) {
				this.$emit('focus', event)
				this.focus = true
			}
		},
		/**
		 * @private
		 * @description Trigger event blur.
		 * @param {string} event
		 */
		onBlur(event: Event) {
			this.$emit('blur', event)
			this.focus = false
		},
		/**
		 * @private
		 * @description Trigger event animationstart.
		 * @param {string} event
		 */
		onAnimationStart(event: Event) {
			this.$emit('animationstart', event)
		},
		/**
		 * @private
		 * @description Trigger event animationend.
		 * @param {string} event
		 */
		onAnimationEnd(event: Event) {
			this.$emit('animationend', event)
		},
		/**
		 * @private
		 * @description Trigger event input.
		 * @param {string} event
		 */
		onInput(event: Event) {
			const target = event.target as HTMLInputElement
			this.$emit('input', target.value)
			this.$emit('update:modelValue', target.value)
		},
		/**
		 * @private
		 * @description Trigger event change.
		 * @param {string} event
		 */
		onChange(event: Event) {
			const target = event.target as HTMLInputElement
			this.$emit('change', target.value)
		},
		/**
		 * @private
		 * @description Trigger event keydown.
		 * @param {string} event
		 */
		onKeyDown(event: Event) {
			this.$emit('keydown', event)
		}
	}
})
</script>

<style lang="scss">
@import './VvInput.scss';
</style>
