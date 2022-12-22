import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'
import { radioGroupTest } from './RadioProperty.test'

type optionFn = (a: { [key: string]: string }) => string

function getValueToTest(
	option: { [key: string]: string },
	key: string | optionFn
) {
	return typeof key == 'string' ? `${option[key]}` : `${key(option)}`
}

async function radioOptionsTest({ canvasElement, ...data }: PlayAttributes) {
	const radioGroup = await within(canvasElement).findByRole('radiogroup')
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
		const radioValue = radio.children[0]
		const radioLabel = radio.innerText
		expect(radioLabel).toEqual(getValueToTest(option, optionParamLabel))
		expect(radioValue).toEqual(getValueToTest(option, optionParamValue))
	})
	radioGroupTest({ canvasElement, ...data })
}

async function arrayOptionsTest({ canvasElement, ...data }: PlayAttributes) {
	const radioGroup = await within(canvasElement).findByRole('radiogroup')
	const radioGroupWrapper = radioGroup.children[0]
	const options = data.args.options as Record<string, string>[]
	options.forEach((option, index: number) => {
		const radio = radioGroupWrapper.children[index] as HTMLElement
		const radioValue = radio.children[0]
		const radioLabel = radio.innerText
		expect(radioLabel).toEqual(option)
		expect(radioValue).toEqual(option)
	})
	radioGroupTest({ canvasElement, ...data })
}

export { radioOptionsTest, arrayOptionsTest }
