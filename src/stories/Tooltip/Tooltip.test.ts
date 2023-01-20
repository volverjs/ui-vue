import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within } from '@storybook/testing-library'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement
	const parentElement = element.parentElement as HTMLElement

	// slot default
	if (!args.default) {
		throw new Error('Default slot is required!')
	}

	// check if tooltip is visible after focus
	await parentElement.focus()
	await sleep(800)
	await expect(window.getComputedStyle(element)).toHaveProperty('opacity', "1")

	// check accessibility
	await expect(element).toHaveNoViolations()

	// check if tooltip is not visible after blur
	await parentElement.blur()
	await sleep(800)
	await expect(window.getComputedStyle(element)).toHaveProperty('opacity', "0")

	// position right
	if (args.position === 'right') {
		await expect(element).toHaveClass('vv-tooltip--right')
	}
	
	// position left
	if (args.position === 'left') {
		await expect(element).toHaveClass('vv-tooltip--left')
	}
	
	// position top
	if (args.position === 'top') {
		await expect(element).toHaveClass('vv-tooltip--top')
	}
	
	// position bottom
	if (args.position === 'bottom') {
		await expect(element).toHaveClass('vv-tooltip--bottom')
	}
}
