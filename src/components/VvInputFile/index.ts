import type { UploadedFile } from '@/types'
import {
	ModifiersProps,
	ValidProps,
	InvalidProps,
	HintProps,
	LabelProps,
	LoadingProps,
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
	name: { type: String },
	id: { type: String },
	modelValue: Object as PropType<
		File | (File | UploadedFile)[] | UploadedFile
	>,
	max: [Number, String],
	labelButton: { type: String, default: 'Image' },
	loading: Boolean,
	accept: String,
	placeholder: String,
	multiple: Boolean,
	iconLeft: String,
	iconRight: String,
}
