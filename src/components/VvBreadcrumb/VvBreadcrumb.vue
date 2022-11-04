<template>
	<nav :class="breadcrumbClass" aria-label="breadcrumbs">
		<ol class="vv-breadcrumb__list">
			<li
				v-for="(route, index) in routes"
				:key="`${route.label}-${index}`"
				class="vv-breadcrumb__item"
				itemprop="itemListElement"
				itemtype="https://schema.org/ListItem"
				itemscope>
				<component
					v-bind="route"
					:is="route.to ? 'router-link' : route.href ? 'a' : 'span'"
					active-class="vv-breadcrumb__item-active"
					exact-active-class="vv-breadcrumb__item-active"
					class="vv-breadcrumb__link"
					itemprop="item">
					<span itemprop="name">
						{{ route.label }}
					</span>
				</component>
			</li>
			<!-- <li class="vv-breadcrumb__item">
				<a class="vv-breadcrumb__link" href="#">Library</a>
			</li>
			<li class="vv-breadcrumb__item-active" aria-current="page">
				My Component
			</li> -->
		</ol>
	</nav>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useBemModifiers } from '../../composables/useModifiers'
import { VvBreadcrumbProps } from './VvBreadcrumb'

const props = defineProps(VvBreadcrumbProps)

//Data
const { modifiers, multiline } = toRefs(props)

const { bemCssClasses: breadcrumbClass } = useBemModifiers('vv-breadcrumb', {
	modifiers,
	multiline
})
</script>
