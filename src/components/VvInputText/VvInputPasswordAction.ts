import VvIcon from '../VvIcon/VvIcon.vue'
import { type VvIconProps, ACTION_ICONS } from '../VvIcon'

export default defineComponent({
	components: {
		VvIcon,
	},
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		labelShow: {
			type: String,
			default: 'Show password',
		},
		labelHide: {
			type: String,
			default: 'Hide password',
		},
		iconShow: {
			type: [String, Object] as PropType<string | VvIconProps>,
			default: ACTION_ICONS.showPassword,
		},
		iconHide: {
			type: [String, Object] as PropType<string | VvIconProps>,
			default: ACTION_ICONS.hidePassword,
		},
	},
	emits: ['toggle-password'],
	setup(props, { emit }) {
		const active = ref(false)
		const activeIcon = computed(() =>
			active.value ? props.iconHide : props.iconShow,
		)
		const { hasIcon } = useComponentIcon(activeIcon)

		function onClick(e: Event) {
			e?.stopPropagation()
			if (!props.disabled) {
				active.value = !active.value
				emit('toggle-password', active.value)
			}
		}

		return {
			active,
			activeIcon,
			hasIcon,
			onClick,
		}
	},
	render() {
		const icon = this.hasIcon
			? h(VvIcon, {
					...this.hasIcon,
					class: 'vv-input-text__icon',
				})
			: undefined
		return h(
			'button',
			{
				disabled: this.disabled,
				class: 'vv-input-text__action',
				ariaLabel: this.active ? this.labelHide : this.labelShow,
				type: 'button',
				onClick: this.onClick,
			},
			icon,
		)
	},
})
