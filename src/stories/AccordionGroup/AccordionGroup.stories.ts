import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvAccordion from '@/components/VvAccordion/VvAccordion.vue'
import VvAccordionGroup from '@/components/VvAccordionGroup/VvAccordionGroup.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { argTypes, defaultArgs } from './AccordionGroup.settings'
import {
    defaultTest,
    externalModelTest,
    lateItemsTest,
    notModelMountTest,
    notRemountTest,
    renameTest,
    swapNamesTest,
} from './AccordionGroup.test'

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

export const NotModel: Story = {
    args: {
        ...defaultArgs,
        not: true,
    },
    play: async (context) => {
        await notModelMountTest(context)
        await defaultTest(context)
    },
    render: args => ({
        components: { VvAccordionGroup },
        setup() {
            const selected = ref<string[]>([])
            const emitted = ref<unknown[]>([])
            return { args, selected, emitted }
        },
        template: /* html */ `
		<vv-accordion-group data-testId="element" v-bind="args" v-model="selected" @update:model-value="emitted.push($event)" />
		<div class="mt-24">
			Closed: <span data-testId="value">{{ selected }}</span>
		</div>
		<div>
			update:modelValue: <span data-testId="emitted">{{ JSON.stringify(emitted) }}</span>
		</div>
	`,
    }),
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
            const selected = ref<string | string[]>(args.not ? [] : 'a-2')
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

export const ExternalModel: Story = {
    args: defaultArgs,
    play: externalModelTest,
    render: args => ({
        components: { VvAccordionGroup, VvButton },
        setup() {
            const names = ['a-1', 'a-2', 'a-3']
            const selected = ref<string | string[]>(
                args.not ? names.slice(1) : names[0],
            )
            const emitted = ref<unknown[]>([])
            function openLast() {
                selected.value = args.not ? names.slice(0, -1) : names[2]
            }
            return { args, selected, emitted, openLast }
        },
        template: /* html */ `
		<vv-accordion-group data-testId="element" v-bind="args" v-model="selected" @update:model-value="emitted.push($event)" />
		<vv-button data-testId="change" class="mt-24" label="Open the last one from outside" modifiers="secondary" @click="openLast" />
		<div class="mt-24">
			{{ args.not ? 'Closed' : 'Opened'}}: <span data-testId="value">{{ selected }}</span>
		</div>
		<div>
			update:modelValue: <span data-testId="emitted">{{ JSON.stringify(emitted) }}</span>
		</div>
	`,
    }),
}

export const ExternalModelNot: Story = {
    ...ExternalModel,
    args: {
        ...defaultArgs,
        not: true,
    },
}

export const NotCollapseRemount: Story = {
    args: {
        ...defaultArgs,
        collapse: true,
        not: true,
    },
    play: notRemountTest,
    render: args => ({
        components: { VvAccordion, VvAccordionGroup, VvButton },
        setup() {
            const shown = ref(['a-1', 'a-2'])
            const selected = ref<string[]>(['a-2'])
            const emitted = ref<unknown[]>([])
            return { args, shown, selected, emitted }
        },
        template: /* html */ `
		<vv-accordion-group data-testId="element" v-bind="args" v-model="selected" @update:model-value="emitted.push($event)">
			<vv-accordion v-for="name in shown" :key="name" :name="name" :title="name" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
		</vv-accordion-group>
		<div class="flex gap-md mt-24">
			<vv-button data-testId="remove" label="Remove a-2" modifiers="secondary" :disabled="!shown.includes('a-2')" @click="shown = shown.filter(name => name !== 'a-2')" />
			<vv-button data-testId="add" label="Add a-3" modifiers="secondary" :disabled="shown.includes('a-3')" @click="shown = [...shown, 'a-3']" />
			<vv-button data-testId="restore" label="Put a-2 back" modifiers="secondary" :disabled="shown.includes('a-2')" @click="shown = [...shown, 'a-2']" />
		</div>
		<div class="mt-24">
			Closed: <span data-testId="value">{{ selected }}</span>
		</div>
		<div>
			update:modelValue: <span data-testId="emitted">{{ JSON.stringify(emitted) }}</span>
		</div>
	`,
    }),
}

export const SwapNames: Story = {
    args: {
        ...defaultArgs,
        collapse: true,
    },
    play: swapNamesTest,
    render: args => ({
        components: { VvAccordion, VvAccordionGroup, VvButton },
        setup() {
            const names = ref(['a-1', 'a-2'])
            const group = ref()
            return { args, names, group }
        },
        template: /* html */ `
		<vv-accordion-group ref="group" data-testId="element" v-bind="args">
			<vv-accordion v-for="(name, index) in names" :key="index" :name="name" :title="name" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
		</vv-accordion-group>
		<div class="flex gap-md mt-24">
			<vv-button data-testId="swap" label="Swap the names" modifiers="secondary" @click="names = [...names].reverse()" />
			<vv-button data-testId="expand" label="Expand all" modifiers="secondary" @click="group.expand()" />
		</div>
	`,
    }),
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
