export function integerOnly(_, totalLanding) {
	const IS_INTEGER_REGEX = /^[0-9]+$/;
	
	if (!totalLanding || IS_INTEGER_REGEX.test(totalLanding) ) {
		return Promise.resolve();
	}
	
	return Promise.reject("Only integer is allowed!")
}
