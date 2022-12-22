import type { PlayAttributes, ComponentConfig } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'

export async function testButton(
	{ canvasElement }: PlayAttributes = {} as PlayAttributes,
	{ isClickDisabled = false, className = null }: ComponentConfig = {}
) {
	const button = await within(canvasElement).findByRole('button')
	if (isClickDisabled) {
		await expect(button).not.toBeClicked()
	} else {
		await expect(button).toBeClicked()
	}
	expect(button).toHaveClass('vv-button')
	if (className) {
		expect(button).toHaveClass(className)
	}
	await expect(button).toHaveNoViolations()
}

export async function testButtonWithBadge(playAttributes: PlayAttributes) {
	const button = await within(playAttributes.canvasElement).findByRole(
		'button'
	)
	expect(button.innerHTML).toContain('vv-badge')
	await testButton(playAttributes)
}

export async function testButtonWithIconLeft(playAttributes: PlayAttributes) {
	const button = await within(playAttributes.canvasElement).findByRole(
		'button'
	)
	expect(button.innerHTML).toContain('vv-icon')
	await testButton(playAttributes)
}
export async function testButtonWithIconOnly(playAttributes: PlayAttributes) {
	const button = await within(playAttributes.canvasElement).findByRole(
		'button'
	)
	expect(button.classList).toContain('vv-button--icon-only')
	await testButton(playAttributes)
}

export async function testButtonLink(
	playAttributes: PlayAttributes,
	{ isClickDisabled = false, className = null }: ComponentConfig = {}
) {
	const button = await within(playAttributes.canvasElement).findByRole(
		'button'
	)
	await testButton(playAttributes, { isClickDisabled, className })
	expect(button).toHaveProperty('href')
	expect(button).toHaveProperty('target')
	await testButton(playAttributes)
}
