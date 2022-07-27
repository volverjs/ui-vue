<template>
	<component
		:is="isComponent"
		:tabindex="computedTabIndex"
		:class="hasClass"
		class="vv-button"
		v-bind="{ ...properties, ...$attrs, onclick: onClick }">
		<div class="vv-button__wrapper">
			<div v-if="$slots.left" class="vv-button__outer-slot">
				<!-- @slot Use this slot for button left slot -->
				<slot name="left" />
			</div>
			<span v-if="$slots.default" class="vv-button__label">
				<!-- @slot Use this slot for button content -->
				<slot />
			</span>
			<span v-else-if="label" class="vv-button__label">
				{{ label }}
			</span>
			<div v-if="$slots.right" class="vv-button__outer-slot">
				<!-- @slot Use this slot for button right slot -->
				<slot name="right" />
			</div>
			<span v-else-if="icon || $slots.icon" class="vv-button__icon">
				<!-- @slot Use this slot for button icon -->
				<slot name="icon">
					<!-- TODO: remove image and use icon component -->
					<img
						class="a-icon__img"
						width="20"
						style="margin-left: 10px"
						:src="loadingStatus ? '' : icon"
						alt="" />
					<!-- <ds-icon
						:name="loadingStatus ? loadingIcon : icon"
						size="inherit" /> -->
				</slot>
			</span>
		</div>
	</component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'VvButton',
	props: {
		/**
		 * The router-link/nuxt-link property, if it is defined the button is rendered as a ruouter-link or nuxt-link.
		 * @see Documentation of [router-link](https://router.vuejs.org/api/#router-link) and [nuxt-link](https://nuxtjs.org/api/components-nuxt-link/)
		 */
		to: {
			type: [String, Object],
			default: undefined
		},
		/**
		 * Button disabled state.
		 */
		disabled: Boolean,
		/**
		 * Button active state.
		 */
		active: Boolean,
		/**
		 * If is defined the button is rendered as an anchor.
		 */
		href: {
			type: String,
			default: undefined
		},
		/**
		 * The anchor target, can be: _blank, _self, _parent, _top.
		 * @values _blank, _self, _parent, _top
		 * @defaultvalue _self
		 */
		target: {
			type: String,
			default: '_self',
			validator: function (value: string) {
				return ['_blank', '_self', '_parent', '_top'].includes(value)
			}
		},
		/**
		 * Name of ds-icon embedded in button.
		 */
		icon: {
			type: String,
			default: null
		},
		/**
		 * Create block level buttonthose that span the full width of a parent.
		 */
		block: Boolean,
		/**
		 * The position of the icon, can be: left or right.
		 * @values left, right
		 * @defaultvalue right
		 */
		iconPosition: {
			type: String,
			default: 'right',
			validator: function (value: string) {
				return ['left', 'right'].includes(value)
			}
		},
		/**
		 * The tabindex.
		 */
		tabindex: {
			type: Number,
			default: -1
		},
		/**
		 * The variant of the button, can be: 'primary', 'secondary', 'link', 'outline'
		 * @values default, primary, secondary, link
		 * @defaultvalue primary
		 */
		variant: {
			type: String,
			default: 'primary',
			validator: function (value: string) {
				return [
					'primary',
					'secondary',
					'link',
					'outline',
					'danger',
					'success',
					'warning',
					'info'
				].includes(value)
			}
		},
		/**
		 * The size of the button, can be: 'small', 'default', 'large'
		 * @values 'small', 'default', 'large'
		 * @defaultvalue default
		 */
		size: {
			type: String,
			default: 'default',
			validator: function (value: string) {
				return ['small', 'default', 'large'].includes(value)
			}
		},
		/**
		 * The type of the button, can be: button, submit, reset.
		 * @values button, submit, reset
		 * @defaultvalue button
		 */
		type: {
			type: String,
			default: 'button',
			validator: function (value: string) {
				return ['button', 'submit', 'reset'].includes(value)
			}
		},
		loadingStatus: Boolean,
		loadingIcon: {
			type: String,
			default: 'loader'
		},
		label: {
			type: String,
			default: null
		}
	},
	emits: ['click'],
	computed: {
		/**
		 * @description Select the tag type in based on the props before.
		 * @returns {string} The type of component
		 */
		isComponent() {
			switch (true) {
				case this.disabled:
					return 'button'
				case this.to !== undefined:
					return '$nuxt' in this ? 'nuxt-link' : 'router-link'
				case this.href !== undefined:
					return 'a'
				default:
					return 'button'
			}
		},
		properties() {
			/**
			 * @description Choose right properties based on tag type of this.isComponent.
			 * @returns {array} Properties of component
			 */
			if (this.isComponent == 'a') {
				if (!this.disabled) {
					return {
						href: this.href,
						target: this.target
					}
				}
				return {
					href: 'javascript:;'
				}
			} else if (this.isComponent == 'button') {
				return {
					disabled: this.disabled,
					['aria-disabled']: this.disabled,
					type: this.type,
					loadingStatus: this.loadingStatus
				}
			} else {
				if (!this.disabled) {
					return {
						to: this.to,
						target: this.target
					}
				}
				return {}
			}
		},
		/**
		 * @description Returns icon position.
		 * @returns {string} The class
		 */
		hasIconPosition() {
			return {
				[`vv-button--icon-${
					this.$slots.default ? this.iconPosition : 'only'
				}`]: this.icon || this.$slots.icon
			}
		},
		/**
		 * @description Returns button variants.
		 * @returns {string} The class
		 */
		hasVariant() {
			return `vv-button--${this.variant}`
		},
		/**
		 * @description Control button sizes.
		 * @returns {string} The class
		 */
		hasSize() {
			return `vv-button--${this.size}`
		},
		/**
		 * @description Define scss classes.
		 * @returns {string} The classes
		 */
		hasClass() {
			return [
				this.hasSize,
				this.hasVariant,
				this.hasIconPosition,
				{
					'vv-button--state-disabled': this.disabled,
					'vv-button--state-active': this.active && !this.disabled,
					'vv-button--block': this.block
				}
			]
		},
		/**
		 * @description Tabindex should be -1 if the button is disabled.
		 * @returns {number} Tabindex value
		 */
		computedTabIndex() {
			return this.disabled ? -1 : this.tabindex
		}
	},
	methods: {
		/**
		 * Triggers when the button is clicked.
		 * @private
		 * @event click
		 * @param {event} event - the click event
		 */
		onClick(event: Event) {
			if (!this.disabled) {
				this.$emit('click', event)
			} else {
				event.stopPropagation()
				event.preventDefault()
			}
		}
	}
})
</script>

<style lang="scss">
@import './VvButton.scss';
</style>
