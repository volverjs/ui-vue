import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function defaultTest({ canvasElement }: PlayAttributes) {
    const progress = await within(canvasElement).findByRole('progressbar')
    await expect(progress).toHaveClass('vv-progress')
    await expect(progress).toHaveNoViolations()
}
