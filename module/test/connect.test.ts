/// <reference types="@types/jest" />
import { connect } from '../src';

describe('connect', () => {
	it('exists', () => {
		expect(typeof connect).toEqual('function');
	});
});
