<template>
	<progress v-bind="properties" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		/**
		 * Progress value
		 */
		value: {
			type: Number
		},
		/**
		 * Progress max value
		 */
		max: {
			type: Number
		},
		/**
		 * Progress label
		 */
		ariaLabel: {
			type: String,
			default: 'progress-bar'
		},
		/**
		 * Indeterminate attribute
		 */
		indeterminate: Boolean
	},
	computed: {
		/**
		 * Compute component properties
		 */
		properties() {
			return {
				'aria-label': this.ariaLabel,
				role: 'progressbar',
				class: this.hasClass,
				value: this.value,
				max: this.max
			}
		},
		/**
		 * @description Define css classes.
		 * @returns {string} The classes
		 */
		hasClass(): Array<string | object> {
			return [
				'vv-progress',
				{
					'vv-progress--indeterminate': this.indeterminate
				}
			]
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-progress';
</style>
