import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')

    await expect(element).toHaveClass('vv-separator')
    if (args.vertical) {
        await expect(element).toHaveClass('vv-separator--vertical')
    }

    if (args.label || args.default) {
        // a label is read: the line is decoration around a text, since the
        // children of a separator are hidden from assistive technologies
        const label = element.getElementsByClassName('vv-separator__label')[0]
        await expect(label).toBeDefined()
        await expect(within(canvasElement).queryByRole('separator')).toBeNull()
        if (args.label) {
            await expect(label.textContent?.trim()).toBe(args.label)
        }
        if (args.default) {
            await expect(label.innerHTML).toContain(args.default)
        }
    } else {
        // without one, it is a separator, and says which way it runs
        await expect(within(canvasElement).getByRole('separator')).toBe(element)
        if (args.vertical) {
            await expect(element.getAttribute('aria-orientation')).toBe('vertical')
        } else {
            await expect(element.tagName).toBe('HR')
        }
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}
