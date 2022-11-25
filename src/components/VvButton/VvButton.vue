<script lang="ts">
export default {
	name: 'VvButton'
}
</script>

<script setup lang="ts">
import { inject, useAttrs, useSlots, computed } from 'vue'
import { nanoid } from 'nanoid'
import { ButtonIconPosition, ButtonTag, VvButtonProps } from './VvButton'
import { contains, equals } from '@/utils/ObjectUtilities'
import { type IVolver, VOLVER_PREFIX } from '@/Volver'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { useBemModifiers } from '@/composables/useModifiers'
import { toButtonRefs } from './useButtonGroupProps'

// props, attrs and slots
const props = defineProps(VvButtonProps)
const attrs = useAttrs()
const slots = useSlots()

// data
const btnName = attrs?.name || nanoid()
const {
	modifiers,
	iconPosition,
	icon,
	label,
	modelValue,
	disabled,
	toggle,
	isInGroup
} = toButtonRefs(props)

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
 * @description The component selecged state by prop or group.
 * @returns {string} The component tag.
 */
const isSelected = computed(() => {
	if (!toggle.value) return props.selected

	return Array.isArray(modelValue.value)
		? contains(btnName, modelValue.value)
		: equals(btnName, modelValue.value)
})

/**
 * @description Define component classes with BEM style.
 * @returns {Array} The component classes.
 */
const { bemCssClasses: hasClass } = useBemModifiers('vv-button', {
	modifiers,
	active: props.active,
	selected: isSelected,
	disabled,
	reverse: computed(() =>
		[ButtonIconPosition.right, ButtonIconPosition.bottom].includes(
			iconPosition.value
		)
	),
	column: computed(() =>
		[ButtonIconPosition.top, ButtonIconPosition.bottom].includes(
			iconPosition.value
		)
	),
	iconOnly: computed(() => icon?.value && !label?.value && !slots['default'])
})

/**
 * @description Define icon attributes.
 * @returns {Object} The icon attributes.
 */
const hasIconProps = computed(() =>
	typeof icon?.value === 'string' ? { name: icon?.value } : icon?.value
)

/**
 * @description Define component attributes.
 * @returns {Object} The component attributes.
 */
const hasProps = computed(() => {
	const toReturn = {
		class: hasClass.value,
		'aria-label': attrs['aria-label'],
		'aria-selected': isSelected.value ? true : undefined
	}
	switch (hasTag.value) {
		case ButtonTag.a:
			return {
				...toReturn,
				role: 'button',
				href: props.href,
				target: props.target,
				rel: props.rel
			}
		case ButtonTag.routerLink:
		case ButtonTag.nuxtLink:
			return {
				...toReturn,
				role: 'button',
				to: props.to,
				target: props.target
			}
		default:
			return {
				...toReturn,
				type: props.type,
				disabled: disabled.value
			}
	}
})

/**
 * @description Catch click event in a group.
 */
function onBtnClick() {
	// set group modelValue
	if (isInGroup.value) {
		modelValue.value = btnName
	}
}
</script>

<template>
	<!-- #region component: "button" | "a" | "router-link" | "nuxt-link" -->
	<component v-bind="hasProps" :is="hasTag" @click.passive="onBtnClick">
		<!-- @slot default to replace all button content -->
		<slot>
			<!-- #region loading -->
			<template v-if="loading">
				<slot name="loading">
					<VvIcon
						v-if="loadingIcon"
						class="vv-button__loading-icon"
						:name="loadingIcon" />
					<span v-if="loadingLabel" class="vv-button__label">
						{{ loadingLabel }}
					</span>
				</slot>
			</template>
			<!-- #endregion loading -->
			<!-- #region button -->
			<template v-else>
				<!-- @slot before -->
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
				<!-- @slot after -->
				<slot name="after" />
			</template>
			<!-- #endregion button -->
		</slot>
	</component>
	<!-- #endregion component: button | a | router-link | nuxt-link -->
</template>
