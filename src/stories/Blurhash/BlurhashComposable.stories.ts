import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { useBlurhash } from '@/composables/useBlurhash'

const meta: Meta = {
	title: 'Composables/useBlurhash',
	tags: ['autodocs'],
}

export default meta

export const Default: StoryObj = {
	render: (args) => ({
		components: { VvInputFile },
		setup() {
			const isLoading = ref(false)
			const { encode, decode, loadImage } = useBlurhash()
			const file = ref({})
			const canvas = ref()
			const isImgLoaded = ref(false)
			const blurhash = ref('')
			const imageUrl = ref('')
			const image = ref()

			return {
				args,
				isLoading,
				canvas,
				encode,
				decode,
				file,
				blurhash,
				isImgLoaded,
				loadImage,
				image,
				imageUrl,
			}
		},
		watch: {
			file: {
				immediate: true,
				async handler(newValue) {
					if (newValue && newValue.size) {
						this.imageUrl = URL.createObjectURL(newValue)
						this.image = await this.loadImage(this.imageUrl)
						this.blurhash = await this.encode(newValue)
					} else {
						this.image = null
						this.imageUrl = ''
						this.blurhash = ''
					}
				},
			},
			blurhash: {
				async handler(newValue) {
					if (this.image) {
						const blurhashDecoded = await this.decode(
							newValue,
							this.image.width,
							this.image.height,
						)

						if (this.canvas) {
							this.canvas.width = this.image.width
							this.canvas.height = this.image.height
							const ctx = this.canvas.getContext('2d')
							const imageData = ctx.createImageData(
								this.canvas.width,
								this.canvas.height,
							)
							imageData.data.set(blurhashDecoded)
							ctx.putImageData(imageData, 0, 0)
						}
					}
				},
			},
		},
		template: /* html */ `
			<div class="w-full grid gap-md grid-cols-3 h-150" :class="{ 'vv-skeleton': isLoading }">
				<div class="w-150 h-150 col-span-1">
					<div class="text-20 font-semibold mb-md">Upload image</div>
					<vv-input-file v-model="file" name="input-file" modifiers="drop-area square hidden" accept=".gif,.jpg,.jpeg,.png,image/gif,image/jpeg,image/png" />
				</div>
				<div v-show="blurhash" class="h-150 col-span-2">
					<picture class="flex gap-md justify-center">
						<div>
							<div class="text-20 font-semibold mb-md">Blurhash</div>
							<canvas
								ref="canvas"
								class="w-150 h-150 block object-cover" />
						</div>
						<div>
							<div class="text-20 font-semibold mb-md">Image</div>
							<img
								v-if="image"
								class="w-150 h-150 block object-cover"
								:class="{ 'vv-skeleton__item': isLoading }"
								:src="imageUrl"
								alt="image"
								:width="image.width"
								:height="image.height" />
						</div>
					</picture>
				</div>
			</div>
		`,
	}),

	parameters: {
		docs: {
			source: {
				type: 'code',
				language: 'html',
				code: /* html */ `
<div class="w-full grid gap-md grid-cols-3 h-150" :class="{ 'vv-skeleton': isLoading }">
	<div class="w-150 h-150 col-span-1">
		<div class="text-20 font-semibold mb-md">Upload image</div>
		<vv-input-file v-model="file" name="input-file" modifiers="drop-area square hidden" accept=".gif,.jpg,.jpeg,.png,image/gif,image/jpeg,image/png" />
	</div>
	<div v-show="blurhash" class="h-150 col-span-2">
		<picture class="flex gap-md justify-center">
			<div>
				<div class="text-20 font-semibold mb-md">Blurhash</div>
				<canvas
					ref="canvas"
					class="w-150 h-150 block object-cover" />
			</div>
			<div>
				<div class="text-20 font-semibold mb-md">Image</div>
				<img
					v-if="image"
					class="w-150 h-150 block object-cover"
					:class="{ 'vv-skeleton__item': isLoading }"
					:src="imageUrl"
					alt="image"
					:width="image.width"
					:height="image.height" />
			</div>
		</picture>
	</div>
</div>

<script setup lang='ts'>
	import { useBlurhash } from '@volverjs/ui-vue/composables'

	const { encode, decode, loadImage } = useBlurhash()

	const isLoading = ref(false)
	const file = ref({})
	const canvas = ref()
	const isImgLoaded = ref(false)
	const blurhash = ref('')
	const imageUrl = ref('')
	const image = ref()

	watch(file, async (newValue) => {
		if (newValue && newValue.size) {
			this.imageUrl = URL.createObjectURL(newValue)
			this.image = await this.loadImage(this.imageUrl)
			this.blurhash = await this.encode(newValue)
		} else {
			this.image = null
			this.imageUrl = ''
			this.blurhash = ''
		}
	}, { immediate: true })

	watch(blurhash, async (newValue) => {
		if (this.image) {
			const blurhashDecoded = await this.decode(
				newValue,
				this.image.width,
				this.image.height,
			)

			if (this.canvas) {
				this.canvas.width = this.image.width
				this.canvas.height = this.image.height
				const ctx = this.canvas.getContext('2d')
				const imageData = ctx.createImageData(
					this.canvas.width,
					this.canvas.height,
				)
				imageData.data.set(blurhashDecoded)
				ctx.putImageData(imageData, 0, 0)
			}
		}
	})
</script>
				`,
			},
		},
	},
}
