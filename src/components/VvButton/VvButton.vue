<template>
	<button :class="hasClass">{{ label }}</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { ButtonIconPosition } from './VvButton'

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
		variant: {
			type: String,
			validator: () => {
				//TODO: to validate based on css button variant
				return true
			}
		}
	},
	computed: {
		/**
		 * @description Define scss classes.
		 * @returns {string} The classes
		 */
		hasClass(): Array<string> {
			return []
		}
	}
})
</script>

<style lang="scss">
// @import '@volverjs/style/scss/components/vv-button';
</style>
