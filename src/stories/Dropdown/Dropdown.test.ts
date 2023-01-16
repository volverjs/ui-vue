import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within } from '@storybook/testing-library'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getOptionValue = (args: any, index: number) => {
	if (args.options && args.options.length > index) {
		let value = args.options[index]
		if (args.valueKey) {
			if (typeof args.valueKey === 'function') {
				value = args.valueKey(value)
			} else if (typeof value === 'object') {
				value = value[args.valueKey]
			}
		} else if (typeof value === 'object') {
			value = value.value
		}
		return value
	}
	return undefined
}

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element'
	)) as HTMLElement
	const value = (await within(canvasElement).findByTestId(
		'value'
	)) as HTMLElement
	const label = element.getElementsByTagName('label')[0]
	const input = label.getElementsByTagName('input')[0]

	// checked value
	if (!args.invalid && args.options && args.options.length > 0) {
		label.addEventListener('click', async () => {
			await sleep()
			if (!args.disabled && !args.readonly) {
				const firstValue = getOptionValue(args, 0)
				expect(JSON.parse(value.innerHTML)).toEqual(
					args.multiple ? [firstValue] : firstValue
				)
			}
		})
		if (args.disabled || args.readonly) {
			await expect(input).not.toBeChecked()
		} else {
			await expect(input).toBeChecked()
		}
	}

	// disabled
	if (args.disabled) {
		await expect(input).toHaveProperty('disabled')
		await expect(input).not.toBeChecked()
	}

	// check accessibility
	await expect(element).toHaveNoViolations()
}
