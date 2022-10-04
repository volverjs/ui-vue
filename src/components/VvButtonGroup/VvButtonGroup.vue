<template>
	<div :class="btnGroupClass">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { useElementGroup } from '../../composables/useElementsGroup'
import { VV_BUTTON_GROUP_MANAGER } from '../../composables/keys'

/**
 * VvButtonGroups
 */
export default defineComponent({
	setup(props) {
		let group = null
		//eventuale pulsante gia selezionato
		const { value: selectedButton } = toRefs(props)
		let isVModelBind = selectedButton.value !== undefined

		if (isVModelBind) {
			//v-model binding -> attiva la modalità toggle creando un gruppo nel quale registrare i pulsanti figli.
			group = useElementGroup(VV_BUTTON_GROUP_MANAGER, {
				defaultSelected: selectedButton
			}).group
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
		 * Active button (name)
		 */
		value: { type: String, default: undefined }
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
	}
})
</script>

<style lang="scss" src="./VvButtonGroup.scss" />
