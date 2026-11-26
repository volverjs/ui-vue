import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { provide, ref } from 'vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { INJECTION_KEY_VOLVER } from '@/constants'
import { Volver } from '@/Volver'
import { argTypes, defaultArgs } from './InputText.settings'
import { Default } from './InputText.stories'
import {
    forcedSuggestionsTest,
    noStorageKeyTest,
    storageKeyChangeTest,
    suggestionsEscapeTest,
    suggestionsTabOutTest,
} from './InputText.test'

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
 * the first one back to the field closes them, as `Esc` does.
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

/**
 * Without a storage key a field keeps no history of what was typed in it, as
 * with an empty `storageKey`.
 */
export const NoStorageKey: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'text',
        label: 'Input without storage key',
    },
    render: args => ({
        components: { VvInputText, VvButton },
        setup() {
            return { args, inputValue: ref() }
        },
        template: /* html */ `
            <div style="min-height: 240px">
                <vv-input-text v-bind="args" v-model="inputValue" data-testId="element" />
                <vv-button data-testId="outside" label="Outside" />
            </div>
        `,
    }),
    play: noStorageKeyTest,
}

export const EmptyStorageKey: Story = {
    ...NoStorageKey,
    args: {
        ...NoStorageKey.args,
        label: 'Input with an empty storage key',
        storageKey: '',
    },
}

/**
 * With `experimentalFeatures.forceInputSuggestions` every text field keeps a
 * history under its `name`; a password or a date field does not, nor a text
 * field with an empty `storageKey`.
 */
export const ForcedSuggestions: Story = {
    ...Default,
    render: () => ({
        components: { VvInputText, VvButton },
        setup() {
            provide(
                INJECTION_KEY_VOLVER,
                new Volver({
                    experimentalFeatures: { forceInputSuggestions: true },
                }),
            )
            return { text: ref(), password: ref(), date: ref(), optOut: ref() }
        },
        template: /* html */ `
            <div style="min-height: 240px">
                <vv-input-text v-model="text" type="text" name="forced-text" label="Text" data-testId="forced-text" />
                <vv-input-text v-model="password" type="password" name="forced-password" label="Password" data-testId="forced-password" />
                <vv-input-text v-model="date" type="date" name="forced-date" label="Date" data-testId="forced-date" />
                <vv-input-text v-model="optOut" type="text" name="forced-opt-out" storage-key="" label="Text without history" data-testId="forced-opt-out" />
                <vv-button data-testId="outside" label="Outside" />
            </div>
        `,
    }),
    play: forcedSuggestionsTest,
}

/**
 * The storage key changes while the field is mounted: the new key starts from
 * the history of the previous one, and the previous item stays as it was.
 */
export const StorageKeyChange: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'text',
        label: 'Input with a storage key that changes',
    },
    render: args => ({
        components: { VvInputText, VvButton },
        setup() {
            const storageKey = ref('storage-key-first')
            function toggle() {
                storageKey.value = storageKey.value === 'storage-key-first'
                    ? 'storage-key-second'
                    : 'storage-key-first'
            }
            return { args, inputValue: ref(), storageKey, toggle }
        },
        template: /* html */ `
            <div style="min-height: 240px">
                <vv-input-text v-bind="args" v-model="inputValue" :storage-key="storageKey" data-testId="element" />
                <vv-button data-testId="toggle" :label="storageKey" @click="toggle" />
                <vv-button data-testId="outside" label="Outside" />
            </div>
        `,
    }),
    play: storageKeyChangeTest,
}
