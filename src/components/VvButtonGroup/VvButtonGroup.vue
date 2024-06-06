<script setup lang="ts">
import type { ButtonGroupState } from '../../types/group'
import { INJECTION_KEY_BUTTON_GROUP } from '../../constants'
import { VvButtonGroupProps, VvButtonGroupEvents } from '.'

const props = defineProps(VvButtonGroupProps)

// emit and props
const emit = defineEmits(VvButtonGroupEvents)

// data
const {
    disabled,
    toggle,
    modifiers,
    multiple,
    unselectable,
    itemModifiers,
} = toRefs(props)
watchEffect(() => {
    if (typeof props.modelValue === 'string' && multiple.value) {
        console.warn(
				`[VvButtonGroup]: modelValue is a string but multiple is true.`,
        )
    }
})
const modelValue = computed({
    get: () => {
        if (!multiple.value) {
            return Array.isArray(props.modelValue)
                ? props.modelValue[0]
                : props.modelValue
        }
        return props.modelValue
    },
    set: (newValue) => {
        if (
            newValue !== undefined
            && (Array.isArray(props.modelValue) || multiple.value)
            && !Array.isArray(newValue)
        ) {
            return emit('update:modelValue', [newValue])
        }
        return emit('update:modelValue', newValue)
    },
})

// provide
useProvideGroupState<ButtonGroupState>(INJECTION_KEY_BUTTON_GROUP, {
    modelValue,
    disabled,
    toggle,
    multiple,
    unselectable,
    modifiers: itemModifiers,
})

// style
const bemCssClasses = useModifiers('vv-button-group', modifiers)
</script>

<script lang="ts">
export default {
    name: 'VvButtonGroup',
}
</script>

<template>
    <fieldset :class="bemCssClasses" role="group">
        <legend
            v-if="$slots.legend || legendLabel"
            class="vv-button-group__legend"
        >
            <!-- @slot Legend slot -->
            <slot name="legend">
                {{ legendLabel }}
            </slot>
        </legend>
        <!-- @slot Default slot -->
        <slot />
    </fieldset>
</template>
