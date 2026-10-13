<script setup lang="ts">
import { VvKbdProps } from '.'

const props = defineProps(VvKbdProps)

const keysList = computed(() => {
    if (props.keys === undefined) {
        return []
    }
    return Array.isArray(props.keys) ? props.keys : [props.keys]
})
const isCombination = computed(() => keysList.value.length > 1)

// styles: a combination is a `vv-kbd-group` of keys
const { modifiers } = toRefs(props)
const bemCssClasses = useModifiers('vv-kbd', modifiers)
const bemGroupCssClasses = useModifiers('vv-kbd-group', modifiers)
</script>

<script lang="ts">
export default {
    name: 'VvKbd',
}
</script>

<template>
    <span v-if="isCombination" :class="bemGroupCssClasses">
        <template v-for="(key, index) in keysList" :key="index">
            <template v-if="index > 0 && separator">{{ separator }}</template>
            <kbd class="vv-kbd">{{ key }}</kbd>
        </template>
    </span>
    <kbd v-else :class="bemCssClasses">
        <!-- @slot The key, in place of the `keys` prop -->
        <slot>{{ keysList[0] }}</slot>
    </kbd>
</template>
