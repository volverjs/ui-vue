<script lang="ts">
	export default {
		name: 'VvAlertGroup',
	}
</script>

<script setup lang="ts">
	import { useVvAlertGroup, VvAlertGroupEvents, VvAlertGroupProps } from '.'
	import VvAlert from '../VvAlert/VvAlert.vue'

	const props = defineProps(VvAlertGroupProps)
	const emit = defineEmits(VvAlertGroupEvents)
	const { hasProps, hasTransition } = useVvAlertGroup(props, emit)
</script>

<template>
	<div v-bind="hasProps">
		<!-- @slot The slot before alert list  -->
		<slot name="before" />
		<TransitionGroup
			tag="div"
			role="group"
			:name="hasTransition"
			class="vv-alert-group__list"
		>
			<!-- @slot The slot for alert list  -->
			<slot>
				<VvAlert v-for="item in items" v-bind="item" :key="item.id" />
			</slot>
		</TransitionGroup>
		<!-- @slot The slot after alert list  -->
		<slot name="after" />
	</div>
</template>
