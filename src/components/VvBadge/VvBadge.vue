<script lang="ts">
export default {
	name: 'VvBadge'
}
</script>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useBemModifiers } from '@/composables/useModifiers'
import { VvBadgeProps } from '@/components/VvBadge'

const props = defineProps(VvBadgeProps)
const { bemCssClasses } = useBemModifiers('vv-badge', {
	modifiers: props.modifiers
})
</script>

<template>
	<span :class="bemCssClasses" role="status">
		<slot>{{ value }}</slot>
	</span>
</template>
