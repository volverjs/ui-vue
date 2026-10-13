import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvRadio from '@/components/VvRadio/VvRadio.vue'
import VvRadioGroup from '@/components/VvRadioGroup/VvRadioGroup.vue'
import { argTypes } from './RadioGroup.settings'
import { cardsTest, segmentedTest } from './RadioGroup.test'

const meta: Meta<typeof VvRadioGroup> = {
    title: 'Components/RadioGroup/Modifiers',
    component: VvRadioGroup,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvRadioGroup>

/**
 * A segmented control: `segmented` draws the track on the group, and
 * `itemModifiers` gives `segment` to every option, the ones drawn from
 * `options` included.
 */
export const Segmented: Story = {
    args: {
        name: 'view',
        label: 'View',
        modifiers: 'segmented',
        itemModifiers: 'segment',
        options: [
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
        ],
    },
    render: args => ({
        components: { VvRadioGroup },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: 'day' }),
        template: /* html */ `
			<vv-radio-group v-bind="args" v-model="inputValue" data-testId="element" />
			<div>Value: <span data-testId="value">{{ inputValue }}</span></div>
		`,
    }),
    play: segmentedTest,
}

const plans = [
    {
        value: 'starter',
        label: 'Starter',
        description: 'Up to three agents, community support.',
    },
    {
        value: 'team',
        label: 'Team',
        description: 'Unlimited agents and shared knowledge bases.',
    },
    {
        value: 'enterprise',
        label: 'Enterprise',
        description: 'Single sign-on, audit log, a dedicated contact.',
    },
]

/**
 * Choice cards: `cards` on the group, `card` on every option through
 * `itemModifiers`, and a title over a description in the slot of each option.
 */
export const Cards: Story = {
    args: {
        name: 'plan',
        label: 'Plan',
        modifiers: 'cards',
        itemModifiers: 'card',
    },
    render: args => ({
        components: { VvRadioGroup, VvRadio },
        setup() {
            return { args, plans }
        },
        data: () => ({ inputValue: 'starter' }),
        template: /* html */ `
			<vv-radio-group v-bind="args" v-model="inputValue" data-testId="element">
				<vv-radio v-for="plan in plans" :key="plan.value" :name="args.name" :value="plan.value">
					<strong class="block text-word-1 font-semibold">{{ plan.label }}</strong>
					<span class="text-14 text-word-3">{{ plan.description }}</span>
				</vv-radio>
			</vv-radio-group>
			<div>Value: <span data-testId="value">{{ inputValue }}</span></div>
		`,
    }),
    play: cardsTest,
}
