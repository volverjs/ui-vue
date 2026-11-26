import type { InputType } from '@/components/VvInputText'
import type { PlayAttributes } from '@/test/types'
import { userEvent, waitFor, within } from 'storybook/test'
import { INPUT_TYPES } from '@/components/VvInputText'
import { expect } from '@/test/expect'
import { tab } from '@/test/keyboard'
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

/**
 * Escape from a suggestion closes the suggestions and gives the focus back to
 * the field, where they stay closed: the focus given back showed them again,
 * and it took a second Escape.
 */
export async function suggestionsEscapeTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const input = element.querySelector('input') as HTMLInputElement
    const option = () =>
        canvasElement.querySelector<HTMLElement>('.vv-dropdown-option')

    input.focus()
    await waitFor(() => expect(option()).toBeVisible())
    option()?.focus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(input).toHaveFocus())
    await sleep(500)
    await expect(option()).not.toBeVisible()
}

/**
 * `Tab` from the field moves the focus through the suggestions, and past the
 * last one to the button after the field, which closes the suggestions: they
 * stayed open over that button. `Shift+Tab` from the first one back to the
 * field closes them too, and the field keeps them closed, as on `Esc`.
 */
export async function suggestionsTabOutTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const next = canvas.getByTestId('next')
    const input = element.querySelector('input') as HTMLInputElement
    const options = () => [
        ...canvasElement.querySelectorAll<HTMLElement>('.vv-dropdown-option'),
    ]

    input.focus()
    await waitFor(() => expect(options()[0]).toBeVisible())
    await tab()
    await expect(document.activeElement).toBe(options()[0])
    await tab(true)
    await expect(input).toHaveFocus()
    await waitFor(() => expect(options()[0]).not.toBeVisible())
    await sleep(500)
    await expect(options()[0]).not.toBeVisible()
    await expect(input).toHaveFocus()

    // a focus in the same tick as the blur shows nothing to the field
    input.blur()
    await sleep(100)
    input.focus()
    await waitFor(() => expect(options()[0]).toBeVisible())
    for (const option of options()) {
        await tab()
        await expect(document.activeElement).toBe(option)
    }
    await tab()
    await expect(next).toHaveFocus()
    await waitFor(() => expect(options()[0]).not.toBeVisible())
    await expect(next).toHaveFocus()
}

/** The suggestion options of a field, rendered inside it. */
function suggestionOptions(element: HTMLElement) {
    return [...element.querySelectorAll<HTMLElement>('.vv-dropdown-option')]
}

/**
 * A field without a storage key keeps no history: leaving it stored the value
 * in memory, and the next focus offered it back as a suggestion. So did an
 * empty `storageKey`, the only way to keep one field out of
 * `forceInputSuggestions`, which otherwise keys the history by `name`.
 */
export async function noStorageKeyTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const outside = await canvas.findByTestId('outside')
    const input = element.querySelector('input') as HTMLInputElement

    await expect(input).toBeClicked()
    await userEvent.keyboard('Lorem')
    outside.focus()
    await sleep(100)
    // an empty field lists every suggestion: one equal to the value is hidden
    await userEvent.clear(input)
    outside.focus()
    await sleep(100)
    input.focus()
    await sleep(500)
    await expect(suggestionOptions(element)).toHaveLength(0)

    await expect(element).toHaveNoViolations()
}

/**
 * `forceInputSuggestions` keeps a history of the text fields only: a password
 * was stored in clear in the browser storage, and a date came back as its raw
 * value (`2026-11-25T10:30`) in a list over the date picker. An empty
 * `storageKey` keeps a text field out of it.
 */
export async function forcedSuggestionsTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const outside = await canvas.findByTestId('outside')
    const field = async (name: string) => {
        const element = await canvas.findByTestId(name)
        return {
            element,
            input: element.querySelector('input') as HTMLInputElement,
        }
    }
    for (const key of ['forced-text', 'forced-password', 'forced-date', 'forced-opt-out']) {
        localStorage.removeItem(key)
    }

    const text = await field('forced-text')
    await expect(text.input).toBeClicked()
    await userEvent.keyboard('Lorem')
    outside.focus()
    await sleep(100)
    await expect(localStorage.getItem('forced-text')).toEqual('["Lorem"]')

    const password = await field('forced-password')
    await expect(password.input).toBeClicked()
    await userEvent.keyboard('secret')
    outside.focus()
    await sleep(100)
    await expect(localStorage.getItem('forced-password')).toBeNull()

    const date = await field('forced-date')
    await expect(date.input).toBeClicked()
    await userEvent.keyboard(new Date().toISOString().split('T')[0])
    await expect(date.input.value).not.toEqual('')
    outside.focus()
    await sleep(100)
    await expect(localStorage.getItem('forced-date')).toBeNull()
    // emptied, as a suggestion equal to the value is hidden
    date.input.focus()
    date.input.value = ''
    date.input.dispatchEvent(new Event('input', { bubbles: true }))
    await expect(date.input.value).toEqual('')
    outside.focus()
    await sleep(100)
    date.input.focus()
    await sleep(500)
    await expect(suggestionOptions(date.element)).toHaveLength(0)

    const optOut = await field('forced-opt-out')
    await expect(optOut.input).toBeClicked()
    await userEvent.keyboard('Lorem')
    outside.focus()
    await sleep(100)
    await expect(localStorage.getItem('forced-opt-out')).toBeNull()
    // an empty field lists every suggestion: one equal to the value is hidden
    await userEvent.clear(optOut.input)
    outside.focus()
    await sleep(100)
    optOut.input.focus()
    await sleep(500)
    await expect(suggestionOptions(optOut.element)).toHaveLength(0)

    await expect(canvasElement).toHaveNoViolations()
}

/**
 * Editing a `datetime-local` field sets the instant the field shows: the
 * milliseconds of the previous value stayed, so `11:00` became
 * `…T10:00:00.917Z`. Showing the value alone does not rewrite it.
 */
export async function dateTimeEditTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const input = element.querySelector('input') as HTMLInputElement

    await sleep(100)
    await expect(value.innerHTML).toEqual('2026-11-25T09:29:29.917Z')

    input.focus()
    input.value = '2026-11-25T11:00'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(100)
    await expect(value.innerHTML).toEqual(
        new Date('2026-11-25T11:00').toISOString(),
    )

    await expect(element).toHaveNoViolations()
}

/**
 * Behind a `debounce`, a value typed and then typed back to the one the field
 * showed leaves the model as it was: the value typed in between, still waiting
 * for its timer, was emitted while the field showed the model again.
 */
export async function dateTimeRevertTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const input = element.querySelector('input') as HTMLInputElement

    await sleep(100)
    const shown = input.value
    input.focus()
    input.value = '2026-11-25T11:00'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(50)
    input.value = shown
    input.dispatchEvent(new Event('input', { bubbles: true }))
    // past the debounce
    await sleep(500)
    await expect(value.innerHTML).toEqual('2026-11-25T09:29:29.917Z')

    await expect(element).toHaveNoViolations()
}

/**
 * A field emptied and then given back the value it showed sets the model to
 * that value: the emptied field still held the date of the model, which
 * matched the value typed, so the model stayed empty.
 */
export async function dateTimeClearTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const input = element.querySelector('input') as HTMLInputElement

    await sleep(100)
    const shown = input.value
    input.focus()
    input.value = ''
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(100)
    await expect(value.innerHTML).toEqual('')
    input.value = shown
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(100)
    await expect(value.innerHTML).toEqual(new Date(shown).toISOString())

    await expect(element).toHaveNoViolations()
}

// local times, so the day is the same in every time zone
export const JANUARY_END = new Date(2026, 0, 31, 12)

/**
 * A date moved from the 31st of January to February lands in February: the
 * year, the month and the day were set one at a time, and the 31st of
 * February overflowed into March before the day was set, so the 28th of
 * February gave the 28th of March. A month field keeps the day of the model,
 * within the month picked.
 */
export async function monthEndTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const input = element.querySelector('input') as HTMLInputElement
    const edits: Partial<Record<InputType, string>> = {
        [INPUT_TYPES.DATE]: '2026-02-28',
        [INPUT_TYPES.MONTH]: '2026-02',
    }

    await sleep(100)
    await expect(value.innerHTML).toEqual(JANUARY_END.toISOString())

    input.focus()
    input.value = edits[args.type as InputType] as string
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(100)
    await expect(value.innerHTML).toEqual(
        new Date(2026, 1, 28, 12).toISOString(),
    )

    await expect(element).toHaveNoViolations()
}

/**
 * Chips in the `#before` slot that fill the row leave the input room to be
 * clicked and typed in: `__inner` grew from no width, `flex: 1`, while
 * `__input-before` started from the width of all its chips and took the
 * whole row, so the third chip squeezed the input to 0px. The fix is in
 * `@volverjs/style`.
 */
export async function beforeOverflowTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const input = element.querySelector('input') as HTMLInputElement
    const inner = element.querySelector('.vv-input-text__inner') as HTMLElement
    const badges = () => element.querySelectorAll('.vv-badge')

    input.focus()
    await userEvent.keyboard('third.address@example.com{Enter}')
    await waitFor(() => expect(badges()).toHaveLength(3))
    await sleep(100)

    // room for an address, not just for the caret
    await expect(inner.getBoundingClientRect().width).toBeGreaterThanOrEqual(96)
    // and a click at the middle of the input reaches the input
    const box = input.getBoundingClientRect()
    await expect(
        document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2),
    ).toBe(input)

    await expect(element).toHaveNoViolations()
}

/**
 * A `step` below one second shows the milliseconds of the model and reads
 * those typed: the field showed seconds at most, and a value with a fraction
 * of a second threw, so the model was not updated.
 */
export async function millisecondsTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const input = element.querySelector('input') as HTMLInputElement
    const model = new Date('2026-11-25T09:29:29.917Z')
    const edits: Partial<Record<InputType, [string, Date]>> = {
        [INPUT_TYPES.TIME]: [
            '11:15:20.250',
            new Date(new Date(model).setHours(11, 15, 20, 250)),
        ],
        [INPUT_TYPES.DATETIME_LOCAL]: [
            '2026-11-25T11:15:20.250',
            new Date(2026, 10, 25, 11, 15, 20, 250),
        ],
    }
    const [typed, expected] = edits[args.type as InputType] as [string, Date]

    await sleep(100)
    await expect(value.innerHTML).toEqual(model.toISOString())
    // seconds and milliseconds read the same in every time zone
    await expect(input.value).toMatch(/:29\.917$/)

    input.focus()
    input.value = typed
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(100)
    await expect(value.innerHTML).toEqual(expected.toISOString())

    await expect(element).toHaveNoViolations()
}
