import moment from "moment";
import DateTimeConverter from "../DateTimeConverter";

export default class AMLConverter {
	static toRequestObj(data) {
		const pfiDate = DateTimeConverter.momentDateToString(data.pfiDate)
		const pfiTime = DateTimeConverter.momentDateTimeToString(data.pfiTime)?.slice(11)
		const ocaDate = DateTimeConverter.momentDateToString(data.ocaDate)
		const ocaTime = DateTimeConverter.momentDateTimeToString(data.ocaTime)?.slice(11)
		return {
			...data,
			pfiTime: pfiDate + ' ' + pfiTime,
			ocaTime: ocaDate + ' ' + ocaTime,
			date: DateTimeConverter.momentDateToString(data.date)
		}
	}
	
	static toFormObj({ pfiTime, ocaTime, date, signatureList, ...rest}) {
		const pfiOnlyDate = pfiTime?.slice(0,10)
		const pfiOnlyTime = pfiTime?.slice(11)
		const ocaOnlyDate = ocaTime?.slice(0,10)
		const ocaOnlyTime = ocaTime?.slice(11)
		return {
			...rest,
			pfiDate: pfiOnlyDate && DateTimeConverter.stringToMomentDate(pfiOnlyDate),
			pfiTime: pfiOnlyTime && moment(pfiOnlyTime, 'HH:mm:ss'),
			ocaDate: ocaOnlyDate && DateTimeConverter.stringToMomentDate(ocaOnlyDate),
			ocaTime: ocaOnlyTime && moment(ocaOnlyTime, 'HH:mm:ss'),
			date: DateTimeConverter.stringToMomentDate(date),
			maintenanceLogSignatureDtoList: signatureList.map(({ signatureId, signatureType, amlSignatureId}) => ({
				signatureId,
				signatureType,
				amlSignatureId
			}))
		}
	}
}