<template>
	<Transition :name="transitioName" v-on="dialogTransitionHandlers">
		<dialog v-show="openDialog" v-bind="dialogAttrs" :class="dialogClass">
			<article ref="modalWrapper" class="vv-dialog__wrapper">
				<header v-if="$slots.header || title" class="vv-dialog__header">
					<slot name="header">
						{{ title }}
						<button
							type="button"
							aria-label="Close"
							class="vv-dialog__close"
							@click.prevent="closeDialog">
							<vv-icon name="close" />
						</button>
					</slot>
				</header>
				<div class="vv-dialog__content">
					<!-- @slot default -->
					<slot />
				</div>
				<footer v-if="$slots.footer" class="vv-dialog__footer">
					<slot name="footer" />
				</footer>
			</article>
		</dialog>
	</Transition>
</template>

<script setup lang="ts">
import type { DialogHTMLAttributes } from 'vue'

import { computed, ref } from 'vue'
import { useVModel, onClickOutside } from '@vueuse/core'
import VvDialogProps from './VvDialog.props'

//Components
import VvIcon from '../VvIcon/VvIcon.vue'

//Constants
import VV_DIALOG from './constants'
import { title } from 'process'

//Props, emits, slots, attrs
const props = defineProps(VvDialogProps)
const emit = defineEmits(VV_DIALOG.EVENTS)

//Data
const openDialog = useVModel(props, 'open', emit)
const htmlAttrIsOpen = ref(true)

//Template reference
const modalWrapper = ref(null)

//Style e binding
const dialogAttrs = computed(() => {
	const { id } = props
	return {
		id,
		open: htmlAttrIsOpen.value
	} as DialogHTMLAttributes
})
const dialogClass = computed(() => {
	return {
		'vv-dialog': true,
		'vv-dialog--small': props.size === VV_DIALOG.SIZES.small,
		'vv-dialog--fullscreen': props.size === VV_DIALOG.SIZES.fullscreen
	}
})

//Transitions
const transitioName = computed(() => `vv-dialog--${props.transition}`)
const dialogTransitionHandlers = {
	'after-enter': () => {
		htmlAttrIsOpen.value = true
		emit('open')
	},
	'after-leave': () => {
		htmlAttrIsOpen.value = false
		emit('close')
	}
}

//Click outside
onClickOutside(modalWrapper, () => {
	if (props.autoClose) openDialog.value = false
})

//Methods
function closeDialog() {
	openDialog.value = false
}
</script>
