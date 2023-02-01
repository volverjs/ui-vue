<script setup lang="ts">
	import { VvTooltipProps } from '@/components/VvTooltip'

	const props = defineProps(VvTooltipProps)
	const { modifiers } = toRefs(props)

	// styles
	const bemCssClasses = useBemModifiers(
		'vv-tooltip',
		modifiers,
		computed(() => ({
			[props.position]: true,
		})),
	)
</script>

<template>
	<span :class="bemCssClasses" role="tooltip" inert>
		<slot>
			{{ value }}
		</slot>
	</span>
</template>
