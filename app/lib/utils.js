import d3 from 'd3';
import moment from 'moment';

export function date(timestamp, local = true) {
	const date = moment.utc(timestamp);

	if (local) {
		return date.local().toDate();
	} else {
		return date.toDate();
	}
}

export function round(n, places = 2) {
	const scale = Math.pow(10, places);
	return Math.round(n * scale) / scale;
}

export const timeFormatters = {
	minute : d3.time.format('%-m/%-d %-I:%M %p'),
	second : d3.time.format('%-m/%-d %-I:%M:%S %p'),
};
