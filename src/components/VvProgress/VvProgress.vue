<template>
	<progress ref="progress" aria-label="progressbar" v-bind="properties" />
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
	},
	watch: {
		indeterminate(newValue: boolean) {
			this.$refs.progress.indeterminate = newValue
		}
	},
	mounted() {
		if (this.indeterminate) {
			this.$refs.progress.indeterminate = true
			this.$refs.progress.removeAttribute('value')
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-progress';
</style>
