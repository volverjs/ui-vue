import fileSystem from 'fs'
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
import path from 'path'
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
 * @param {String} dirPath The root path of icons folder/s
 * @param {IFilesMap} objectFiles A map of prefix (key) and files path array (value)
 * @param {String} prefix The Iconify prefix
 * @returns {IFilesMap} A map of prefix (key) and files path array (value)
 */
function getAllFiles(
	dirPath: string,
	prefix = 'iconify',
	objectFiles: IFilesMap = {},
) {
	const files = fileSystem.readdirSync(dirPath)

	files.forEach(function (file) {
		if (fileSystem.statSync(dirPath + '/' + file).isDirectory()) {
			objectFiles = getAllFiles(dirPath + '/' + file, file, objectFiles)
		} else {
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
 * @param {String} prefix The Iconify prefix
 * @param {Array<String>} files Array of SVG files paths
 * @param {String} destPath The destination folder to write IconifyJSON file
 */
async function generateIcons(
	prefix: string,
	files: string[],
	destPath: string,
) {
	// Create empty icon set
	const iconSet = blankIconSet(prefix)

	for (const file of files) {
		// Read icon, create SVG instance
		const content = await fileSystem.promises.readFile(file, {
			encoding: 'utf-8',
		})
		const svg = new SVG(content)
		// Clean up icon code
		await cleanupSVG(svg)

		// Assume icon is monotone: replace color with currentColor, add if missing
		// If icon is not monotone, remove this code
		await parseColors(svg, {
			defaultColor: 'currentColor',
			callback: (attr, colorStr, color) => {
				return !color || isEmptyColor(color) ? colorStr : 'currentColor'
			},
		})

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

	// Get the IconifyJSON object from iconSet
	const iconifyJson: IconifyJSON = iconSet.export()

	// Validate the IconifyJSON object
	try {
		validateIconSet(iconifyJson)
	} catch (error) {
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
	prefix?: string,
) {
	const objectFiles = getAllFiles(srcPath, prefix)

	if (!Object.keys(objectFiles).length) {
		// eslint-disable-next-line no-console
		console.error(`There are no files in ${srcPath}`)
	} else {
		Object.keys(objectFiles).forEach((prefix) => {
			generateIcons(prefix, objectFiles[prefix], destPath)
			// eslint-disable-next-line no-console
			console.info(`Icons generated in: ${destPath}/${prefix}.json\n`)
		})
	}
}

const argv = yargs(hideBin(process.argv)).argv as {
	srcPath?: string
	destPath?: string
	prefix?: string
	watch?: boolean
}
const srcPath = argv.srcPath
const destPath = argv.destPath || srcPath

if (!srcPath || !destPath) {
	// eslint-disable-next-line no-console
	console.error(
		'Please specify the srcPath and destPath with --srcPath and --destPath',
	)
	process.exit()
}

if (argv.watch) {
	chokidar
		.watch(srcPath)
		.on('add', () => {
			createIconifyJsonFiles(srcPath, destPath, argv.prefix)
		})
		.on('change', () => {
			createIconifyJsonFiles(srcPath, destPath, argv.prefix)
		})
} else {
	createIconifyJsonFiles(srcPath, destPath, argv.prefix)
}
