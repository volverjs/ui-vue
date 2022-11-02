<template>
	<article :class="cardClass" v-bind="cardAttrs">
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

<script setup lang="ts">
import { toRefs, computed, useAttrs } from 'vue'
import { VvCardProps } from './VvCard'

//Computed
import { useBemModifiers } from '../../composables/useModifiers'

//Props, Emits, attrs ...
const props = defineProps(VvCardProps)
const attrs = useAttrs()

//Styles & bindings
const { variant } = toRefs(props)
const { bemCssClasses: cardClass } = useBemModifiers('vv-card', {
	variant
})
const cardAttrs = computed(() => {
	return attrs
})
</script>
