<script lang="ts">
	export default {
		name: 'VvDropdown',
		inheritAttrs: false,
	}
</script>

<script setup lang="ts">
	import type { Ref } from 'vue'
	import {
		useFloating,
		offset,
		flip,
		autoUpdate,
		shift,
		autoPlacement,
		arrow,
		size,
	} from '@floating-ui/vue'
	import { VvDropdownProps } from '.'
	import type {
		AutoPlacementOptions,
		FlipOptions,
		OffsetOptions,
		ShiftOptions,
		SizeOptions,
	} from '../../types/floating-ui'

	// props, emit and attrs
	const props = defineProps(VvDropdownProps)
	const emit = defineEmits([
		'update:modelValue',
		'beforeExpand',
		'beforeCollapse',
		'afterExpand',
		'afterCollapse',
	])
	const { id } = toRefs(props)
	const hasId = useUniqueId(id)
	const attrs = useAttrs()
	const maxWidth = ref('auto')
	const maxHeight = ref('auto')

	// template elements
	const localReferenceEl = ref<HTMLElement | null>(null)
	const floatingEl: Ref<HTMLElement | null> = ref(null)
	const arrowEl = ref<HTMLElement | null>(null)
	const listEl = ref<HTMLUListElement | null>(null)
	const referenceEl = computed({
		get: () => props.reference ?? localReferenceEl.value,
		set: (newValue) => {
			localReferenceEl.value = newValue
		},
	})

	// floating ui
	const middleware = computed(() => {
		const toReturn = []

		if (props.autoPlacement) {
			if (typeof props.autoPlacement === 'boolean') {
				toReturn.push(autoPlacement())
			} else {
				toReturn.push(
					autoPlacement(props.autoPlacement as AutoPlacementOptions),
				)
			}
		} else if (props.flip) {
			if (typeof props.flip === 'boolean') {
				toReturn.push(flip())
			} else {
				toReturn.push(flip(props.flip as FlipOptions))
			}
		}

		if (props.shift) {
			if (typeof props.shift === 'boolean') {
				toReturn.push(shift())
			} else {
				toReturn.push(shift(props.shift as ShiftOptions))
			}
		}

		if (props.size) {
			const apply = ({
				availableWidth,
				availableHeight,
			}: {
				availableWidth: number
				availableHeight: number
			}) => {
				maxWidth.value = `${availableWidth}px`
				maxHeight.value = `${availableHeight}px`
			}
			if (typeof props.size === 'boolean') {
				toReturn.push(
					size({
						apply,
					}),
				)
			} else {
				toReturn.push(
					size({
						...(props.size as SizeOptions),
						apply,
					}),
				)
			}
		}

		if (props.offset) {
			toReturn.push(offset(Number(props.offset)))

			if (['string', 'number'].includes(typeof props.offset)) {
				toReturn.push(offset(Number(props.offset)))
			} else {
				toReturn.push(offset(props.offset as OffsetOptions))
			}
		}

		if (props.arrow) {
			toReturn.push(
				arrow({
					element: arrowEl,
				}),
			)
		}

		return toReturn
	})
	const { x, y, strategy, middlewareData, placement } = useFloating(
		referenceEl,
		floatingEl,
		{
			whileElementsMounted: autoUpdate,
			placement: computed(() => props.placement),
			strategy: computed(() => props.strategy),
			middleware,
		},
	)
	const dropdownPlacement = computed(() => ({
		position: strategy.value,
		top: `${y.value ?? 0}px`,
		left: `${x.value ?? 0}px`,
		maxWidth: maxWidth.value,
		maxHeight: maxHeight.value,
		width:
			props.triggerWidth && referenceEl.value
				? `${referenceEl.value.offsetWidth}px`
				: undefined,
	}))

	// placement
	const side = computed(() => placement.value.split('-')[0])
	const staticSide = computed(
		() =>
			({
				top: 'bottom',
				right: 'left',
				bottom: 'top',
				left: 'right',
			}[side.value] ?? 'bottom'),
	)
	const arrowPlacement = computed(() => {
		if (['bottom', 'top'].includes(staticSide.value)) {
			return {
				right: `${middlewareData.value.arrow?.x ?? 0}px`,
				[staticSide.value]: `${
					-(arrowEl.value?.offsetWidth ?? 0) / 2
				}px`,
			}
		}
		return {
			top: `${middlewareData.value.arrow?.y ?? 0}px`,
			[staticSide.value]: `${-(arrowEl.value?.offsetWidth ?? 0) / 2}px`,
		}
	})

	// visibility
	const modelValue = useVModel(props, 'modelValue', emit)
	const localModelValue = ref(false)
	const expanded = computed({
		get: () => modelValue.value ?? localModelValue.value,
		set: (newValue) => {
			if (modelValue.value === undefined) {
				localModelValue.value = newValue
				return
			}
			modelValue.value = newValue
		},
	})
	const show = () => {
		expanded.value = true
	}
	const hide = () => {
		expanded.value = false
	}
	const toggle = () => {
		expanded.value = !expanded.value
	}
	const init = (el: HTMLElement) => {
		referenceEl.value = el
	}
	defineExpose({ toggle, show, hide, init })
	watch(expanded, (newValue) => {
		if (newValue && props.autofocusFirst) {
			nextTick(() => {
				// focus first item
				const focusableElements = getKeyboardFocusableElements(
					floatingEl.value,
				)
				if (focusableElements.length > 0) {
					focusableElements[0].focus()
				}
			})
		}
	})
	onClickOutside(
		floatingEl,
		() => {
			if (!props.keepOpen) {
				expanded.value = false
			}
		},
		{ ignore: [referenceEl] },
	)

	// aria
	const hasAriaLabelledby = computed(() => {
		return referenceEl.value?.getAttribute?.('id') ?? undefined
	})
	const referenceAria = computed(() => ({
		'aria-controls': hasId.value,
		'aria-haspopup': true,
		'aria-expanded': expanded.value,
	}))

	// provide to dropdown
	const { component: VvDropdownTriggerProvider, bus } =
		useProvideDropdownTrigger({
			reference: referenceEl,
			id: hasId,
			expanded,
			aria: referenceAria,
		})
	bus.on('click', toggle)

	// provide top dropdown item
	const { role, modifiers } = toRefs(props)
	const { itemRole } = useProvideDropdownItem({ role, expanded })

	// styles
	const bemCssClasses = useModifiers(
		'vv-dropdown',
		modifiers,
		computed(() => ({
			arrow: props.arrow,
		})),
	)

	// focus
	const { focused } = useFocusWithin(floatingEl)
	function getKeyboardFocusableElements(element: Element | null) {
		if (!element) {
			return []
		}
		return [
			...element.querySelectorAll(
				'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])',
			),
		].filter(
			(el) =>
				!el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
		) as HTMLElement[]
	}
	const focusNext = () => {
		nextTick(() => {
			if (focused.value) {
				const focusableElements = getKeyboardFocusableElements(
					floatingEl.value,
				)
				if (focusableElements.length === 0 || !document.activeElement) {
					return
				}
				const activeElementIndex = focusableElements.indexOf(
					document.activeElement as HTMLElement,
				)
				if (activeElementIndex < focusableElements.length - 1) {
					focusableElements[activeElementIndex + 1].focus()
				} else {
					focusableElements[0].focus()
				}
			}
		})
	}
	const focusPrev = () => {
		nextTick(() => {
			if (focused.value) {
				const focusableElements = getKeyboardFocusableElements(
					floatingEl.value,
				)
				if (focusableElements.length === 0 || !document.activeElement) {
					return
				}
				const activeElementIndex = focusableElements.indexOf(
					document.activeElement as HTMLElement,
				)
				if (activeElementIndex > 0) {
					focusableElements[activeElementIndex - 1].focus()
				} else {
					focusableElements[focusableElements.length - 1].focus()
				}
			}
		})
	}

	// keyboard
	onKeyStroke('Escape', (e) => {
		if (expanded.value) {
			e.preventDefault()
			hide()
		}
	})
	onKeyStroke('ArrowDown', (e) => {
		if (expanded.value && focused.value) {
			e.preventDefault()
			focusNext()
		}
	})
	onKeyStroke('ArrowUp', (e) => {
		if (expanded.value && focused.value) {
			e.preventDefault()
			focusPrev()
		}
	})
	onKeyStroke([' ', 'Enter'], (e) => {
		if (
			expanded.value &&
			focused.value &&
			e.target !== document.activeElement
		) {
			e.preventDefault()
			const activeElement = document.activeElement as HTMLElement
			activeElement.click()
		}
	})
	const onTransitionBeforeEnter = () => {
		emit(expanded.value ? 'beforeExpand' : 'beforeCollapse')
	}
	const onTransitionAfterLeave = () => {
		emit(expanded.value ? 'afterExpand' : 'afterCollapse')
	}
</script>

<template>
	<VvDropdownTriggerProvider>
		<slot
			v-bind="{ init, show, hide, toggle, expanded, aria: referenceAria }"
		/>
	</VvDropdownTriggerProvider>
	<Transition
		:name="transitionName"
		v-on="{
			beforeEnter: onTransitionBeforeEnter,
			onAfterLeave: onTransitionAfterLeave,
		}"
	>
		<div
			v-show="expanded"
			ref="floatingEl"
			:style="dropdownPlacement"
			:class="bemCssClasses"
		>
			<div
				v-if="props.arrow"
				ref="arrowEl"
				:style="arrowPlacement"
				class="vv-dropdown__arrow"
			></div>
			<slot name="before" v-bind="{ expanded }" />
			<div
				v-bind="attrs"
				:id="hasId"
				ref="listEl"
				:tabindex="!expanded ? -1 : undefined"
				:role="role"
				:aria-labelledby="hasAriaLabelledby"
				class="vv-dropdown__list"
			>
				<slot
					name="items"
					v-bind="{
						role: itemRole,
					}"
				/>
			</div>
			<slot name="after" v-bind="{ expanded }" />
		</div>
	</Transition>
</template>
