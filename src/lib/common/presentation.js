export const formatTimeValue = value => {
	if (value === null) return null;
	return Number(value).toFixed(2).replace('.', ':')
}

export const formatSingleTimeValue = value => {
	if (value === null) return null;
	const isSingle = Math.trunc(value)
	if (isSingle.toString().length === 1) {
		const data = Number(value).toFixed(2).replace('.', ':')
		return String('0' + data)
	}
	else {
		return Number(value).toFixed(2).replace('.', ':')
	}
}