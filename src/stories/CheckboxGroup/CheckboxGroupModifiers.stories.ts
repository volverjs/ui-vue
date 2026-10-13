import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvCheckbox from '@/components/VvCheckbox/VvCheckbox.vue'
import VvCheckboxGroup from '@/components/VvCheckboxGroup/VvCheckboxGroup.vue'
import { argTypes } from './CheckboxGroup.settings'
import { cardsTest, segmentedTest } from './CheckboxGroup.test'

const meta: Meta<typeof VvCheckboxGroup> = {
    title: 'Components/CheckboxGroup/Modifiers',
    component: VvCheckboxGroup,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvCheckboxGroup>

/**
 * A segmented control where more than one option can be on: `segmented`
 * draws the track on the group, and `itemModifiers` gives `segment` to every
 * option, the ones drawn from `options` included.
 */
export const Segmented: Story = {
    args: {
        name: 'format',
        label: 'Format',
        modifiers: 'segmented',
        itemModifiers: 'segment',
        options: [
            { value: 'bold', label: 'Bold' },
            { value: 'italic', label: 'Italic' },
            { value: 'underline', label: 'Underline' },
        ],
    },
    render: args => ({
        components: { VvCheckboxGroup },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: ['bold'] }),
        template: /* html */ `
			<vv-checkbox-group v-bind="args" v-model="inputValue" data-testId="element" />
			<div>Value: <span data-testId="value">{{ inputValue.join(',') }}</span></div>
		`,
    }),
    play: segmentedTest,
}

const channels = [
    {
        value: 'email',
        label: 'Email',
        description: 'A summary of the day, every morning.',
    },
    {
        value: 'sms',
        label: 'SMS',
        description: 'A text message for the urgent ones only.',
    },
    {
        value: 'push',
        label: 'Push',
        description: 'A notification on the devices you signed in on.',
    },
]

/**
 * Choice cards: `cards` on the group, `card` on every option through
 * `itemModifiers`, and a title over a description in the slot of each option.
 */
export const Cards: Story = {
    args: {
        name: 'channels',
        label: 'Channels',
        modifiers: 'cards',
        itemModifiers: 'card',
    },
    render: args => ({
        components: { VvCheckboxGroup, VvCheckbox },
        setup() {
            return { args, channels }
        },
        data: () => ({ inputValue: ['email'] }),
        template: /* html */ `
			<vv-checkbox-group v-bind="args" v-model="inputValue" data-testId="element">
				<vv-checkbox v-for="channel in channels" :key="channel.value" :name="args.name" :value="channel.value">
					<strong class="block text-word-1 font-semibold">{{ channel.label }}</strong>
					<span class="text-14 text-word-3">{{ channel.description }}</span>
				</vv-checkbox>
			</vv-checkbox-group>
			<div>Value: <span data-testId="value">{{ inputValue.join(',') }}</span></div>
		`,
    }),
    play: cardsTest,
}
