import d3 from 'd3';
import moment from 'moment';
import numeral from 'numeral';

export function date(timestamp, local = true) {
	const date = moment.utc(timestamp);

	if (local) {
		return date.local().toDate();
	} else {
		return date.toDate();
	}
}

export function round(n, places = 1) {
	return numeral(n).format('0,0.' + Array(places + 1).join('0'));
}

export const timeFormatters = {
	minute : d3.time.format('%-m/%-d %-I:%M %p'),
	second : d3.time.format('%-m/%-d %-I:%M:%S %p'),
};

export class UpdateNormalizer {
	constructor(frequency, accessor = i => i) {
		this.updates   = [];
		this.sentUntil = 0;
		this.frequency = frequency;
		this.accessor  = accessor;
		this.bisector  = d3.bisector(this.accessor).left;
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
