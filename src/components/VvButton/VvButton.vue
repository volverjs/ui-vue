<template>
	<!-- #region component: "button" | "a" | "router-link" | "nuxt-link" -->
	<component v-bind="properties" :is="isComponent" @click.passive="onClick">
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
import type { PropType } from 'vue'
import type { UseGroupComponentProps } from '../../composables/group/types'

import { v4 as uuidv4 } from 'uuid'
import { computed, defineComponent, unref, toRefs, ref } from 'vue'
import { useSharedGroupState } from '../../composables/group/useSharedGroupState'
import { VV_BUTTON_GROUP } from '../../constants'
import { ButtonIconPosition, ButtonTag, ButtonTarget } from './VvButton'

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
			default: ButtonIconPosition.left,
			validator: (value: string) => value in ButtonIconPosition
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
		 * Link href
		 */
		href: String,
		/**
		 * Link target
		 */
		target: {
			type: String as PropType<ButtonTarget>,
			validator: (value: string) => value in ButtonTarget
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
		rounded: Boolean,
		/**
		 * Button disabled
		 */
		disabled: Boolean
	},
	setup(props, context) {
		const { attrs } = context

		const modelValue = ref(attrs?.name || uuidv4())
		const sharedProps: UseGroupComponentProps = {
			...toRefs(props),
			modelValue
		}
		const { isInGroup, group, checkIsSelected } = useSharedGroupState(
			sharedProps,
			context,
			{
				key: VV_BUTTON_GROUP
			}
		)

		return {
			group,
			isInGroup,
			isActive: computed(() => checkIsSelected(modelValue.value)),
			onClick(e: Event) {
				if (isInGroup.value) unref(group)?.add(modelValue.value)
			}
		}
		// #endregion button-group logic
	},
	data() {
		return {
			buttonTags: ButtonTag,
			iconPositions: ButtonIconPosition
		}
	},
	computed: {
		/**
		 * Compute component properties
		 */
		properties() {
			return {
				...this.linkProps,
				'aria-label': this.label || this.$attrs['aria-label'],
				'aria-disabled': this.isDisabled,
				role: 'button',
				class: this.hasClass,
				to: this.to
			}
		},
		/**
		 * Compute link props (target, href)
		 */
		linkProps() {
			const isLink = this.isComponent === this.buttonTags.a
			let toReturn = {}
			if (isLink) {
				toReturn = this.isDisabled
					? {
							href: 'javascript:;'
					  }
					: {
							target: this.target,
							href: this.href
					  }
			}
			return toReturn
		},
		/**
		 * Check disabled state based on attributes
		 */
		isDisabled() {
			return 'disabled' in this.$attrs
		},
		/**
		 * @description Select the tag type in based on the props before.
		 * @returns {string} The type of component
		 */
		isComponent() {
			switch (true) {
				case this.isDisabled:
					return ButtonTag.button
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
		 * @description Define css classes.
		 * @returns {string} The classes
		 */
		hasClass(): Array<string | object> {
			return [
				'vv-button',
				this.hasVariant,
				this.hasIconPosition,
				{
					'vv-button--active': this.active || this.isActive,
					'vv-button--block': this.block,
					'vv-button--rounded': this.rounded,
					'vv-button--full-bleed': this.fullBleed
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
