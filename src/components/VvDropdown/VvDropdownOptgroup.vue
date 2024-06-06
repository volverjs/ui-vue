<script setup lang="ts">
import { LabelProps } from '../../props'

const props = defineProps({
    ...LabelProps,
})
</script>

<script lang="ts">
export default {
    name: 'VvDropdownOptgroup',
}
</script>

<template>
    <li class="vv-dropdown-optgroup" role="presentation" tabindex="-1">
        {{ props.label }}
    </li>
</template>
