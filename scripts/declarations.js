import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { globSync } from 'glob'
import ts from 'typescript'

// Runs last in `build`, once `vue-tsc` has emitted the declarations into ./dist
// and build.js has written the exports of package.json: it makes the
// declarations resolvable from another project, then checks them as that
// project would.

const dist = path.resolve('dist')

function fail(message) {
    console.error(message)
    process.exit(1)
}

// A global type in auto-imports.d.ts reaches the declarations as
// `globalThis.<Name>`, a name the consumers do not have. vite.config.ts keeps
// the types out; this is what tells if they come back, whatever the cause.
if (/^\s*export type \{/m.test(fs.readFileSync('auto-imports.d.ts', 'utf-8'))) {
    fail('auto-imports.d.ts declares global types: see `vueValues` in vite.config.ts')
}

// The sources import through the `@/` alias of tsconfig.json, and the
// declarations keep it, but a consumer has no such alias. Point each one at
// the declaration it means, relative to the file that imports it.
const aliasRE = /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)(['"])@\/([^'"]+)\2/g
for (const file of globSync('dist/**/*.d.ts', { posix: true })) {
    const source = fs.readFileSync(file, 'utf-8')
    const rewritten = source.replace(aliasRE, (_, prefix, quote, target) => {
        const specifier = path.posix.relative(path.posix.dirname(file), `dist/${target}`)
        return `${prefix}${quote}${specifier.startsWith('.') ? specifier : `./${specifier}`}${quote}`
    })
    if (rewritten !== source) {
        fs.writeFileSync(file, rewritten)
    }
}

// What an application compiles: every subpath of `exports`, imported by its
// name so the `types` of each entry is the file it resolves to, and every
// declaration `./dist/*` publishes, apart from those of the stories and the
// tests. With `skipLibCheck` off, as an application that checks its libraries
// has it, a name that exists only in this repository, such as a global of
// auto-imports.d.ts or of a shim, fails here and not there.
const { name, exports } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const specifiers = Object.entries(exports)
    .filter(([, entry]) => entry.types)
    .map(([subpath]) => (subpath === '.' ? name : `${name}/${subpath.slice(2)}`))
// never written to disk, and inside the package, so its imports resolve
// through `exports` the way they do from `node_modules`
const consumer = path.resolve('declarations-consumer.ts')
const consumerSource = specifiers
    .map((specifier, index) => `import type * as entry${index} from '${specifier}'\n`)
    .join('')
const options = {
    noEmit: true,
    strict: true,
    skipLibCheck: false,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    types: [],
}
const host = ts.createCompilerHost(options)
const { fileExists, readFile, getSourceFile } = host
host.fileExists = fileName => fileName === consumer || fileExists(fileName)
host.readFile = fileName => (fileName === consumer ? consumerSource : readFile(fileName))
host.getSourceFile = (fileName, languageVersion, ...rest) =>
    fileName === consumer
        ? ts.createSourceFile(fileName, consumerSource, languageVersion)
        : getSourceFile(fileName, languageVersion, ...rest)
const declarations = globSync('dist/**/*.d.ts', {
    ignore: ['dist/stories/**', 'dist/test/**'],
    absolute: true,
})
const program = ts.createProgram([consumer, ...declarations], options, host)
// the declarations of the dependencies are not ours to fix. TypeScript does
// not report every name it cannot resolve, one inside some type arguments for
// one, so this catches what it reports and not more.
const diagnostics = ts.getPreEmitDiagnostics(program)
    .filter((diagnostic) => {
        const fileName = diagnostic.file && path.resolve(diagnostic.file.fileName)
        return !fileName || fileName === consumer || fileName.startsWith(dist + path.sep)
    })
if (diagnostics.length) {
    console.error(ts.formatDiagnostics(diagnostics, {
        getCanonicalFileName: fileName => fileName,
        getCurrentDirectory: () => process.cwd(),
        getNewLine: () => '\n',
    }))
    fail(`${diagnostics.length} errors in the declarations`)
}
console.log(`Declarations checked: ${specifiers.length} entry points, ${declarations.length} files`)
