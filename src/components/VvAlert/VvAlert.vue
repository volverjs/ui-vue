<template>
	<transition :name="transition">
		<div
			v-if="visible"
			:class="alertClass"
			role="alert"
			@click.prevent="closeAlertOnClick">
			<slot v-bind="slotParams">
				<button
					v-if="closable"
					class="vv-alert__close"
					type="button"
					aria-label="Close"
					@click.stop.prevent="closeAlert" />
				<slot v-if="hasIcon" name="icon" v-bind="slotParams">
					<vv-icon :name="icon" />
				</slot>
				<div v-if="hasTitle" class="vv-alert__title">
					<slot name="title" v-bind="slotParams">
						{{ title }}
					</slot>
				</div>
				<div v-if="hasContent" class="vv-alert__content">
					<slot name="content" v-bind="slotParams">
						{{ message }}
					</slot>
				</div>
			</slot>
		</div>
	</transition>
</template>

<script lang="ts" setup>
import { computed, watch, toRefs, useSlots, onUnmounted } from 'vue'
import { VvAlertProps, VvAlertEvents } from './VvAlert'

//Components
import VvIcon from '../VvIcon/VvIcon.vue'

//Composables
import { toBem } from '@/composables/useModifiers'
import { useVModel } from '@vueuse/core'

//Props, emits, attrs , slots
const props = defineProps(VvAlertProps)
const emit = defineEmits(VvAlertEvents)
const slots = useSlots()

//Data
let closeTimeout: ReturnType<typeof setTimeout>
const { closable } = toRefs(props)
const visible = useVModel(props, 'visible', emit)

//Computed
const hasTitle = computed(() => !!(props.title || slots['title']))
const hasContent = computed(() => !!(props.message || slots['content']))
const hasIcon = computed(() => !!(props.icon || slots['icon']))
const hasAutocloseTimeout = computed(
	() => props.autoclose && props.autoclose > 0
)

//Slots
const slotParams = computed(() => ({
	closeAlert
}))

//Styles
const alertClass = computed(() => {
	return {
		...toBem('vv-alert', {
			modifiers: props.modifiers,
			icon: hasIcon.value,
			close: props.closable,
			fixed: props.fixed,
			top: props.fixed && props.top,
			bottom: props.fixed && props.bottom
		}),
		'z-notification-alert': props.fixed
	}
})

//Change visible + autoclose
watch(
	visible,
	(bVisible: boolean) => {
		if (bVisible && hasAutocloseTimeout.value) {
			closeTimeout = setTimeout(() => {
				closeAlert()
			}, props.autoclose)
		}
	},
	{ immediate: true }
)

function closeAlert() {
	visible.value = false
	console.log('Close', props.title)
	emit('close')
	if (closeTimeout) clearTimeout(closeTimeout)
}
function closeAlertOnClick() {
	emit('close')
	if (props.closeOnClick) visible.value = false
}
</script>
