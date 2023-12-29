import type { UploadedFile } from '@/types'
import {
	IdNameProps,
	ModifiersProps,
	ValidProps,
	InvalidProps,
	HintProps,
	LabelProps,
	LoadingProps,
	ReadonlyProps,
	IconProps,
} from '../../props'
import { type VvIconProps, ACTION_ICONS } from '../VvIcon'

export type VvInputFileEvents = {
	'update:modelValue': [File | undefined]
}

export const VvInputFileProps = {
	...IdNameProps,
	...ModifiersProps,
	...ValidProps,
	...InvalidProps,
	...HintProps,
	...LabelProps,
	...LoadingProps,
	...ReadonlyProps,
	...IconProps,
	/**
	 * Input value
	 */
	modelValue: {
		type: Object as PropType<File | (File | UploadedFile)[] | UploadedFile>,
		required: true,
	},
	/**
	 * Whether to show progress bar
	 */
	progress: { type: [Number, String], default: undefined },
	/**
	 * Input
	 * Text that appears in the form control when it has no value set
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder
	 */
	placeholder: { type: String, default: undefined },
	/**
	 * File types to accept
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
	 */
	accept: { type: String, default: '*' },
	/**
	 * Whether to allow multiple values
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple
	 */
	multiple: { type: Boolean, default: false },
	/**
	 * Max number of files
	 */
	max: { type: [Number, String], default: undefined },
	/**
	 * Show drop area
	 */
	dropArea: { type: Boolean, default: false },
	/**
	 * Label for add button
	 */
	labelAdd: {
		type: String,
		default: 'Add file',
	},
	/**
	 * VvIcon name for add button
	 * @see VVIcon
	 */
	iconAdd: {
		type: [String, Object] as PropType<string | VvIconProps>,
		default: ACTION_ICONS.add,
	},
	/**
	 * Label for replace button
	 */
	labelReplace: {
		type: String,
		default: 'Replace file',
	},
	/**
	 * VvIcon name for replace button
	 * @see VVIcon
	 */
	iconReplace: {
		type: [String, Object] as PropType<string | VvIconProps>,
		default: ACTION_ICONS.edit,
	},
	/**
	 * Label for download button
	 */
	labelDownload: {
		type: String,
		default: 'Downlaod file',
	},
	/**
	 * VvIcon name for download button
	 * @see VVIcon
	 */
	iconDownload: {
		type: [String, Object] as PropType<string | VvIconProps>,
		default: ACTION_ICONS.download,
	},
	/**
	 * Label for remove button
	 */
	labelRemove: {
		type: String,
		default: 'Remove file',
	},
}
