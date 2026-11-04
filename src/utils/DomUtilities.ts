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
        if (overflow.split(' ').every(item => item === 'auto' || item === 'scroll')) {
            return parent
        }
        parent = parent.parentElement
    }

    return document.documentElement
}

function scrolls(overflow: string) {
    return overflow === 'auto' || overflow === 'scroll'
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
 * can still scroll vertically, and when the event can no longer be cancelled.
 * @param event - The `wheel` event, whose `currentTarget` is the list.
 */
export function scrollInlineOnWheel(event: WheelEvent) {
    const element = event.currentTarget as HTMLElement | null
    if (
        !element
        // an event the browser no longer lets cancel is already scrolling
        // something else: scrolling the list too would move both
        || !event.cancelable
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
    // In a right-to-left list `scrollLeft` runs from 0 to the negative room
    if (!hasRoomAhead(Math.abs(element.scrollLeft), room, event.deltaY)) {
        return
    }
    // an element inside the list that can still scroll vertically, such as
    // the items of a dropdown, keeps the wheel
    for (const target of event.composedPath()) {
        if (target === element) {
            break
        }
        if (target instanceof Element && scrollsBlockAhead(target, event.deltaY)) {
            return
        }
    }
    event.preventDefault()
    // a wheel that counts lines or pages rather than pixels scrolls by lines
    // of 40px or by the width of the list
    let delta = event.deltaY
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta *= 40
    } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        delta *= element.clientWidth
    }
    // `instant`: the lists scroll smoothly, and a smooth scroll that each
    // step of the wheel restarts from where the last one had got to loses
    // part of the distance
    element.scrollBy({
        left: direction === 'rtl' ? -delta : delta,
        behavior: 'instant',
    })
}
