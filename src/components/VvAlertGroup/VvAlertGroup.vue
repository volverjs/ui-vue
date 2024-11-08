<script setup lang="ts">
import { useVvAlertGroup, VvAlertGroupEvents, VvAlertGroupProps } from '.'
import VvAlert from '../VvAlert/VvAlert.vue'

// props and emit
const props = defineProps(VvAlertGroupProps)

const emit = defineEmits(VvAlertGroupEvents)

const { hasProps, hasTransition } = useVvAlertGroup(props, emit)

const alertGroupTransitionHandlers = {
    'before-enter': () => {
        emit('beforeEnter')
    },
    'after-leave': () => {
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
</script>

<script lang="ts">
export default {
    name: 'VvAlertGroup',
}
</script>

<template>
    <div v-bind="hasProps">
        <!-- @slot The slot before alert list  -->
        <slot name="before" />
        <TransitionGroup
            tag="div"
            role="group"
            :name="hasTransition"
            class="vv-alert-group__list"
            v-on="alertGroupTransitionHandlers"
        >
            <!-- @slot The slot for alert list  -->
            <slot>
                <VvAlert v-for="item in items" v-bind="item" :key="item.id" />
            </slot>
        </TransitionGroup>
        <!-- @slot The slot after alert list  -->
        <slot name="after" />
    </div>
</template>
