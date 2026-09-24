import type { Spec } from '@json-render/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
    ActionProvider,
    Renderer,
    StateProvider,
    VisibilityProvider,
} from '@json-render/vue'
import { registry } from '@/json-render'
import {
    dialogWithoutTitleTest,
    fieldsWithoutLabelTest,
    iconOnlyButtonTest,
    namedSlotsTest,
} from './JsonRender.test'

const meta: Meta = {
    title: 'JsonRender/Registry',
}

export default meta

type Story = StoryObj

// the schema asks for `children` on every element, but a spec may leave it out
const bareAlert = {
    type: 'Alert',
    props: { title: 'Bare' },
} as unknown as Spec['elements'][string]

const namedSlotsSpec: Spec = {
    root: 'card',
    elements: {
        card: {
            type: 'Card',
            props: { title: 'Invoice' },
            children: ['accordion', 'alert', 'plain', 'bare'],
            slots: { header: ['heading'], footer: ['download'] },
        },
        heading: {
            type: 'Badge',
            props: { value: 'Invoice 42' },
            children: [],
        },
        bare: bareAlert,
        alert: {
            type: 'Alert',
            props: { title: 'Heads up' },
            children: [],
            // `header` is not a slot the catalog declares for an alert
            slots: { footer: ['retry'], header: ['stray'] },
        },
        stray: {
            type: 'Badge',
            props: { value: 'Stray header' },
            children: [],
        },
        plain: {
            type: 'Card',
            props: { title: 'Plain' },
            children: [],
            slots: { footer: [] },
        },
        retry: {
            type: 'Button',
            props: { label: 'Retry' },
            children: [],
        },
        accordion: {
            type: 'Accordion',
            props: { title: 'Details', content: 'Lorem ipsum dolor sit amet.' },
            children: [],
            slots: { summary: ['summary'] },
        },
        summary: {
            type: 'Badge',
            props: { value: 'Custom summary' },
            children: [],
        },
        download: {
            type: 'Button',
            props: { label: 'Download' },
            children: [],
        },
    },
}

function renderSpec(spec: Spec) {
    return () => ({
        components: {
            ActionProvider,
            Renderer,
            StateProvider,
            VisibilityProvider,
        },
        setup() {
            return { spec, registry }
        },
        template: /* html */ `
			<div data-testId="element">
				<StateProvider :initial-state="{}">
					<VisibilityProvider>
						<ActionProvider :handlers="{}">
							<Renderer :spec="spec" :registry="registry" />
						</ActionProvider>
					</VisibilityProvider>
				</StateProvider>
			</div>
		`,
    })
}

/**
 * A spec that fills the named slots the catalog declares, `footer` on the card
 * and on the alert and `summary` on the accordion, rendered through the Volver
 * registry.
 */
export const NamedSlots: Story = {
    render: renderSpec(namedSlotsSpec),
    play: namedSlotsTest,
}

/**
 * A button with an icon and no label, named for assistive technologies by its
 * `ariaLabel`.
 */
export const IconOnlyButton: Story = {
    render: renderSpec({
        root: 'button',
        elements: {
            button: {
                type: 'Button',
                props: { icon: 'add', ariaLabel: 'Add an item' },
                children: [],
            },
        },
    }),
    play: iconOnlyButtonTest,
}

// every form field of the catalog, none of them with a label
const fieldsWithoutLabelSpec: Spec = {
    root: 'card',
    elements: {
        card: {
            type: 'Card',
            props: { title: 'Filters' },
            children: ['search', 'notes', 'country', 'ward', 'terms', 'plan', 'channels', 'size', 'volume', 'invoice'],
        },
        search: {
            type: 'InputText',
            props: { name: 'search', ariaLabel: 'Search the catalog', placeholder: 'Search' },
            children: [],
        },
        notes: {
            type: 'Textarea',
            props: { name: 'notes', ariaLabel: 'Notes' },
            children: [],
        },
        country: {
            type: 'Select',
            props: { name: 'country', ariaLabel: 'Country', options: [{ label: 'Italy', value: 'it' }] },
            children: [],
        },
        ward: {
            type: 'Combobox',
            props: { name: 'ward', ariaLabel: 'Ward', options: [{ label: 'Cardiology', value: 'cardiology' }] },
            children: [],
        },
        terms: {
            type: 'Checkbox',
            props: { name: 'terms', ariaLabel: 'Accept the terms', value: true },
            children: [],
        },
        plan: {
            type: 'Radio',
            props: { name: 'plan', ariaLabel: 'Pro plan', value: 'pro' },
            children: [],
        },
        channels: {
            type: 'CheckboxGroup',
            props: { name: 'channels', ariaLabel: 'Channels', options: [{ label: 'Email', value: 'email' }] },
            children: [],
        },
        size: {
            type: 'RadioGroup',
            props: { name: 'size', ariaLabel: 'Size', options: [{ label: 'Small', value: 's' }] },
            children: [],
        },
        volume: {
            type: 'InputRange',
            props: { name: 'volume', ariaLabel: 'Volume', min: 0, max: 10 },
            children: [],
        },
        invoice: {
            type: 'InputFile',
            props: { name: 'invoice', ariaLabel: 'Invoice' },
            children: [],
        },
    },
}

/**
 * Every form field of the catalog drawn without a label, each named by its
 * `ariaLabel` alone.
 */
export const FieldsWithoutLabel: Story = {
    render: renderSpec(fieldsWithoutLabelSpec),
    play: fieldsWithoutLabelTest,
}

/**
 * A dialog with no title, named by its `ariaLabel`.
 */
export const DialogWithoutTitle: Story = {
    render: renderSpec({
        root: 'dialog',
        elements: {
            dialog: {
                type: 'Dialog',
                props: { ariaLabel: 'Confirm the order' },
                children: ['text'],
            },
            text: {
                type: 'Badge',
                props: { value: 'Two items, 42 euros' },
                children: [],
            },
        },
    }),
    play: dialogWithoutTitleTest,
}
