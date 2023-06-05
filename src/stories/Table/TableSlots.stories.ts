import type { Meta, StoryObj } from '@storybook/vue3'
import VvTable from '@/components/VvTable/VvTable.vue'
import { defaultArgs, argTypes } from './Table.settings'
import { Default } from './Table.stories'

const meta: Meta<typeof VvTable> = {
	title: 'Components/Table/Slots',
	component: VvTable,
	args: defaultArgs,
	argTypes: argTypes,
}

export default meta

type Story = StoryObj<typeof VvTable>

export const Loading: Story = {
	...Default,
	args: {
		...defaultArgs,
		loading: `<div data-testId="slot" class="font-bold p-lg"> Loading slot... </div>`,
		isLoading: true,
	},
}
export const Error: Story = {
	...Default,
	args: {
		...defaultArgs,
		error: `<div data-testId="slot" class="font-bold text-danger p-lg"> Error slot! </div>`,
		isError: true,
	},
}
export const Empty: Story = {
	...Default,
	args: {
		...defaultArgs,
		empty: `<div data-testId="slot" class="font-bold p-lg"> Empty slot: No results found! </div>`,
		data: [],
	},
}
export const TBody: Story = {
	...Default,
	args: {
		...defaultArgs,
		tbody: `<div data-testId="slot" class="font-bold p-lg"> Tbody slot </div>`,
	},
}
export const TFoot: Story = {
	...Default,
	args: {
		...defaultArgs,
		tfoot: `<div data-testId="slot" class="font-bold p-lg"> tfoot slot </div>`,
	},
}
export const Caption: Story = {
	...Default,
	args: {
		...defaultArgs,
		caption: `<div data-testId="slot" class="font-bold p-lg"> caption slot </div>`,
	},
}
export const Navigation: Story = {
	...Default,
	args: {
		...defaultArgs,
		navigation: `<div data-testId="slot" class="font-bold p-lg"> navigation slot </div>`,
	},
}
export const Col: Story = {
	...Default,
	args: {
		...defaultArgs,
		col: `<div data-testId="slot" class="font-bold p-lg h-20"> Column slot </div>`,
	},
}
export const ColField: Story = {
	...Default,
	args: {
		...defaultArgs,
		'col::age': `
			<div role="status" class="vv-badge h-20">
				<div data-testId="slot" class="font-bold p-lg"> Age slot </div>
			</div>
		`,
	},
}
export const SkeletonField: Story = {
	...Default,
	args: {
		...defaultArgs,
		'skeleton::age': `
			<div class="vv-skeleton flex ml-md">
				<div class="vv-skeleton__item rounded-lg w-20"></div>
				<div class="vv-skeleton__item rounded-lg w-20"></div>
			</div>
		`,
		isLoading: true,
	},
}
