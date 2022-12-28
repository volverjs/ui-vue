import type { PlayAttributes, ComponentConfig } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within } from '@storybook/testing-library'

async function accordionTest(
	{ canvasElement, ...data }: PlayAttributes,
	{ className = null }: ComponentConfig = {}
) {
	const accordion = (await within(canvasElement).findByTestId(
		'accordion'
	)) as HTMLDetailsElement
	expect(accordion).toHaveClass('vv-accordion')
	className && expect(accordion).toHaveClass(className)
	const title = accordion.firstChild as HTMLElement
	expect(title.innerText).toEqual(data.args.title)
	expect(title).toHaveClass('vv-collapse__summary')
	expect(accordion.open).toBe(false)
	expect(title).toBeClicked()
	await sleep()
	expect(accordion.open).toBeTruthy()
	const content = accordion.lastChild as HTMLElement
	expect(content).toHaveClass('vv-collapse__content')
	expect(content.innerText).toEqual(data.args.content)
	expect(accordion).toHaveNoViolations()
}

async function slotsTest({ canvasElement, ...data }: PlayAttributes) {
	const accordion = await within(canvasElement).findByTestId('slot')
	data.args.slotName == 'details' &&
		expect(accordion.innerHTML).toEqual(data.args.details)

	data.args.slotName == 'header' &&
		expect(accordion.innerHTML).toEqual(data.args.title)
}

export { accordionTest, slotsTest }
