import { within } from '@storybook/test'
import { expect } from '@/test/expect'
import type { PlayAttributes } from '@/test/types'

export async function defaultTest({ canvasElement }: PlayAttributes) {
    const progress = await within(canvasElement).findByRole('progressbar')
    await expect(progress).toHaveClass('vv-progress')
    await expect(progress).toHaveNoViolations()
}
