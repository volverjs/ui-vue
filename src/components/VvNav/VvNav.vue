<script setup lang="ts">
import { VvNavEvents, VvNavProps } from '@/components/VvNav'
import VvNavItem from './VvNavItem.vue'

const props = defineProps(VvNavProps)
const emit = defineEmits(VvNavEvents)

const { modifiers } = toRefs(props)

// One listener for every item. Nothing to add for the keyboard: the items are
// links and buttons, and activating one from the keyboard, with Enter or with
// Space on a button, fires the click that lands here.
// The index is on the link or button of the item, and the click can land on
// markup inside it, from the `item` slot, so it is looked up from there, never
// past the list itself.
function onClick(event: Event) {
    const list = event.currentTarget as HTMLElement
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-index]')
    if (target && list.contains(target) && target.dataset.index) {
        const index = Number.parseInt(target.dataset.index)
        const item = props.items?.[index]
        if (!item || item?.disabled) {
            return
        }
        emit('click', item)
    }
}

// bem css classes
const bemCssClasses = useModifiers('vv-nav', modifiers)
</script>

<script lang="ts">
export default {
    name: 'VvNav',
}
</script>

<template>
    <nav :class="bemCssClasses">
        <ul class="vv-nav__menu" role="menu" @click.stop="onClick">
            <slot>
                <VvNavItem
                    v-for="({ on = {}, data, ...item }, index) in items"
                    :key="index"
                    :data-index="index"
                    v-bind="item"
                    v-on="on"
                >
                    <slot name="item" v-bind="{ item, data, index }" />
                </VvNavItem>
            </slot>
        </ul>
    </nav>
</template>
