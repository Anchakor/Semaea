import { testlib } from './External';
import { QUnitAssert } from '../typings/qunit';

export interface Assert extends QUnitAssert {
  serializedEqual: (actual: unknown, expected: unknown, message?: string) => unknown
}

export function test(name: string, func: (assert: Assert) => void) {
  testlib.test(name, (libAssert: QUnitAssert) => {
    const assert = libAssert as Assert
    assert.serializedEqual = (actual: unknown, expected: unknown, message?: string) => 
      assert.strictEqual(JSON.stringify(actual, null, 1), JSON.stringify(expected, null, 1), message);

    func(assert);
  });
}

export function testAsync(name: string, func: (assert: Assert, asyncDone: () => void) => void) {
  test(name, (assert: Assert) => {
    const done = assert.async();
    func(assert, done);
  });
}
