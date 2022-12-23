import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'

export const badgeTest = async ({ canvasElement, name }: PlayAttributes) => {
	const badge = await within(canvasElement).findByRole('status')
	expect(badge).toHaveClass('vv-badge')
	name != 'dot' && expect(badge).toHaveClass(`vv-badge--${name}`)
	expect(badge).toHaveNoViolations()
}
