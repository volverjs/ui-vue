<script lang="ts">
export default {
	name: 'VvProgress'
}
</script>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useBemModifiers } from '@/composables/useModifiers'
import { VvProgressProps } from '@/components/VvProgress'

// props
const props = defineProps(VvProgressProps)
const { value, max, ariaLabel } = toRefs(props)

// styles
const { bemCssClasses: hasClass } = useBemModifiers('vv-progress', {
	modifiers: props.modifiers,
	indeterminate: computed(() => props.value === undefined)
})
</script>

<template>
	<progress
		role="progressbar"
		v-bind="{
			class: hasClass,
			ariaLabel,
			max,
			value
		}" />
</template>
