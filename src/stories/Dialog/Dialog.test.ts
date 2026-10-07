import type { PlayAttributes } from '@/test/types'
import { userEvent, waitFor, within } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function defaultTest(
    { canvasElement, args }: PlayAttributes = {} as PlayAttributes,
) {
    const element = await within(canvasElement).findByTestId('element')
    const button = await within(canvasElement).findByTestId('button')

    // hidden
    await expect(element?.style.display).toEqual('none')

    // open
    await userEvent.click(button)
    await expect(element).toHaveProperty('open', true)

    // named by its title, unless the header slot replaces it, and with it the
    // element the name points at: the caller names the dialog then, and its
    // reference is the only one
    if (args.header) {
        const labelledby = args['aria-labelledby']
        await expect(element.getAttribute('aria-labelledby')).toBe(labelledby ?? null)
        if (labelledby) {
            await expect(
                within(canvasElement).getByRole('dialog', {
                    name: document.getElementById(labelledby)?.textContent ?? '',
                }),
            ).toBe(element)
        }
    } else if (args.title) {
        await expect(
            within(canvasElement).getByRole('dialog', { name: args.title }),
        ).toBe(element)
    }

    // check accessibility
    await expect(element).toHaveNoViolations()

    // size
    if (args.size) {
        await expect(element).toHaveClass(`vv-dialog--${args.size}`)
    }

    // default slot
    if (args.default) {
        const defaultSlot = element.getElementsByClassName(
            'vv-dialog__content',
        )[0].firstElementChild as HTMLElement
        await expect(
            defaultSlot.innerHTML.replace(/<!--(.*?)-->/g, ''),
        ).toEqual(args.default)
    }

    // header slot
    if (args.header) {
        const headerSlot = element.getElementsByClassName(
            'vv-dialog__header',
        )[0].firstElementChild as HTMLElement
        await expect(headerSlot.innerHTML.replace(/<!--(.*?)-->/g, '')).toEqual(
            args.header,
        )
    }

    // footer slot
    if (args.footer) {
        const headerSlot = element.getElementsByClassName(
            'vv-dialog__footer',
        )[0].firstElementChild as HTMLElement
        await expect(headerSlot.innerHTML.replace(/<!--(.*?)-->/g, '')).toEqual(
            args.footer,
        )
    }

    // keep open
    if (!args.keepOpen) {
        await userEvent.click(element)
        await sleep(1000)
        await expect(element).toHaveProperty('open', false)
        await expect(element?.style.display).toEqual('none')
    }
}

export async function openOnMountTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')

    // mounted with its model already true, it opens as a modal like a dialog
    // opened later: `showModal()` was never called, and the browser kept a
    // <dialog> with no `open` hidden
    await waitFor(() => expect(element).toHaveProperty('open', true))
    await expect(element.matches(':modal')).toBe(true)

    // `open` once, after `beforeEnter`: it is emitted where `showModal()` runs
    await expect(
        within(canvasElement).getByTestId('events'),
    ).toHaveTextContent(/^beforeEnter open$/)
    await expect(
        within(canvasElement).getByRole('dialog', { name: args.title }),
    ).toBe(element)

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function closedByBrowserTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element') as HTMLDialogElement
    const button = await within(canvasElement).findByTestId('button')
    const model = within(canvasElement).getByTestId('model')
    const events = within(canvasElement).getByTestId('events')

    await userEvent.click(button)
    await waitFor(() => expect(element).toHaveProperty('open', true))

    // `keepOpen` holds the first `Esc` back
    const cancel = new Event('cancel', { cancelable: true })
    element.dispatchEvent(cancel)
    await expect(cancel.defaultPrevented).toBe(true)
    await expect(element).toHaveProperty('open', true)

    // the second `Esc` in a row comes without a user activation since the
    // first: the browser sends a `cancel` it does not let the page prevent,
    // and closes the dialog. A test cannot press it: the keys of `userEvent`
    // are synthetic and send no `cancel`, and the commands of the test runner
    // count as user activation. It does what the browser does instead.
    element.dispatchEvent(new Event('cancel', { cancelable: false }))
    element.close()

    // the model follows, and `close` is emitted as for any other close
    await waitFor(() => expect(model).toHaveTextContent('false'))
    await waitFor(() => expect(events).toHaveTextContent(/^close$/))

    // so the dialog opens again
    await userEvent.click(button)
    await waitFor(() => expect(element).toHaveProperty('open', true))
    await expect(element.matches(':modal')).toBe(true)
    await expect(model).toHaveTextContent('true')

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function reopenOnCloseTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element') as HTMLDialogElement
    const model = within(canvasElement).getByTestId('model')
    const events = within(canvasElement).getByTestId('events')
    await waitFor(() => expect(element).toHaveProperty('open', true))

    // the close button closes the dialog, and the listener of `close` opens it
    // again
    await userEvent.click(within(element).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(events).toHaveTextContent(/^open close open$/))

    // the native `close` of the first close comes after the reopen, and leaves
    // the dialog open
    await sleep(500)
    await expect(events).toHaveTextContent(/^open close open$/)
    await expect(element).toHaveProperty('open', true)
    await expect(element.matches(':modal')).toBe(true)
    await expect(model).toHaveTextContent('true')
}
