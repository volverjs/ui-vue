import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function checkTest({ canvasElement, functions, ...data }) {
	console.log(data)
	const checkboxParent = await within(canvasElement).findByTestId('checkbox')
	const checkbox = document.getElementById(`${data.args.id}`)
	expect(checkbox).toBeCheckable()
	if (functions) {
		functions.forEach(async (func) => {
			await func({ checkboxParent, ...data })
		})
	}
	// Accessibility Test
	expect.extend(toHaveNoViolations)
	expect(await axe(checkboxParent)).toHaveNoViolations()
}

async function generalTest({ canvasElement, ...data }) {
	const accordion = await within(canvasElement).findByTestId('accordion')
	const title = accordion.firstChild
	console.log({ accordion })
	console.log({ data })
	expect(accordion).toHaveClass('vv-accordion')
	expect(title.innerText).toEqual(data.args.title)
	expect(title).toHaveClass('vv-collapse__summary')
	expect(accordion.open).toBe(false)
	title.click()
	expect(accordion.open).toBeTruthy()
	const content = accordion.lastChild
	expect(content).toHaveClass('vv-collapse__content')
	expect(content.innerText).toEqual(data.args.content)
	accessibilityTest(accordion)
}

async function borderedTest({ canvasElement }, className) {
	const accordion = await within(canvasElement).findByTestId('accordion')
	console.log(className)
	expect(accordion).toHaveClass(`vv-accordion--${className}`)
	accessibilityTest(accordion)
}

async function generalCheckTest({ ...data }) {
	const checkbox = document.getElementById(`${data.args.id}`)
	const labelProp = data.args.label
	const checkboxLabel = checkbox.parentElement.innerText
	expect(labelProp).toEqual(checkboxLabel)
	const checkboxValue = checkbox._value
	expect(checkboxValue).toBe(data.args.value)
	expect(checkbox).not.toHaveClass(
		'focus-visible',
		'vv-input-check__input--checked'
	)
	checkbox.addEventListener('change', (event) => {
		expect(event).toBeTruthy
		const eventValue = event.target._value
		expect(eventValue).toEqual(checkboxValue)
	})
	await userEvent.click(checkbox)
	await expect(checkbox).toHaveClass(
		'focus-visible',
		'vv-input-check__input--checked'
	)
}

async function booleanTest(checkboxParent) {
	const checkbox = document.getElementById(`${checkboxParent.args.id}`)
	console.log([checkboxParent.checkboxParent.attributes[0]])
	// expect(checkboxParent.children[0]).toHaveClass('vv-input-checkbox')
	checkbox.addEventListener('change', (event) => {
		expect(event).toBeTruthy
	})
	await userEvent.click(checkbox)
	await classTest(checkbox, [
		'focus-visible',
		'vv-input-check__input--checked'
	])
}

async function binaryTest() {
	const checkbox = document.getElementById('5')
	expect(checkbox.parentElement).toHaveClass('vv-input-checkbox')
	// userEvent.click(checkbox)
	userEvent.click(checkbox)
	accessibilityTest(checkbox)
	checkbox.addEventListener('change', (event) => {
		console.log(event)
	})
}

async function disabledTest({ ...data }) {
	const checkbox = document.getElementById(data.args.id)
	await expect(checkbox).toHaveClass('vv-input-check__input--disabled')
	await expect(checkbox).toBeDisabled()
	await expect(checkbox).toHaveProperty('disabled')
	await expect(checkbox).not.toBeCheckable()
	await accessibilityTest(checkbox)
}

async function switchTest({ ...data }) {
	const checkbox = document.getElementById(data.args.id)
	const label = checkbox.parentElement
	expect(data.args.switch).toBe(true)
	expect(label).toHaveClass('vv-input-checkbox--switch')
}

async function readOnlyTest() {
	const checkbox = document.getElementById('2')
	const value = document.getElementById('value')
	console.log(checkbox.modelValue)
	expect(checkbox).toHaveProperty('readOnly')
	await expect(checkbox).toHaveClass('vv-input-check__input--readonly')
	userEvent.click(checkbox)
	await expect(checkbox).toBeCheckable()
	await console.log({ checkbox })
	await classTest(checkbox, [
		'focus-visible',
		'vv-input-check__input--checked',
		'vv-input-check__input--readonly'
	])
	accessibilityTest(checkbox)
}

expect.extend({
	async toBeClickable(checkbox) {
		await checkbox.click()
		let result = {
			pass: false,
			message: `Click event doesn't work`
		}
		if (checkbox.checked) {
			result = {
				pass: true,
				message: `Click event work!`
			}
		}
		return result
	}
})

async function classTest(input, classNames = []) {
	classNames.forEach((cssClass) => {
		expect(input).toHaveClass(cssClass)
	})
}

async function accessibilityTest(element) {
	expect.extend(toHaveNoViolations)
	expect(await axe(element)).toHaveNoViolations()
}

export {
	checkTest,
	generalTest,
	borderedTest,
	generalCheckTest,
	booleanTest,
	binaryTest,
	disabledTest,
	readOnlyTest,
	switchTest
}
