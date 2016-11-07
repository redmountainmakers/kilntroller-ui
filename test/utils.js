import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import mocha from 'mocha';

import * as utils from '../app/lib/utils';

chai.use( dirtyChai );

describe( 'round', () => {
	it( 'should round numbers and format with commas', () => {
		expect( utils.round( 1234.567 ) ).to.eql( '1,234.6' );
		expect( utils.round( - 1234.567, 2 ) ).to.eql( '-1,234.57' );
		expect( utils.round( 123, 0 ) ).to.eql( '123' );
		expect( utils.round( - 123, 2 ) ).to.eql( '-123.00' );
		expect( utils.round( 12345678.12, 0 ) ).to.eql( '12,345,678' );
		expect( utils.round( - 12345678.12, 0 ) ).to.eql( '-12,345,678' );
		expect( utils.round( 12345678.12, 1 ) ).to.eql( '12,345,678.1' );
		expect( utils.round( - 12345678.12, 1 ) ).to.eql( '-12,345,678.1' );
		expect( utils.round( 12345678.12, 2 ) ).to.eql( '12,345,678.12' );
		expect( utils.round( - 12345678.12, 2 ) ).to.eql( '-12,345,678.12' );
		expect( utils.round( 12345678.12, 3 ) ).to.eql( '12,345,678.120' );
		expect( utils.round( - 12345678.12, 3 ) ).to.eql( '-12,345,678.120' );
	} );
} );

describe( 'UpdateNormalizer', () => {
	it( 'should return batches of updates', () => {
		const normalizer = new utils.UpdateNormalizer( 1000 );
		let x = 0;
		for ( let i = 1; i <= 1000; i ++ ) {
			const val = 601 * i;
			normalizer.queue( val );
			if ( x < val ) {
				x += 1000;
				const updates = normalizer.getCurrentUpdates();
				if ( i === 1 ) {
					expect( updates ).to.eql( [] );
				} else {
					expect( updates.length ).to.be.within( 1, 2 );
					/* eslint-disable no-loop-func */
					updates.forEach( u => {
						expect( u ).to.be.within( x - 2000, x - 1001 );
					} );
				}
			}
		}
	} );

	it( 'should add updates in sorted order', () => {
		const normalizer = new utils.UpdateNormalizer( 1000 );
		normalizer.queue( 1200 );
		normalizer.queue( 800 );
		normalizer.queue( 600 );
		expect( normalizer.updates ).to.eql( [ 600, 800, 1200 ] );
		expect( normalizer.getCurrentUpdates() ).to.eql( [] );
		expect( normalizer.updates ).to.eql( [ 600, 800, 1200 ] );
		expect( normalizer.getCurrentUpdates() ).to.eql( [ 600, 800 ] );
		expect( normalizer.updates ).to.eql( [ 1200 ] );
		expect( normalizer.getCurrentUpdates() ).to.eql( [ 1200 ] );
		expect( normalizer.updates ).to.eql( [] );
		expect( normalizer.getCurrentUpdates() ).to.eql( [] );
	} );

	it( 'should not fail if gaps are added between updates', () => {
		const normalizer = new utils.UpdateNormalizer( 1000 );
		normalizer.queue( 2200 );
		normalizer.queue( 600 );
		expect( normalizer.updates ).to.eql( [ 600, 2200 ] );
		expect( normalizer.getCurrentUpdates() ).to.eql( [] );
		expect( normalizer.updates ).to.eql( [ 600, 2200 ] );
		expect( normalizer.getCurrentUpdates() ).to.eql( [ 600 ] );
		expect( normalizer.updates ).to.eql( [ 2200 ] );
		expect( normalizer.getCurrentUpdates() ).to.eql( [] );
		expect( normalizer.updates ).to.eql( [ 2200 ] );
		expect( normalizer.getCurrentUpdates() ).to.eql( [ 2200 ] );
		expect( normalizer.updates ).to.eql( [] );
		expect( normalizer.getCurrentUpdates() ).to.eql( [] );
	} );
} );
