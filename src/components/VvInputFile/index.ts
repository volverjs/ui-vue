import type { UploadedFile } from '@/types'
import {
	ModifiersProps,
	ValidProps,
	InvalidProps,
	HintProps,
	LabelProps,
	LoadingProps,
	ReadonlyProps,
} from '../../props'

export type VvInputFileEvents = {
	'update:modelValue': [File | undefined]
}

export const VvInputFileProps = {
	...ModifiersProps,
	...ValidProps,
	...InvalidProps,
	...HintProps,
	...LabelProps,
	...LoadingProps,
	...ReadonlyProps,
	name: { type: String },
	id: { type: String },
	modelValue: {
		type: Object as PropType<File | (File | UploadedFile)[] | UploadedFile>,
		required: true,
	},
	max: [Number, String],
	labelButton: { type: String, default: 'Image' },
	loading: Boolean,
	accept: String,
	placeholder: String,
	multiple: Boolean,
	iconLeft: String,
	iconRight: String,
}
