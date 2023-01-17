<script lang="ts">
	export default {
		name: 'VvDialog',
	}
</script>

<script setup lang="ts">
	import { type DialogHTMLAttributes, computed, ref } from 'vue'
	import { useVModel, onClickOutside } from '@vueuse/core'
	import VvIcon from '@/components/VvIcon/VvIcon.vue'
	import { VvDialogEvents, VvDialogProps } from '@/components/VvDialog'

	// props, emit
	const props = defineProps(VvDialogProps)
	const emit = defineEmits(VvDialogEvents)

	// data
	const show = useVModel(props, 'modelValue', emit)
	const htmlAttrIsOpen = ref(true)

	// template ref
	const modalWrapper = ref(null)

	// styles
	const dialogAttrs = computed(() => {
		const { id } = props
		return {
			id,
			open: htmlAttrIsOpen.value,
		} as DialogHTMLAttributes
	})
	const dialogClass = computed(() => {
		if (!props.size) {
			return 'vv-dialog'
		}
		return ['vv-dialog', `vv-dialog--${props.size}`]
	})

	// transitions
	const transitioName = computed(() => `vv-dialog--${props.transition}`)
	const dialogTransitionHandlers = {
		'before-enter': () => {
			htmlAttrIsOpen.value = true
			emit('open')
		},
		'after-leave': () => {
			htmlAttrIsOpen.value = false
			emit('close')
		},
	}

	// methods
	onClickOutside(modalWrapper, () => {
		if (props.autoClose) {
			show.value = false
		}
	})

	function closeDialog() {
		show.value = false
	}
</script>

<template>
	<Transition :name="transitioName" v-on="dialogTransitionHandlers">
		<dialog v-show="show" v-bind="dialogAttrs" :class="dialogClass">
			<article ref="modalWrapper" class="vv-dialog__wrapper">
				<header v-if="$slots.header || title" class="vv-dialog__header">
					<!-- @slot Header slot -->
					<slot name="header">
						{{ title }}
						<button
							type="button"
							aria-label="Close"
							class="vv-dialog__close"
							@click.prevent="closeDialog"
						>
							<vv-icon name="close" />
						</button>
					</slot>
				</header>
				<div class="vv-dialog__content">
					<!-- @slot Content slot -->
					<slot />
				</div>
				<footer v-if="$slots.footer" class="vv-dialog__footer">
					<!-- @slot Footer slot -->
					<slot name="footer" />
				</footer>
			</article>
		</dialog>
	</Transition>
</template>
