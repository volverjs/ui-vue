import VvIcon from '../VvIcon/VvIcon.vue'

export default defineComponent({
    components: {
        VvIcon,
    },
    props: {
        inputType: {
            type: String as PropType<'input-text'>,
            default: 'input-text',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
        },
        mode: {
            type: String,
            validator: (v: string) => ['up', 'down'].includes(v),
            default: 'up',
        },
    },
    emits: ['step-up', 'step-down'],
    setup(props, { emit }) {
        const isUp = computed(() => props.mode === 'up')

        const onClick = (e: Event) => {
            e?.stopPropagation()
            if (!props.disabled) {
                emit(isUp.value ? 'step-up' : 'step-down')
            }
        }

        return {
            isUp,
            onClick,
        }
    },
    render() {
        return h('button', {
            class: [
                `vv-${this.inputType}__action`,
                `vv-${this.inputType}__action-chevron`,
                this.isUp ? `vv-${this.inputType}__action-chevron-up` : undefined,
            ],
            disabled: this.disabled,
            ariaLabel: this.label,
            type: 'button',
            onClick: this.onClick,
        })
    },
})
