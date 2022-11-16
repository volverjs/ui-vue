import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'
import { radioGroupTest } from './RadioProperty.test'

interface RadioConfig {
	className?: string
}

async function slotsTest(
	{ canvasElement, ...args }: PlayAttributes = {} as PlayAttributes,
	{ className }: RadioConfig = {} as RadioConfig
) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	const slot = radioGroupParent.lastElementChild as HTMLElement
	expect(slot).toHaveClass('vv-input-radio-group__hint')
	expect(slot.innerText).toBeTruthy()
	if (className) {
		expect(radioGroupParent).toHaveClass(
			`vv-input-radio-group--${className}`
		)
	}
	expect(slot).toHaveNoViolations()
	await radioGroupTest({ canvasElement, ...args })
}

export { slotsTest }
