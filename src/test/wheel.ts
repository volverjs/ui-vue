/**
 * Dispatches a `wheel` event on `target` and tells whether a listener
 * cancelled it. A dispatched event scrolls nothing by itself: whatever moves
 * the element is the component's listener.
 */
export function dispatchWheel(target: Element, init: WheelEventInit) {
    const event = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        ...init,
    })
    target.dispatchEvent(event)
    return event.defaultPrevented
}
