import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvDropdownAction from '@/components/VvDropdown/VvDropdownAction.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { defaultTest } from './Dropdown.test'
import { defaultArgs, argTypes } from './Dropdown.settings'

const meta: Meta<typeof VvDropdown> = {
	title: 'Components/Dropdown/Multilevel',
	component: VvDropdown,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvDropdown>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvDropdown, VvDropdownAction, VvIcon, VvButton },
		setup() {
			const expanded = ref(false)
			return { expanded, args }
		},
		template: /* html */ `
            <vv-dropdown v-model="expanded" v-bind="args" data-testId="wrapper">
                <vv-button ref="toggle" class="absolute top-1/2 left-1/2 -translate-1/2" modifiers="full-bleed" data-testId="trigger">
                    Toggle dropdown
                </vv-button>
                <template #items>
                    <vv-dropdown-action>
                        <vv-icon name="edit" /> Update
                    </vv-dropdown-action>
                    <vv-dropdown-action>
                        <vv-icon name="trash" /> Delete
                    </vv-dropdown-action>
                    <vv-dropdown placement="right-start" offset="5" arrow>
                        <vv-dropdown-action>
                            <vv-icon name="more-vertical" /> More
                        </vv-dropdown-action>
                        <template #items>
                            <vv-dropdown-action>
                                <vv-icon name="add" /> Create
                            </vv-dropdown-action>
                            <vv-dropdown-action>
                                <vv-icon name="eye-on" /> Publish
                            </vv-dropdown-action>
                        </template>
                    </vv-dropdown>
                </template>
            </vv-dropdown>
        `,
	}),
	play: defaultTest,
}
