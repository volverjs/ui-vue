import { ModifiersProps } from '@/props'
import type { ExtractPropTypes } from 'vue'
import type { VvIconProps } from '../VvIcon'

export type AlertItem = {
	id: string | number
	title?: string
	icon?: string | VvIconProps
	content?: string
	footer?: string
	modifiers?: string | string[]
	dismissable?: boolean
	autoClose?: number
	closeLabel?: string
	role?: 'alert' | 'alertdialog'
}

export const VvAlertGroupProps = {
	...ModifiersProps,
	name: {
		type: String,
		required: true,
	},
	items: {
		type: Array as PropType<AlertItem[]>,
		default: () => [],
	},
	stack: {
		type: Boolean,
		default: false,
	},
	reverse: {
		type: Boolean,
		default: false,
	},
	inline: {
		type: String as PropType<'start' | 'middle' | 'end'>,
		default: undefined,
	},
	block: {
		type: String as PropType<'top' | 'center' | 'bottom'>,
		default: undefined,
	},
	position: {
		type: String as PropType<'absolute' | 'fixed'>,
		default: undefined,
	},
	transition: {
		type: String,
		default: undefined,
	},
}

export const VvAlertGroupEvents = [
	'close',
	'before-enter',
	'after-leave',
	'enter',
	'after-enter',
	'enter-cancelled',
	'before-leave',
	'leave',
	'leave-cancelled',
]

export const useVvAlertGroup = (
	props: Readonly<ExtractPropTypes<typeof VvAlertGroupProps>>,
	emit: (event: string, ...args: unknown[]) => void,
) => {
	const bus = useProvideAlertGroup({ name: computed(() => props.name) })

	// check props block and inline coexist
	if ((props.block && !props.inline) || (!props.block && props.inline)) {
		// eslint-disable-next-line
		console.warn(
			`[VvAlertGroup]: block and inline props must coexist at the same time.`,
		)
	}

	// props
	const hasClass = computed(() => {
		const toReturn: (string | Record<string, boolean>)[] = [
			useModifiers(
				'vv-alert-group',
				computed(() => props.modifiers),
				computed(() => ({
					stack: props.stack,
					reverse: props.reverse,
					absolute: props.position === 'absolute',
					fixed: props.position === 'fixed',
				})),
			).value,
		]
		if (props.inline && props.block) {
			toReturn.push(`vv-alert-group--${props.block}-${props.inline}`)
		}
		return toReturn
	})

	const hasTransition = computed(() => {
		if (props.transition) {
			return props.transition
		}
		if (!props.position) {
			return 'vv-alert--fade'
		}
		if (props.inline === 'start') {
			return 'vv-alert--fade-inline-start'
		}
		if (props.inline === 'end') {
			return 'vv-alert--fade-inline-end'
		}
		if (props.block === 'top') {
			return 'vv-alert--fade-block-top'
		}
		if (props.block === 'bottom') {
			return 'vv-alert--fade-block-bottom'
		}
		return 'vv-alert--fade'
	})

	// listeners
	bus.on('close', (id: string) => {
		emit('close', id)
	})

	return {
		hasTransition,
		hasProps: computed(() => ({
			class: hasClass.value,
		})),
	}
}
