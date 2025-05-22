import type { PropType } from 'vue'
import type { VvIconProps } from '../VvIcon'
import VvIcon from '../VvIcon/VvIcon.vue'

export default defineComponent({
    components: {
        VvIcon,
    },
    props: {
        inputType: {
            type: String as PropType<'input-text' | 'select'>,
            default: 'input-text',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: 'Clear',
        },
        icon: {
            type: [String, Object] as PropType<string | VvIconProps>,
            default: 'close',
        },
    },
    emits: ['clear'],
    setup(props, { emit }) {
        const { hasIcon } = useComponentIcon(computed(() => props.icon))
        function onClick(e: Event) {
            e?.stopPropagation()
            if (!props.disabled) {
                emit('clear')
            }
        }
        return {
            hasIcon,
            onClick,
        }
    },
    render() {
        const icon = this.hasIcon
            ? h(VvIcon, {
                    ...this.hasIcon,
                    class: `vv-${this.inputType}__icon`,
                })
            : undefined

        return h(
            'button',
            {
                disabled: this.disabled,
                class: `vv-${this.inputType}__action`,
                ariaLabel: this.label,
                type: 'button',
                onClick: this.onClick,
            },
            icon,
        )
    },
})
