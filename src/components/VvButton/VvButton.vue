<script lang="ts">
	export default {
		name: 'VvButton',
	}
</script>

<script setup lang="ts">
	import VvIcon from '../VvIcon/VvIcon.vue'
	import VvAction from '../VvAction/VvAction.vue'
	import { VvButtonEvents, VvButtonProps, useGroupProps } from '.'
	import { Side } from '../../constants'

	// props, attrs, slots and emit
	const props = defineProps(VvButtonProps)
	const attrs = useAttrs()
	const slots = useSlots()
	const emit = defineEmits(VvButtonEvents)

	// data
	const {
		id,
		modifiers,
		iconPosition,
		icon,
		label,
		modelValue,
		disabled,
		toggle,
		unselectable,
	} = useGroupProps(props, emit)
	const hasId = useUniqueId(id)
	const name = computed(() => (attrs?.name as string) || hasId.value)

	// expose el
	const element = ref<{ $el: HTMLElement } | null>(null)
	const $el = computed(() => element.value?.$el)
	defineExpose({ $el })

	/**
	 * @description The component pressed state by prop or group.
	 * @returns {string} The component tag.
	 */
	const pressed = computed(() => {
		if (!toggle.value) {
			return props.pressed
		}
		if (Array.isArray(modelValue.value)) {
			return contains(name.value, modelValue.value)
		}
		return equals(name.value, modelValue.value)
	})

	/**
	 * @description Define component classes with BEM style.
	 * @returns {Array} The component classes.
	 */
	const bemCssClasses = useModifiers(
		'vv-button',
		modifiers,
		computed(() => ({
			reverse: [Side.right, Side.bottom].includes(
				iconPosition.value as Side,
			),
			column: [Side.top, Side.bottom].includes(
				iconPosition.value as Side,
			),
			'icon-only': Boolean(
				icon?.value && !label?.value && !slots.default,
			),
		})),
	)

	/**
	 * @description Define icon attributes.
	 * @returns {Object} The icon attributes.
	 */
	const hasIconProps = computed(() =>
		typeof icon?.value === 'string' ? { name: icon?.value } : icon?.value,
	)

	/**
	 * @description Catch click event
	 */
	const toggleValue = computed(() => {
		return props.value !== undefined ? props.value : name.value
	})
	const onClick = () => {
		if (toggle.value) {
			if (Array.isArray(modelValue.value)) {
				if (contains(toggleValue.value, modelValue.value)) {
					if (unselectable.value) {
						modelValue.value = modelValue.value.filter(
							(n) => n !== toggleValue.value,
						)
					}
					return
				}
				modelValue.value.push(toggleValue.value)
				return
			}
			if (toggleValue.value === modelValue.value && unselectable.value) {
				modelValue.value = props.uncheckedValue
				return
			}
			modelValue.value = toggleValue.value
		}
	}
</script>

<template>
	<VvAction
		v-bind="{
			disabled,
			pressed,
			active,
			type,
			to,
			href,
			target,
			rel,
			ariaLabel,
		}"
		:id="hasId"
		ref="element"
		:class="bemCssClasses"
		@click="onClick"
	>
		<!-- @slot Default slot -->
		<slot>
			<!-- #region loading -->
			<template v-if="loading">
				<!-- @slot Slot for loading content -->
				<slot name="loading">
					<VvIcon
						v-if="loadingIcon"
						class="vv-button__loading-icon"
						:name="loadingIcon"
					/>
					<span v-if="loadingLabel" class="vv-button__label">
						{{ loadingLabel }}
					</span>
				</slot>
			</template>
			<!-- #endregion -->
			<!-- #region button -->
			<template v-else>
				<!-- @slot Before label and icon -->
				<slot name="before" />
				<template v-if="icon">
					<VvIcon class="vv-button__icon" v-bind="hasIconProps" />
				</template>
				<span v-if="label" class="vv-button__label">
					<!-- @slot Use this slot for button label -->
					<slot name="label">
						{{ label }}
					</slot>
				</span>
				<!-- @slot After label and icon -->
				<slot name="after" />
			</template>
			<!-- #endregion -->
		</slot>
	</VvAction>
</template>
