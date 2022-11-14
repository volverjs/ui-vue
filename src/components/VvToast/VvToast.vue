<template>
	<transition :name="transition">
		<div v-if="visible" :class="toastClass">
			<slot v-bind="slotParams">
				<div v-if="hasHeader" class="vv-toast__header">
					<slot name="header" v-bind="slotParams">
						<button
							v-if="closable"
							class="vv-toast__close"
							type="button"
							aria-label="Close"
							@click.stop.prevent="closeToast" />
						<slot v-if="hasIcon" name="icon" v-bind="slotParams">
							<vv-icon :name="icon" class="mr-xs" />
						</slot>
						{{ title }}
					</slot>
				</div>
				<div v-if="hasContent" class="vv-toast__content">
					<slot name="content" v-bind="slotParams">
						{{ message }}
					</slot>
				</div>
			</slot>
		</div>
	</transition>
</template>

<script lang="ts" setup>
import { computed, watch, toRefs, useSlots } from 'vue'
import { VvToastProps, VvToastEvents } from './VvToast'

//Components
import VvIcon from '../VvIcon/VvIcon.vue'

//Composables
import { toBem } from '@/composables/useModifiers'
import { useVModel } from '@vueuse/core'

//Props, emits, attrs , slots
const props = defineProps(VvToastProps)
const emit = defineEmits(VvToastEvents)
const slots = useSlots()

//Data
let closeTimeout: ReturnType<typeof setTimeout>
const { closable } = toRefs(props)
const visible = useVModel(props, 'visible', emit)

//Computed
const hasHeader = computed(() => !!(props.title || slots['header']))
const hasContent = computed(() => !!(props.message || slots['content']))
const hasIcon = computed(() => !!(props.icon || slots['icon']))
const hasAutocloseTimeout = computed(
	() => props.autoclose && props.autoclose > 0
)

//Slots
const slotParams = computed(() => ({
	closeToast
}))

//Styles
const toastClass = computed(() => {
	return {
		...toBem('vv-toast', {
			modifiers: props.modifiers,
			fixed: props.fixed,
			top: props.top,
			bottom: props.bottom,
			right: props.right,
			left: props.left,
			center: props.center
		}),
		'z-toast': true
	}
})

//Change visible + autoclose
watch(
	visible,
	(bVisible: boolean) => {
		if (bVisible && hasAutocloseTimeout.value) {
			closeTimeout = setTimeout(() => {
				closeToast()
				clearTimeout(closeTimeout)
			}, props.autoclose)
		}
	},
	{ immediate: true }
)

function closeToast() {
	visible.value = false
	emit('close')
	if (closeTimeout) clearTimeout(closeTimeout)
}
</script>
