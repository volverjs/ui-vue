<script setup lang="ts">
import { useVvAlert, VvAlertEvents, VvAlertProps } from '.'
import VvIcon from '../VvIcon/VvIcon.vue'

const props = defineProps(VvAlertProps)

const emit = defineEmits(VvAlertEvents)

const { hasProps, hasTitleId, hasIcon, close } = useVvAlert(props, emit)
defineExpose({
    /** Close the alert */
    close,
})
</script>

<script lang="ts">
export default {
    name: 'VvAlert',
}
</script>

<template>
    <!--
        `aria-labelledby` may only be bound when the `vv-alert__title` element
        below actually renders, or it points at an id that is not in the
        document. That means a title, and no `header` slot: the header slot
        replaces the whole default header, title included, and it takes no slot
        prop for the id, so an alert with a custom header cannot say what names
        it. Leaving the attribute off is right in both cases: `role=alert` is a
        live region, so its content is announced when it appears whether or not
        the container carries a name, and the role does not require one. An
        `alertdialog` does, and there the absence is the honest signal: a
        reference to a missing id would not have named it either, it would only
        have hidden that nothing does.
    -->
    <div
        v-bind="hasProps"
        :aria-labelledby="
            !$slots.header && ($slots.title || title) ? hasTitleId : undefined
        "
    >
        <div
            v-if="
                $slots.header
                    || $slots.title
                    || $slots.close
                    || $slots['title::before']
                    || $slots['title::after']
                    || title
                    || hasIcon
                    || dismissable
                    || autoClose
            "
            class="vv-alert__header"
        >
            <VvIcon v-if="hasIcon" v-bind="hasIcon" class="vv-alert__icon" />
            <!-- @slot Header slot -->
            <slot name="header">
                <!-- @slot Before title slot -->
                <slot name="title::before" />
                <strong
                    v-if="$slots.title || title"
                    :id="hasTitleId"
                    class="vv-alert__title"
                >
                    <!-- @slot Title slot -->
                    <slot name="title">
                        {{ title }}
                    </slot>
                </strong>
                <!-- @slot After title slot -->
                <slot name="title::after" />
            </slot>
            <!-- @slot Close button slot -->
            <slot name="close" v-bind="{ close }">
                <button
                    v-if="dismissable || autoClose"
                    class="vv-alert__close"
                    type="button"
                    :aria-label="closeLabel"
                    @click.stop="close"
                >
                    <div class="vv-alert__close-mask" />
                </button>
            </slot>
        </div>
        <div v-if="$slots.default || content" class="vv-alert__content">
            <!-- @slot Content slot -->
            <slot>
                {{ content }}
            </slot>
        </div>
        <div v-if="$slots.footer || footer" class="vv-alert__footer">
            <!-- @slot Footer slot -->
            <slot name="footer">
                {{ footer }}
            </slot>
        </div>
    </div>
</template>
