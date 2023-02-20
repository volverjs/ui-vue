import { TYPES_ICON } from '@/components/VvInputText'
import VvIcon from '@/components/VvIcon/VvIcon.vue'

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
			type: String,
			default: TYPES_ICON.PASSWORD_SHOW,
		},
		iconHide: {
			type: String,
			default: TYPES_ICON.PASSWORD_HIDE,
		},
	},
	emits: ['toggle-password'],
	setup(props, { emit }) {
		const active = ref(false)
		const activeIcon = computed(() =>
			active.value ? props.iconHide : props.iconShow,
		)

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
			onClick,
		}
	},
	render() {
		const icon = h(VvIcon, {
			name: this.activeIcon,
			class: 'vv-input-text__icon',
		})
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
