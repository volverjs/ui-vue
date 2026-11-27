import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VvSelect from '@/components/VvSelect/VvSelect.vue'
import { argTypes, defaultArgs } from './Select.settings'
import { Default } from './Select.stories'
import { beforeSelectTest } from './Select.test'

const meta: Meta<typeof VvSelect> = {
    title: 'Components/Select/Slots',
    // @ts-expect-error missing generic components support
    component: VvSelect,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvSelect>

export const Before: Story = {
    ...Default,
    args: {
        ...Default.args,
        before: '<div class="vv-badge vv-badge--sm uppercase">Before</div>',
    },
}

/**
 * A disabled native select in the `before` slot, such as the country of the
 * regions the field lists. The field is not dimmed, and the select keeps its
 * own height: up to `@volverjs/style` 0.1.34 a select anywhere in the field
 * took the paddings and the height of its control, and a disabled one dimmed
 * the whole field.
 */
export const BeforeSelect: Story = {
    args: {
        ...defaultArgs,
        label: 'Region',
        placeholder: 'Select a region',
        options: ['Lombardy', 'Piedmont', 'Veneto'],
    },
    render: args => ({
        components: { VvSelect },
        setup() {
            return { args, inputValue: ref() }
        },
        template: /* html */ `
            <vv-select v-bind="args" v-model="inputValue" data-testId="element">
                <template #before>
                    <select aria-label="Country" data-testId="country" disabled>
                        <option>Italy</option>
                    </select>
                </template>
            </vv-select>
        `,
    }),
    play: beforeSelectTest,
}

export const After: Story = {
    ...Default,
    args: {
        ...Default.args,
        after: '<div class="vv-badge vv-badge--sm uppercase">After</div>',
    },
}

export const Hint: Story = {
    ...Default,
    args: {
        ...Default.args,
        hint: 'Hint <em class="italic">slot!</em>',
    },
}
