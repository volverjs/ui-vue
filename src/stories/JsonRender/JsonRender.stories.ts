import type { Spec } from '@json-render/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
    ActionProvider,
    Renderer,
    StateProvider,
    VisibilityProvider,
} from '@json-render/vue'
import { registry } from '@/json-render'
import { namedSlotsTest } from './JsonRender.test'

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
