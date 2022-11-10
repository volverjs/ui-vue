<template>
	<div :class="[tooltipClass, `vv-tooltip--${props.position}`]">
		<slot />
		<span inert role="tooltip" class="vv-tooltip__content"
			><slot name="tooltip"
		/></span>
	</div>
</template>

<script setup lang="ts">
import { useBemModifiers } from '@/composables/useModifiers'
import { toRefs } from 'vue'
import { VvTooltipProps } from './VvTooltip'

const props = defineProps(VvTooltipProps)
const { modifiers } = toRefs(props)

//Styles & bindings
const { bemCssClasses: tooltipClass } = useBemModifiers('vv-tooltip', {
	modifiers
})
</script>
