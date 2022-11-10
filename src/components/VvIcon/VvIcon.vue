<template>
	<Icon
		v-if="show"
		:class="iconClass"
		v-bind="{
			...$props,
			provider: currentProvider,
			icon
		}" />
</template>

<script setup lang="ts">
import type { IDesignSystem } from '../../DesignSystem'

import { inject, toRefs } from 'vue'

import { ref, computed } from 'vue'
import { Icon, addIcon, iconExists } from '@iconify/vue'
import { VvIconProps } from './VvIcon'

//Composables
import { useBemModifiers } from '@/composables/useModifiers'

//Props,emits,slots
const props = defineProps(VvIconProps)

//Data
const show = ref(true)
const { modifiers } = toRefs(props)

//Inject
const ds = inject<IDesignSystem>('ds')

//Styles & bindings
const { bemCssClasses: iconClass } = useBemModifiers('vv-icon', {
	modifiers
})

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
			ds?.iconsCollections.find((iconsCollection) => {
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
	if (props.src) {
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
