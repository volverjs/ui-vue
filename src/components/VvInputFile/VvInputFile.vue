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

	const { modifiers, id } = toRefs(props)

	const hasId = useUniqueId(id)
	const hasHintId = computed(() => `${hasId.value}-hint`)

	// styles
	const bemCssClasses = useModifiers(
		'vv-input-file',
		modifiers,
		computed(() => ({
			dragging: isDragging.value,
			loading: props.loading,
			valid: props.valid === true,
			invalid: props.invalid === true,
			'icon-before': !!props.iconLeft,
			'icon-after': !!props.iconRight,
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
		return modifiers?.value?.includes('drop-area')
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
	}

	const onClick = () => {
		if (!inputEl.value) {
			return
		}
		inputEl.value.click()
	}

	const onClickRemoveFile = (index: number) => {
		if (!Array.isArray(localModelValue.value)) {
			localModelValue.value = undefined
			return
		}
		const toReturn = [...localModelValue.value]
		toReturn.splice(index, 1)
		localModelValue.value = toReturn
	}

	const previewSrc = computed(() => {
		if (files.value.length === 0) {
			return
		}
		if (files.value[0] instanceof File) {
			return URL.createObjectURL(files.value[0])
		}
		return files.value[0].url
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
			@click.stop="onClick"
		>
			<slot name="drop-area">
				<VvButton
					modifiers="action"
					aria-label="upload"
					:label="!previewSrc ? labelButton : undefined"
					:class="{
						'absolute top-8 right-8': previewSrc,
					}"
					:icon="!previewSrc ? 'image' : 'edit'"
					class="z-1"
					@click.stop="onClick"
				/>
				<picture class="vv-input-file__preview">
					<img
						v-if="previewSrc"
						:src="previewSrc"
						:alt="files[0].name"
					/>
				</picture>
			</slot>
		</div>
		<div class="vv-input-file__wrapper">
			<VvIcon v-if="iconLeft" :name="iconLeft" />
			<input
				:id="hasId"
				ref="inputEl"
				:placeholder="placeholder"
				:aria-describedby="hasHintLabelOrSlot ? hasHintId : undefined"
				:aria-invalid="invalid"
				:aria-errormessage="
					hasInvalidLabelOrSlot ? hasHintId : undefined
				"
				:multiple="isMultiple"
				:accept="accept"
				type="file"
				:name="name"
				@change="onChange"
			/>
			<VvIcon v-if="iconRight" :name="iconRight" />
		</div>
		<ul class="vv-input-file__list">
			<li
				v-for="(file, index) in files"
				:key="index"
				class="vv-input-file__item"
			>
				<VvIcon
					class="vv-input-file__item-icon"
					name="akar-icons:file"
				/>
				<div class="vv-input-file__item-name">{{ file.name }}</div>
				<small class="vv-input-file__item-info">
					{{ sizeInKiB(file.size) }} KB
				</small>
				<button
					type="button"
					class="vv-input-file__item-remove"
					title="Remove"
					aria-label="remove-file"
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
