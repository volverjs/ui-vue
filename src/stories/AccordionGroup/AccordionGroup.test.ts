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

export async function externalModelTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const emitted = await canvas.findByTestId('emitted')
    const accordions = [...element.children] as HTMLDetailsElement[]
    const last = accordions.length - 1

    // the model opens the first accordion on mount
    await sleep()
    expect(accordions.map(accordion => accordion.open)).toEqual(
        accordions.map((_, index) => index === 0),
    )

    // the parent changes the model to open the last one
    expect(await canvas.findByTestId('change')).toBeClicked()
    await sleep()
    expect(accordions.map(accordion => accordion.open)).toEqual(
        accordions.map((_, index) => index === last),
    )

    // the model came from the parent, so the group has nothing to emit
    expect(JSON.parse(emitted.textContent ?? '')).toEqual([])

    // accessibility
    await expect(element).toHaveNoViolations()
}

export async function sortedModelTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const emitted = await canvas.findByTestId('emitted')

    // the group lists the names in another order than the parent keeps them,
    // which is not a change, so the two do not answer each other for ever
    await sleep(1000)
    expect(JSON.parse(emitted.textContent ?? '')).toEqual([])

    // a real change is still emitted, once
    expect(element.querySelector('[id="a-1"] summary')).toBeClicked()
    await sleep(1000)
    expect(JSON.parse(emitted.textContent ?? '')).toEqual([['a-2']])
}

export async function notModelMountTest({
    canvasElement,
    args,
}: PlayAttributes) {
    const emitted = await within(canvasElement).findByTestId('emitted')
    const names = args.items.map((item: { name: string }) => item.name)

    // the first accordion wins, and the parent hears the result once
    await sleep()
    expect(JSON.parse(emitted.textContent ?? '')).toEqual([names.slice(1)])
}

export async function notRemountTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const value = await canvas.findByTestId('value')
    const emitted = await canvas.findByTestId('emitted')
    const accordion = (name: string) =>
        element.querySelector(`[id="${name}"]`) as HTMLDetailsElement | null

    // the model lists a-2 as closed
    await sleep()
    expect(accordion('a-1')?.open).toBe(true)
    expect(accordion('a-2')?.open).toBe(false)

    // a-2 leaves, and a-3 arrives open while it is away
    expect(await canvas.findByTestId('remove')).toBeClicked()
    await sleep()
    expect(accordion('a-2')).toBeNull()
    expect(await canvas.findByTestId('add')).toBeClicked()
    await sleep()
    expect(accordion('a-3')?.open).toBe(true)

    // a-2 comes back closed, as the model still says
    expect(await canvas.findByTestId('restore')).toBeClicked()
    await sleep()
    expect(accordion('a-2')?.open).toBe(false)
    expect(JSON.parse(value.textContent ?? '')).toEqual(['a-2'])
    expect(JSON.parse(emitted.textContent ?? '')).toEqual([])

    // accessibility
    await expect(element).toHaveNoViolations()
}

export async function swapNamesTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const accordions = [...element.children] as HTMLDetailsElement[]

    // two accordions swap their names in the same update
    await sleep()
    expect(accordions.map(accordion => accordion.id)).toEqual(['a-1', 'a-2'])
    expect(await canvas.findByTestId('swap')).toBeClicked()
    await sleep()
    expect(accordions.map(accordion => accordion.id)).toEqual(['a-2', 'a-1'])

    // the group still knows both, so expanding all opens both
    expect(await canvas.findByTestId('expand')).toBeClicked()
    await sleep()
    expect(accordions.map(accordion => accordion.open)).toEqual([true, true])

    // accessibility
    await expect(element).toHaveNoViolations()
}

export async function renameTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const rename = await canvas.findByTestId('rename')
    const value = await canvas.findByTestId('value')
    const emitted = await canvas.findByTestId('emitted')
    const accordion = element.children[0] as HTMLDetailsElement

    // the model names the accordion, which opens on mount
    await sleep()
    expect(accordion.open).toBe(true)

    // renamed, it takes the state the model gives its new name
    expect(rename).toBeClicked()
    await sleep()
    expect(accordion.open).toBe(false)

    // and back
    expect(rename).toBeClicked()
    await sleep()
    expect(accordion.open).toBe(true)

    // the model never changed, so nothing was emitted
    expect(value.textContent).toBe('a-1')
    expect(JSON.parse(emitted.textContent ?? '')).toEqual([])

    // accessibility
    await expect(element).toHaveNoViolations()
}
