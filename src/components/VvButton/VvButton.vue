<script lang="ts">
	export default {
		name: 'VvButton',
	}
</script>

<script setup lang="ts">
	import { inject, useAttrs, useSlots, computed } from 'vue'
	import { nanoid } from 'nanoid'
	import { contains, equals } from '@/utils/ObjectUtilities'
	import { type IVolver, VOLVER_PREFIX } from '@/Volver'
	import { useBemModifiers } from '@/composables/useModifiers'
	import VvIcon from '@/components/VvIcon/VvIcon.vue'
	import {
		ButtonIconPosition,
		VvButtonEvents,
		ButtonTag,
		VvButtonProps,
		useGroupProps,
	} from '@/components/VvButton'

	// props, attrs, slots and emit
	const props = defineProps(VvButtonProps)
	const attrs = useAttrs()
	const slots = useSlots()
	const emit = defineEmits(VvButtonEvents)

	// data
	const name = (attrs?.name as string) || nanoid()
	const {
		modifiers,
		iconPosition,
		icon,
		label,
		modelValue,
		disabled,
		toggle,
		unselectable,
	} = useGroupProps(props, emit)

	// inject Volver
	const ds = inject<IVolver>(VOLVER_PREFIX)

	/**
	 * @description The tag defined by props.
	 * @returns {string} The tag.
	 */
	const hasTag = computed(() => {
		switch (true) {
			case disabled.value:
				return ButtonTag.button
			case props.to !== undefined:
				return ds?.nuxt ? ButtonTag.nuxtLink : ButtonTag.routerLink
			case props.href !== undefined:
				return ButtonTag.a
			default:
				return ButtonTag.button
		}
	})

	/**
	 * @description The component pressed state by prop or group.
	 * @returns {string} The component tag.
	 */
	const isPressed = computed(() => {
		if (!toggle.value) return props.pressed

		return Array.isArray(modelValue.value)
			? contains(name, modelValue.value)
			: equals(name, modelValue.value)
	})

	/**
	 * @description Define component classes with BEM style.
	 * @returns {Array} The component classes.
	 */
	const { bemCssClasses } = useBemModifiers('vv-button', {
		modifiers,
		active: props.active,
		pressed: isPressed,
		disabled,
		reverse: computed(() =>
			[ButtonIconPosition.right, ButtonIconPosition.bottom].includes(
				iconPosition.value,
			),
		),
		column: computed(() =>
			[ButtonIconPosition.top, ButtonIconPosition.bottom].includes(
				iconPosition.value,
			),
		),
		iconOnly: computed(
			() => icon?.value && !label?.value && !slots['default'],
		),
	})

	/**
	 * @description Define icon attributes.
	 * @returns {Object} The icon attributes.
	 */
	const hasIconProps = computed(() =>
		typeof icon?.value === 'string' ? { name: icon?.value } : icon?.value,
	)

	/**
	 * @description Define component attributes.
	 * @returns {Object} The component attributes.
	 */
	const hasProps = computed(() => {
		const toReturn = {
			class: bemCssClasses.value,
			'aria-pressed': isPressed.value ? true : undefined,
		}
		switch (hasTag.value) {
			case ButtonTag.a:
				return {
					...toReturn,
					role: 'button',
					href: props.href,
					target: props.target,
					rel: props.rel,
				}
			case ButtonTag.routerLink:
			case ButtonTag.nuxtLink:
				return {
					...toReturn,
					role: 'button',
					to: props.to,
					target: props.target,
				}
			default:
				return {
					...toReturn,
					type: props.type,
					disabled: disabled.value,
				}
		}
	})

	/**
	 * @description Catch click event in a group.
	 */
	const onClick = () => {
		if (toggle.value) {
			if (Array.isArray(modelValue.value)) {
				if (contains(name, modelValue.value)) {
					if (unselectable.value) {
						modelValue.value = modelValue.value.filter(
							(n) => n !== name,
						)
					}
					return
				}
				modelValue.value.push(name)
				return
			}
			if (equals(name, modelValue.value) && unselectable.value) {
				modelValue.value = undefined
				return
			}
			modelValue.value = name
		}
	}
</script>

<template>
	<!-- #region component: "button" | "a" | "router-link" | "nuxt-link" -->
	<component v-bind="hasProps" :is="hasTag" @click.passive="onClick">
		<!-- @slot Replace all button content -->
		<slot>
			<!-- #region loading -->
			<template v-if="loading">
				<!-- @slot Replace all button content on loading -->
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
			<!-- #endregion loading -->
			<!-- #region button -->
			<template v-else>
				<!-- @slot Before label and icon -->
				<slot name="before" />
				<!-- #region icon -->
				<template v-if="icon">
					<VvIcon class="vv-button__icon" v-bind="hasIconProps" />
				</template>
				<!-- #endregion icon -->
				<!-- #region label  -->
				<span v-if="label" class="vv-button__label">
					<!-- @slot Use this slot for button label -->
					<slot name="label">
						{{ label }}
					</slot>
				</span>
				<!-- #endregion label  -->
				<!-- @slot After label and icon -->
				<slot name="after" />
			</template>
			<!-- #endregion button -->
		</slot>
	</component>
	<!-- #endregion component: button | a | router-link | nuxt-link -->
</template>
