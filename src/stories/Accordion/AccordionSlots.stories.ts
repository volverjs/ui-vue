import type { Meta, StoryObj } from '@storybook/vue3'
import { Default as AccordionDefault } from './Accordion.stories'
import { defaultArgs } from './Accordion.settings'
import VvAccordion from '@/components/VvAccordion/VvAccordion.vue'

const meta: Meta<typeof VvAccordion> = {
    title: 'Components/Accordion/Slots',
    component: VvAccordion,
}

export default meta

type Story = StoryObj<typeof VvAccordion>

export const Default: Story = {
    ...AccordionDefault,
    args: {
        ...defaultArgs,
        default: `<strong data-testId="slot" class="font-bold text-brand-darken-1">Custom Details</strong>`,
    },
}

export const Summary: Story = {
    ...AccordionDefault,
    args: {
        ...defaultArgs,
        summary: `<strong data-testId="slot" class="font-bold text-brand-darken-1">Custom Summary</strong>`,
    },
}
