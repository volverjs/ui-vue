import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'

interface RadioConfig {
	isClickDisabled?: boolean
	isVertical?: boolean
	className?: string | string[] | null
	child?: number
	propName?: string
}

async function radioGroupTest(
	{ canvasElement }: PlayAttributes = {} as PlayAttributes,
	{
		isClickDisabled = false,
		className = null,
		isVertical = false
	}: RadioConfig = {}
) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	const radios = document.getElementsByClassName('vv-input-radio__input')
	const radio1 = radios[0] as HTMLInputElement
	const radio2 = radios[1] as HTMLInputElement
	expect(radioGroupParent).toHaveClass('vv-input-radio-group')
	if (!isVertical) {
		expect(radioGroupParent).toHaveClass([
			'vv-input-radio-group--horizontal'
		])
	} else {
		expect(radioGroupParent).not.toHaveClass('vv-input-radio--horizontal')
	}
	if (className) {
		expect(radioGroupParent).toHaveClass(className)
	}
	if (isClickDisabled) {
		await expect(radio1).not.toBeClicked()
		expect(radio1).toHaveClass('vv-input-radio__input--disabled')
	} else {
		await expect(radio1).toBeClicked()
		await expect(radio1).toHaveClass([
			'focus-visible',
			'vv-input-radio__input--checked'
		])
		radioCheck(radio1, true)
		radioCheck(radio2, false)
	}
	expect(radioGroupParent).toHaveNoViolations()
}

async function labelTest(
	{ canvasElement, ...data }: PlayAttributes = {} as PlayAttributes,
	{ child = 0, propName = '' }: RadioConfig = {}
) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	const labelInnerHTML = radioGroupParent.children[child].innerHTML
	const propLabel = data.args[propName]
	expect(labelInnerHTML).toBeTruthy()
	expect(propLabel).toBeTruthy()
	expect(labelInnerHTML).toEqual(propLabel)
	await radioGroupTest({ canvasElement, ...data })
}

async function readonlyTest(
	{ canvasElement, ...data }: PlayAttributes = {} as PlayAttributes
) {
	const radioGroupWrapper = await document.getElementsByClassName(
		'vv-input-radio-group__wrapper'
	)[0]
	const radioLabels = [...radioGroupWrapper.children]
	radioLabels.forEach((label) => {
		const radio = label.children[0]
		expect(radio).toHaveClass('vv-input-radio__input--readonly')
	})
	radioGroupTest({ canvasElement, ...data })
}

async function radioCheck(radio: HTMLInputElement, value: boolean) {
	expect(radio.ariaChecked).toBe(`${value}`)
	expect(radio.checked).toBe(value)
}

export { radioGroupTest, labelTest, readonlyTest }
