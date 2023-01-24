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
	} from '@floating-ui/vue'
	import {
		type AutoPlacementOptions,
		type FlipOptions,
		type ShiftOptions,
		type OffsetOptions,
		VvDropdownProps,
	} from '@/components/VvDropdown'
	import {
		useProvideDropdownTrigger,
		useProvideDropdownItem,
	} from '@/composables/dropdown/useProvideDropdown'
	import { useUniqueId } from '@/composables/useUniqueId'
	import { useBemModifiers } from '@/composables/useModifiers'

	// props, emit and attrs
	const props = defineProps(VvDropdownProps)
	const emit = defineEmits(['update:modelValue'])
	const { id } = toRefs(props)
	const hasId = useUniqueId(id)
	const attrs = useAttrs()

	// template elements
	const localReferenceEl = ref<HTMLElement | null>(null)
	const floatingEl: Ref<HTMLElement | null> = ref(null)
	const arrowEl = ref<HTMLElement | null>(null)
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
			placement: props.placement,
			middleware,
		},
	)
	const dropdownPlacement = computed(() => ({
		position: strategy.value,
		top: `${y.value ?? 0}px`,
		left: `${x.value ?? 0}px`,
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
				left: `${middlewareData.value.arrow?.x ?? 0}px`,
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
	watch(expanded, (newValue) => {
		if (newValue && props.autofocusFirst) {
			nextTick(() => {
				// focus first item
				focusFirst()
			})
		}
	})
	onClickOutside(
		floatingEl,
		() => {
			if (props.autoClose) {
				expanded.value = false
			}
		},
		{ ignore: [referenceEl] },
	)

	// aria
	const hasAriaLabelledby = computed(() => {
		return referenceEl.value?.getAttribute('id') ?? undefined
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
	const { bemCssClasses } = useBemModifiers('vv-dropdown', {
		modifiers,
		arrow: props.arrow,
	})

	// focus
	const { focused } = useFocusWithin(floatingEl)
	const focusFirst = () => {
		nextTick(() => {
			// focus first item
			const firstItem = floatingEl.value?.querySelector(
				'li:first-child',
			) as HTMLElement | undefined
			const firstAction = (firstItem?.firstElementChild ?? firstItem) as
				| HTMLElement
				| undefined
			if (firstAction) {
				firstAction.focus()
			}
		})
	}
	const focusLast = () => {
		nextTick(() => {
			// focus first item
			const lastItem = floatingEl.value?.querySelector(
				'li:last-child',
			) as HTMLElement | undefined
			const lastAction = (lastItem?.firstElementChild ?? lastItem) as
				| HTMLElement
				| undefined

			if (lastAction) {
				lastAction.focus()
			}
		})
	}
	const focusNext = () => {
		nextTick(() => {
			if (focused.value) {
				const nextItem = (document.activeElement?.nextElementSibling ??
					document.activeElement?.parentElement
						?.nextElementSibling) as HTMLElement | undefined
				const nextAction = (nextItem?.firstElementChild ?? nextItem) as
					| HTMLElement
					| undefined
				if (nextAction) {
					nextAction.focus()
				} else {
					focusFirst()
				}
			}
		})
	}
	const focusPrev = () => {
		nextTick(() => {
			if (focused.value) {
				const prevItem = (document.activeElement
					?.previousElementSibling ??
					document.activeElement?.parentElement
						?.previousElementSibling) as HTMLElement | undefined
				const prevAction = (prevItem?.firstElementChild ?? prevItem) as
					| HTMLElement
					| undefined
				if (prevAction) {
					prevAction.focus()
				} else {
					focusLast()
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
		if (expanded.value && focused.value) {
			e.preventDefault()
			;(document.activeElement as HTMLElement)?.click()
		}
	})
</script>

<template>
	<VvDropdownTriggerProvider>
		<slot
			v-bind="{ init, show, hide, toggle, expanded, aria: referenceAria }"
		/>
	</VvDropdownTriggerProvider>
	<Transition :name="transitionName">
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
			<ul
				v-bind="attrs"
				:id="hasId"
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
			</ul>
			<slot name="after" v-bind="{ expanded }" />
		</div>
	</Transition>
</template>
