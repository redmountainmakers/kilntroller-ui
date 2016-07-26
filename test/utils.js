import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import mocha from 'mocha';

import * as utils from '../app/lib/utils';

chai.use(dirtyChai);

describe('UpdateNormalizer', () => {
	it('should return batches of updates', () => {
		const normalizer = new utils.UpdateNormalizer(1000);
		let x = 0;
		for (let i = 1; i <= 1000; i++) {
			const val = 601 * i;
			normalizer.queue(val);
			if (x < val) {
				x += 1000;
				const updates = normalizer.getCurrentUpdates();
				if (i === 1) {
					expect(updates).to.eql([]);
				} else {
					expect(updates.length).to.be.within(1, 2);
					/* eslint-disable no-loop-func */
					updates.forEach(u => {
						expect(u).to.be.within(x - 2000, x - 1001);
					});
				}
			}
		}
	});
});
