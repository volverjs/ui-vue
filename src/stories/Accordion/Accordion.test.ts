import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = (await within(canvasElement).findByTestId(
        'element',
    )) as HTMLDetailsElement
    const summary = element.getElementsByTagName('summary')[0]
    const content = element.getElementsByClassName(
        'vv-accordion__content',
    )[0] as HTMLElement

    const modifiers
        = !args.modifiers || Array.isArray(args.modifiers)
            ? args.modifiers
            : [args.modifiers]

    expect(element).toHaveClass('vv-accordion')

    // modifiers
    if (modifiers) {
        for (const modifier of modifiers) {
            expect(element).toHaveClass(`vv-accordion--${modifier}`)
        }
    }

    // summary slot / title
    if (args.summary) {
        const div = document.createElement('div')
        div.innerHTML = args.summary
        expect(summary).toHaveClass('vv-accordion__summary')
        expect(summary.textContent).toEqual(div.textContent)
    } else if (args.title) {
        expect(summary).toHaveClass('vv-accordion__summary')
        expect(summary.textContent).toEqual(args.title)
    }

    // open
    if (!args.disabled) {
        expect(element.open).toBe(!!args.not)
        expect(summary).toBeClicked()
        await sleep()
        expect(element.open).toBe(!args.not)
        expect(summary.getAttribute('aria-expanded')).toBe(
            args.not ? 'false' : 'true',
        )
        expect(content.getAttribute('aria-hidden')).toBe(
            args.not ? 'true' : 'false',
        )
    }

    // default slot / content
    if (element.open) {
        if (args.default) {
            const div = document.createElement('div')
            div.innerHTML = args.default
            expect(content.textContent).toEqual(div.textContent)
        } else if (args.content) {
            expect(content.textContent).toEqual(args.content)
        }
    }

    // accessibility
    await expect(element).toHaveNoViolations()
}

export async function notWithoutModelTest({ canvasElement }: PlayAttributes) {
    const element = (await within(canvasElement).findByTestId(
        'element',
    )) as HTMLDetailsElement
    const summary = element.getElementsByTagName('summary')[0]
    const content = element.getElementsByClassName(
        'vv-accordion__content',
    )[0] as HTMLElement
    const emitted = await within(canvasElement).findByTestId('emitted')

    // opened on arrival, without emitting
    expect(element.open).toBe(true)
    expect(summary.getAttribute('aria-expanded')).toBe('true')
    expect(content.getAttribute('aria-hidden')).toBe('false')
    expect(emitted.textContent).toBe('0')

    // closed by a click on the summary
    expect(summary).toBeClicked()
    await sleep()
    expect(element.open).toBe(false)
    expect(summary.getAttribute('aria-expanded')).toBe('false')
    expect(content.getAttribute('aria-hidden')).toBe('true')

    // accessibility
    await expect(element).toHaveNoViolations()
}

export async function nameClearedTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = (await canvas.findByTestId('element')) as HTMLDetailsElement
    const summary = element.getElementsByTagName('summary')[0]
    expect(element.id).toBe('a-1')

    // without a name the accordion falls back to an id of its own
    expect(await canvas.findByTestId('clear')).toBeClicked()
    await sleep()
    expect(element.id).not.toBe('')
    expect(summary.getAttribute('aria-controls')).toBe(element.id)

    // accessibility
    await expect(element).toHaveNoViolations()
}

export async function notInGroupTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const first = (await canvas.findByTestId('first')) as HTMLDetailsElement
    const emitted = await canvas.findByTestId('emitted')

    // the group opens nothing, so the accordion stays closed, without emitting
    await sleep()
    expect(first.open).toBe(false)
    expect(emitted.textContent).toBe('0')

    // an accordion added after the group has mounted gets no toggle, and stays closed too
    expect(await canvas.findByTestId('add')).toBeClicked()
    const second = (await canvas.findByTestId('second')) as HTMLDetailsElement
    await sleep()
    expect(second.open).toBe(false)
    expect(emitted.textContent).toBe('0')

    // accessibility
    await expect(element).toHaveNoViolations()
}
