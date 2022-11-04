<template>
	<component :is="wrapperImage" v-bind="wrapperImageProps">
		<img v-bind="imgProps" :style="imgStyle" />
	</component>
</template>

<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue'
import { computed, reactive, toRefs } from 'vue'
import { VvImageProps } from './VvImage'

//Props, attrs, slots
const props = defineProps(VvImageProps)

//Data
const { width, height } = toRefs(props)

//Style and binding
const imgProps = computed(() => {
	const { src, alt } = props
	return {
		src,
		alt
	} as ImgHTMLAttributes
})

const imgStyle = reactive({
	width,
	height
})

const wrapperImage = computed(() => {
	const { download } = props
	if (download) {
		return 'a'
	}

	return ''
})

// Problema * Chrome 65+ and Firefox only support same-origin download links. Non scarica ma apre se è un puntamento esterno
const wrapperImageProps = computed(() => {
	const { src, download, downloadFileName } = props
	if (download) {
		return {
			download: downloadFileName || true,
			href: src
		}
	}

	return {}
})
</script>
