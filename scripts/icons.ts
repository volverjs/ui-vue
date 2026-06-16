#!/usr/bin/env node
import fileSystem from 'node:fs'
import path from 'node:path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import {
    SVG,
    blankIconSet,
    cleanupSVG,
    runSVGO,
    parseColors,
    isEmptyColor,
} from '@iconify/tools'
import { validateIconSet } from '@iconify/utils'
import type { IconifyJSON } from '@iconify/types'
import chokidar from 'chokidar'

/**
 * @field key is the iconify prefix
 * @value string[] is the files path array
 */
interface IFilesMap {
    [key: string]: string[]
}

/**
 * @description A recursive function that search for files into a folder or tree-folder root and returns a map of [lastFolderName]: string[] files paths
 * @param {string} dirPath The root path of icons folder/s
 * @param {IFilesMap} objectFiles A map of prefix (key) and files path array (value)
 * @param {string} prefix The Iconify prefix
 * @returns {IFilesMap} A map of prefix (key) and files path array (value)
 */
function getAllFiles(
    dirPath: string,
    prefix = 'iconify',
    objectFiles: IFilesMap = {},
) {
    // Sort entries: readdirSync returns them in filesystem order, which differs
    // between platforms (e.g. macOS vs Linux/CI) and would otherwise change the
    // icon insertion — and thus output — order.
    const files = fileSystem.readdirSync(dirPath).sort()

    files.forEach((file) => {
        if (fileSystem.statSync(`${dirPath}/${file}`).isDirectory()) {
            objectFiles = getAllFiles(`${dirPath}/${file}`, file, objectFiles)
        }
        else {
            if (file.includes('.svg')) {
                objectFiles[prefix]
                    ? objectFiles[prefix].push(path.join(dirPath, '/', file))
                    : (objectFiles[prefix] = [path.join(dirPath, '/', file)])
            }
        }
    })

    return objectFiles
}

/**
 * @description Create the IconifyJSON .json file from prefix, files path array and the destination path
 * @param {string} prefix The Iconify prefix
 * @param {Array<string>} files Array of SVG files paths
 * @param {string} destPath The destination folder to write IconifyJSON file
 * @param {Object} options The options object
 * @param {boolean} options.keepColors Keep colors in SVG
 */
async function generateIcons(
    prefix: string,
    files: string[],
    destPath: string,
    options?: {
        keepColors?: boolean
    },
) {
    // Create empty icon set
    const iconSet = blankIconSet(prefix)

    for (const file of files) {
        try {
            // Read icon, create SVG instance
            const content = await fileSystem.promises.readFile(file, {
                encoding: 'utf-8',
            })
            const svg = new SVG(content)
            // Clean up icon code
            await cleanupSVG(svg)

            // Assume icon is monotone: replace color with currentColor, add if missing
            // If icon is not monotone, remove this code
            if (!options?.keepColors) {
                await parseColors(svg, {
                    defaultColor: 'currentColor',
                    callback: (_attr, colorStr, color) => {
                        return !color || isEmptyColor(color) || colorStr.includes('var(')
                            ? colorStr
                            : 'currentColor'
                    },
                })
            }

            // Optimise
            await runSVGO(svg)

            // https://docs.iconify.design/tools/utils/icon-name.html
            // All parts of icon name must match the following regular expression: /^[a-z0-9]+(-[a-z0-9]+)*$/
            const fileName = file
                // get file name from path
                .replace(/^.*[\\/]/, '')
                // remove extension
                .split('.')[0]
                // replace white spaces with '-'
                .replace(/ /g, '-')
                // remove chars that not match the Iconify regex icon name (plus '-')
                .replace(/[^a-z0-9-]/gi, '')

            // Add icon to icon set
            iconSet.fromSVG(fileName, svg)
        }
        catch (error) {
            console.error(error)
        }
    }

    // Get the IconifyJSON object from iconSet
    const iconifyJson: IconifyJSON = iconSet.export()

    // Drop the auto-generated `lastModified` timestamp: IconSet.export() sets it
    // to the current time on every run, which would make the committed icon JSON
    // files differ on each build (dirtying the working tree and breaking the
    // release `pnpm version` step). It's metadata only and not needed at runtime.
    delete iconifyJson.lastModified

    // Validate the IconifyJSON object
    try {
        validateIconSet(iconifyJson)
    }
    catch (error) {
        throw new Error(
			`Icon set is not valid: ${(error as { message?: string })
				?.message}`,
        )
    }

    // Write IconifyJSON into file.json
    const filename = `${destPath}/${iconifyJson.prefix}.json`
    fileSystem.mkdirSync(path.dirname(filename), { recursive: true })
    fileSystem.writeFileSync(filename, JSON.stringify(iconifyJson))
}

/**
 * @description Create IconifyJSON files starting from srcPath subfolders
 * @param srcPath
 * @param destPath
 */
export function createIconifyJsonFiles(
    srcPath: string,
    destPath: string,
    options?: {
        prefix?: string
        keepColors?: boolean
    },
) {
    const objectFiles = getAllFiles(srcPath, options?.prefix)

    if (!Object.keys(objectFiles).length) {
        console.error(`There are no files in ${srcPath}`)
    }
    else {
        Object.keys(objectFiles).forEach((prefix) => {
            generateIcons(prefix, objectFiles[prefix], destPath, options)

            console.info(`Icons generated in: ${destPath}/${prefix}.json\n`)
        })
    }
}

const argv = yargs(hideBin(process.argv)).argv as {
    srcPath?: string
    destPath?: string
    prefix?: string
    watch?: boolean
    keepColors?: boolean
}
const srcPath = argv.srcPath
const destPath = argv.destPath || srcPath

if (!srcPath || !destPath) {
    console.error(
        'Please specify the srcPath and destPath with --srcPath and --destPath',
    )
    process.exit()
}

const options = { prefix: argv.prefix, keepColors: argv.keepColors }
if (argv.watch) {
    createIconifyJsonFiles(srcPath, destPath, options)
    chokidar
        .watch(srcPath, {
            ignoreInitial: true,
        })
        .on('add', () => {
            createIconifyJsonFiles(srcPath, destPath, options)
        })
        .on('change', () => {
            createIconifyJsonFiles(srcPath, destPath, options)
        })
}
else {
    createIconifyJsonFiles(srcPath, destPath, options)
}
