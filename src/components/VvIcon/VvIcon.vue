<template>
	<Icon
		v-if="show"
		:class="hasClass"
		v-bind="{
			...$props,
			provider: currentProvider,
			icon
		}" />
</template>

<script lang="ts">
import { defineComponent, type ComputedRef, type PropType } from 'vue'
import type { IconifyRenderMode } from '@iconify/vue'
import { Icon, addIcon, iconExists } from '@iconify/vue'
import type { PREFIX } from './VvIcon'
import { useModifiers } from '../../composables/useModifiers'

export default defineComponent({
	components: { Icon },
	props: {
		color: String,
		width: {
			type: [String, Number]
		},
		height: {
			type: [String, Number]
		},
		/**
		 * Icon name
		 * Can be the full composition of iconify name "@{provider}:{prefix}:{name}" or "{prefix}:{name}" or "{name}"
		 * https://docs.iconify.design/api/providers.html#provider-in-icon-name
		 */
		name: {
			type: String,
			required: true
		},
		/**
		 * By default 'vv'
		 * If custom collection is not added with "addCollection" DS class method, this prop could not be used
		 * Icon provider: https://docs.iconify.design/api/providers.html#provider-in-icon-name
		 */
		provider: {
			type: String
		},
		/**
		 * The name of icon set.
		 * Icon default options prefix: simple | normal | detailed
		 */
		prefix: {
			type: String as PropType<PREFIX>,
			default: 'normal'
		},
		/**
		 * Url remote SVG icon
		 */
		src: String,
		/**
		 * Horizontal flip
		 */
		horizontalFlip: Boolean,
		/**
		 * Vertical flip
		 */
		verticalFlip: Boolean,
		/**
		 * String alternative to "horizontalFlip" and "verticalFlip".
		 * Example: https://docs.iconify.design/icon-components/vue/transform.html
		 */
		flip: String,
		/**
		 * Icon render mode
		 * 'style' = 'bg' or 'mask', depending on icon content
		 * 'bg' = span with style using `background`
		 * 'mask' = span with style using `mask`
		 * 'svg' = svg
		 * Iconify doc: https://docs.iconify.design/iconify-icon/modes.html
		 */
		mode: String as PropType<IconifyRenderMode>,
		/**
		 * Toggles inline or block mode
		 * Example https://docs.iconify.design/icon-components/vue/inline.html
		 */
		inline: Boolean,
		/**
		 * rotates icon
		 * Example https://docs.iconify.design/icon-components/vue/transform.html
		 */
		rotate: [Number, String],
		/**
		 * A callback that is called when icon data has been loaded
		 */
		onLoad: Function,
		/**
		 * SVG icon string
		 */
		svg: String,
		/**
		 * Icon modifiers: vv-icon css helper classes, value/s are concatened with prefix 'vv-icon--'
		 * @values string | Array<string>
		 */
		modifiers: {
			type: [String, Array] as PropType<string | string[]>
		}
	},
	setup(props) {
		// Get computed string with all css classes (modifiers) with 'vv-icon' prefix
		const hasModifiers: ComputedRef<string> = useModifiers(
			'vv-icon',
			props.modifiers
		)

		return {
			hasModifiers
		}
	},
	data() {
		return {
			show: true,
			iconName: ''
		}
	},
	computed: {
		/**
		 * Icon name
		 */
		icon() {
			// compose Iconify icon name format
			const iconName = `@${this.currentProvider}:${this.prefix}:${this.name}`

			// Check first if icon with "name" exist
			if (iconExists(this.name)) {
				return this.name
			} else if (iconExists(iconName)) {
				// Check and return composed icon name if exist
				return iconName
			} else {
				// Check into all collections and set "iconName" data
				this.$ds.iconsCollections.some((iconsCollection) => {
					const icon = `@${this.currentProvider}:${iconsCollection.prefix}:${this.name}`
					if (iconExists(icon)) {
						this.iconName = icon
						return true
					}
				})
			}
			return this.iconName || this.name
		},
		hasClass() {
			return ['vv-icon', this.hasModifiers]
		},
		currentProvider() {
			return this.provider || this.$ds.provider
		}
	},
	created() {
		if (this.src) {
			this.show = false
			this.$ds
				.fetchIcon(this.src)
				.then((svg?: string) => {
					if (svg) {
						this.addIconFromSvg(svg)
						this.show = true
					}
				})
				.catch((e) => {
					throw new Error(`During fetch icon: ${e?.message}`)
				})
		} else if (this.svg) {
			this.addIconFromSvg(this.svg)
		}
	},
	methods: {
		/**
		 * Get SVG content from SVG string
		 * @param {string} svg
		 * @return {SVGSVGElement | null} https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement
		 */
		getSvgContent(svg: string): SVGSVGElement | null {
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
		},
		/**
		 * Add icon to current Iconify provider
		 * @param {string} svg
		 */
		addIconFromSvg(svg: string) {
			const svgContentEl: SVGSVGElement | null = this.getSvgContent(svg)
			const svgContent = svgContentEl?.innerHTML.trim() || ''
			if (svgContentEl && svgContent) {
				addIcon(
					`@${this.currentProvider}:${this.prefix}:${this.name}`,
					{
						body: svgContent,
						// Set height and width from svg content
						height: svgContentEl.viewBox.baseVal.height,
						width: svgContentEl.viewBox.baseVal.width
					}
				)
			}
		}
	}
})
</script>
