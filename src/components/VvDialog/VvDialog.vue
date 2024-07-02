<script setup lang="ts">
import type { DialogHTMLAttributes } from 'vue'
import { VvDialogEvents, VvDialogProps } from '.'

// props, emit and template refs
const props = defineProps(VvDialogProps)

const emit = defineEmits(VvDialogEvents)

const dialogEl: Ref<HTMLDialogElement | undefined> = ref()

// data
const modelValue = useVModel(props, 'modelValue', emit)
const localModelValue = ref(false)
const isOpened = computed({
    get: () => modelValue.value ?? localModelValue.value,
    set: (newValue) => {
        if (modelValue.value === undefined) {
            localModelValue.value = newValue
            return
        }
        modelValue.value = newValue
    },
})

// template ref
const modalWrapper = ref(null)

/**
 * @description Define component classes with BEM style.
 * @returns {Array} The component classes.
 */
const { modifiers } = toRefs(props)
const bemCssClasses = useModifiers(
    'vv-dialog',
    modifiers,
    // DEPRECATED: Must be removed in the future
    computed(() => {
        if (props.size) {
            return { [props.size]: !!props.size }
        }
        return {}
    }),
)

const dialogAttrs = computed(() => {
    const { id } = props
    return {
        id,
    } as DialogHTMLAttributes
})

// transitions
const transitioName = computed(() => `vv-dialog--${props.transition}`)
const dialogTransitionHandlers = {
    'before-enter': () => {
        if (!dialogEl.value?.open) {
            dialogEl.value?.showModal()
        }
        emit('open')
        emit('beforeEnter')
    },
    'after-leave': () => {
        if (dialogEl.value?.open) {
            dialogEl.value?.close()
        }
        emit('close')
        emit('afterLeave')
    },
    'enter': () => {
        emit('enter')
    },
    'after-enter': () => {
        emit('afterEnter')
    },
    'enter-cancelled': () => {
        emit('enterCancelled')
    },
    'before-leave': () => {
        emit('beforeLeave')
    },
    'leave': () => {
        emit('leave')
    },
    'leave-cancelled': () => {
        emit('leaveCancelled')
    },
}

// methods
onClickOutside(modalWrapper, () => {
    if (!props.keepOpen) {
        close()
    }
})

function close() {
    isOpened.value = false
}

function open() {
    isOpened.value = true
}

defineExpose({ close, open })

function onCancel() {
    if (!props.keepOpen) {
        close()
    }
}
</script>

<script lang="ts">
export default {
    name: 'VvDialog',
}
</script>

<template>
    <Transition :name="transitioName" v-on="dialogTransitionHandlers">
        <dialog
            v-show="isOpened"
            v-bind="dialogAttrs"
            ref="dialogEl"
            :class="bemCssClasses"
            @cancel.stop.prevent="onCancel"
        >
            <article ref="modalWrapper" class="vv-dialog__wrapper">
                <header v-if="$slots.header || title" class="vv-dialog__header">
                    <!-- @slot Header slot -->
                    <slot name="header">
                        {{ title }}
                        <button
                            type="button"
                            :aria-label="labelClose"
                            :title="labelClose"
                            class="vv-dialog__close"
                            @click.passive="close"
                        />
                    </slot>
                </header>
                <div class="vv-dialog__content">
                    <!-- @slot Content slot -->
                    <slot />
                </div>
                <footer v-if="$slots.footer" class="vv-dialog__footer">
                    <!-- @slot Footer slot -->
                    <slot name="footer" />
                </footer>
            </article>
        </dialog>
    </Transition>
</template>
