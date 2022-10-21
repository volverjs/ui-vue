<template>
	<div :class="btnGroupClass" role="group">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProvideGroupState } from '../../composables/group/useGroup'
import { ButtonGroupState } from '../../composables/group/group'
import { VV_BUTTON_GROUP } from '../../constants'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
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
})

//Computed
const btnGroupClass = computed(() => {
	return {
		'vv-button-group': true,
		'vv-button-group--vertical': props.vertical,
		'vv-button-group--compact': props.compact,
		'vv-button-group--block': props.block,
		'vv-button-group--rounded': props.rounded
	}
})

//Dependecy injection
// const {modelValue, disabled, toggle} = toRefs(props)
// const sharedButtonGroupState = new ButtonGroupState({
// 	key: VV_BUTTON_GROUP,
// 	modelValue,
// 	disabled,
// 	toggle
// })
const groupState = ButtonGroupState.create(VV_BUTTON_GROUP, props)
useProvideGroupState(groupState, emit)
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-button-group';
</style>
