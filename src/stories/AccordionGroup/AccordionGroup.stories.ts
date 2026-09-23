import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvAccordion from '@/components/VvAccordion/VvAccordion.vue'
import VvAccordionGroup from '@/components/VvAccordionGroup/VvAccordionGroup.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { argTypes, defaultArgs } from './AccordionGroup.settings'
import { defaultTest, lateItemsTest, renameTest } from './AccordionGroup.test'

const meta: Meta<typeof VvAccordionGroup> = {
    title: 'Components/AccordionGroup',
    component: VvAccordionGroup,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

export type Story = StoryObj<typeof VvAccordionGroup>

export const Default: Story = {
    args: defaultArgs,
    play: defaultTest,
    render: (args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { VvAccordionGroup },
        setup() {
            return { args }
        },
        data() {
            return {
                selected: null,
            }
        },
        template: /* html */ `
		<vv-accordion-group data-testId="element" v-bind="args" v-model="selected" />
		<div class="mt-24">
			{{ args.not ? 'Closed' : 'Opened'}}: <span data-testId="value">{{ selected }}</span>
		</div>
	`,
    }),
}

export const Not: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        not: true,
    },
}

export const Collapse: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        collapse: true,
    },
}

export const CollapseNot: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        collapse: true,
        not: true,
    },
}

export const LateItems: Story = {
    args: defaultArgs,
    play: lateItemsTest,
    render: args => ({
        components: { VvAccordionGroup, VvButton },
        setup() {
            const items = ref<typeof args.items>(args.items?.slice(0, 1))
            const selected = ref(args.not ? undefined : 'a-2')
            const emitted = ref<unknown[]>([])
            return { args, items, selected, emitted }
        },
        template: /* html */ `
		<vv-accordion-group data-testId="element" v-bind="args" :items="items" v-model="selected" @update:model-value="emitted.push($event)" />
		<vv-button data-testId="load" class="mt-24" label="Load the other items" modifiers="secondary" :disabled="items.length > 1" @click="items = args.items" />
		<div class="mt-24">
			{{ args.not ? 'Closed' : 'Opened'}}: <span data-testId="value">{{ selected }}</span>
		</div>
		<div>
			update:modelValue: <span data-testId="emitted">{{ JSON.stringify(emitted) }}</span>
		</div>
	`,
    }),
}

export const LateItemsNot: Story = {
    ...LateItems,
    args: {
        ...defaultArgs,
        not: true,
    },
}

export const Rename: Story = {
    args: defaultArgs,
    play: renameTest,
    render: () => ({
        components: { VvAccordion, VvAccordionGroup, VvButton },
        setup() {
            const name = ref('a-1')
            const selected = ref('a-1')
            const emitted = ref<unknown[]>([])
            return { name, selected, emitted }
        },
        template: /* html */ `
		<vv-accordion-group data-testId="element" v-model="selected" @update:model-value="emitted.push($event)">
			<vv-accordion :name="name" :title="name" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
		</vv-accordion-group>
		<vv-button data-testId="rename" class="mt-24" :label="name === 'a-1' ? 'Rename to b-1' : 'Rename to a-1'" modifiers="secondary" @click="name = name === 'a-1' ? 'b-1' : 'a-1'" />
		<div class="mt-24">
			Opened: <span data-testId="value">{{ selected }}</span>
		</div>
		<div>
			update:modelValue: <span data-testId="emitted">{{ JSON.stringify(emitted) }}</span>
		</div>
	`,
    }),
}
