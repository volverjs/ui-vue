import type { Meta, StoryObj } from '@storybook/vue3'
import VvAccordion from '@/components/VvAccordion/VvAccordion.vue'
import { defaultTest } from './Accordion.test'
import { defaultArgs, argTypes } from './Accordion.settings'

const meta: Meta<typeof VvAccordion> = {
	title: 'Components/Accordion',
	component: VvAccordion,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvAccordion>

export const Default: Story = {
	args: defaultArgs,
	play: defaultTest,
	render: (args) => ({
		components: { VvAccordion },
		setup() {
			const open = ref(false)
			return { args, open }
		},
		template: /* html */ `
			<vv-accordion data-testId="element" v-bind="args" v-model="open">
                <template #summary v-if="args.summary"><div v-html="args.summary"></div></template>
                <template #default v-if="args.default"><div v-html="args.default"></div></template>
            </vv-accordion>
            <div class="mt-24">
                {{ args.not ? 'Closed' : 'Opened'}}: <span data-testId="value">{{ open }}</span>
            </div>
    `,
	}),
}

export const Not: Story = {
	...Default,
	args: {
		...defaultArgs,
		not: true,
	},
}
