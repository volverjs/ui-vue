import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvSelect from '@/components/VvSelect/VvSelect.vue'
import { argTypes, defaultArgs } from './Select.settings'
import { ariaDescribedbyTest, ariaLabelTest, defaultTest } from './Select.test'

const meta: Meta<typeof VvSelect> = {
    title: 'Components/Select',
    // @ts-expect-error missing generic components support
    component: VvSelect,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvSelect>

function createRender(args: any) {
    return {
        components: { VvSelect },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: args.multiple ? [] : undefined }),
        template: /* html */ `
        <vv-select v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
            <template #before v-if="args.before"><div class="flex" v-html="args.before"></div></template>
            <template #after v-if="args.after"><div class="flex" v-html="args.after"></div></template>
            <template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
        </vv-select>
        <div>Value: <span data-testId="value">{{inputValue}}</span></div> 
    `,
    }
}

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: createRender,
    play: defaultTest,
}

export const Disabled: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        disabled: true,
    },
}

export const Readonly: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        readonly: true,
    },
}

export const Multiple: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        multiple: true,
    },
}

export const Unselectable: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        unselectable: true,
    },
}

export const Valid: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        valid: true,
        validLabel: 'Selected response is valid.',
    },
}

export const Invalid: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        invalid: true,
        invalidLabel: 'Selected response is invalid.',
    },
}

export const Hint: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        hintLabel: 'Please fill the input above.',
    },
}

export const Loading: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        loading: true,
        loadingLabel: 'Loading...',
    },
}

export const Floating: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        floating: true,
    },
}

export const AutoselectFirst: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        autoselectFirst: true,
    },
}

/**
 * A select with no visible label, named by `aria-label` instead. `label` is
 * optional, so this is a shape the other stories never draw: the attribute is
 * written in kebab-case at the call site, as it is on `VvInputRange`, and
 * reaches the <select> because the component declares it as a prop.
 */
export const AriaLabel: Story = {
    args: {
        ...defaultArgs,
        label: undefined,
    },
    render: args => ({
        components: { VvSelect },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
        <vv-select v-bind="args" v-model="inputValue" aria-label="Reparto" data-testId="element" />
        <div>Value: <span data-testId="value">{{inputValue}}</span></div>
    `,
    }),
    play: ariaLabelTest,
}

/**
 * Help text the page already draws, pointed at from the field. The one of the
 * three aria props that does not override: the field's own `hintLabel` is
 * appended to the caller's ids rather than replacing them, because
 * `aria-describedby` takes a list.
 */
export const AriaDescribedby: Story = {
    args: {
        ...defaultArgs,
        hintLabel: 'Pick the ward you were referred to.',
    },
    render: args => ({
        components: { VvSelect },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
        <div>
            <span id="extra-help">Ask at the desk if the ward is not listed.</span>
            <vv-select v-bind="args" v-model="inputValue" aria-describedby="extra-help" data-testId="element" />
        </div>
        <div>Value: <span data-testId="value">{{inputValue}}</span></div>
    `,
    }),
    play: ariaDescribedbyTest,
}
