<script lang="ts">
	export default {
		name: 'VvAlert',
	}
</script>

<script setup lang="ts">
	import VvIcon from '../VvIcon/VvIcon.vue'
	import { useVvAlert, VvAlertEvents, VvAlertProps } from '.'

	const props = defineProps(VvAlertProps)
	const emit = defineEmits(VvAlertEvents)
	const { hasProps, hasTitleId, hasIcon, close } = useVvAlert(props, emit)
	defineExpose({ close })
</script>

<template>
	<div v-bind="hasProps">
		<div
			v-if="
				$slots.header ||
				$slots.title ||
				$slots.close ||
				$slots['title::before'] ||
				$slots['title::after'] ||
				title ||
				dismissable ||
				autoClose
			"
			class="vv-alert__header"
		>
			<VvIcon v-if="hasIcon" v-bind="hasIcon" class="vv-alert__icon" />
			<!-- @slot Header slot -->
			<slot name="header">
				<!-- @slot Before title slot -->
				<slot name="title::before" />
				<strong :id="hasTitleId" class="vv-alert__title">
					<!-- @slot Title slot -->
					<slot name="title">
						{{ title }}
					</slot>
				</strong>
				<!-- @slot After title slot -->
				<slot name="title::after" />
			</slot>
			<!-- @slot Close button slot -->
			<slot name="close" v-bind="{ close }">
				<button
					v-if="dismissable || autoClose"
					class="vv-alert__close"
					type="button"
					:aria-label="closeLabel"
					@click.stop="close"
				>
					<div class="vv-alert__close-mask"></div>
				</button>
			</slot>
		</div>
		<div v-if="$slots.default || content" class="vv-alert__content">
			<!-- @slot Content slot -->
			<slot>
				{{ content }}
			</slot>
		</div>
		<div v-if="$slots.footer || footer" class="vv-alert__footer">
			<!-- @slot Footer slot -->
			<slot name="footer">
				{{ footer }}
			</slot>
		</div>
	</div>
</template>
