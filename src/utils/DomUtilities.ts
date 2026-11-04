/**
 * Whether a computed `overflow` value lets the element scroll on that axis.
 */
function scrolls(overflow: string) {
    return overflow === 'auto' || overflow === 'scroll'
}

/**
 * The nearest ancestor of `element` that scrolls on both axes, or
 * `document.documentElement` when none does. It passes over a container that
 * scrolls on one axis only, such as `overflow: hidden auto`: see section 9 of
 * `docs/specs/floating-elements.md`.
 * @param element - The element to start from, excluded from the search.
 */
export function findScrollContainer(element: HTMLElement | null) {
    if (!element) {
        return undefined
    }
    if (
        typeof globalThis.getComputedStyle !== 'function'
        || typeof document === 'undefined'
    ) {
        return undefined
    }
    let parent = element.parentElement
    while (parent) {
        const { overflow } = globalThis.getComputedStyle(parent)
        if (overflow.split(' ').every(scrolls)) {
            return parent
        }
        parent = parent.parentElement
    }

    return document.documentElement
}

/**
 * Whether a scroll `position`, from 0 to `room`, can still move the way
 * `delta` points. A pixel of tolerance absorbs the fraction of a pixel a
 * scroll position can stop at near either end.
 */
function hasRoomAhead(position: number, room: number, delta: number) {
    return delta < 0 ? position >= 1 : position <= room - 1
}

/**
 * Whether `element` scrolls on the block axis and can still move the way
 * `delta` points.
 */
function scrollsBlockAhead(element: Element, delta: number) {
    const room = element.scrollHeight - element.clientHeight
    return room > 0
        && scrolls(globalThis.getComputedStyle(element).overflowY)
        && hasRoomAhead(element.scrollTop, room, delta)
}

/**
 * Scrolls sideways, on a vertical turn of the mouse wheel, the element the
 * listener is bound to, when that element scrolls only on the inline axis.
 * A mouse wheel turns on the vertical axis, so a list that scrolls only
 * sideways with its scrollbar hidden, as `@volverjs/style` draws the menu of
 * `vv-nav--tabs` and the list of `vv-breadcrumb`, kept the items past its edge
 * out of a mouse's reach. Bind it to `wheel` without `passive`: it cancels the
 * events it handles.
 *
 * The browser keeps the event when the gesture is mostly sideways (a
 * trackpad), when it is a pinch to zoom, when the element fits or scrolls on
 * the block axis too, and at the end the wheel heads to, so the page scrolls
 * on past the list. It keeps it as well over an element inside the list that
 * can still scroll vertically, and when the event can no longer be cancelled
 * or another listener has cancelled it already.
 * @param event - The `wheel` event, whose `currentTarget` is the list.
 */
export function scrollInlineOnWheel(event: WheelEvent) {
    const element = event.currentTarget as HTMLElement | null
    if (
        !element
        // An event that cannot be cancelled keeps its default scroll, and one
        // already cancelled was handled by another listener, such as a list
        // nested in this one: scrolling this list too would move both
        || !event.cancelable
        || event.defaultPrevented
        || event.ctrlKey
        || Math.abs(event.deltaY) <= Math.abs(event.deltaX)
    ) {
        return
    }
    const room = element.scrollWidth - element.clientWidth
    if (room <= 0) {
        return
    }
    const { overflowX, overflowY, direction } = globalThis.getComputedStyle(element)
    if (
        !scrolls(overflowX)
        || (scrolls(overflowY) && element.scrollHeight > element.clientHeight)
    ) {
        return
    }
    // An element inside the list that can still scroll vertically, such as
    // the items of a dropdown, keeps the wheel
    for (const target of event.composedPath()) {
        if (target === element) {
            break
        }
        if (target instanceof Element && scrollsBlockAhead(target, event.deltaY)) {
            return
        }
    }
    // A wheel that counts lines or pages rather than pixels scrolls by lines
    // of 40px or by the width of the list
    let delta = event.deltaY
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta *= 40
    } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        delta *= element.clientWidth
    }
    // The list scrolls first, and the event is cancelled only if it moved:
    // at the end the wheel heads to it does not, and the page scrolls on.
    // The end is not worked out from the room, since Chromium can stop a
    // right-to-left list a pixel short of it, where the page was held back.
    // `instant`: the lists scroll smoothly, and a smooth scroll that each
    // step of the wheel restarts from where the last one had got to loses
    // part of the distance
    const before = element.scrollLeft
    element.scrollBy({
        left: direction === 'rtl' ? -delta : delta,
        behavior: 'instant',
    })
    if (element.scrollLeft !== before) {
        event.preventDefault()
    }
}
