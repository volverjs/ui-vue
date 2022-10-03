<template>
	<div :class="btnGroupClass">
		<slot />
	</div>
</template>

<script lang="ts">
// import type { PropType } from 'vue'
import { defineComponent } from 'vue'

/**
 * VvButtonGroups
 */
export default defineComponent({
	data: () => ({
		observer: null //MutationObserver
	}),
	props: {
		/**
		 * True = show buttons vertically
		 */
		vertical: { type: Boolean, default: false },
		/**
		 * True = no padding between buttons
		 */
		compact: { type: Boolean, default: false },
		/**
		 * Active index button
		 */
		value: { type: Number, default: undefined }
	},
	computed: {
		btnGroupActiveItem() {
			return this.value
		},
		btnGroupClass() {
			return {
				'vv-button-group': true,
				'vv-button-group--vertical': this.vertical,
				'vv-button-group--compact': this.compact
			}
		}
	},
	methods: {
		traceVvButtons() {
			debugger
		}
	},
	mounted() {
		const observer = new MutationObserver(this.traceVvButtons)
		observer.observe(this.$el, {
			childList: true,
			subtree: true
		})
		this.observer = observer as MutationObserver
	}
})
</script>

<style lang="scss" src="./VvButtonGroup.scss" />
