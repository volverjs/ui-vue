<template>
	<component
		v-bind="{
			...$attrs,
			href:
				isComponent === buttonTags.a && $attrs.disabled
					? 'javascript:;'
					: $attrs.href
		}"
		:is="isComponent"
		:class="hasClass"
		:aria-disabled="$attrs.disabled"
		role="button">
		<slot>
			<div v-if="loading" class="vv-button__icon-loader">
				<template v-if="$slots.loading">
					<slot name="loading" />
				</template>
				<template v-else>
					<template v-if="loadingLabel">{{ loadingLabel }}</template>
					<span
						class="iconify"
						data-icon="eos-icons:bubble-loading"></span>
				</template>
			</div>
			<template v-else>
				{{ label }}
				<span v-if="icon || $slots.icon" class="vv-button__icon">
					<!-- @slot Use this slot for button icon -->
					<slot name="icon">
						<span class="iconify" :data-icon="icon"></span>
					</slot>
				</span>
				<span v-if="badge || $slots.badge" class="vv-button__badge">
					<!-- @slot Use this slot for button badge -->
					<slot name="badge">
						{{ badge }}
						<!-- <ds-badge :value="badge" :size="size" /> -->
					</slot>
				</span>
			</template>
		</slot>
	</component>
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
		 * Badge
		 */
		badge: [String, Number],
		/**
		 * Loading status
		 */
		loading: Boolean,
		/**
		 * Loading icon
		 */
		loadingIcon: String,
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
			type: String,
			validator: () => {
				//TODO: to validate based on css button variant
				return true
			}
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
		 * @description Define scss classes.
		 * @returns {string} The classes
		 */
		hasClass(): Array<string | object> {
			return [
				'vv-button',
				{
					'flex-row-reverse':
						this.iconPosition === this.iconPositions.left,
					'flex-col': this.iconPosition === this.iconPositions.bottom,
					'flex-col-reverse':
						this.iconPosition === this.iconPositions.top
				},
				this.hasVariant,
				this.hasIconPosition,
				{
					'vv-button--state-active': this.active,
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
				[`vv-button--icon-${this.iconPosition || 'only'}`]:
					this.icon || this.$slots.icon
			}
		},
		/**
		 * @description Returns button variants.
		 * @returns {string} The class
		 */
		hasVariant() {
			return `vv-button--${this.variant}`
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-button';
</style>
