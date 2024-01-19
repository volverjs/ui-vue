import VvAccordionGroup from '@/components/VvAccordionGroup/VvAccordionGroup.vue'
import VvAccordion from '@/components/VvAccordion/VvAccordion.vue'
import { defaultTest } from './AccordionGroup.test'
import { defaultArgs, argTypes } from './AccordionGroup.settings'
import meta, { type Story } from './AccordionGroup.stories'

export default {
	...meta,
	title: 'Components/AccordionGroup/Slots',
}

export const Default: Story = {
	args: defaultArgs,
	argTypes: {
		...argTypes,
		items: {
			control: {
				disable: true,
			},
		},
		default: {
			...argTypes.default,
			control: {
				disable: true,
			},
		},
	},
	play: defaultTest,
	render: (args) => ({
		props: Object.keys(argTypes),
		components: { VvAccordionGroup, VvAccordion },
		setup() {
			return { args }
		},
		data() {
			return {
				selected: '',
				content:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.',
			}
		},
		template: /*html*/ `
			<vv-accordion-group data-testId="element" v-bind="args" v-model="selected">
				<vv-accordion name="a-1" data-testId="a-1" title="Details 1" :content="content" />
				<vv-accordion name="a-2" title="Details 2" :content="content" />
				<vv-accordion name="a-3" title="Details 3" :content="content" />
			</vv-accordion-group>
			<div class="mt-24"  >
				{{ args.not ? 'Closed' : 'Opened'}}: <span data-testId="value">{{ selected }}</span>
			</div>
		`,
	}),
}
