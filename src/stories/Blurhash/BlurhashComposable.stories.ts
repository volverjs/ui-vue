import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { useBlurhash } from '@/composables/useBlurhash'

const meta: Meta = {
	title: 'Composables/Blurhash',
}

export default meta

export const Default: StoryObj = {
	render: (args) => ({
		components: { VvInputFile },
		setup() {
			const isLoading = ref(false)
			const { encode, decode, loadImage } = useBlurhash()
			const file = ref()
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
					if (newValue) {
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
			<div class="w-full h-150" :class="{ 'vv-skeleton': isLoading }">
				{{blurhash}}
				<vv-input-file v-model="file" name="input-file" accept=".gif,.jpg,.jpeg,.png,image/gif,image/jpeg,image/png" />
                <picture>
                    <canvas
						v-show="blurhash"
                        ref="canvas"
                        class="w-full h-full block object-cover" />
                    <img
						v-if="image"
                        class="w-full h-full block object-cover"
                        :class="{ 'vv-skeleton__item': isLoading }"
                        :src="imageUrl"
                        alt="image"
                        :width="image.width"
                        :height="image.height" />
                </picture>
			</div>
		`,
	}),
}
