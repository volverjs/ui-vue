import type { InputType } from '@/components/VvInputText'
import type { PlayAttributes } from '@/test/types'
import { userEvent, within } from 'storybook/test'
import { INPUT_TYPES } from '@/components/VvInputText'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { invalidPropWarnings } from '@/test/warnings'

function valueByType(type: InputType, mask?: string, id?: string) {
    if (mask) {
        switch (id) {
            case 'phone-number':
                return { toType: '393923847556' }
            case 'date-placeholder':
                return { toType: '01011970', toCheck: '1970-01-01' }
            case 'phone-or-email':
                return {
                    toType:
						Math.random() < 0.5 ? '393923847556' : 'test@test.com',
                }
            case 'intl-number':
                return { toType: '1234567890.22' }
            case 'currency':
                return { toType: '1234567890.22' }
            default:
                return { toType: '1234567890' }
        }
    }
    switch (type) {
        case INPUT_TYPES.TEXT:
        case INPUT_TYPES.PASSWORD:
        case INPUT_TYPES.SEARCH:
            return { toType: 'Lorem ipsum' }
        case INPUT_TYPES.NUMBER:
            return { toType: '1' }
        case INPUT_TYPES.EMAIL:
            return { toType: 'test@test.com' }
        case INPUT_TYPES.TEL:
            return { toType: '+1234567890' }
        case INPUT_TYPES.URL:
            return { toType: 'https://www.test.com' }
        case INPUT_TYPES.DATE:
            return { toType: new Date().toISOString().split('T')[0] }
        case INPUT_TYPES.TIME:
            return { toType: '12:00' }
        case INPUT_TYPES.COLOR:
        case INPUT_TYPES.DATETIME_LOCAL:
        case INPUT_TYPES.MONTH:
        case INPUT_TYPES.WEEK:
            return { toType: undefined }
    }
}

export async function checkNullTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const input = element.getElementsByTagName('input')[0]

    await expect(input).toHaveProperty('value', '')
    await expect(value.innerHTML).toEqual('null')
}

export async function checkUndefinedTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const input = element.getElementsByTagName('input')[0]

    await expect(input).toHaveProperty('value', '')
    await expect(value.innerHTML).toEqual('undefined')
}

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const input = element.getElementsByTagName('input')[0]
    const hint = element.getElementsByClassName('vv-input-text__hint')[0]

    // value
    if (!args.invalid && !args.disabled && !args.readonly) {
        const { toType, toCheck } = valueByType(args.type, args.iMask, args.id)
        if (toType) {
            await expect(input).toBeClicked()
            await userEvent.keyboard(toType)
            await sleep()
            if (args.maxlength) {
                await expect(value.innerHTML).toEqual(
                    toType.slice(0, args.maxlength),
                )
            } else {
                await expect(value.innerHTML).toEqual(toCheck ?? toType)
            }
        }
    }

    // disabled
    if (args.disabled) {
        await expect(element).toHaveClass('vv-input-text--disabled')
        await expect(input).toHaveProperty('disabled')
        await expect(input).not.toBeClicked()
    }

    // readonly
    if (args.readonly) {
        await expect(element).toHaveClass('vv-input-text--readonly')
        await expect(input).toHaveProperty('readOnly')
    }

    // invalid
    if (args.invalid) {
        await expect(element).toHaveClass('vv-input-text--invalid')
        await expect(input).toHaveProperty('ariaInvalid')
        if (args.invalidLabel) {
            await expect(hint.innerHTML).toEqual(args.invalidLabel)
        }
    }

    // valid
    if (args.valid) {
        await expect(element).toHaveClass('vv-input-text--valid')
        await expect(input).toHaveProperty('ariaInvalid', 'false')
        if (args.validLabel) {
            await expect(hint.innerHTML).toEqual(args.validLabel)
        }
    }

    //   min / max / minlength / maxlength
    if (args.min) {
        await expect(input).toHaveProperty('min', String(args.min))
    }

    if (args.max) {
        await expect(input).toHaveProperty('max', String(args.max))
    }

    if (args.minlength) {
        await expect(input).toHaveProperty('minLength', args.minlength)
    }

    if (args.maxlength) {
        await expect(input).toHaveProperty('maxLength', args.maxlength)
    }

    // floating
    if (args.floating) {
        await expect(element).toHaveClass('vv-input-text--floating')
    }

    // loading
    if (args.loading) {
        await expect(element).toHaveClass('vv-input-text--loading')
    }

    // hint
    if (args.hintLabel) {
        await expect(hint.innerHTML).toEqual(args.hintLabel)
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function syncUpdateTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const submit = await canvas.findByTestId('submit')
    const submitted = await canvas.findByTestId('submitted')
    const input = element.getElementsByTagName('input')[0]

    // Deliberately not awaiting between the two: the click has to be handled in
    // the same task as the keystroke, the way a real click right after the last
    // character is. `userEvent` yields in between and would hide a model that is
    // only committed one task later.
    input.focus()
    input.value = 'Lorem ipsum'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    submit.click()

    await sleep()
    await expect(submitted.innerHTML).toEqual('Lorem ipsum')
}

export async function debouncedTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const outside = await canvas.findByTestId('outside')
    const value = await canvas.findByTestId('value')
    const input = element.getElementsByTagName('input')[0]

    // The debounce (300ms) holds the value back.
    input.focus()
    input.value = 'Lorem'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(50)
    await expect(value.innerHTML).toEqual('')

    // Enter commits it without waiting for the rest of the debounce.
    input.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }),
    )
    await sleep(50)
    await expect(value.innerHTML).toEqual('Lorem')

    // So does leaving the field.
    input.value = 'Lorem ipsum'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(50)
    await expect(value.innerHTML).toEqual('Lorem')
    outside.focus()
    await sleep(50)
    await expect(value.innerHTML).toEqual('Lorem ipsum')
}

export async function debouncedSuggestionTest({
    canvasElement,
    args,
}: PlayAttributes) {
    const storageKey = args.storageKey as string
    localStorage.removeItem(storageKey)

    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const outside = await canvas.findByTestId('outside')
    const value = await canvas.findByTestId('value')
    const input = element.getElementsByTagName('input')[0]

    input.focus()
    input.value = 'Lorem'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(50)
    outside.focus()
    await sleep(50)

    // Blur stores the flushed value, not the prop the component was still
    // reading while handling the blur.
    await expect(value.innerHTML).toEqual('Lorem')
    await expect(localStorage.getItem(storageKey)).toEqual('["Lorem"]')
}

export async function isoTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const input = element.getElementsByTagName('input')[0] as HTMLInputElement
    const value = await within(canvasElement).findByTestId('value')

    const inputDate = getDateFromInputValue(input.value, args.type)
    if (!inputDate) {
        await expect(value.innerHTML).toEqual('null')
        return
    }
    const valueDate = new Date(value.innerHTML)

    if (args.type === INPUT_TYPES.TIME || args.type === INPUT_TYPES.DATETIME_LOCAL) {
        expect(inputDate.getHours()).toEqual(valueDate.getHours())
        expect(inputDate.getMinutes()).toEqual(valueDate.getMinutes())
    }
    if (args.type === INPUT_TYPES.MONTH || args.type === INPUT_TYPES.DATE || args.type === INPUT_TYPES.DATETIME_LOCAL) {
        expect(inputDate.getMonth()).toEqual(valueDate.getMonth())
        expect(inputDate.getFullYear()).toEqual(valueDate.getFullYear())
    }
    if (args.type === INPUT_TYPES.DATE || args.type === INPUT_TYPES.DATETIME_LOCAL) {
        expect(inputDate.getDate()).toEqual(valueDate.getDate())
    }
}

export async function defaultMaxTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const input = element.getElementsByTagName('input')[0] as HTMLInputElement
    const yearOverflow: Partial<Record<InputType, string>> = {
        [INPUT_TYPES.DATE]: '222222-02-05',
        [INPUT_TYPES.DATETIME_LOCAL]: '222222-02-05T22:22',
        [INPUT_TYPES.MONTH]: '222222-02',
        [INPUT_TYPES.WEEK]: '222222-W05',
    }

    // until it is focused an empty date input is drawn as text
    await expect(input).toBeClicked()
    await expect(input).toHaveProperty('type', args.type)

    // a six digit year is a valid value for the browser, only a max rejects it
    input.value = yearOverflow[args.type as InputType] as string
    await expect(input.validity.rangeOverflow).toBe(true)

    await expect(element).toHaveNoViolations()
}

// local times, so the input formats them the same in every time zone
export const DATE_MIN = new Date(2030, 0, 1, 12, 30, 15)
export const DATE_MAX = new Date(2030, 0, 2, 18, 45)

export async function dateLimitsTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const input = element.getElementsByTagName('input')[0] as HTMLInputElement
    const limits: Partial<Record<InputType, [string, string]>> = {
        [INPUT_TYPES.DATE]: ['2030-01-01', '2030-01-02'],
        [INPUT_TYPES.DATETIME_LOCAL]: ['2030-01-01T12:30', '2030-01-02T18:45'],
        [INPUT_TYPES.MONTH]: ['2030-01', '2030-01'],
        [INPUT_TYPES.TIME]: ['12:30:15', '18:45:00'],
    }
    const [min, max] = limits[args.type as InputType] as [string, string]

    await expect(input).toBeClicked()
    await expect(input).toHaveProperty('min', min)
    await expect(input).toHaveProperty('max', max)
}

export async function emptyLimitsTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const input = element.getElementsByTagName('input')[0] as HTMLInputElement

    // an empty min is no min, a max that cannot be formatted leaves the default
    await expect(input).toBeClicked()
    await expect(input.hasAttribute('min')).toBe(false)
    await expect(input).toHaveProperty('max', '9999-12-31')
}

export async function invalidIconPositionTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')

    // the validator refuses a value that is not a position
    expect(invalidPropWarnings('iconPosition')).not.toHaveLength(0)
    // and neither `before` nor `after` places the icon
    expect(element.getElementsByClassName('vv-input-text__icon')).toHaveLength(0)
}
