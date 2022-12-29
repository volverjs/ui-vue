import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'

async function accordionGroupTest({ canvasElement }) {
	const accordionGroup = await within(canvasElement).findByTestId(
		'accordion-group'
	)
	const accordion1 = await within(canvasElement).findByTestId('accordion-1')
	await accordion1.firstChild.click()
	const accordions = accordionGroup.children
	Array.from(accordions).forEach((accordion, index) => {
		const title = accordion.firstChild
		const content = accordion.lastChild
		if (index == 0) {
			expect(title.ariaExpanded).toBe('true')
			expect(content.ariaHidden).toBe('false')
		} else {
			expect(title.ariaExpanded).toBe('false')
			expect(content.ariaHidden).toBe('true')
		}
	})
	await expect(accordionGroup).toHaveNoViolations()
}

async function itemsTest({ canvasElement }) {
	const accordionGroup = await within(canvasElement).findByTestId(
		'accordion-group'
	)
	accordionGroup.children[0].click()
	const selected = await within(canvasElement).findByTestId('selected')
	expect(selected.innerText).toBe('selected: a-1')
	await accordionGroup.children[1].click()
	expect(selected.innerText).toBe('selected: a-2')
	await expect(accordionGroup).toHaveNoViolations()
}

async function collapseTest({ canvasElement }) {
	const accordionGroup = await within(canvasElement).findByTestId(
		'accordion-group'
	)
	accordionGroup.children[0].click()
	const selected = await within(canvasElement).findByTestId('selected')
	expect(selected.innerText).toBe('selected: [ "a-1" ]')
	await accordionGroup.children[1].click()
	expect(selected.innerText).toBe('selected: [ "a-1", "a-2" ]')
	await expect(accordionGroup).toHaveNoViolations()
}

export { accordionGroupTest, itemsTest, collapseTest }
