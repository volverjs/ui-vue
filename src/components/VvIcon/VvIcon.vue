<script lang="ts">
	export default {
		name: 'VvIcon',
	}
</script>

<script setup lang="ts">
	import { Icon, addIcon, iconExists, type IconifyJSON } from '@iconify/vue'
	import { VvIconProps } from '@/components/VvIcon'

	// props
	const props = defineProps(VvIconProps)

	// data
	const show = ref(true)

	// inject plugin
	const volver = useVolver()

	// classes
	const { modifiers } = toRefs(props)
	const bemCssClasses = useModifiers('vv-icon', modifiers)

	/**
	 * Provider name
	 */
	const provider = computed(() => {
		return props.provider || volver?.iconsProvider
	})

	/**
	 * Icon name
	 */
	const icon = computed(() => {
		const _name = props.name ?? ''
		// compose Iconify icon name format
		const iconName = `@${provider.value}:${props.prefix}:${props.name}`

		// Check first if icon with "name" exist
		if (iconExists(_name)) {
			return _name
		} else if (iconExists(iconName)) {
			// Check and return composed icon name if exist
			return iconName
		} else {
			// Check into all collections and set "iconName" data
			return (
				volver?.iconsCollections.find(
					(iconsCollection: IconifyJSON) => {
						const icon = `@${provider.value}:${iconsCollection.prefix}:${_name}`
						if (iconExists(icon)) {
							return icon
						}
					},
				) || _name
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
			addIcon(`@${provider.value}:${props.prefix}:${props.name}`, {
				body: svgContent,
				// Set height and width from svg content
				height: svgContentEl.viewBox.baseVal.height,
				width: svgContentEl.viewBox.baseVal.width,
			})
		}
	}

	if (volver) {
		if (
			props.src &&
			!iconExists(`@${provider.value}:${props.prefix}:${props.name}`)
		) {
			show.value = false
			volver
				.fetchIcon(props.src)
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
			inline,
			width,
			height,
			horizontalFlip,
			verticalFlip,
			flip,
			rotate,
			color,
			onLoad,
			icon,
		}"
	/>
</template>
