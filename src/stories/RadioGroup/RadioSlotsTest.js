import { expect } from '@storybook/jest'
import { within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function slotsTest({ canvasElement }, radioGroup) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	const slot = radioGroupParent.lastElementChild
	expect(slot).toHaveClass('vv-input-radio-group__hint')
	expect(slot.innerText).toBeTruthy
	if (radioGroup) {
		expect(radioGroupParent).toHaveClass(
			`vv-input-radio-group--${radioGroup}`
		)
	}
	expect.extend(toHaveNoViolations)
	expect(await axe(slot)).toHaveNoViolations()
}
export { slotsTest }
