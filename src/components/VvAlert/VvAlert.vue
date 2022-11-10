<template>
	<transition>
		<div v-if="visible" :class="alertClass" role="alert">
			<slot>
				<button
					v-if="closable"
					class="vv-alert__close"
					type="button"
					aria-label="Close"
					@click.prevent="visible = false" />
				<slot v-if="hasIcon" name="icon">
					<vv-icon :name="icon" />
				</slot>
				<div v-if="hasTitle" class="vv-alert__title">
					<slot name="title">
						{{ title }}
					</slot>
				</div>
				<div v-if="hasContent" class="vv-alert__content">
					<slot name="content">
						{{ message }}
					</slot>
				</div>
			</slot>
		</div>
	</transition>
</template>

<script lang="ts" setup>
import { computed, toRefs, useSlots } from 'vue'
import { VvAlertProps, VvAlertEvents } from './VvAlert'
import { POSITIONS } from './constants'

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
const { title, message, icon, closable } = toRefs(props)
const visible = useVModel(props, 'visible', emit)

//Computed
const hasTitle = computed(() => !!(props.title || slots['title']))
const hasContent = computed(() => !!(props.message || slots['content']))
const hasIcon = computed(() => !!(props.icon || slots['icon']))

//Styles
const alertClass = computed(() => {
	return {
		...toBem('vv-alert', {
			modifiers: props.modifiers,
			icon: hasIcon.value,
			close: props.closable
		}),
		...positioningClass.value
	}
})
const positioningClass = computed(() => {
    let posXclass = ''
    let posYClass = ''
    switch(props.position){
        case POSITIO
    }

	return {
		fixed: props.fixed,
		'z-notification-alert': props.fixed,
		'inset-x-lg': props.fixed,
		'top-lg': props.fixed
	}
})
</script>
