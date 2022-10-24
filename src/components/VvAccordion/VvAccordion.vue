<template>
	<div class="vv-accordion-group">
		<details :class="hasClass">
			<summary
				aria-controls="#accordion-item-1"
				aria-expanded="false"
				class="vv-collapse__summary">
				{{ title }}
			</summary>
			<div class="vv-collapse__content">
				<p>{{ content }}</p>
			</div>
		</details>
	</div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useModifiers } from '../../composables/useModifiers'
import { useProvideGroupState } from '../../composables/group/useGroup'

export interface VvAccordionProps {
	title: string
	content: string
	disabled?: boolean
	iconRight?: boolean
	modifiers?: string | string[]
}

const props = defineProps<VvAccordionProps>()

const hasModifiers: ComputedRef<string> = useModifiers(
	'vv-accordion',
	props.modifiers
)

const hasClass = computed(() => ['vv-accordion', hasModifiers.value])

// group logic
const accordionId = uuidv4()
const groupState = useProvideGroupState(groupState, emit)
</script>

<style lang="scss">
@import '@volverjs/style/scss/components/vv-accordion';
</style>
