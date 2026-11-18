import { userEvent } from 'storybook/test'

/** Whether the stories run in Vitest, where the browser takes real keys */
export const hasBrowserKeys = '__vitest_browser__' in globalThis

/**
 * Presses `keys`, in the syntax of user-event, on the focused element: in
 * Vitest the keys of the browser, through Playwright, and in Storybook the
 * keys of user-event, which reach no element in a closed shadow root.
 */
export async function press(keys: string) {
    if (hasBrowserKeys) {
        const { userEvent: browser } = await import('vitest/browser')
        await browser.keyboard(keys)
        return
    }
    await userEvent.keyboard(keys)
}

/**
 * Presses `Tab`, or `Shift+Tab` with `shift`, on the focused element.
 *
 * In Vitest it is the key of the browser, through Playwright: the browser
 * picks the next element, inside a shadow root too, and the page runs its
 * tasks and renders between the `focusout` and the `focus`, as for a user. A
 * field that opened its dropdown again on that focus showed only there.
 *
 * Storybook has no such key, and user-event picks the next element itself, in
 * the document alone: a story in a shadow root gives the element `to`, which
 * takes the focus after the key.
 */
export async function tab(shift = false, to?: HTMLElement) {
    if (hasBrowserKeys) {
        await press(shift ? '{Shift>}{Tab}{/Shift}' : '{Tab}')
        return
    }
    if (!to) {
        await userEvent.tab({ shift })
        return
    }
    let from = document.activeElement
    while (from?.shadowRoot?.activeElement) {
        from = from.shadowRoot.activeElement
    }
    const init = {
        key: 'Tab',
        code: 'Tab',
        shiftKey: shift,
        bubbles: true,
        cancelable: true,
        composed: true,
    }
    from?.dispatchEvent(new KeyboardEvent('keydown', init))
    to.focus()
    from?.dispatchEvent(new KeyboardEvent('keyup', init))
}
