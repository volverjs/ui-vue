<template>
	<component
		v-bind="{
			...$attrs,
			href:
				isComponent === buttonTags.a && disabled ? 'javascript:;' : href
		}"
		:is="isComponent"
		:class="hasClass"
		:aria-disabled="disabled"
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
import { ButtonIconPosition, ButtonTarget, ButtonTag } from './VvButton'

export default defineComponent({
	props: {
		icon: String,
		iconPosition: {
			type: String as PropType<ButtonIconPosition>,
			default: ButtonIconPosition.left
		},
		label: String,
		badge: [String, Number],
		loading: Boolean,
		loadingIcon: String,
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
		 * If exist the button is rendered as an anchor.
		 */
		href: String,
		/**
		 * The anchor target, can be: _blank, _self, _parent, _top.
		 * @values _blank, _self, _parent, _top
		 * @defaultvalue _self
		 */
		target: {
			type: String as PropType<ButtonTarget>,
			default: ButtonTarget.self,
			validator: (value: ButtonTarget) => value in ButtonTarget
		},
		/**
		 * Button disabled state.
		 */
		disabled: Boolean,
		/**
		 * Create block level buttonthose that span the full width of a parent.
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
			buttonTags: ButtonTag
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
				case this.href !== undefined:
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
				this.hasVariant,
				this.hasIconPosition,
				{
					'vv-button--state-disabled': this.disabled,
					'vv-button--state-active': this.active && !this.disabled,
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
