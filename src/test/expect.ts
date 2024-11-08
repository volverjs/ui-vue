import { sleep } from '@/test/sleep'
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable ts/no-namespace */
import { expect, userEvent } from '@storybook/test'
import { axe } from 'jest-axe'

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeChecked: (expected?: HTMLElement) => CustomMatcherResult
        }
        interface Matchers<R> {
            toBeClicked: (expected?: HTMLElement) => CustomMatcherResult
        }
        interface Matchers<R> {
            toHaveClass: (
                className: string | string[],
                expected?: HTMLElement,
            ) => CustomMatcherResult
        }
        interface Matchers<R> {
            toHaveImgChild: (
                imgTag: string,
                expected?: HTMLElement,
            ) => CustomMatcherResult
        }
    }
}

expect.extend({
    async toBeChecked(checkbox: HTMLInputElement) {
        await checkbox.click()
        await sleep()
        if (checkbox.checked) {
            return {
                pass: true,
                message: () => `Checkbox is checked`,
            }
        }
        return {
            pass: false,
            message: () => `Checkbox is not checked`,
        }
    },
    async toBeClicked(element: HTMLElement) {
        const result = {
            pass: false,
            message: () => 'Click event don\'t works',
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
            message: () => 'Element has violations',
        }
    },
    async toHaveClass(element: HTMLElement, className: string | string[]) {
        const classes = !Array.isArray(className) ? [className] : className
        return {
            pass: classes.every(cssClass =>
                element.classList.contains(cssClass),
            ),
            message: () =>
                `One of these classes doesn't exist: ${classes.join(', ')}`,
        }
    },
    async toHaveImgChild(element: HTMLElement, imgTag: string) {
        const img = element.getElementsByTagName(imgTag)
        return {
            pass: img.length === 1,
            message: () => `${imgTag} not exist!`,
        }
    },
})

export { expect }
