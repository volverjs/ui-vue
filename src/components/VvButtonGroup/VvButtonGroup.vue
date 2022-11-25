<script lang="ts">
export default {
	name: 'VvButtonGroup'
}
</script>

<script setup lang="ts">
import type IButtonGroupState from '@/composables/group/types/IButtonGroupState'
import { ref, toRefs } from 'vue'
import { VvButtonGroupProps, VvButtonGroupEvents } from './VvButtonGroup'
import { VV_BUTTON_GROUP } from '@/constants'
import { useVModel } from '@vueuse/core'
import { useProvideGroupState } from '@/composables/group/useProvideGroupState'
import { useBemModifiers } from '@/composables/useModifiers'

// emit and props
const emit = defineEmits(VvButtonGroupEvents)
const props = defineProps(VvButtonGroupProps)

// data
const modelValue = useVModel(props, 'modelValue', emit)
const { disabled, vertical, compact, toggle, modifiers } = toRefs(props)

// style
const { bemCssClasses: btnGroupClass } = useBemModifiers('vv-button-group', {
	modifiers,
	vertical,
	compact
})

const groupState: IButtonGroupState = {
	key: VV_BUTTON_GROUP,
	modelValue,
	disabled,
	toggle,
	modifiers: modifiers?.value ? modifiers : ref([])
}
useProvideGroupState(groupState)
</script>

<template>
	<div :class="btnGroupClass" role="group">
		<slot />
	</div>
</template>
