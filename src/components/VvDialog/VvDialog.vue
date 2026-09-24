<script setup lang="ts">
import type { DialogHTMLAttributes, Ref } from 'vue'
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
const { id, modifiers } = toRefs(props)
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

// the dialog is named by its title, unless the header slot replaces it: the
// caller then names it, with `aria-labelledby` or `aria-label`
const hasId = useUniqueId(id)
const hasTitleId = computed(() => `${hasId.value}-title`)

// transitions: with `appear` on the <Transition>, a dialog mounted open runs
// these hooks too. `showModal()` is called on `enter` and not before: for a
// dialog mounted open `before-enter` runs while it is not in the document yet,
// and `showModal()` needs it to be.
const transitioName = computed(() => `vv-dialog--${props.transition}`)
const dialogTransitionHandlers = {
    'before-enter': () => {
        emit('beforeEnter')
    },
    'after-leave': () => {
        if (dialogEl.value?.open) {
            dialogEl.value?.close()
        }
        emit('close')
        emit('afterLeave')
    },
    'enter': (el: Element) => {
        const dialog = el as HTMLDialogElement
        if (!dialog.open) {
            dialog.showModal()
        }
        emit('open')
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

defineExpose({
    /** Close the dialog */
    close,
    /** Open the dialog */
    open,
})

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
    <Transition :name="transitioName" appear v-on="dialogTransitionHandlers">
        <dialog
            v-show="isOpened"
            v-bind="dialogAttrs"
            ref="dialogEl"
            :aria-labelledby="title && !$slots.header ? hasTitleId : undefined"
            :class="bemCssClasses"
            @cancel.stop.prevent="onCancel"
        >
            <article ref="modalWrapper" class="vv-dialog__wrapper">
                <header v-if="$slots.header || title" class="vv-dialog__header">
                    <!-- @slot Header slot -->
                    <slot name="header">
                        <span :id="hasTitleId">{{ title }}</span>
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
