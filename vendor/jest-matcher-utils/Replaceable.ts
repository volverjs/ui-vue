/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getType } from 'jest-get-type'

const supportTypes = ['map', 'array', 'object']

type ReplaceableForEachCallBack = (
	value: unknown,
	key: unknown,
	object: unknown,
) => void

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default class Replaceable {
	object: any
	type: string

	constructor(object: any) {
		this.object = object
		this.type = getType(object)
		if (!supportTypes.includes(this.type)) {
			throw new Error(`Type ${this.type} is not support in Replaceable!`)
		}
	}

	static isReplaceable(obj1: unknown, obj2: unknown): boolean {
		const obj1Type = getType(obj1)
		const obj2Type = getType(obj2)
		return obj1Type === obj2Type && supportTypes.includes(obj1Type)
	}

	forEach(cb: ReplaceableForEachCallBack): void {
		if (this.type === 'object') {
			const descriptors = Object.getOwnPropertyDescriptors(this.object)
			;[
				...Object.keys(descriptors),
				...Object.getOwnPropertySymbols(descriptors),
			]
				//@ts-expect-error because typescript do not support symbol key in object
				//https://github.com/microsoft/TypeScript/issues/1863
				.filter((key) => descriptors[key].enumerable)
				.forEach((key) => {
					cb(this.object[key], key, this.object)
				})
		} else {
			this.object.forEach(cb)
		}
	}

	get(key: any): any {
		if (this.type === 'map') {
			return this.object.get(key)
		}
		return this.object[key]
	}

	set(key: any, value: any): void {
		if (this.type === 'map') {
			this.object.set(key, value)
		} else {
			this.object[key] = value
		}
	}
}
/* eslint-enable */
