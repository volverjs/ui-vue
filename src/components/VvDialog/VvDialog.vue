<script lang="ts">
	export default {
		name: 'VvDialog',
	}
</script>

<script setup lang="ts">
	import type { DialogHTMLAttributes } from 'vue'
	import VvIcon from '../VvIcon/VvIcon.vue'
	import { VvDialogEvents, VvDialogProps } from '.'

	// props, emit and template refs
	const props = defineProps(VvDialogProps)
	const emit = defineEmits(VvDialogEvents)
	const dialogEl: Ref<HTMLDialogElement | undefined> = ref()

	// data
	const localModelValue = ref(false)
	const modelValue = computed({
		get() {
			return props.modelValue ?? localModelValue.value
		},
		set(value) {
			if (props.modelValue === undefined) {
				localModelValue.value = value
			}
			emit('update:modelValue', value)
		},
	})

	// template ref
	const modalWrapper = ref(null)

	// styles
	const dialogAttrs = computed(() => {
		const { id } = props
		return {
			id,
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
			dialogEl.value?.showModal()
			emit('open')
			emit('before-enter')
		},
		'after-leave': () => {
			dialogEl.value?.close()
			emit('close')
			emit('after-leave')
		},
		enter: () => {
			emit('enter')
		},
		'after-enter': () => {
			emit('after-enter')
		},
		'enter-cancelled': () => {
			emit('enter-cancelled')
		},
		'before-leave': () => {
			emit('before-leave')
		},
		leave: () => {
			emit('leave')
		},
		'leave-cancelled': () => {
			emit('leave-cancelled')
		},
	}

	// methods
	onClickOutside(modalWrapper, () => {
		if (!props.keepOpen) {
			modelValue.value = false
		}
	})

	function close() {
		modelValue.value = false
	}

	function open() {
		modelValue.value = true
	}

	defineExpose({ close, open })

	// keyboard
	onKeyStroke('Escape', (e) => {
		if (modelValue.value) {
			e.preventDefault()
			close()
		}
	})
</script>

<template>
	<Transition :name="transitioName" v-on="dialogTransitionHandlers">
		<dialog
			v-show="modelValue"
			v-bind="dialogAttrs"
			ref="dialogEl"
			:class="dialogClass"
		>
			<article ref="modalWrapper" class="vv-dialog__wrapper">
				<header v-if="$slots.header || title" class="vv-dialog__header">
					<!-- @slot Header slot -->
					<slot name="header">
						{{ title }}
						<button
							type="button"
							aria-label="Close"
							class="vv-dialog__close"
							@click.passive="close"
						>
							<VvIcon name="close" />
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
