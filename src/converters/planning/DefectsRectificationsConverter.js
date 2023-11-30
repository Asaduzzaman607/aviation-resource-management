import DateTimeConverter from "../DateTimeConverter";

export default class DefectsRectificationsConverter {
	static toRequestObj(values) {
		return [
			{
				...values[0],
				dueDate: DateTimeConverter.momentDateToString(values[0].dueDate),
				// rectSignTime: DateTimeConverter.momentDateTimeToString(values[0].rectSignTime),
			},
			{
				...values[1],
				dueDate: DateTimeConverter.momentDateToString(values[1].dueDate),
				// rectSignTime: DateTimeConverter.momentDateTimeToString(values[1].rectSignTime),
			},
		]
	}

	static toFormObj(obj) {
		return {

		}
	}
}
