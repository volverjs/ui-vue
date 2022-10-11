<template>
	<Icon
		v-if="show"
		v-bind="{
			...$props,
			icon
		}" />
</template>

<script lang="ts">
import { Icon, addIcon } from '@iconify/vue'
import type { IconifyRenderMode } from '@iconify/vue'
import { defineComponent, type PropType } from 'vue'

// addAPIProvider('test', { resources: ['https://test.it'] })

// addCollection({
// 	prefix: 'mdi',
// 	provider: 'test',
// 	icons: {
// 		account: {
// 			body: '<path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" fill="currentColor"/>'
// 		},
// 		pippo: {
// 			body: '<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"/>'
// 		}
// 	},
// 	width: 24,
// 	height: 24
// })

// addIcon('account-cash', {
// 	body: '<path d="M11 8c0 2.21-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4m0 6.72V20H0v-2c0-2.21 3.13-4 7-4c1.5 0 2.87.27 4 .72M24 20H13V3h11v17m-8-8.5a2.5 2.5 0 0 1 5 0a2.5 2.5 0 0 1-5 0M22 7a2 2 0 0 1-2-2h-3c0 1.11-.89 2-2 2v9a2 2 0 0 1 2 2h3c0-1.1.9-2 2-2V7z" fill="currentColor"/>'
// })

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
			type: String,
			default: 'md'
		},
		/**
		 * Url remote SVG icon
		 */
		src: String,
		/**
		 * Optional fetch options for remote call
		 * {RequestInit} https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html
		 */
		fetchOptions: {
			type: Object,
			default: () => ({
				cache: 'force-cache',
				credentials: 'omit'
			})
		},
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
			type: [String, Number],
			default: 24
		},
		/**
		 * Icon height
		 */
		height: {
			type: [String, Number],
			default: 24
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
		svg: String
	},
	data() {
		return {
			show: true
		}
	},
	computed: {
		icon() {
			const provider = this.provider || this.$ds.defaultProvider
			return `@${provider}:${this.prefix}:${this.name}`
		}
	},
	created() {
		if (this.src) {
			this.show = false
			this.fetchIcon(this.src)
				.then((svg) => {
					if (svg) {
						this.addIcon(svg)
						this.show = true
					}
				})
				.catch((e) => e)
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
			//TODO: const jsdom = require("jsdom");
			// const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
			// dom.window.document.querySelector("p").textContent; // 'Hello world'
			const domParser = new DOMParser()
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
				addIcon(this.name, {
					body: svgContent,
					height: svgContentEl.viewBox.baseVal.height,
					width: svgContentEl.viewBox.baseVal.width
				})
			}
		},
		fetchIcon(src: string): Promise<string | undefined> {
			return new Promise((resolve, reject) => {
				fetch(src, this.fetchOptions)
					.catch((e) => reject(e))
					.then((response) => response?.text())
					.then((svg?: string) => resolve(svg))
			})
		}
	}
})
</script>
