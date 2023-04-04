import { ModifiersProps } from '@/props'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableRow = Record<string | number | symbol, any>

type TableColumn =
	| {
			name: string
			field?: string
			label?: string
			sortable?: boolean
			class?: string
			classTh?: string
			classTd?: string
			wrapperClass?: string
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			render?: (row: any, index?: number) => unknown
	  }
	| string

export const VvTableProps = {
	...ModifiersProps,
	columns: {
		type: Array as PropType<TableColumn[]>,
		required: true,
		default: () => [],
	},
	data: {
		type: Array as PropType<TableRow[]>,
		default: () => [],
	},
	sort: {
		type: String,
		required: false,
		default: undefined,
	},
	order: {
		type: String as PropType<'asc' | 'desc'>,
		required: false,
		default: 'asc',
		validation: (order: string) => ['asc', 'desc'].includes(order),
	},
	page: {
		type: [String, Number],
		required: false,
		default: undefined,
	},
	total: {
		type: [String, Number],
		required: false,
		default: undefined,
	},
	labelNext: {
		type: String,
		default: 'Next',
	},
	labelPrev: {
		type: String,
		default: 'Prev',
	},
	// labelTotalPages: {
	// 	type: String,
	// 	default: 'Total pages',
	// },
	labelItemsShown: {
		type: String,
		default: 'Items shown',
	},
	limit: {
		type: [String, Number],
		required: false,
		default: undefined,
	},
	limitSteps: {
		type: Array as PropType<number[]>,
		required: false,
		default: () => [10, 25, 50, 100],
	},
	nextDisabled: {
		type: Boolean,
		required: false,
		default: false,
	},
	hideNavigation: {
		type: Boolean,
		required: false,
		default: false,
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	isError: {
		type: Boolean,
		default: false,
	},
	transitionName: {
		type: String,
		default: 'fade-in',
	},
}

export const VvTableEmits = [
	'update:sort',
	'update:order',
	'update:page',
	'update:limit',
]
