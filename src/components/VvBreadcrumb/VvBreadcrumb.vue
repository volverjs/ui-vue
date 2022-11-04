<template>
	<nav :class="breadcrumbClass" aria-label="breadcrumbs">
		<ol class="vv-breadcrumb__list">
			<li
				v-for="(route, index) in routes"
				:key="`${route.label}-${index}`"
				:class="{
					'vv-breadcrumb__item': index < Number(routes?.length) - 1,
					'vv-breadcrumb__item-active':
						index === Number(routes?.length) - 1
				}"
				itemprop="itemListElement"
				itemtype="https://schema.org/ListItem"
				itemscope>
				<component
					:is="route.to ? 'router-link' : route.href ? 'a' : 'span'"
					v-bind="route"
					:class="{
						'vv-breadcrumb__link':
							index < Number(routes?.length) - 1
					}"
					:aria-current="
						index === Number(routes?.length) - 1
							? 'page'
							: undefined
					"
					itemprop="item">
					<!-- <span itemprop="name"> -->
					{{ route.label }}
					<!-- </span> -->
				</component>
				<meta itemprop="position" :content="`${index + 1}`" />
			</li>
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
