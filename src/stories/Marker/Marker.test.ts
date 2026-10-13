import type { PlayAttributes } from '@/test/types'
import { waitFor, within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const [content] = element.getElementsByClassName('vv-marker__content')

    await expect(element).toHaveClass('vv-marker')
    if (args.modifiers) {
        await expect(element).toHaveClass(`vv-marker--${args.modifiers}`)
    }

    // the text, from the label or from the slot
    if (args.default) {
        await expect(content.innerHTML).toContain(args.default)
    } else {
        await expect(content.textContent?.trim()).toBe(args.label)
    }

    // the icon beside it
    if (args.icon) {
        await waitFor(() =>
            expect(element.querySelector('svg.vv-marker__icon')).not.toBeNull(),
        )
    } else {
        await expect(element.getElementsByClassName('vv-marker__icon')).toHaveLength(0)
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}
