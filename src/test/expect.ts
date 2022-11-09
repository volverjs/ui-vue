import { expect } from '@storybook/jest'
import { userEvent } from '@storybook/testing-library'
import { axe } from 'jest-axe'

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace jest {
		interface Matchers<R> {
			toBeClicked: (expected?: HTMLElement) => CustomMatcherResult
		}
		interface Matchers<R> {
			toHaveClass: (
				className: string | string[],
				expected?: HTMLElement
			) => CustomMatcherResult
		}
	}
}

expect.extend({
	async toBeClicked(element: HTMLElement) {
		const result = {
			pass: false,
			message: () => "Click event don't works"
		}
		element.addEventListener('click', () => {
			result.pass = true
			result.message = () => `Click event works`
		})
		await userEvent.click(element)
		return result
	},
	async toHaveNoViolations(element: HTMLElement) {
		const results = await axe(element)
		return {
			pass: results.violations.length === 0,
			message: () => 'Element has violations'
		}
	},
	async toHaveClass(element: HTMLElement, className: string | string[]) {
		const classes = !Array.isArray(className) ? [className] : className
		return {
			pass: classes.every((cssClass) =>
				element.classList.contains(cssClass)
			),
			message: () =>
				`One of these clsses doesn't exist: ${classes.join(', ')}`
		}
	}
})

export { expect }
