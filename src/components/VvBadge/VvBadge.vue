<template>
	<span :class="badgeClass" role="status">{{ value }}</span>
</template>

<script setup lang="ts">
import { useBemModifiers } from '@/composables/useModifiers'
import { toRefs } from 'vue'
import { VvBadgeProps } from './VvBadge'

const props = defineProps(VvBadgeProps)
const { modifiers } = toRefs(props)

//Styles & bindings
const { bemCssClasses: badgeClass } = useBemModifiers('vv-badge', {
	modifiers
})
</script>
