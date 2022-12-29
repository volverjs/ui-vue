import type { PlayAttributes, ComponentConfig } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'

async function radioGroupTest(
	{ canvasElement }: PlayAttributes = {} as PlayAttributes,
	{
		isClickDisabled = false,
		className = null,
		isVertical = false
	}: ComponentConfig = {}
) {
	const radioGroupParent = await within(canvasElement).findByTestId(
		'radiogroup'
	)
	const radios = document.getElementsByClassName('vv-radio__input')
	const radio1 = radios[0] as HTMLInputElement
	const radio2 = radios[1] as HTMLInputElement
	expect(radioGroupParent).toHaveClass('vv-radio-group')
	if (!isVertical) {
		expect(radioGroupParent).toHaveClass(['vv-radio-group--horizontal'])
	} else {
		expect(radioGroupParent).not.toHaveClass('vv-radio--horizontal')
	}
	if (className) {
		expect(radioGroupParent).toHaveClass(className)
	}
	if (isClickDisabled) {
		await expect(radio1).not.toBeClicked()
		expect(radio1.parentElement).toHaveClass('vv-radio--disabled')
	} else {
		await expect(radio1).toBeClicked()
		radioCheck(radio1, true)
		radioCheck(radio2, false)
	}
	expect(radioGroupParent).toHaveNoViolations()
}

async function labelTest(
	{ canvasElement, ...data }: PlayAttributes = {} as PlayAttributes,
	{ child = 0, propName = '' }: ComponentConfig = {}
) {
	const radioGroupParent = await within(canvasElement).findByTestId(
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
	{ canvasElement }: PlayAttributes = {} as PlayAttributes
) {
	const radioGroup = (await within(canvasElement).findByTestId(
		'radiogroup'
	)) as HTMLDivElement
	const radios = [...radioGroup.getElementsByClassName('vv-radio')]
	radios.forEach((radio) => {
		expect(radio).toHaveClass('vv-radio--readonly')
	})
}

async function radioCheck(radio: HTMLInputElement, value: boolean) {
	expect(radio.checked).toBe(value)
}

async function slotsTest(
	{ canvasElement, ...args }: PlayAttributes = {} as PlayAttributes,
	{ className }: ComponentConfig = {} as ComponentConfig
) {
	const radioGroupParent = await within(canvasElement).findByTestId(
		'radiogroup'
	)
	const slot = radioGroupParent.lastElementChild as HTMLElement
	expect(slot).toHaveClass('vv-radio-group__hint')
	expect(slot.innerText).toBeTruthy()
	if (className) {
		expect(radioGroupParent).toHaveClass(`vv-radio-group--${className}`)
	}
	expect(slot).toHaveNoViolations()
	await radioGroupTest({ canvasElement, ...args })
}

type optionFn = (a: { [key: string]: string }) => string

function getValueToTest(
	option: { [key: string]: string },
	key: string | optionFn
) {
	return typeof key == 'string' ? `${option[key]}` : `${key(option)}`
}

async function radioOptionsTest({ canvasElement, ...data }: PlayAttributes) {
	const radioGroup = await within(canvasElement).findByTestId('radiogroup')
	const radioGroupWrapper = radioGroup.children[0]
	const optionParamLabel = (data.args.optionLabel || 'label') as
		| string
		| optionFn
	const optionParamValue = (data.args.optionValue || 'value') as
		| string
		| optionFn
	const options = data.args.options as Record<string, string>[]
	options.forEach((option, index: number) => {
		const radio = radioGroupWrapper.children[index] as HTMLElement
		const radioInput = radio.children[0] as HTMLInputElement
		const radioText = radio.innerText
		expect(radioText).toEqual(getValueToTest(option, optionParamLabel))
		expect(radioInput.value).toEqual(
			getValueToTest(option, optionParamValue)
		)
	})
	radioGroupTest({ canvasElement, ...data })
}

async function arrayOptionsTest({ canvasElement, ...data }: PlayAttributes) {
	const radioGroup = await within(canvasElement).findByTestId('radiogroup')
	const radioGroupWrapper = radioGroup.children[0]
	const options = data.args.options as Record<string, string>[]
	options.forEach((option, index: number) => {
		const radio = radioGroupWrapper.children[index] as HTMLElement
		const radioInput = radio.children[0] as HTMLInputElement
		const radioText = radio.innerText
		expect(radioInput.value).toEqual(option)
		expect(radioText).toEqual(option)
	})
	radioGroupTest({ canvasElement, ...data })
}

export {
	radioGroupTest,
	labelTest,
	readonlyTest,
	slotsTest,
	radioOptionsTest,
	arrayOptionsTest
}
