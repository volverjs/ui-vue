import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvTextarea from '@/components/VvTextarea/VvTextarea.vue'
import { argTypes, defaultArgs } from './Textarea.settings'
import { debouncedTest } from './Textarea.test'

const meta: Meta<typeof VvTextarea> = {
    title: 'Components/Textarea/Debounce',
    component: VvTextarea,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvTextarea>

/**
 * With `debounce` the model waits, but leaving the field commits it right away
 * instead of dropping it, and the suggestions history stores the flushed value.
 */
export const Debounced: Story = {
    args: {
        ...defaultArgs,
        debounce: 300,
        storageKey: 'textarea-debounced-suggestion-example',
        maxSuggestions: 5,
    },
    render: args => ({
        components: { VvTextarea },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
			<vv-textarea v-bind="args" v-model="inputValue" data-testId="element" />
			<button data-testId="outside">Outside</button>
			<div>Value: <span data-testId="value">{{ inputValue }}</span></div>
		`,
    }),
    play: debouncedTest,
}
