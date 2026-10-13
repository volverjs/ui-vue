import type { PlayAttributes } from '@/test/types'
import { userEvent, waitFor, within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const button = await within(canvasElement).findByTestId('button')

    if (args.loading) {
        // the placeholder is a status named by its label, with a bar for
        // each item and its class
        const element = within(canvasElement).getByRole('status', { name: args.label })
        const items = [...element.getElementsByClassName('vv-skeleton__item')]
        await expect(element).toHaveClass('vv-skeleton')
        await expect(items).toHaveLength(args.items)
        for (const [index, item] of items.entries()) {
            const itemClass = Array.isArray(args.itemClass)
                ? args.itemClass[index]
                : args.itemClass
            if (itemClass) {
                await expect(item).toHaveClass(itemClass)
            }
        }
        await expect(within(canvasElement).queryByTestId('content')).toBeNull()
        await expect(element).toHaveNoViolations()

        // once loaded, the content takes its place
        await userEvent.click(button)
        await waitFor(() => expect(within(canvasElement).queryByTestId('content')).not.toBeNull())
        await expect(within(canvasElement).queryByRole('status')).toBeNull()
    } else {
        await expect(within(canvasElement).getByTestId('content')).toBeDefined()
        await expect(within(canvasElement).queryByRole('status')).toBeNull()

        // loading again, the placeholder comes back
        await userEvent.click(button)
        await waitFor(() => expect(within(canvasElement).queryByRole('status')).not.toBeNull())
    }
}

export async function shapeTest({ canvasElement, args }: PlayAttributes) {
    const element = within(canvasElement).getByRole('status', { name: args.label })

    // bars of a shape of their own, in place of `items`
    await expect(element.getElementsByClassName('rounded-full')).toHaveLength(1)
    await expect(element.getElementsByClassName('vv-skeleton__item')).toHaveLength(3)

    // check accessibility
    await expect(element).toHaveNoViolations()
}
