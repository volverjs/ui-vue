<script lang="ts">
export default {
	name: 'VvIcon'
}
</script>

<script setup lang="ts">
import { inject, toRefs, ref, computed } from 'vue'
import { Icon, addIcon, iconExists, type IconifyJSON } from '@iconify/vue'
import { type IVolver, VOLVER_PREFIX } from '@/Volver'
import { VvIconProps } from '@/components/VvIcon'
import { useBemModifiers } from '@/composables/useModifiers'

// props
const props = defineProps(VvIconProps)

// data
const show = ref(true)
const { modifiers } = toRefs(props)

// inject
const ds = inject<IVolver>(VOLVER_PREFIX)

// classes
const { bemCssClasses } = useBemModifiers('vv-icon', {
	modifiers
})

/**
 * Provider name
 */
const currentProvider = computed(() => {
	return props.provider || ds?.provider
})

/**
 * Icon name
 */
const icon = computed(() => {
	const _name = props.name || ''
	// compose Iconify icon name format
	const iconName = `@${currentProvider.value}:${props.prefix}:${props.name}`

	// Check first if icon with "name" exist
	if (iconExists(_name)) {
		return _name
	} else if (iconExists(iconName)) {
		// Check and return composed icon name if exist
		return iconName
	} else {
		// Check into all collections and set "iconName" data
		return (
			ds?.iconsCollections.find((iconsCollection: IconifyJSON) => {
				const icon = `@${currentProvider.value}:${iconsCollection.prefix}:${_name}`
				if (iconExists(icon)) {
					return icon
				}
			}) || _name
		)
	}
})

/**
 * Get SVG content from SVG string
 * @param {string} svg
 * @return {SVGSVGElement | null} https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement
 */
function getSvgContent(svg: string): SVGSVGElement | null {
	let dom = null
	if (typeof window === 'undefined') {
		// SSR
		// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
		const { JSDOM } = require('jsdom')
		dom = new JSDOM().window
	}
	const domParser = dom ? new dom.DOMParser() : new window.DOMParser()
	const svgDomString = domParser.parseFromString(svg, 'text/html')
	const svgEl = svgDomString.querySelector('svg')
	return svgEl
}

/**
 * Add icon to current Iconify provider
 * @param {string} svg
 */
function addIconFromSvg(svg: string) {
	const svgContentEl: SVGSVGElement | null = getSvgContent(svg)
	const svgContent = svgContentEl?.innerHTML.trim() || ''
	if (svgContentEl && svgContent) {
		addIcon(`@${currentProvider.value}:${props.prefix}:${props.name}`, {
			body: svgContent,
			// Set height and width from svg content
			height: svgContentEl.viewBox.baseVal.height,
			width: svgContentEl.viewBox.baseVal.width
		})
	}
}

if (ds) {
	if (
		props.src &&
		!iconExists(`@${currentProvider.value}:${props.prefix}:${props.name}`)
	) {
		show.value = false
		ds.fetchIcon(props.src)
			.then((svg?: string) => {
				if (svg) {
					addIconFromSvg(svg)
					show.value = true
				}
			})
			.catch((e) => {
				throw new Error(`During fetch icon: ${e?.message}`)
			})
	} else if (props.svg) {
		addIconFromSvg(props.svg)
	}
}
</script>

<template>
	<Icon
		v-if="show"
		:class="bemCssClasses"
		v-bind="{
			...$props,
			provider: currentProvider,
			icon
		}" />
</template>
