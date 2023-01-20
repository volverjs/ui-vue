<script setup lang="ts">
import { VvTooltipProps } from '@/components/VvTooltip'

const props = defineProps(VvTooltipProps)
const { modifiers } = toRefs(props)

// styles
const { bemCssClasses: tooltipClass } = useBemModifiers('vv-tooltip', {
	modifiers
})
</script>

<template>
	<span :class="[tooltipClass, `vv-tooltip--${position}`]" role="tooltip" inert>
		<slot />
	</span>
</template>