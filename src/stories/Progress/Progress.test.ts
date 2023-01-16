import { expect } from '@/test/expect'
import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/testing-library'

export async function defaultTest({ canvasElement }: PlayAttributes) {
	const progress = await within(canvasElement).findByRole('progressbar')
	expect(progress).toHaveClass('vv-progress')
	await expect(progress).toHaveNoViolations()
}
