export const sleep = async (ms = 300) =>
	await new Promise((resolve) => setTimeout(resolve, ms))
