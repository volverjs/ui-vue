<script lang="ts">
export default {
	name: 'VvCard'
}
</script>

<script setup lang="ts">
import { useBemModifiers } from '@/composables/useModifiers'
import { VvCardProps } from '@/components/VvCard'

// props and attrs
const props = defineProps(VvCardProps)

// styles
const { bemCssClasses } = useBemModifiers('vv-card', {
	modifiers: props.modifiers
})
</script>

<template>
	<article :class="bemCssClasses">
		<header v-if="$slots.header || title" class="vv-card__header">
			<slot name="header">
				{{ title }}
			</slot>
		</header>
		<slot />
		<div v-if="$slots.content" class="vv-card__content">
			<slot name="content" />
		</div>
		<footer v-if="$slots.footer" class="vv-card__footer">
			<slot name="footer" />
		</footer>
	</article>
</template>
