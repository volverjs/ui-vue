import type { MaybeRefOrGetter, Ref } from 'vue'
import { computed, toValue } from 'vue'

/**
 * Promote an element to the top layer through the Popover API.
 *
 * A floating element positioned with `position: fixed` still belongs to the
 * nearest ancestor stacking context: an ancestor with a `z-index` traps it, and
 * no z-index of its own can lift it out. The top layer is outside the document
 * stacking order altogether, so the element is painted above the page and is
 * never clipped by an ancestor `overflow`.
 *
 * The popover is created as `manual`: the light dismiss and the escape key
 * handling of `auto` popovers would collide with the click outside and focus
 * management the components already implement, and `auto` popovers close each
 * other when they are not nested.
 *
 * @param el - The element to promote
 * @param enabled - Whether the element should be promoted
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
 */
export function useTopLayer(
    el: Ref<HTMLElement | undefined>,
    enabled: MaybeRefOrGetter<boolean>,
) {
    const isSupported
        = typeof globalThis.HTMLElement !== 'undefined'
            && 'popover' in globalThis.HTMLElement.prototype

    const isTopLayer = computed(() => isSupported && toValue(enabled))

    /**
     * Value for the `popover` attribute, `undefined` when the element must stay
     * in the document flow
     */
    const popover = computed(() => (isTopLayer.value ? 'manual' : undefined))

    // ":popover-open" throws where the Popover API is missing, so the support
    // check has to come first
    function isOpen() {
        return (isSupported && el.value?.matches(':popover-open')) ?? false
    }

    /**
     * Move the element to the top layer. Does nothing when the promotion is
     * disabled or unsupported, so the element keeps its in-flow rendering.
     */
    function show() {
        if (!isTopLayer.value || !el.value?.isConnected || isOpen()) {
            return
        }
        try {
            el.value.showPopover()
        } catch {
            // The element left the document or was already promoted between the
            // check and the call: it keeps its in-flow position, nothing else
            // to recover
        }
    }

    /**
     * Return the element to the document flow. Must be called once the leave
     * transition is over, otherwise the element jumps back in place while it is
     * still animating.
     */
    function hide() {
        if (!el.value || !isOpen()) {
            return
        }
        try {
            el.value.hidePopover()
        } catch {
            // Already dismissed by the browser, e.g. with the ancestor dialog
        }
    }

    return {
        isTopLayer,
        popover,
        show,
        hide,
    }
}
