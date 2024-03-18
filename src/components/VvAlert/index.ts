import { type ExtractPropTypes, type PropType, withModifiers } from 'vue'
import { AlertRole } from '@/constants'
import { IconProps, IdProps } from '@/props'
import type { AlertModifier } from '@/types'

export const VvAlertProps = {
	...IdProps,
	...IconProps,
	/**
	 * Component BEM modifiers
	 */
	modifiers: {
		type: [String, Array] as PropType<AlertModifier | AlertModifier[]>,
		default: undefined,
	},
	/**
	 * The alert is dismissable
	 * @default false
	 * @type boolean
	 */
	dismissable: {
		type: Boolean,
		default: false,
	},
	/**
	 * The alert auto close after the specified time in milliseconds
	 * @default 0
	 * @type number
	 */
	autoClose: {
		type: Number,
		default: 0,
	},
	/**
	 * The alert close label
	 * @default 'Close'
	 * @type string
	 */
	closeLabel: {
		type: String,
		default: 'Close',
	},
	/**
	 * The alert title
	 * @default ''
	 * @type string
	 */
	title: {
		type: String,
		default: undefined,
	},
	/**
	 * The alert content
	 * @default ''
	 * @type string
	 */
	content: {
		type: String,
		default: undefined,
	},
	/**
	 * The alert footer
	 * @default ''
	 * @type string
	 */
	footer: {
		type: String,
		default: undefined,
	},
	/**
	 * The alert role
	 * @default 'alert'
	 * @type string
	 * @values 'alert', 'alertdialog'
	 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Alert_Role
	 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Alertdialog_role
	 */
	role: {
		type: String as PropType<`${AlertRole}`>,
		default: AlertRole.alert,
	},
}

export const VvAlertEvents = ['close']

export const useVvAlert = (
	props: Readonly<ExtractPropTypes<typeof VvAlertProps>>,
	emit: (event: string, ...args: unknown[]) => void,
) => {
	const { bus } = useInjectedAlertGroup()

	const hasId = useUniqueId(computed(() => props.id))
	const hasTitleId = computed(() => `${hasId.value}-title`)

	// icon
	const { hasIcon } = useComponentIcon(computed(() => props.icon))

	// props
	const hasClass = useModifiers(
		'vv-alert',
		computed(() => props.modifiers),
		computed(() => ({
			dismissable: props.autoClose > 0 || props.dismissable,
			'auto-close': props.autoClose > 0,
			hover: isMouseover.value,
		})),
	)
	const hasStyle = computed(() => ({
		'--alert-duration': `${props.autoClose}ms`,
	}))

	// close
	const close = () => {
		if (timeout) {
			clearTimeout(timeout)
		}
		emit('close', hasId.value)
		bus?.emit('close', hasId.value)
	}

	// auto close
	let timeout: ReturnType<typeof setTimeout>
	watch(
		() => props.autoClose,
		(value) => {
			if (value > 0) {
				timeout = setTimeout(close, value)
				return
			}
			if (timeout) {
				clearTimeout(timeout)
			}
		},
		{
			immediate: true,
		},
	)

	// listeners
	const isMouseover = ref(false)
	const onMouseover = withModifiers(() => {
		isMouseover.value = true
		if (timeout) {
			clearTimeout(timeout)
		}
	}, ['passive'])
	const onMouseleave = withModifiers(() => {
		isMouseover.value = false
		if (props.autoClose > 0) {
			timeout = setTimeout(close, props.autoClose)
		}
	}, ['passive'])

	return {
		close,
		hasIcon,
		hasTitleId,
		hasProps: computed(() => ({
			onMouseover,
			onMouseleave,
			class: hasClass.value,
			style: hasStyle.value,
			role: props.role,
			'aria-labelledby': hasTitleId.value,
		})),
	}
}
