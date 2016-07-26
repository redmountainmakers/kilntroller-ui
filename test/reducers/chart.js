import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import mocha from 'mocha';
import moment from 'moment';

import * as chart from '../../app/reducers/chart';

chai.use(dirtyChai);

describe('chart.range reducer', () => {
	it('should set a default range', () => {
		const now   = moment.utc();
		const prev  = moment.utc().subtract(8, 'hours');
		const state = chart.range(undefined, {});
		expect(Math.abs(now - state.max)).to.be.below(2);
		expect(Math.abs(prev - state.min)).to.be.below(2);
	});

	describe('USER_ZOOM', () => {
		it('should update the range in response to user zoom', () => {
			const state  = chart.range(undefined, {});
			const result = chart.range(state, {
				type : 'USER_ZOOM',
				min  : 100,
				max  : 200,
			});
			expect(result).to.eql({ min : 100, max : 200 });
		});
	});
});

describe('chart.data reducer', () => {
	it('initializes with an empty array', () => {
		expect(chart.data(undefined, {})).to.eql([]);
	});

	describe('DATA_RECEIVE', () => {
		function action(data) {
			return {
				data,
				type : 'DATA_RECEIVE',
			};
		}

		function series(...timestamps) {
			let type = null;
			if (typeof timestamps[0] === 'string') {
				type = timestamps.shift();
			}
			return timestamps.map(t => {
				return {
					type,
					timestamp : t,
				};
			});
		}

		it('test helper: series', () => {
			expect(series(1, 2)).to.eql([
				{ type : null, timestamp : 1 },
				{ type : null, timestamp : 2 },
			]);
			expect(series('test', 1, 2)).to.eql([
				{ type : 'test', timestamp : 1 },
				{ type : 'test', timestamp : 2 },
			]);
		});

		it('initializes with an empty array', () => {
			expect(chart.data(undefined, action())).to.eql([]);
		});

		it('returns the same array if no data received', () => {
			const state  = series(1, 2);
			const result = chart.data(state, action());
			expect(result).to.eql(state);
			expect(result === state).to.be.true();
		});

		it('returns new values if no previous values', () => {
			const received = series(1, 2);
			const result   = chart.data([], action(received));
			expect(result).to.eql(received);
			expect(result === received).to.be.true();
		});

		it('merges old and new values in the middle', () => {
			const state  = series(10, 20, 30, 40, 50);
			const result = chart.data(state, action(series(11, 12, 35, 49)));
			expect(result).to.eql(series(10, 11, 12, 20, 30, 35, 40, 49, 50));
		});

		it('merges old and new values at the beginning', () => {
			const state  = series(10, 20, 30);
			const result = chart.data(state, action(series(0, 8, 9, 10)));
			expect(result).to.eql(series(0, 8, 9, 10, 20, 30));
		});

		it('merges old and new values at the end', () => {
			const state  = series(10, 20, 30);
			const result = chart.data(state, action(series(30, 31, 32)));
			expect(result).to.eql(series(10, 20, 30, 31, 32));
		});

		it('merges and replaces values at the beginning and middle', () => {
			const state    = series('old', 10, 20, 30, 40, 50);
			const received = series('new', 9, 10, 11, 24, 25, 30, 31, 51);
			const result   = chart.data(state, action(received));
			expect(result).to.eql([
				{ type : 'new', timestamp : 9 },
				{ type : 'new', timestamp : 10 },
				{ type : 'new', timestamp : 11 },
				{ type : 'old', timestamp : 20 },
				{ type : 'new', timestamp : 24 },
				{ type : 'new', timestamp : 25 },
				{ type : 'new', timestamp : 30 },
				{ type : 'new', timestamp : 31 },
				{ type : 'old', timestamp : 40 },
				{ type : 'old', timestamp : 50 },
				{ type : 'new', timestamp : 51 },
			]);
		});

		it('merges and replaces values at the middle and end', () => {
			const state    = series('old', 10, 20, 30, 40, 50);
			const received = series('new', 11, 21, 30, 31, 32, 49, 50, 51, 52);
			const result   = chart.data(state, action(received));
			expect(result).to.eql([
				{ type : 'old', timestamp : 10 },
				{ type : 'new', timestamp : 11 },
				{ type : 'old', timestamp : 20 },
				{ type : 'new', timestamp : 21 },
				{ type : 'new', timestamp : 30 },
				{ type : 'new', timestamp : 31 },
				{ type : 'new', timestamp : 32 },
				{ type : 'old', timestamp : 40 },
				{ type : 'new', timestamp : 49 },
				{ type : 'new', timestamp : 50 },
				{ type : 'new', timestamp : 51 },
				{ type : 'new', timestamp : 52 },
			]);
		});
	});
});
