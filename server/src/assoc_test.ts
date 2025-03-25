import * as assert from 'assert';
import { nil, cons } from './list';
import { AssocList, contains_key, get_keys, get_value, set_value } from './assoc';

// Note: the tests provided here may exceed the minimum number required by our
// course guidelines

describe('assoc', function() {

  it('set_value', function() {
    // Add many new pairs and confirm they are all added
    const L0: AssocList<number> = 
      set_value("d", -12, 
      set_value("c", 7, 
      set_value("b", 5, 
      set_value("a", 1, nil))));
    assert.strictEqual(get_value("d", L0), -12);
    assert.strictEqual(get_value("b", L0), 5);
    assert.strictEqual(get_value("c", L0), 7);
    assert.strictEqual(get_value("a", L0), 1);

    // First initialize a list and confirm key's value is retrieved correctly
    const L1: AssocList<number> = cons(["b", 2], nil);
    assert.strictEqual(get_value("b", L1), 2);

    // Change value of key and confirm change occurred
    const L2: AssocList<number> = set_value("b", 3, L1);
    assert.notStrictEqual(get_value("b", L2), 2);
    assert.strictEqual(get_value("b", L2), 3);
    const L3: AssocList<number> = set_value("b", 2, L2);
    assert.strictEqual(get_value("b", L3), 2);
  });

  it('contains_key', function() {
    assert.strictEqual(contains_key("a", nil), false);
    assert.strictEqual(contains_key("b", nil), false);

    const L0: AssocList<number> = cons(["b", 2], nil);
    assert.strictEqual(contains_key("a", L0), false);
    assert.strictEqual(contains_key("b", L0), true);

    const L1: AssocList<number> = cons(["a", 1], cons(["b", 2], cons(["c", 3], nil)));
    const L2: AssocList<number> = cons(["a", 4], cons(["b", 5], cons(["c", 6], cons(["d", 9], nil))));
    assert.strictEqual(contains_key("c", L1), true);
    assert.strictEqual(contains_key("d", L1), false);
    assert.strictEqual(contains_key("d", L2), true);
  });

  it('get_keys', function() {
    assert.deepStrictEqual(get_keys(nil), nil);
    assert.deepStrictEqual(get_keys(nil), nil);

    assert.deepStrictEqual(get_keys(cons(["a", 1], nil)), cons("a", nil));
    assert.deepStrictEqual(get_keys(cons(["b", 2], nil)), cons("b", nil));

    const L1: AssocList<number> = cons(["a", 1], cons(["b", 2], cons(["c", 3], nil)));
    const L2: AssocList<number> = cons(["a", 4], cons(["b", 5], cons(["c", 6], cons(["d", 9], nil))));
    assert.deepStrictEqual(get_keys(L1), cons("a", cons("b", cons("c", nil))));
    assert.deepStrictEqual(get_keys(L2), cons("a", cons("b", cons("c", cons("d", nil)))));
  });

  it('get_value', function() {
    const L1: AssocList<number> = cons(["a", 1], cons(["b", 2], cons(["c", 3], nil)));
    const L2: AssocList<number> = cons(["a", 4], cons(["b", 5], cons(["c", 6], cons(["d", 9], nil))));

    assert.strictEqual(get_value("a", L1), 1);
    assert.strictEqual(get_value("a", L2), 4);

    assert.strictEqual(get_value("b", L1), 2);
    assert.strictEqual(get_value("b", L2), 5);

    assert.strictEqual(get_value("c", L1), 3);
    assert.strictEqual(get_value("d", L2), 9);
  });

});
