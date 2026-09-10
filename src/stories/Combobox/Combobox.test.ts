import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { defaultTest as selectDefaultTest } from '@/stories/Select/Select.test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    // native
    if (args.native) {
        await selectDefaultTest({ canvasElement, args })
        return
    }

    const { getOptionValue } = useOptions(args)

    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const dropdown = element.getElementsByClassName(
        'vv-dropdown',
    )[0] as HTMLElement
    const dropdownFirstItem = dropdown.querySelectorAll(
        'div[role="option"]',
    )[0] as HTMLElement
    const dropdownSecondItem = dropdown.querySelectorAll(
        'div[role="option"]',
    )[1] as HTMLElement
    const hint = element.getElementsByClassName('vv-select__hint')[0]

    // disabled
    if (args.disabled) {
        await expect(element).toHaveClass('vv-select--disabled')
    }

    // readonly
    if (args.readonly) {
        await expect(element).toHaveClass('vv-select--readonly')
    }

    if (
        !args.invalid
        && !args.disabled
        && !args.readonly
        && args.options
        && args.options.length > 0
    ) {
        // select first value
        if (!args.autoselectFirst) {
            await expect(dropdownFirstItem).toBeClicked()
            await sleep()
        }

        const firstValue = getOptionValue(
            args.options[0].options?.[0] ?? args.options[0],
        )
        // in grouped options the first element is not selectable
        if (args.multiple) {
            await expect(JSON.parse(value.innerHTML)).toEqual([firstValue])
        } else {
            await expect(value.innerHTML).toEqual(firstValue)
        }

        // select second value
        if (args.options && args.options.length > 1) {
            await expect(dropdownSecondItem).toBeClicked()
            await sleep()
            const secondValue = getOptionValue(
                args.options[0].options?.[1] ?? args.options[1],
            )
            if (args.multiple) {
                await expect(JSON.parse(value.innerHTML)).toEqual([
                    firstValue,
                    secondValue,
                ])
            } else {
                await expect(value.innerHTML).toEqual(secondValue)
            }
        }
    }

    // invalid
    if (args.invalid) {
        await expect(element).toHaveClass('vv-select--invalid')
        if (args.invalidLabel) {
            await expect(hint.innerHTML).toEqual(args.invalidLabel)
        }
    }

    // valid
    if (args.valid) {
        await expect(element).toHaveClass('vv-select--valid')
        if (args.validLabel) {
            await expect(hint.innerHTML).toEqual(args.validLabel)
        }
    }

    // loading
    if (args.loading) {
        await expect(element).toHaveClass('vv-select--loading')
    }

    // hint
    if (args.hintLabel) {
        await expect(hint.innerHTML).toEqual(args.hintLabel)
    }

    // aria-labelledby
    // It may only be there when the element it names is, or the combobox points
    // at an id that is not in the document and ends up with no accessible name
    // while appearing to have one. The expected value follows the same
    // precedence the template does: a caller's `ariaLabelledby` is a deliberate
    // override and wins over the component's own label, so asserting the
    // internal id unconditionally would fail on a legitimate usage.
    const comboboxEl = element.querySelector('[role="combobox"]')
    const labelEl = element.querySelector('label')
    await expect(labelEl === null).toEqual(!args.label)
    const expectedLabelledby
        = args.ariaLabelledby ?? (args.label ? labelEl?.id : undefined)
    if (expectedLabelledby) {
        await expect(comboboxEl?.getAttribute('aria-labelledby')).toEqual(
            expectedLabelledby,
        )
    } else {
        await expect(comboboxEl?.hasAttribute('aria-labelledby')).toEqual(false)
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function ariaLabelTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const combobox = element.querySelector('[role="combobox"]')

    // Written as a kebab-case attribute at the call site, it binds to the
    // camelCase prop, so it reaches the control instead of naming the block the
    // user never operates. Declaring the prop is also what takes it out of
    // `$attrs`, which is why the block does not carry a copy.
    await expect(element).not.toHaveAttribute('aria-label')
    await expect(combobox).toHaveAttribute('aria-label', 'Reparto')

    // No visible label means no element to point at, so the reference has to be
    // absent rather than dangling.
    await expect(element.querySelector('label')).toBeNull()
    await expect(combobox).not.toHaveAttribute('aria-labelledby')

    // The point of all of it: axe agrees the combobox has a name.
    await expect(element).toHaveNoViolations()
}

export async function ariaDescribedbyTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const combobox = element.querySelector('[role="combobox"]')
    const hint = element.getElementsByClassName('vv-select__hint')[0]

    // `aria-describedby` is a list of ids, so the hint joins what the caller
    // pointed at rather than taking its place. This is the one of the three that
    // merges instead of overriding.
    const describedBy
        = combobox?.getAttribute('aria-describedby')?.split(' ') ?? []
    await expect(describedBy).toContain('extra-help')
    await expect(describedBy).toContain(hint.id)
    await expect(element).not.toHaveAttribute('aria-describedby')
    await expect(element).toHaveNoViolations()
}
