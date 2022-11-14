<template>
	<progress ref="progress" aria-label="progressbar" v-bind="properties" />
</template>

<script setup lang="ts">
import { useBemModifiers } from '../../composables/useModifiers'
import { computed, toRefs } from 'vue'
import { VvProgressProps } from './VvProgress'

//Props, emits, slots, attrs
const props = defineProps(VvProgressProps)

// data
const { modifiers } = toRefs(props)

//Styles & bindings
const { bemCssClasses: progressClass } = useBemModifiers('vv-progress', {
	modifiers,
	indeterminate: computed(() => !props.determinate)
})

/**
 * Compute component properties
 */
const properties = computed(() => {
	return {
		'aria-label': props.ariaLabel,
		role: 'progressbar',
		class: progressClass.value,
		value: props.value,
		max: props.max
	}
})
</script>
