import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { argTypes, defaultArgs } from './InputText.settings'
import { Default } from './InputText.stories'
import { suggestionsEscapeTest, suggestionsTabOutTest } from './InputText.test'

const meta: Meta<typeof VvInputText> = {
    title: 'Components/InputText/Suggestions',
    component: VvInputText,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const StorageSuggestions: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'text',
        label: 'Input with Storage Suggestions',
        placeholder: 'Start typing to see stored suggestions',
        storageKey: 'example-input-storage',
        maxSuggestions: 5,
    },
    render: args => ({
        components: { VvInputText },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
            <div class="space-y-md">
                <div>
                    <p class="text-sm text-gray-600 mb-sm">
                        Storage suggestions are saved when you blur the input and can be removed by clicking the trash button in the dropdown.
                    </p>
                    <vv-input-text 
                        v-bind="args" 
                        v-model="inputValue" 
                        data-testId="element"
                    />
                    <div class="mt-sm">Value: <span data-testId="value">{{ inputValue }}</span></div>
                </div>
            </div>
        `,
    }),
}

export const ExternalSuggestions: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'text',
        label: 'Input with External Suggestions',
        placeholder: 'Type to filter suggestions',
        suggestions: ['Apple', 'Apricot', 'Avocado', 'Banana', 'Blueberry'],
    },
    render: args => ({
        components: { VvInputText },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
            <div class="space-y-md">
                <div>
                    <p class="text-sm text-gray-600 mb-sm">
                        External suggestions cannot be removed. They're always available for selection.
                    </p>
                    <vv-input-text 
                        v-bind="args" 
                        v-model="inputValue" 
                        data-testId="element"
                    />
                    <div class="mt-sm">Value: <span data-testId="value">{{ inputValue }}</span></div>
                </div>
            </div>
        `,
    }),
}

/**
 * Escape from a suggestion closes the suggestions, and the field the focus
 * goes back to does not show them again.
 */
export const SuggestionsEscape: Story = {
    ...ExternalSuggestions,
    play: suggestionsEscapeTest,
}

/**
 * `Tab` past the last suggestion closes the suggestions and leaves the focus
 * on the button after the field: they stayed open over it. `Shift+Tab` from
 * the first one back to the field leaves them open, as the field shows them.
 */
export const SuggestionsTabOut: Story = {
    ...ExternalSuggestions,
    render: args => ({
        components: { VvInputText, VvButton },
        setup() {
            return { args, inputValue: ref() }
        },
        template: /* html */ `
            <div style="min-height: 240px">
                <vv-input-text v-bind="args" v-model="inputValue" data-testId="element" />
                <vv-button data-testId="next" label="Next" />
            </div>
        `,
    }),
    play: suggestionsTabOutTest,
}

export const BothSuggestions: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'text',
        label: 'Input with Storage + External Suggestions',
        placeholder: 'Type to see all suggestions',
        storageKey: 'combined-suggestions-example',
        suggestions: ['Apple', 'Apricot', 'Avocado'],
        maxSuggestions: 5,
    },
    render: args => ({
        components: { VvInputText },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
            <div class="space-y-md">
                <div>
                    <p class="text-sm text-gray-600 mb-sm">
                        <strong>External suggestions:</strong> Apple, Apricot, Avocado (cannot be removed)<br/>
                        <strong>Storage suggestions:</strong> Saved values from previous inputs (can be removed with trash button)
                    </p>
                    <vv-input-text 
                        v-bind="args" 
                        v-model="inputValue" 
                        data-testId="element"
                    />
                    <div class="mt-sm">Value: <span data-testId="value">{{ inputValue }}</span></div>
                </div>
            </div>
        `,
    }),
}
