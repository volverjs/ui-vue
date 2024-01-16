<script lang="ts">
	export default {
		name: 'VvInputFile',
	}
</script>

<script setup lang="ts">
	import { useVModel } from '@vueuse/core'
	import type { UploadedFile } from '../../types'
	import { computed, onBeforeUnmount, ref } from 'vue'
	import VvButton from '../VvButton/VvButton.vue'
	import VvIcon from '../VvIcon/VvIcon.vue'
	import HintSlotFactory from '../common/HintSlot'
	import { VvInputFileProps, type VvInputFileEvents } from '.'

	// props, emit, slots and attrs
	const props = defineProps(VvInputFileProps)
	const emit = defineEmits<VvInputFileEvents>()
	const slots = useSlots()

	// props merged with volver defaults (now only for labels)
	const propsDefaults = useDefaults<typeof VvInputFileProps>(
		'VvInputFile',
		VvInputFileProps,
		props,
	)
	const { modifiers, id, readonly, icon, iconPosition, iconDownload } =
		toRefs(props)
	const hasId = useUniqueId(id)
	const hasHintId = computed(() => `${hasId.value}-hint`)

	const hasProgress = computed(() => {
		if (!props.progress) {
			return false
		}
		const progress =
			typeof props.progress === 'string'
				? parseInt(props.progress)
				: props.progress
		return progress > 0 && progress < 100
	})

	const { hasIconBefore, hasIconAfter } = useComponentIcon(icon, iconPosition)
	const { hasIcon: hasIconDownload } = useComponentIcon(iconDownload)

	// styles
	const bemCssClasses = useModifiers(
		'vv-input-file',
		modifiers,
		computed(() => ({
			dragging: isDragging.value,
			loading: props.loading && !hasProgress.value,
			valid: props.valid === true,
			invalid: props.invalid === true,
			'icon-before': !!hasIconBefore.value,
			'icon-after': !!hasIconAfter.value,
			'drop-area': hasDropArea.value,
		})),
	)

	const {
		HintSlot,
		hasHintLabelOrSlot,
		hasInvalidLabelOrSlot,
		hintSlotScope,
	} = HintSlotFactory(propsDefaults, slots)

	const localModelValue = useVModel(props, 'modelValue', emit)
	const files = computed(() => {
		if (
			!localModelValue.value ||
			(!Array.isArray(localModelValue.value) &&
				!(localModelValue.value as File)?.name)
		) {
			return []
		}
		return Array.isArray(localModelValue.value)
			? localModelValue.value
			: [localModelValue.value]
	})

	const hasMax = computed(() => {
		return typeof props.max === 'string' ? parseInt(props.max) : props.max
	})

	const hasDropArea = computed(() => {
		return props.dropArea && !readonly.value
	})

	const isMultiple = computed(() => {
		if (!props.multiple) {
			return false
		}
		if (!hasMax.value) {
			return true
		}
		return hasMax.value - files.value.length > 1
	})

	const isDragging = ref(false)

	const inputEl = ref<HTMLInputElement>()
	const onDragenter = () => {
		isDragging.value = true
	}

	const onDragleave = () => {
		isDragging.value = false
	}

	const onDrop = (event: DragEvent) => {
		if (!event.dataTransfer?.files) {
			return
		}
		isDragging.value = false
		addFiles(event.dataTransfer?.files)
	}

	const onChange = () => {
		if (!inputEl.value?.files) {
			return
		}
		addFiles(inputEl.value.files)
		inputEl.value.value = ''
	}

	const addFiles = (uploadedFiles: FileList) => {
		if (!props.multiple) {
			if (Array.isArray(localModelValue.value)) {
				localModelValue.value = [...uploadedFiles]
				return
			}
			localModelValue.value = uploadedFiles[0]
			return
		}
		let toReturn: (File | UploadedFile)[] = []
		if (!Array.isArray(localModelValue.value) && localModelValue.value) {
			toReturn = [localModelValue.value]
		} else {
			toReturn =
				localModelValue.value && Array.isArray(localModelValue.value)
					? [...localModelValue.value]
					: toReturn
		}
		for (const file of uploadedFiles) {
			if (hasMax.value && toReturn.length >= hasMax.value) {
				break
			}
			toReturn.push(file)
		}
		localModelValue.value = toReturn
		selectedFileIndex.value = toReturn.length - 1
	}

	const onClickDropArea = () => {
		if (!inputEl.value) {
			return
		}
		if (!readonly.value) {
			inputEl.value.click()
		}
	}

	const onClickRemoveFile = (index: number) => {
		if (!Array.isArray(localModelValue.value)) {
			localModelValue.value = undefined
			return
		}
		if (selectedFileIndex.value === index) {
			selectedFileIndex.value = 0
		}
		const toReturn = [...localModelValue.value]
		toReturn.splice(index, 1)
		localModelValue.value = toReturn
	}

	const selectedFileIndex = ref(0)
	const PREVIEW_MIME_TYPES = ['image/jpeg', 'image/png']
	const previewSrc = computed(() => {
		if (files.value.length === 0) {
			return
		}
		if (!files.value[selectedFileIndex.value]) {
			return undefined
		}
		if (files.value[selectedFileIndex.value] instanceof File) {
			const currentFile = files.value[selectedFileIndex.value] as File
			if (!PREVIEW_MIME_TYPES.includes(currentFile.type)) {
				return undefined
			}
			return URL.createObjectURL(currentFile)
		}
		const currentFile = files.value[selectedFileIndex.value] as UploadedFile
		if (currentFile.thumbnailUrl) {
			return currentFile.thumbnailUrl
		}
		if (!PREVIEW_MIME_TYPES.includes(currentFile.type)) {
			return undefined
		}
		return currentFile.url
	})

	watch(previewSrc, (_newValue, oldValue) => {
		if (oldValue) {
			URL.revokeObjectURL(oldValue)
		}
	})

	onBeforeUnmount(() => {
		if (previewSrc.value) {
			URL.revokeObjectURL(previewSrc.value)
		}
	})

	const sizeInKiB = (size?: number) => {
		if (!size) {
			return
		}
		return Math.floor(size / 1024)
	}

	const onClickDownloadFile = (file: File | UploadedFile) => {
		const link = document.createElement('a')
		if (file instanceof File) {
			link.href = URL.createObjectURL(file)
		} else if (file.url) {
			link.href = file.url
		}
		link.setAttribute('download', file.name)
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(link.href)
	}

	const onClickSelectFile = (index: number) => {
		selectedFileIndex.value = index
	}

	const dropdAreaActionLabel = computed(() => {
		if (files.value.length === 0 || isMultiple.value) {
			return props.labelAdd
		}
		return props.labelReplace
	})

	const dropAreaActionIcon = computed(() => {
		if (files.value.length === 0 || isMultiple.value) {
			return props.iconAdd
		}
		return props.iconReplace
	})
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="hasId">
			{{ label }}
		</label>
		<div
			v-if="hasDropArea"
			class="vv-input-file__drop-area"
			@dragenter.prevent.stop="onDragenter"
			@dragleave.prevent.stop="onDragleave"
			@drop.prevent.stop="onDrop"
			@dragover.prevent.stop
			@click.stop="onClickDropArea"
		>
			<slot name="drop-area">
				<picture class="vv-input-file__preview">
					<img
						v-if="previewSrc"
						:src="previewSrc"
						:alt="files[selectedFileIndex].name"
					/>
				</picture>
				<VvButton
					v-if="!readonly"
					modifiers="action"
					:label="!previewSrc ? dropdAreaActionLabel : undefined"
					:title="previewSrc ? dropdAreaActionLabel : undefined"
					:class="{
						'vv-input-file__drop-area-action': previewSrc,
					}"
					:icon="dropAreaActionIcon"
					@click.stop="onClickDropArea"
				/>
			</slot>
		</div>
		<div class="vv-input-file__wrapper">
			<VvIcon v-if="hasIconBefore" v-bind="hasIconBefore" />
			<input
				:id="hasId"
				ref="inputEl"
				type="file"
				:readonly="readonly"
				:placeholder="placeholder"
				:aria-describedby="hasHintLabelOrSlot ? hasHintId : undefined"
				:aria-invalid="invalid"
				:aria-errormessage="
					hasInvalidLabelOrSlot ? hasHintId : undefined
				"
				:multiple="isMultiple"
				:accept="accept"
				:capture="capture"
				:name="name"
				@change="onChange"
			/>
			<progress
				v-if="hasProgress"
				class="vv-input-file__progress"
				:value="progress"
				max="100"
			>
				{{ progress }}%
			</progress>
			<VvIcon v-if="hasIconAfter" v-bind="hasIconAfter" />
		</div>
		<ul class="vv-input-file__list">
			<li
				v-for="(file, index) in files"
				:key="index"
				class="vv-input-file__item"
				:class="{
					active:
						index === selectedFileIndex &&
						hasDropArea &&
						files.length > 1,
				}"
				@click.stop="onClickSelectFile(index)"
			>
				<button
					v-if="hasIconDownload"
					type="button"
					class="vv-input-file__item-action"
					:title="labelDownload"
					@click.stop="onClickDownloadFile(file)"
				>
					<VvIcon v-bind="hasIconDownload" />
				</button>
				<div class="vv-input-file__item-name">
					{{ file.name }}
				</div>
				<small class="vv-input-file__item-info">
					{{ sizeInKiB(file.size) }} KB
				</small>
				<button
					v-if="!readonly"
					type="button"
					class="vv-input-file__item-remove"
					:title="labelRemove"
					@click.stop="onClickRemoveFile(index)"
				/>
			</li>
		</ul>
		<HintSlot :id="hasHintId" class="vv-input-file__hint">
			<template v-if="$slots.hint" #hint>
				<slot name="hint" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.loading" #loading>
				<slot name="loading" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.valid" #valid>
				<slot name="valid" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.invalid" #invalid>
				<slot name="invalid" v-bind="hintSlotScope" />
			</template>
		</HintSlot>
	</div>
</template>
