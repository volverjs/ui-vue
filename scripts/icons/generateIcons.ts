import fileSystem from 'fs'
import {
	SVG,
	blankIconSet,
	cleanupSVG,
	runSVGO,
	parseColors,
	isEmptyColor
} from '@iconify/tools'
import path from 'path'
import { validateIconSet } from '@iconify/utils'
import type { IconifyJSON } from '@iconify/types'

const ICONS_ROOT = 'src/assets/icons'

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
	objectFiles: IFilesMap = {},
	prefix = 'iconify'
) {
	const files = fileSystem.readdirSync(dirPath)

	files.forEach(function (file) {
		if (fileSystem.statSync(dirPath + '/' + file).isDirectory()) {
			objectFiles = getAllFiles(dirPath + '/' + file, objectFiles, file)
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
	destPath: string
) {
	// Create empty icon set
	const iconSet = blankIconSet(prefix)

	for (const file of files) {
		// Read icon, create SVG instance
		const content = await fileSystem.promises.readFile(file, {
			encoding: 'utf-8'
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
			}
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
	} catch (error: any) {
		throw new Error(`Icon set is not valid: ${error?.message}`)
	}

	// Write IconifyJSON into file.json
	fileSystem.writeFileSync(
		`${destPath}/${iconifyJson.prefix}.json`,
		JSON.stringify(iconifyJson)
	)
}

/**
 * @description Create IconifyJSON files starting from srcPath subfolders
 * @param srcPath
 * @param destPath
 */
export function createIconifyJsonFiles(
	srcPath = ICONS_ROOT,
	destPath = ICONS_ROOT
) {
	const objectFiles = getAllFiles(srcPath)

	if (!Object.keys(objectFiles).length) {
		console.error(`There are no files in ${srcPath}`)
	} else {
		Object.keys(objectFiles).forEach((prefix) => {
			generateIcons(prefix, objectFiles[prefix], destPath)
			console.info(`Icons generated in: ${destPath}/${prefix}.json\n`)
		})
	}
}

createIconifyJsonFiles()
