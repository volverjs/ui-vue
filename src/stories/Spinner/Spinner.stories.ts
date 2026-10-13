import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvSpinner from '@/components/VvSpinner/VvSpinner.vue'
import { argTypes, defaultArgs } from './Spinner.settings'
import { decorativeTest, defaultTest } from './Spinner.test'

const meta: Meta<typeof VvSpinner> = {
    title: 'Components/Spinner',
    component: VvSpinner,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvSpinner>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvSpinner },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-spinner v-bind="args" data-testId="element" />
		`,
    }),
    play: defaultTest,
}

export const Label: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        label: 'Loading the invoices',
    },
}

/**
 * The spinner takes the size and the colour of the text around it: here a
 * text utility and the graphic role of the brand, which keeps 3:1 with any
 * brand colour.
 */
export const Size: Story = {
    ...Default,
    render: args => ({
        components: { VvSpinner },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-spinner v-bind="args" class="text-24 text-brand-graphic" data-testId="element" />
		`,
    }),
}

/**
 * Inside a button the label already says what is happening, so the spinner
 * is decoration.
 */
export const InButton: Story = {
    args: {
        ...defaultArgs,
        decorative: true,
    },
    render: args => ({
        components: { VvButton, VvSpinner },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-button disabled data-testId="button">
				<vv-spinner v-bind="args" data-testId="element" /> Saving
			</vv-button>
		`,
    }),
    play: decorativeTest,
}
