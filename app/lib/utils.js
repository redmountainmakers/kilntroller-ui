import { timeFormat } from 'd3-time-format';
import { bisector } from 'd3-array';
import moment from 'moment';

export function date(timestamp, local = true) {
	const date = moment.utc(timestamp);

	if (local) {
		return date.local().toDate();
	} else {
		return date.toDate();
	}
}

export function round(n, places = 1) {
	const placeValue = Math.pow(10, places);

	let formatted = (Math.round(n * placeValue) / placeValue).toLocaleString();

	const decimalPlaces = (formatted.split('.')[1] || '').length;

	if (decimalPlaces < places) {
		if (!decimalPlaces) {
			formatted += '.';
		}
		formatted += Array(places - decimalPlaces + 1).join('0');
	}

	return formatted;
}

export const timeFormatters = {
	minute : timeFormat('%-m/%-d %-I:%M %p'),
	second : timeFormat('%-m/%-d %-I:%M:%S %p'),
};

export class UpdateNormalizer {
	constructor(frequency, accessor = i => i) {
		this.updates   = [];
		this.sentUntil = 0;
		this.frequency = frequency;
		this.accessor  = accessor;
		this.bisector  = bisector(this.accessor).left;
	}

	queue(update) {
		const i = this.bisector(this.updates, this.accessor(update));
		this.updates.splice(i, 0, update);
	}

	getCurrentUpdates() {
		if (!this.updates.length) {
			return [];
		}

		const min = this.accessor(this.updates[0]);
		const max = this.accessor(this.updates[this.updates.length - 1]);

		if (
			max > this.sentUntil + 5 * this.frequency ||
			min > this.sentUntil + this.frequency
		) {
			// This is the first run, or we fell behind.  Send all updates
			// except for the last period.
			this.sentUntil = max - (max % this.frequency);
		}

		const i = this.bisector(this.updates, this.sentUntil);
		this.sentUntil += this.frequency;
		return this.updates.splice(0, i);
	}
}
