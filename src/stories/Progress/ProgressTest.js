import { expect } from '@storybook/jest'
import { within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function progressTest({ canvasElement }) {
	const progress = await within(canvasElement).findByRole('progressbar')
	expect(progress).toHaveClass('vv-progress')
	await accessibilityTest(progress)
}

async function indeterminateTest({ canvasElement }) {
	const progress = await within(canvasElement).findByRole('progressbar')
	await classTest(progress, ['vv-progress', 'vv-progress--indeterminate'])
	await accessibilityTest(progress)
}

async function classTest(progress, classNames = []) {
	classNames.forEach((cssClass) => {
		expect(progress).toHaveClass(cssClass)
	})
}

async function accessibilityTest(element) {
	expect.extend(toHaveNoViolations)
	expect(await axe(element)).toHaveNoViolations()
}

export { progressTest, indeterminateTest, classTest, accessibilityTest }
