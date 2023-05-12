import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { icons as NormalIcons } from '@/assets/icons/normal.json'
import { defaultArgs, argTypes } from './Icon.settings'

const meta: Meta<typeof VvIcon> = {
	title: 'Components/Icon/Collection',
	component: VvIcon,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvIcon>

export const Default: Story = {
	args: {
		...defaultArgs,
		width: 24,
	},
	render: (args) => ({
		components: { VvIcon },
		setup() {
			const allIcons = Object.keys(NormalIcons)
			const icons = ref(allIcons)
			const search = ref('')
			watch(search, (newValue) => {
				icons.value = allIcons.filter((icon) => icon.includes(newValue))
			})
			return { args, search, icons }
		},
		template: /*html*/ `
			<div class="absolute inset-0 overflow-y-auto p-16">
				<div class="vv-input-text">
					<div class="vv-input-text__wrapper">
						<input v-model="search" type="search" placeholder="Search..." />
					</div>
				</div>
				<div class="grid grid-cols-5 gap-16 mt-16">
					<div
						v-for="iconName in icons"
						:key="iconName"
						class="flex items-center gap-16">
						<VvIcon v-bind="args" :name="iconName" />
						{{ iconName }}
					</div>
				</div>
			</div>
		`,
	}),
}
