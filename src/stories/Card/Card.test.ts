import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/test'
import { expect } from '@/test/expect'

export async function defaulTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('card')
    const modifiers
		= !args.modifiers || Array.isArray(args.modifiers)
		    ? args.modifiers
		    : [args.modifiers]

    // check modifiers
    if (modifiers) {
        for (const modifier of modifiers) {
            await expect(element).toHaveClass(`vv-card--${modifier}`)
        }
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}
