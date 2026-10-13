import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')

    await expect(element).toHaveClass('vv-spinner')

    // alone, it is a status named by its label
    await expect(
        within(canvasElement).getByRole('status', { name: args.label }),
    ).toBe(element)

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function decorativeTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const button = await within(canvasElement).findByTestId('button')

    // next to a text that says the same, it is hidden, and the button keeps
    // the name of its text
    await expect(element.getAttribute('aria-hidden')).toBe('true')
    await expect(element.getAttribute('role')).toBeNull()
    await expect(element.getAttribute('aria-label')).toBeNull()
    await expect(
        within(canvasElement).getByRole('button', { name: 'Saving' }),
    ).toBe(button)

    // check accessibility
    await expect(button).toHaveNoViolations()
}
