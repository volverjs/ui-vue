import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { argTypes, defaultArgs } from './InputFile.settings'
import { Default as DefaultStory } from './InputFile.stories'
import { selectFromKeyboardTest } from './InputFile.test'

const meta: Meta<typeof VvInputFile> = {
    title: 'Components/InputFile/DropArea',
    component: VvInputFile,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputFile>

export const Default: Story = {
    ...DefaultStory,
    args: {
        ...DefaultStory.args,
        label: 'Drop area',
        dropArea: true,
    },
}

export const InputHidden: Story = {
    ...Default,
    args: {
        ...Default.args,
        label: 'Drop area hidden input',
        dropArea: true,
        modifiers: 'hidden',
    },
}

export const Square: Story = {
    ...Default,
    args: {
        ...Default.args,
        class: 'max-w-192',
        label: 'Drop area square',
        dropArea: true,
        modifiers: 'square hidden',
    },
}

export const Circle: Story = {
    ...Default,
    args: {
        ...Default.args,
        class: 'max-w-192',
        label: 'Drop area circle',
        dropArea: true,
        modifiers: 'circle hidden',
    },
}

/**
 * Two files in a drop area: the one previewed is picked from the list, with the
 * mouse or from the keyboard.
 */
export const SelectFromKeyboard: Story = {
    args: {
        ...defaultArgs,
        label: 'Drop area',
        dropArea: true,
        multiple: true,
    },
    render: args => ({
        components: { VvInputFile },
        setup() {
            const files = ref([
                new File(['first'], 'first.txt', { type: 'text/plain' }),
                new File(['second'], 'second.txt', { type: 'text/plain' }),
            ])
            return { args, files }
        },
        template: /* html */ `
			<vv-input-file v-bind="args" v-model="files" />
		`,
    }),
    play: selectFromKeyboardTest,
}
