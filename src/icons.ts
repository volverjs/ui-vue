import type { IconifyJSON } from '@iconify/vue'
import detailedJson from './assets/icons/detailed.json'
import normalJson from './assets/icons/normal.json'
import simpleJson from './assets/icons/simple.json'

// typed, so the declaration neither copies every icon nor imports the JSON
// files, which are not in `dist`
export const detailed: IconifyJSON = detailedJson
export const normal: IconifyJSON = normalJson
export const simple: IconifyJSON = simpleJson

export default [normal, detailed, simple]
