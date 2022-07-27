<template>
	<component :is="tag" :class="hasClass" class="vv-text">
		<!-- @slot Use this slot for the text -->
		<slot />
	</component>
</template>

<script lang="ts">
import {
	VvTextTag,
	VvTextWeight,
	isTextSizeDynamic,
	isTextSizeStatic
} from '../../types/VvText'
import { defineComponent } from 'vue'
import { useModifiers } from '../../composables'
import type { VvTextSizeDynamic, VvTextSizeStatic } from '../../types/VvText'
import type { PropType } from 'vue'

export default defineComponent({
	name: 'VvText',
	props: {
		/**
		 * Text color.
		 */
		color: {
			type: String,
			default: null
		},
		/**
		 * Text html tag
		 * @values enum VvTextTag
		 * @defaultvalue div
		 */
		tag: {
			type: String as PropType<VvTextTag>,
			default: VvTextTag.div,
			validator: (value: VvTextTag) => value in VvTextTag
		},
		/**
		 * Text modifiers
		 * @values string | Array<string>
		 * @defaultvalue copy
		 */
		modifiers: {
			type: [String, Array] as PropType<string | string[]>,
			default: 'copy'
		},
		/**
		 * Text size
		 * @values enum VvTextSize
		 * @defaultvalue base
		 */
		size: {
			type: String as PropType<VvTextSizeDynamic | VvTextSizeStatic>,
			default: 'base',
			validator: (value: VvTextSizeDynamic | VvTextSizeStatic) => {
				return (
					isTextSizeDynamic(value as VvTextSizeDynamic) ||
					isTextSizeStatic(value as VvTextSizeStatic)
				)
			}
		},
		/**
		 * Text font weight
		 * @values enum VvTextWeight
		 * @defaultvalue normal
		 */
		weight: {
			type: String as PropType<VvTextWeight>,
			default: VvTextWeight.normal,
			validator: (value: VvTextWeight) => value in VvTextWeight
		}
	},
	setup(props) {
		return {
			hasModifiers: useModifiers('vv-text', props.modifiers)
		}
	},
	computed: {
		/**
		 * @description Define scss classes.
		 * @returns {string} The classes
		 */
		hasClass(): Array<string> {
			return [
				this.hasModifiers,
				`font-${this.weight}`,
				`text-${this.color}`,
				`text-${this.size}`
			]
		}
	}
})
</script>
