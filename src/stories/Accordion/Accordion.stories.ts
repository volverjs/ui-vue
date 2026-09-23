import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvAccordion from '@/components/VvAccordion/VvAccordion.vue'
import VvAccordionGroup from '@/components/VvAccordionGroup/VvAccordionGroup.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { argTypes, defaultArgs } from './Accordion.settings'
import {
    defaultTest,
    nameClearedTest,
    notInGroupTest,
    notWithoutModelTest,
} from './Accordion.test'

const meta: Meta<typeof VvAccordion> = {
    title: 'Components/Accordion',
    component: VvAccordion,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvAccordion>

export const Default: Story = {
    args: defaultArgs,
    play: defaultTest,
    render: args => ({
        components: { VvAccordion },
        setup() {
            const open = ref(false)
            return { args, open }
        },
        template: /* html */ `
			<vv-accordion data-testId="element" v-bind="args" v-model="open">
                <template #summary v-if="args.summary"><div v-html="args.summary"></div></template>
                <template #default v-if="args.default"><div v-html="args.default"></div></template>
            </vv-accordion>
            <div class="mt-24">
                {{ args.not ? 'Closed' : 'Opened'}}: <span data-testId="value">{{ open }}</span>
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

export const NotWithoutModel: Story = {
    args: {
        ...defaultArgs,
        not: true,
    },
    play: notWithoutModelTest,
    render: args => ({
        components: { VvAccordion },
        setup() {
            const emitted = ref<unknown[]>([])
            return { args, emitted }
        },
        template: /* html */ `
            <vv-accordion data-testId="element" v-bind="args" @update:model-value="emitted.push($event)" />
            <div class="mt-24">
                update:modelValue: <span data-testId="emitted">{{ JSON.stringify(emitted) }}</span>
            </div>
    `,
    }),
}

export const NameCleared: Story = {
    args: defaultArgs,
    play: nameClearedTest,
    render: args => ({
        components: { VvAccordion, VvButton },
        setup() {
            const name = ref('a-1')
            return { args, name }
        },
        template: /* html */ `
            <vv-accordion data-testId="element" v-bind="args" :name="name" />
            <vv-button data-testId="clear" class="mt-24" label="Clear the name" modifiers="secondary" :disabled="!name" @click="name = ''" />
    `,
    }),
}

export const NotInGroup: Story = {
    args: {
        ...defaultArgs,
        not: true,
    },
    play: notInGroupTest,
    render: args => ({
        components: { VvAccordion, VvAccordionGroup, VvButton },
        setup() {
            const added = ref(false)
            const emitted = ref(0)
            return { args, added, emitted }
        },
        template: /* html */ `
            <vv-accordion-group data-testId="element">
                <vv-accordion name="first" data-testId="first" v-bind="args" @update:model-value="emitted++" />
                <vv-accordion v-if="added" name="second" data-testId="second" v-bind="args" @update:model-value="emitted++" />
            </vv-accordion-group>
            <vv-button data-testId="add" class="mt-24" label="Add an accordion" modifiers="secondary" :disabled="added" @click="added = true" />
            <div class="mt-24">
                update:modelValue: <span data-testId="emitted">{{ emitted }}</span>
            </div>
    `,
    }),
}
