import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { argTypes, defaultArgs } from './InputFile.settings'
import { Default as DefaultStory } from './InputFile.stories'

const meta: Meta<typeof VvInputFile> = {
    title: 'Components/InputFile/Slots',
    component: VvInputFile,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputFile>

export const DropArea: Story = {
    ...DefaultStory,
    args: {
        ...DefaultStory.args,
        class: 'max-w-320',
        dropArea: true,
        // @ts-expect-error - dropAreaSlot is a Storybook control for slot content
        dropAreaSlot: 'Drag one or more files to this drop zone.',
    },
}

export const Hint: Story = {
    ...DefaultStory,
    args: {
        ...DefaultStory.args,
        hint: 'Hint <em class="italic">slot!</em>',
    },
}
