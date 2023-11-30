import moment from 'moment-timezone';

export default function timeConverterWithTZ(dateTime) {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  return moment.utc(dateTime).tz(timeZone).format('MMM D, YYYY, h:mm:ss A');
}
