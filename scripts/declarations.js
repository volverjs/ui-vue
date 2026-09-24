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

// The sources import through the `@/` alias of tsconfig.json, and the
// declarations keep it, but a consumer has no such alias. Point each one at
// the declaration it means, relative to the file that imports it.
const aliasRE = /(\bfrom\s+|\bimport\s*\(\s*)(['"])@\/([^'"]+)\2/g
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

// Every entry point in `exports`, compiled with the options of an application
// that checks its libraries: a name that exists only in this repository, such
// as a global of auto-imports.d.ts or of a shim, fails here and not there.
const { exports } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const entries = Object.values(exports)
    .map(entry => entry.types)
    .filter(Boolean)
    .map(types => path.resolve(types))
const program = ts.createProgram(entries, {
    noEmit: true,
    strict: true,
    skipLibCheck: false,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    types: [],
})
// the declarations of the dependencies are not ours to fix
const diagnostics = ts.getPreEmitDiagnostics(program)
    .filter(diagnostic => !diagnostic.file || path.resolve(diagnostic.file.fileName).startsWith(dist + path.sep))
if (diagnostics.length) {
    console.error(ts.formatDiagnostics(diagnostics, {
        getCanonicalFileName: fileName => fileName,
        getCurrentDirectory: () => process.cwd(),
        getNewLine: () => '\n',
    }))
    console.error(`${diagnostics.length} errors in the declarations of ${entries.length} entry points`)
    process.exit(1)
}
console.log(`Declarations of ${entries.length} entry points checked`)
