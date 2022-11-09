import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'

interface ButtonConfig {
	isClickDisabled?: boolean
	className?: string | string[] | null
}

export async function testButton(
	{ canvasElement }: PlayAttributes = {} as PlayAttributes,
	{ isClickDisabled = false, className = null }: ButtonConfig = {}
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

export async function testButtonWithBadge({ canvasElement }: PlayAttributes) {
	const button = await within(canvasElement).findByRole('button')
	expect(button.innerHTML).toContain('vv-badge')
	await testButton({ canvasElement })
}

export async function testButtonWithIconLeft({
	canvasElement
}: PlayAttributes) {
	const button = await within(canvasElement).findByRole('button')
	expect(button.innerHTML).toContain('vv-icon')
	await testButton({ canvasElement })
}
export async function testButtonWithIconOnly({
	canvasElement
}: PlayAttributes) {
	const button = await within(canvasElement).findByRole('button')
	expect(button.classList).toContain('vv-button--icon-only')
	await testButton({ canvasElement })
}

export async function testButtonLink(
	{ canvasElement }: PlayAttributes,
	{ isClickDisabled = false, className = null }: ButtonConfig = {}
) {
	const button = await within(canvasElement).findByRole('button')
	await testButton({ canvasElement }, { isClickDisabled, className })
	expect(button).toHaveProperty('href')
	expect(button).toHaveProperty('target')
	await testButton({ canvasElement })
}
