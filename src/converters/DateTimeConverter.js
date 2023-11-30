import moment from "moment";

export default class DateTimeConverter {
	static momentDateToString(momentDate, format = 'YYYY-MM-DD') {
		if (!momentDate) return '';
		return momentDate.format(format);
	}
	static momentDateYearToString(momentDate, format = 'YYYY-MM') {
		if (!momentDate) return '';
		return momentDate.format(format);
	}
	
	static momentDateTimeToISO(momentDateTime) {
		if (!momentDateTime) return '';
		return momentDateTime.toISOString();
	}
	
	static momentDateTimeToString(momentDateTime) {
		if (!momentDateTime) return '';
		return momentDateTime.format("YYYY-MM-DD HH:mm:ss");
	}
	
	static stringToMomentDate(dateString) {
		if (!dateString) return '';
		return moment(dateString, 'YYYY-MM-DD');
	}
	
	static stringToMomentDateTime(dateTimeString) {
		if (!dateTimeString) return '';
		return moment(dateTimeString, moment.ISO_8601);
	}
	
	
}