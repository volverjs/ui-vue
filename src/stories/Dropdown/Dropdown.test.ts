import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within } from '@storybook/test'

export async function defaultTest({ canvasElement }: PlayAttributes) {
	const wrapper = (await within(canvasElement).findByTestId(
		'wrapper',
	)) as HTMLElement
	const trigger = (await within(canvasElement).findByTestId(
		'trigger',
	)) as HTMLElement

	await expect(trigger).toBeClicked()
	await sleep(100)
	const dropdown = wrapper.getElementsByClassName('vv-dropdown')[0]
	await expect(dropdown).toBeDefined()

	// check accessibility
	await expect(dropdown).toHaveNoViolations()
}
