<script setup lang="ts">
import VvAction from '@/components/VvAction/VvAction.vue'
</script>

<script lang="ts">
export default {
    name: 'VvNavItem',
    inheritAttrs: false,
}
</script>

<template>
    <li class="vv-nav__item" role="presentation">
        <slot name="before" />
        <VvAction v-bind="$attrs" class="vv-nav__item-label" role="menuitem">
            <slot />
        </VvAction>
        <slot name="after" />
    </li>
</template>
