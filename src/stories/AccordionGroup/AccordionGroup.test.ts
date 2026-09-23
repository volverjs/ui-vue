import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const firstChild = element.children[0] as HTMLDetailsElement
    const firstChildSummary = firstChild.getElementsByTagName('summary')[0]
    const value = await within(canvasElement).findByTestId('value')

    const modifiers
        = !args.modifiers || Array.isArray(args.modifiers)
            ? args.modifiers
            : [args.modifiers]

    expect(element).toHaveClass('vv-accordion-group')

    // modifiers
    if (modifiers) {
        for (const modifier of modifiers) {
            expect(element).toHaveClass(`vv-accordion-group--${modifier}`)
        }
    }

    // open
    if (!args.disabled && args.items && args.items.length > 0) {
        expect(firstChild.open).toBe(args.not ?? false)
        expect(firstChildSummary).toBeClicked()
        await sleep()
        expect(firstChild.open).toBe(!args.not)
        if (firstChild.open) {
            if (args.not) {
                expect(JSON.stringify(JSON.parse(value.textContent ?? ''))).toBe(
                    JSON.stringify(
                        args.items.map(
                            (item: { name: string }) => item.name,
                        ).toSpliced(0, 1),
                    ),
                )
            } else if (args.collapse) {
                expect(JSON.stringify(JSON.parse(value.textContent ?? ''))).toBe(
                    JSON.stringify([args.items[0].name]),
                )
            } else {
                expect(value.textContent ?? '').toBe(args.items[0].name)
            }
            expect(firstChildSummary.getAttribute('aria-expanded')).toBe('true')
            const content = firstChild.lastChild as HTMLElement
            expect(content.getAttribute('aria-hidden')).toBe('false')
        }
    }

    // accessibility
    await expect(element).toHaveNoViolations()
}

export async function lateItemsTest({ canvasElement, args }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const value = await canvas.findByTestId('value')
    const emitted = await canvas.findByTestId('emitted')
    const names = args.items.map((item: { name: string }) => item.name)

    // one item on mount, open only in the `not` group
    await sleep()
    expect(element.children).toHaveLength(1)
    expect((element.children[0] as HTMLDetailsElement).open).toBe(!!args.not)

    // the other items arrive after the group has mounted
    expect(await canvas.findByTestId('load')).toBeClicked()
    await sleep()
    const accordions = [...element.children] as HTMLDetailsElement[]
    expect(accordions).toHaveLength(names.length)

    if (args.not) {
        // the one already open stays open, and the model lists the others
        // as closed, emitted once for each change
        expect(accordions.map(accordion => accordion.open)).toEqual(
            names.map((_: string, index: number) => index === 0),
        )
        expect(JSON.parse(value.textContent ?? '')).toEqual(
            names.toSpliced(0, 1),
        )
        expect(JSON.parse(emitted.textContent ?? '')).toEqual([
            names.slice(1, 2),
            names.slice(1),
        ])
    } else {
        // the one named by the model opens, and the model never changes
        expect(accordions.map(accordion => accordion.open)).toEqual(
            names.map((_: string, index: number) => index === 1),
        )
        expect(value.textContent).toBe(names[1])
        expect(JSON.parse(emitted.textContent ?? '')).toEqual([])
    }

    // accessibility
    await expect(element).toHaveNoViolations()
}
