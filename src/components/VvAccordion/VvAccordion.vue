<template>
	<details role="group" :class="hasClass">
		<summary class="vv-collapse__header">{{ title }}</summary>
		<p class="vv-collapse__content">
			{{ content }}
		</p>
	</details>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useModifiers } from '../../composables/useModifiers'

export interface VvAccordionProps {
	title: string
	content: string
	iconRight?: boolean
	modifiers?: string | string[]
}

const props = defineProps<VvAccordionProps>()

const hasModifiers: ComputedRef<string> = useModifiers(
	'vv-collapse',
	props.modifiers
)

const hasClass = computed(() => ['vv-collapse', hasModifiers.value])
</script>

<style lang="scss">
@import '@volverjs/style/scss/components/vv-collapse';
</style>
