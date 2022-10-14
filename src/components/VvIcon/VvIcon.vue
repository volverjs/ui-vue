<template>
	<Icon
		v-if="show"
		:class="hasClass"
		v-bind="{
			...$props,
			icon
		}" />
</template>

<script lang="ts">
import { defineComponent, type ComputedRef, type PropType } from 'vue'
import type { IconifyRenderMode } from '@iconify/vue'
import { Icon, addIcon, getIcon } from '@iconify/vue'
import { PREFIX } from './VvIcon'
import { useModifiers } from '../../composables/useModifiers'

export default defineComponent({
	components: { Icon },
	props: {
		/**
		 * Icon name
		 */
		name: {
			type: String,
			required: true
		},
		/**
		 * Icon provider
		 */
		provider: {
			type: String
		},
		/**
		 * Icon prefix
		 */
		prefix: {
			type: String as PropType<PREFIX>,
			default: PREFIX.normal
		},
		/**
		 * Url remote SVG icon
		 */
		src: String,
		/**
		 * String changes icon color.
		 */
		color: String,
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
		 */
		flip: String,
		/**
		 * Icon render mode
		 * 'style' = 'bg' or 'mask', depending on icon content
		 * 'bg' = <span> with style using `background`
		 * 'mask' = <span> with style using `mask`
		 * 'svg' = <svg>
		 */
		mode: String as PropType<IconifyRenderMode>,
		/**
		 * Icon width
		 */
		width: {
			type: [String, Number]
		},
		/**
		 * Icon height
		 */
		height: {
			type: [String, Number]
		},
		/**
		 * Toggles inline or block mode
		 */
		inline: Boolean,
		/**
		 * rotates icon
		 */
		rotate: [Number, String],
		/**
		 * A callback that is called when icon data has been loaded
		 */
		onLoad: Function,
		/**
		 * SVG string
		 */
		svg: String,
		/**
		 * Icon modifiers
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
			show: true
		}
	},
	computed: {
		icon() {
			const iconName = `@${this.currentProvider}:${this.prefix}:${this.name}`
			const icon = getIcon(iconName)
			return icon ? iconName : this.name
		},
		hasClass() {
			return ['vv-icon', this.hasModifiers]
		},
		currentProvider() {
			return this.provider || this.$ds.defaultProvider
		}
	},
	created() {
		if (this.src) {
			this.show = false
			this.$ds
				.fetchIcon(this.src)
				.then((svg?: string) => {
					if (svg) {
						this.addIcon(svg)
						this.show = true
					}
				})
				.catch((e) => {
					throw new Error(`During fetch icon: ${e?.message}`)
				})
		} else if (this.svg) {
			this.addIcon(this.svg)
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
		addIcon(svg: string) {
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
