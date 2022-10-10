<template>
	<div :class="groupClass">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useGroup, VV_RADIO_GROUP } from '../../composables/group/useGroup'

/**
 * VvInputRadioGroup
 */
export default defineComponent({
	props: {
		/**
		 * VModel
		 */
		modelValue: null,
		/**
		 * True se disabilitato
		 */
		disabled: { type: Boolean, default: false },
		/**
		 * True = show buttons vertically
		 */
		vertical: { type: Boolean, default: false }
	},
	setup() {
		const group = useGroup(VV_RADIO_GROUP)

		return group
	},
	computed: {
		groupClass() {
			return {
				'vv-input-radio-group': true,
				'vv-input-radio-group--horizontal': !this.vertical
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-radio-group';
</style>
