<template>
	<div :class="btnGroupClass" role="group">
		<slot />
	</div>
</template>

<script lang="ts">
import type { UseGroupComponentProps } from '../../composables/group/types'

import { defineComponent, toRefs } from 'vue'
import { useGroup } from '../../composables/group/useGroup'
import { VV_BUTTON_GROUP } from '../../constants'

/**
 * VvButtonGroups
 */
export default defineComponent({
	setup(props, context) {
		let group = null
		//eventuale pulsante gia selezionato
		const { toggle } = toRefs(props)

		if (toggle.value) {
			//Attiva la modalità toggle creando un gruppo nel quale registrare i pulsanti figli.
			const useGroupApi = useGroup(props, context, {
				key: VV_BUTTON_GROUP
			})
			group = useGroupApi.group
		}

		return {
			group
		}
	},
	props: {
		/**
		 * True = show buttons as disabled
		 */
		disabled: { type: Boolean, default: false },
		/**
		 * True = show buttons vertically
		 */
		vertical: { type: Boolean, default: false },
		/**
		 * True = no padding between buttons
		 */
		compact: { type: Boolean, default: false },
		/**
		 * True = il button group si comporterà come un toggle, materrà attivo l'ultimo pulsante cliccato.
		 */
		toggle: { type: Boolean, default: false },
		/**
		 * True = display as block
		 */
		block: { type: Boolean, default: false },
		/**
		 * True = display btn-broup as rounded (first and last child .vv-button)
		 */
		rounded: { type: Boolean, default: false },
		/**
		 * Active button (name)
		 */
		modelValue: { type: String, default: undefined }
	},
	computed: {
		btnGroupActiveItem() {
			return this.modelValue
		},
		btnGroupClass() {
			return {
				'vv-button-group': true,
				'vv-button-group--vertical': this.vertical,
				'vv-button-group--compact': this.compact,
				'vv-button-group--block': this.block,
				'vv-button-group--rounded': this.rounded
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-button-group';
</style>
