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

const namedSlotsSpec: Spec = {
    root: 'card',
    elements: {
        card: {
            type: 'Card',
            props: { title: 'Invoice' },
            children: ['accordion', 'alert'],
            slots: { footer: ['download'] },
        },
        alert: {
            type: 'Alert',
            props: { title: 'Heads up' },
            children: [],
            slots: { footer: ['retry'] },
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

/**
 * A spec that fills the named slots the catalog declares, `footer` on the card
 * and on the alert and `summary` on the accordion, rendered through the Volver
 * registry.
 */
export const NamedSlots: Story = {
    render: () => ({
        components: {
            ActionProvider,
            Renderer,
            StateProvider,
            VisibilityProvider,
        },
        setup() {
            return { spec: namedSlotsSpec, registry }
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
    }),
    play: namedSlotsTest,
}
