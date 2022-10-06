<template>
	<div :class="btnGroupClass" role="group">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { useElementGroup } from '../../composables/group/useElementsGroup'
import { VV_BUTTON_GROUP_MANAGER } from '../../composables/group/keys'

/**
 * VvButtonGroups
 */
export default defineComponent({
	setup(props) {
		let group = null
		//eventuale pulsante gia selezionato
		const { modelValue, toggle } = toRefs(props)

		if (toggle.value) {
			//Attiva la modalità toggle creando un gruppo nel quale registrare i pulsanti figli.
			group = useElementGroup(VV_BUTTON_GROUP_MANAGER, {
				defaultSelected: modelValue.value
			})
		}

		return {
			group
		}
	},
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
