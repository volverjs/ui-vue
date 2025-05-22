import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/test'
import { expect } from '@/test/expect'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const badge = await within(canvasElement).findByTestId('element')
    expect(badge).toHaveClass('vv-badge')
    if (args.modifiers.length > 0) {
        expect(badge).toHaveClass(`vv-badge--${args.modifiers}`)
    }
    await expect(badge).toHaveNoViolations()
}
