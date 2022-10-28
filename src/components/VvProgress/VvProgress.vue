<template>
	<progress v-bind="properties" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VvProgressProps } from './VvProgress'

//Props, emits, slots, attrs
const props = defineProps(VvProgressProps)

/**
 * Compute component properties
 */
const properties = computed(() => {
	return {
		'aria-label': props.ariaLabel,
		role: 'progressbar',
		class: hasClass.value,
		value: props.value,
		max: props.max
	}
})
/**
 * @description Define css classes.
 * @returns {string} The classes
 */
const hasClass = computed((): Array<string | object> => {
	return [
		'vv-progress',
		{
			'vv-progress--indeterminate': props.indeterminate
		}
	]
})
</script>
