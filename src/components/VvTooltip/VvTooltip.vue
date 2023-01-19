<template>
	<span :class="[tooltipClass, `vv-tooltip--${props.position}`]" role="tooltip" inert>
		<slot />
	</span>
</template>

<script setup lang="ts">
import { useBemModifiers } from '@/composables/useModifiers'
import { toRefs } from 'vue'
import { VvTooltipProps } from '@/components/VvTooltip'

const props = defineProps(VvTooltipProps)
const { modifiers } = toRefs(props)

// styles
const { bemCssClasses: tooltipClass } = useBemModifiers('vv-tooltip', {
	modifiers
})
</script>
