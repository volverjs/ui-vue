<script lang="ts">
	export default {
		name: 'VvIcon',
	}
</script>

<script setup lang="ts">
	import { Icon, addIcon, iconExists } from '@iconify/vue'
	import { type VvIconProps, VvIconPropsDefaults } from '.'

	// props
	const props = withDefaults(defineProps<VvIconProps>(), VvIconPropsDefaults)

	const hasRotate = computed(() => {
		if (typeof props.rotate === 'string') {
			return parseFloat(props.rotate)
		}
		return props.rotate
	})

	// data
	const show = ref(true)

	// inject plugin
	const volver = useVolver()

	// classes
	const { modifiers } = toRefs(props)
	const bemCssClasses = useModifiers('vv-icon', modifiers)

	// provider name
	const provider = computed(() => {
		return props.provider || volver?.iconsProvider
	})

	// icon name
	const icon = computed(() => {
		const name = props.name ?? ''
		// compose Iconify icon name format
		const iconName = `@${provider.value}:${props.prefix}:${name}`

		// Check if icon with prefix and provider exist
		if (iconExists(iconName)) {
			return iconName
		}

		// Check if icon exist into any collection
		const iconsCollection = volver?.iconsCollections.find(
			(iconsCollection) => {
				const icon = `@${provider.value}:${iconsCollection.prefix}:${name}`
				return iconExists(icon)
			},
		)
		if (iconsCollection) {
			return `@${provider.value}:${iconsCollection.prefix}:${name}`
		}

		return name
	})

	/**
	 * Get SVG content from SVG string
	 * @param {string} svg
	 * @return {SVGSVGElement | undefined} https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement
	 */
	function getSvgContent(svg: string): SVGSVGElement | undefined {
		let dom
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
		const svgContentEl = getSvgContent(svg)
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
					throw new Error(`Error during fetch icon: ${e?.message}`)
				})
		}
	}

	if (props.svg) {
		addIconFromSvg(props.svg)
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
			rotate: hasRotate,
			color,
			onLoad,
			icon,
		}"
	/>
</template>
