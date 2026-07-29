import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { argTypes, defaultArgs } from './InputText.settings'
import { debouncedTest, syncUpdateTest } from './InputText.test'

const meta: Meta<typeof VvInputText> = {
    title: 'Components/InputText/Debounce',
    component: VvInputText,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

/**
 * Without `debounce` the model is committed synchronously, so a submit handled
 * in the same task as the keystroke reads the value just typed.
 */
export const SyncUpdate: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvInputText },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined, submittedValue: undefined }),
        template: /* html */ `
			<vv-input-text v-bind="args" v-model="inputValue" data-testId="element" />
			<button type="button" @click="submittedValue = inputValue" data-testId="submit">Submit</button>
			<div>Value: <span data-testId="value">{{ inputValue }}</span></div>
			<div>Submitted: <span data-testId="submitted">{{ submittedValue }}</span></div>
		`,
    }),
    play: syncUpdateTest,
}

/**
 * With `debounce` the model waits, but leaving the field or pressing Enter
 * commits it right away instead of dropping it.
 */
export const Debounced: Story = {
    args: {
        ...defaultArgs,
        debounce: 300,
    },
    render: args => ({
        components: { VvInputText },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
			<vv-input-text v-bind="args" v-model="inputValue" data-testId="element" />
			<button data-testId="outside">Outside</button>
			<div>Value: <span data-testId="value">{{ inputValue }}</span></div>
		`,
    }),
    play: debouncedTest,
}
