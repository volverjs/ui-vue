import { expect } from '@storybook/jest'
import { within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function accordionTest({ canvasElement, ...data }) {
	const accordion = await within(canvasElement).findByTestId('accordion')
	const title = accordion.firstChild
	expect(accordion).toHaveClass('vv-accordion')
	expect(title.innerText).toEqual(data.args.title)
	expect(title).toHaveClass('vv-collapse__summary')
	expect(accordion.open).toBe(false)
	title.click()
	expect(accordion.open).toBeTruthy()
	const content = accordion.lastChild
	expect(content).toHaveClass('vv-collapse__content')
	expect(content.innerText).toEqual(data.args.content)
	accessibilityTest(accordion)
}

async function propsTest({ canvasElement }, className) {
	const accordion = await within(canvasElement).findByTestId('accordion')
	expect(accordion).toHaveClass(`vv-accordion--${className}`)
	accessibilityTest(accordion)
}

async function slotsTest({ canvasElement }) {
	const slot = await within(canvasElement).findByTestId('slot')
	expect(slot.innerHTML).toBeTruthy
}

async function accessibilityTest(element) {
	expect.extend(toHaveNoViolations)
	expect(await axe(element)).toHaveNoViolations()
}

export { accordionTest, propsTest, slotsTest }
