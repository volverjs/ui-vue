<script lang="ts">
	export default {
		name: 'VvProgress',
	}
</script>

<script setup lang="ts">
	import { VvProgressProps } from '@/components/VvProgress'

	// props
	const props = defineProps(VvProgressProps)
	const { value, max, label: ariaLabel } = toRefs(props)
	const indeterminate = computed(() => props.value === undefined)

	// styles
	const { modifiers } = toRefs(props)
	const bemCssClasses = useBemModifiers(
		'vv-progress',
		modifiers,
		computed(() => ({ indeterminate: indeterminate.value })),
	)
</script>

<template>
	<progress
		role="progressbar"
		v-bind="{
			class: bemCssClasses,
			ariaLabel,
			max,
			value,
		}"
	/>
</template>
