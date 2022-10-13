import { promises as fs } from 'fs'
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

const ICONS_ROOT = 'src/assets/icons'

function getAllFiles(dirPath, objectFiles, prefix) {
	const files = fileSystem.readdirSync(dirPath)

	objectFiles = objectFiles || {}

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

export async function addIcons(prefix, files) {
	// Create empty icon set
	const iconSet = blankIconSet(prefix)

	for (const file of files) {
		// Read icon, create SVG instance
		const content = await fs.readFile(file, { encoding: 'utf-8' })
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

	const iconifyJson = iconSet.export()

	try {
		validateIconSet(iconifyJson)
	} catch (error) {
		throw new Error(`Icon set is not valid: ${error?.message}`)
	}

	fileSystem.writeFileSync(
		`${ICONS_ROOT}/${iconifyJson.prefix}.json`,
		JSON.stringify(iconifyJson)
	)
}

const objectFiles = getAllFiles(ICONS_ROOT, null)

if (!Object.keys(objectFiles).length) {
	console.error(`There are no files in ${ICONS_ROOT}`)
} else {
	Object.keys(objectFiles).forEach((prefix) => {
		addIcons(prefix, objectFiles[prefix])
		console.info(`Icons generated in: ${ICONS_ROOT}/${prefix}.json\n`)
	})
}
