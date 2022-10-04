<template>
	<!-- #region component: "button" | "a" | "router-link" | "nuxt-link" -->
	<component
		v-bind="{
			...$attrs,
			role: 'button',
			'aria-label': label || $attrs['aria-label'],
			'aria-disabled': $attrs.disabled,
			class: hasClass,
			href:
				isComponent === buttonTags.a && $attrs.disabled
					? 'javascript:;'
					: $attrs.href
		}"
		:is="isComponent">
		<!-- @slot default to replace all button content -->
		<slot>
			<!-- #region loading -->
			<template v-if="loading">
				<slot name="loading">
					<span
						v-if="loadingIcon"
						class="iconify vv-button__icon"
						:data-icon="loadingIcon"></span>
					<span v-if="loadingLabel" class="vv-button__label">
						{{ loadingLabel }}
					</span>
				</slot>
			</template>
			<!-- #endregion loading -->
			<!-- #region button -->
			<template v-else>
				<!-- @slot before -->
				<slot name="before" />
				<!-- #region icon -->
				<template v-if="icon">
					<span
						class="iconify vv-button__icon"
						:data-icon="icon"></span>
				</template>
				<!-- #endregion icon -->
				<!-- #region label  -->
				<span v-if="label" class="vv-button__label">
					<!-- @slot Use this slot for button label -->
					<slot name="label">
						{{ label }}
					</slot>
				</span>
				<!-- #endregion label  -->
				<!-- @slot after -->
				<slot name="after" />
			</template>
			<!-- #endregion button -->
		</slot>
	</component>
	<!-- #endregion component: button | a | router-link | nuxt-link -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { ButtonIconPosition, ButtonTag } from './VvButton'

export default defineComponent({
	props: {
		/**
		 * Button icon
		 */
		icon: String,
		/**
		 * Button icon position
		 */
		iconPosition: {
			type: String as PropType<ButtonIconPosition>,
			default: ButtonIconPosition.left
		},
		/**
		 * Button label
		 */
		label: String,
		/**
		 * Loading status
		 */
		loading: Boolean,
		/**
		 * Loading icon
		 */
		loadingIcon: { type: String, default: 'eos-icons:bubble-loading' },
		/**
		 * Loading label
		 */
		loadingLabel: {
			type: String,
			default: 'Loading...'
		},
		/**
		 * The variant of the button
		 * @values
		 * @defaultvalue default
		 */
		variant: {
			type: String
		},
		/**
		 * The router-link/nuxt-link property, if it is defined the button is rendered as a ruouter-link or nuxt-link.
		 * @see Documentation of [router-link](https://router.vuejs.org/api/#router-link) and [nuxt-link](https://nuxtjs.org/api/components-nuxt-link/)
		 */
		to: {
			type: [String, Object]
		},
		/**
		 * Create block level button that span the full width of a parent.
		 */
		block: Boolean,
		/**
		 * Button active state.
		 */
		active: Boolean,
		/**
		 * Button rounded.
		 */
		rounded: Boolean
	},
	data() {
		return {
			buttonTags: ButtonTag,
			iconPositions: ButtonIconPosition
		}
	},
	computed: {
		/**
		 * @description Select the tag type in based on the props before.
		 * @returns {string} The type of component
		 */
		isComponent() {
			switch (true) {
				case this.to !== undefined:
					return '$nuxt' in this
						? ButtonTag.nuxtLink
						: ButtonTag.routerLink
				case this.$attrs.href !== undefined:
					return ButtonTag.a
				default:
					return ButtonTag.button
			}
		},
		/**
		 * @description Define css classes.
		 * @returns {string} The classes
		 */
		hasClass(): Array<string | object> {
			return [
				'vv-button',
				this.hasVariant,
				this.hasIconPosition,
				{
					'vv-button--active': this.active,
					'vv-button--block': this.block,
					'vv-button--rounded': this.rounded
				}
			]
		},
		/**
		 * @description Returns icon position.
		 * @returns {string} The class
		 */
		hasIconPosition() {
			return {
				'vv-button--reverse':
					this.iconPosition === this.iconPositions.right,
				'vv-button--column vv-button--reverse':
					this.iconPosition === this.iconPositions.bottom,
				'vv-button--column':
					this.iconPosition === this.iconPositions.top,
				'vv-button--icon-only': this.icon && !this.label
			}
		},
		/**
		 * @description Returns button variants.
		 * @returns {string} The class
		 */
		hasVariant() {
			return this.variant ? `vv-button--${this.variant}` : ''
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-button';
</style>
