import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'

interface ButtonConfig {
	isClickDisabled?: boolean
	className?: string | string[]
}

const buttonState: { component: HTMLElement | null } = {
	component: null
}

async function buttonWithin(canvasElement: HTMLElement) {
	const component = await within(canvasElement).findByRole('button')
	buttonState.component = component
	return component
}

async function getComponent(canvasElement: HTMLElement) {
	if (buttonState.component) {
		return buttonState.component
	}
	return await buttonWithin(canvasElement)
}

export async function testButton(
	{ canvasElement }: PlayAttributes = {} as PlayAttributes,
	{ isClickDisabled = false }: ButtonConfig = {}
) {
	const button = await getComponent(canvasElement)
	if (isClickDisabled) {
		await expect(button).not.toBeClicked()
	} else {
		await expect(button).toBeClicked()
	}
	expect(button).toHaveClass('vv-button')
	await expect(button).toHaveNoViolations()
}

export async function testButtonWithBadge({ canvasElement }: PlayAttributes) {
	const button = await getComponent(canvasElement)
	expect(button.innerHTML).toContain('vv-badge')
	await testButton({ canvasElement })
}

export async function testButtonWithIconLeft({
	canvasElement
}: PlayAttributes) {
	const button = await getComponent(canvasElement)
	expect(button.innerHTML).toContain('vv-icon')
	await testButton({ canvasElement })
}
export async function testButtonWithIconOnly({
	canvasElement
}: PlayAttributes) {
	const button = await getComponent(canvasElement)
	expect(button.classList).toContain('vv-button--icon-only')
	await testButton({ canvasElement })
}

export async function testButtonClass(
	{ canvasElement }: PlayAttributes,
	{ className = '' }: ButtonConfig = {}
) {
	const button = await getComponent(canvasElement)
	expect(button).toBeClicked()
	expect(button).toHaveClass(className, button)
	expect(button).toHaveNoViolations()
}
