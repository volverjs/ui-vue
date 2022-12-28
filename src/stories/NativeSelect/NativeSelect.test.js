import { expect } from '@/test/expect'
import { userEvent, within } from '@storybook/testing-library'

async function nativeSelectTest({ canvasElement, ...data }) {
	const selectParent = await within(canvasElement).findByTestId(
		data.args['data-testId']
	)
	expect(selectParent).toHaveClass('vv-select')
	const select = selectParent.children[1].children[0]
	expect(select.parentElement).toHaveClass('vv-select__wrapper')
	userEvent.click(select)
	data.args.options.forEach((option, index) => {
		const opt = select[index + 1]
		opt.selected = true
		expect(select.value).toBe(JSON.stringify(option.value))
	})
	const opt_1 = select[1]
	opt_1.selected = true
	expect(select.value).toBe(JSON.stringify(data.args.options[0].value))
	await expect(selectParent).toHaveNoViolations()
}

async function disabledTest({ canvasElement }) {
	const selectParent = await within(canvasElement).findByTestId('select')
	const select = selectParent.children[1].children[0]
	expect(select).toBeDisabled()
	expect(select).toHaveProperty('disabled', true)
	await expect(select).toHaveNoViolations()
}

async function errorTest({ canvasElement, ...data }) {
	const selectParent = await within(canvasElement).findByTestId(
		data.args['data-testId']
	)
	expect(data.args.error).toBe(true)
	expect(selectParent).toHaveClass('vv-select--invalid')
	const errorLabel = selectParent.lastChild
	expect(errorLabel.innerText).toEqual(data.args.errorLabel)
	await expect(selectParent).toHaveNoViolations()
}

async function hintLabelTest({ canvasElement, ...data }) {
	const selectParent = await within(canvasElement).findByTestId(
		data.args['data-testId']
	)
	const labelInnerHTML = selectParent.lastChild.innerHTML
	const hintLabel = data.args.hintLabel
	expect(labelInnerHTML).toBeTruthy()
	expect(labelInnerHTML).toEqual(hintLabel)
}

async function iconTest({ canvasElement }) {
	// icon-left
	const selectParent1 = await within(canvasElement).findByTestId('icon-left')
	expect(selectParent1).toHaveClass('vv-select--icon-left')
	const iconLeft = selectParent1.children[1].children[0]
	expect(iconLeft).toHaveClass(
		'vv-icon',
		'iconify',
		'iconify--normal',
		'iconify--vv'
	)
	// icon-right
	const selectParent2 = await within(canvasElement).findByTestId('icon-right')
	expect(selectParent2).toHaveClass('vv-select--icon-right')
	const iconRight = selectParent1.children[1].children[0]
	expect(iconRight).toHaveClass(
		'vv-icon',
		'iconify',
		'iconify--normal',
		'iconify--vv'
	)
	await expect(selectParent1).toHaveNoViolations()
	await expect(selectParent2).toHaveNoViolations()
}

async function loadingTest({ canvasElement, ...data }) {
	const selectParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	expect(data.args.loading).toBe(true)
	expect(selectParent).toHaveClass('vv-select--loading')
	await expect(selectParent).toHaveNoViolations()
}

async function optionsTest({ canvasElement, ...data }) {
	const selectWrapperParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	const options = selectWrapperParent.children[1].children[0]
	const propOptions = data.args.options
	propOptions.forEach((propOption, index) => {
		expect(options[index + 1].value).toEqual(
			`${propOption.value || propOption}`
		)
		expect(options[index + 1].innerText).toEqual(
			`${propOption.label || propOption}`
		)
	})
}

async function readonlyTest({ canvasElement }) {
	const selectWrapperParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	const select = selectWrapperParent.getElementsByTagName('select')[0]
	expect(selectWrapperParent).toHaveClass('vv-select--readonly')
	expect(select).toHaveProperty('disabled', true)
	await expect(selectWrapperParent).toHaveNoViolations()
}

async function validTest({ canvasElement, ...data }) {
	const selectWrapperParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	const validLabel = selectWrapperParent.lastChild
	expect(data.args.valid).toBe(true)
	expect(selectWrapperParent).toHaveClass('vv-select--valid')
	expect(validLabel).toHaveClass('vv-select__hint')
	expect(data.args.validLabel).toEqual(validLabel.innerText)
	await expect(selectWrapperParent).toHaveNoViolations()
	await expect(validLabel).toHaveNoViolations()
}

async function customKeysTest({ canvasElement, ...data }) {
	const selectWrapperParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	const select = selectWrapperParent.children[1].children[0]
	const labelKey = data.args['label-key']
	const valueKey = data.args['value-key']
	const options = data.args.options
	expect(labelKey && valueKey).toBeTruthy()
	options.forEach((option, index) => {
		expect(select[index + 1].value).toEqual(`${option[valueKey]}`)
		expect(select[index + 1].innerText).toEqual(`${option[labelKey]}`)
	})
}

export {
	nativeSelectTest,
	errorTest,
	hintLabelTest,
	iconTest,
	loadingTest,
	optionsTest,
	disabledTest,
	readonlyTest,
	validTest,
	customKeysTest
}
