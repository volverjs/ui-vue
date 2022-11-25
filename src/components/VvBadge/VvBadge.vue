<script lang="ts">
export default {
	name: 'VvBadge'
}
</script>

<script setup lang="ts">
import { useBemModifiers } from '@/composables/useModifiers'
import { defineProps } from 'vue'
import { VvBadgeProps } from './VvBadge'

const props = defineProps(VvBadgeProps)
const { bemCssClasses: badgeClass } = useBemModifiers('vv-badge', {
	modifiers: props.modifiers
})
</script>

<template>
	<span :class="badgeClass" role="status">
		<slot>{{ value }}</slot>
	</span>
</template>
