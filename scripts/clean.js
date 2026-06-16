import fs from 'node:fs'

// Clean the output directory before the build pipeline runs.
// This must happen BEFORE `generate-tsd`, otherwise the emitted .d.ts
// declarations would be deleted before the Vite bundles are generated.
fs.rmSync('./dist', { recursive: true, force: true })
