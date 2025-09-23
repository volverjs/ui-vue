<script setup lang="ts">
import { VvNavEvents, VvNavProps } from '@/components/VvNav'
import VvNavItem from './VvNavItem.vue'

const props = defineProps(VvNavProps)
const emit = defineEmits(VvNavEvents)

const { modifiers } = toRefs(props)

function onClick(event: Event) {
    const target = event.target as HTMLElement
    if (target?.dataset.index) {
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
