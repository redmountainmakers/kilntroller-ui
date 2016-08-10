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
	});
});
