export default class FlightDataConverter {
	static toRequestObj(values) {
		if (Object.values(values).every(v => !v)) {
			return null;
		}
		const airTime = values?.totalAirTime
		const totalAirTime = (airTime)?.toString().replace(":", ".");
		return {
			...values,
			totalAirTime: totalAirTime,
			// blockOnTime: DateTimeConverter.momentDateTimeToString(values.blockOnTime),
			// blockOffTime: DateTimeConverter.momentDateTimeToString(values.blockOffTime),
			// landingTime: DateTimeConverter.momentDateTimeToString(values.landingTime),
			// takeOffTime: DateTimeConverter.momentDateTimeToString(values.takeOffTime),
			// commencedTime: DateTimeConverter.momentDateTimeToString(values.commencedTime),
			// completedTime: DateTimeConverter.momentDateTimeToString(values.completedTime)
		}
	}

	static toFormObj({ totalAirTime, blockOffTime, landingTime, takeOffTime, commencedTime, completedTime, ...rest }) {
		return {
			...rest,
			totalAirTime: totalAirTime?.toString().replace('.', ':')
			// blockOnTime: DateTimeConverter.stringToMomentDateTime(blockOnTime),
			// blockOffTime: DateTimeConverter.stringToMomentDateTime(blockOffTime),
			// landingTime: DateTimeConverter.stringToMomentDateTime(landingTime),
			// takeOffTime: DateTimeConverter.stringToMomentDateTime(takeOffTime),
			// commencedTime: DateTimeConverter.stringToMomentDateTime(commencedTime),
			// completedTime: DateTimeConverter.stringToMomentDateTime(completedTime)
		}
	}
}