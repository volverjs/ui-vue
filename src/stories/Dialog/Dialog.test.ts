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
